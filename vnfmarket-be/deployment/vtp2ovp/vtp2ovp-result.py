#!/usr/bin/python
# Copyright 2019 Huawei Technologies Co., Ltd.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

import json
import os
import re
import shutil
import sys
import tarfile
from datetime import datetime
import argparse
import pprint
from argparse import RawTextHelpFormatter


class VTP2OVPResult:
    execution_id = None
    tar_path = None
    vtp_home = None

    result_json = {
        "testcases_list": [],
        "build_tag": "",
        "version": "2019.12",
        "test_date": "",
        "duration": 0,
        "vnf_type": "TOSCA",
        "vnf_checksum": "",
        "validation": "enabled"

    }

    sub_test = {
        "objective": "",
        "portal_key_file": "",
        "sub_testcase": [],
        "mandatory": "true",
        "name": "",
        "result": ""
    }

    def __init__(self, execution_id, tar_path, vtp_home):
        self.execution_id = execution_id
        self.tar_path = tar_path
        self.vtp_home = vtp_home + "/data/executions"

    def find_folder_by_execution_id(self):
        ret_dir_name = None

        # TODO: Improve by better seraching.
        dir_obj = os.listdir(self.vtp_home)
        for dir_name in dir_obj:
            if dir_name.__contains__(self.execution_id):
                ret_dir_name = dir_name
                break

        if not ret_dir_name:
            raise Exception('Given execution-id does not exist\n')

        return ret_dir_name

    def extract_execution_id_from_name(self, dir_name=None):

        temp_arr = dir_name.split("__")
        exec_id = temp_arr[0]
        temp_arr.remove(exec_id)
        nm_arr = []
        nm_arr.extend(temp_arr)
        objective = "__".join(nm_arr)
        return exec_id + "," + objective

    def extract_request_id_from_execution_id(self, exec_id):
        request_id = exec_id.split("-")[0]
        return request_id

    def find_folder_by_request_id(self, request_id):
        file_list = []
        if os.path.exists(self.vtp_home):
            for dir_name in os.listdir(self.vtp_home):
                if re.match('^' + request_id + '-', dir_name):
                    if not dir_name.__contains__(self.execution_id):
                        file_list.append(dir_name)
        return file_list

    def check_pass_fail(self, dir_path):
        completed_path = dir_path + "/completed"
        if os.path.isfile(completed_path):
            return "PASS"
        else:
            return "FAIL"

    def get_testdate(self, dir_path=None):
        t = os.path.getmtime(dir_path)
        return str(datetime.utcfromtimestamp(t)) + " UTC"

    def get_duration(self, dir_path=None):
        input_file = dir_path + "/input"
        output_file = dir_path + "/output"
        t1 = os.path.getmtime(input_file)
        input_timestamp = datetime.utcfromtimestamp(t1)
        t2 = os.path.getmtime(output_file)
        output_timestamp = datetime.utcfromtimestamp(t2)
        time_diff = output_timestamp - input_timestamp
        return time_diff.seconds * 1000

    def generate_ovp_result_json(self):
        arr_temp = [self.sub_test]
        self.result_json.update({"testcases_list": arr_temp})
        with open('./result.json', 'w') as json_file:
            json.dump(self.result_json, json_file, default=str, indent=4)
        return json_file

    def generate_result_tar(self):
        arr_sub_testcase = []
        dir_name = None
        try:
            dir_name = self.find_folder_by_execution_id()
            exec_id = self.extract_execution_id_from_name(dir_name)
            objective = exec_id.split(',')[1]
            self.sub_test['objective'] = objective
            output_file_path = "/data/executions/" + dir_name + "/output"
            self.sub_test.update({'portal_key_file': output_file_path})
            self.sub_test['name'] = objective
            self.result_json.update({'duration': str(self.get_duration(self.vtp_home + "/" + dir_name)) + " ms"})
            self.sub_test['result'] = self.check_pass_fail(self.vtp_home + "/" + dir_name)
            test_date = self.get_testdate(self.vtp_home + "/" + dir_name)
            self.result_json.update({'test_date': test_date})
            self.result_json.update({'build_tag': self.execution_id})
            request_id = self.extract_request_id_from_execution_id(exec_id)
            file_list = self.find_folder_by_request_id(request_id)
            for sub_test in file_list:
                sub_test_case = {}
                sub_exec_id = self.extract_execution_id_from_name(sub_test)
                exec_id_name = sub_exec_id.split(",")
                sub_test_name = exec_id_name[1]
                sub_test_case['name'] = sub_test_name
                full_name = "__".join(exec_id_name)
                pass_fail = self.check_pass_fail(self.vtp_home + "/" + full_name)
                sub_test_case['result'] = pass_fail
                arr_sub_testcase.append(sub_test_case)
            self.sub_test['sub_testcase'] = arr_sub_testcase
            self.generate_ovp_result_json()
            self.make_tar_dir()
            self.display_result_json()

        except Exception as e:
            print str(e)

    def display_result_json(self):
        print "\nOVP result JSON: "
        pretty_printer = pprint.PrettyPrinter(indent=4)
        pretty_printer.pprint(self.result_json)

    def make_tar_dir(self):
        tar_file_name = "vtp-ovp-result-" + self.execution_id + ".tar"
        head, tail = os.path.split(self.vtp_home)
        with tarfile.open(tar_file_name, "w:gz") as tar_handle:
            tar_handle.add('./result.json')
            tar_handle.add(head, arcname='./data')

        if not os.path.exists(self.tar_path):
            os.mkdir(self.tar_path)
        elif not os.path.isdir(self.tar_path):
            raise Exception('Given path for OVP output tar file is not a directory\n')
        shutil.move(tar_file_name, os.path.join(self.tar_path, tar_file_name))
        if os.path.exists('result.json'):
            os.remove('result.json')
        print "\n\nOVP Result Tar file: " + os.path.abspath(self.tar_path + '/' + tar_file_name)


def main():
    text = 'This command helps to produce VTP results in LFV OVP format. ' \
           'Run this command from the server machine, where VTP is running'
    parser = argparse.ArgumentParser(description=text, formatter_class=RawTextHelpFormatter)
    parser.add_argument('--execution-id', action='store', dest='execution_id',
                        help='VTP test case execution id')
    parser.add_argument('--tar-path', action='store', dest='tar_path',
                        help='Location to OVP output tar file')
    parser.add_argument('--vtp-home', default=os.getenv('OPEN_CLI_HOME'), action='store', dest='vtp_home',
                        help='VTP installation home directory')
    args = parser.parse_args()

    if not args.execution_id or not args.tar_path or not args.vtp_home:
        sys.stderr.write(str('Too few arguments\n'))
    else:
        if args.execution_id:
            execution_id = args.execution_id
        if args.tar_path:
            tar_path = args.tar_path
        if args.vtp_home:
            vtp_home = args.vtp_home

        if os.path.exists(vtp_home):
            if not os.path.isdir(vtp_home):
                print 'Given VTP path is not a directory\n'
            else:
                vtp2ovp = VTP2OVPResult(execution_id, tar_path, vtp_home)
                vtp2ovp.generate_result_tar()
        else:
            print 'Given VTP path does not exist\n'


"""
    usage: vtp2ovp-result.py [-h] [--execution-id EXECUTION_ID]
                             [--tar-path TAR_PATH] [--vtp-home VTP_HOME]

    This command helps to produce VTP results in LFV OVP format.
    Run this command from the server machine, where VTP is running

    optional arguments:
      -h, --help            show this help message and exit
      --execution-id EXECUTION_ID
                            VTP test case execution id
      --tar-path TAR_PATH   Location to OVP output tar file
      --vtp-home VTP_HOME   VTP installation home directory

"""
if __name__ == '__main__':
    main()
