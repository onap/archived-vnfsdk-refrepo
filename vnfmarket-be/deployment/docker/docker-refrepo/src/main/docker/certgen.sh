#!/bin/sh
#
# Copyright 2020 Huawei Technologies Co., Ltd.
# Copyright 2020 Nokia
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
#

openssl req -nodes -newkey rsa:2048 -keyout example.key -out example.csr -subj "/C=US/O=ONAP/OU=OSAAF/CN=intermediateCA_9/"
openssl x509 -req -in example.csr -signkey example.key -days 730 -out cert.crt
cp -p cert.crt /etc/nginx/ssl/
cp -p example.key /etc/nginx/ssl/cert.key
chmod 644 /etc/nginx/ssl/cert.crt
chmod 644 /etc/nginx/ssl/cert.key
