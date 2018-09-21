[comment]: # (# Copyright 2018 Huawei Technologies Co., Ltd.)
[comment]: # (# )
[comment]: # (Licensed under the Apache License, Version 2.0 (the "License")
[comment]: # (# you may not use this file except in compliance with the License.)
[comment]: # (# You may obtain a copy of the License at)
[comment]: # (#)
[comment]: # (#     http://www.apache.org/licenses/LICENSE-2.0)
[comment]: # (#)
[comment]: # (# Unless required by applicable law or agreed to in writing, software)
[comment]: # (# distributed under the License is distributed on an "AS IS" BASIS,)
[comment]: # (# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.)
[comment]: # (# See the License for the specific language governing permissions and)
[comment]: # (# limitations under the License.)
VNFSDK Marketplace
==================

VNFSDK marketplace provides

 1. Marketplace portal - operator uses this for managing the VNF packages
 2. VNF package repository - Backend repo for persisting the VNF packages
 3. VNF testing platform - Platform for testing VNF for a given ONAP environment.

VNF Test Platform (VTP)
=======================
A platform to automate and manage different kind of VNF test cases for given VNF package(s) and provides unified accessibility over CLI, REST API and  UI portal for operating the test cases. Also it facilitate to write test cases in different languages like java,  shell scripts, python, etc.

- LFN/ONAP wants test platform where VNF packages could be certified using ONAP requirements to drive industry adoption
- Provide an platform where vendor/operator can develop, deploy, run test cases and query the results
- Test cases, test results and VNF should be manageable .i,e with authorization, so only user with given roles is allowed to perform operation like VNF package upload/download, run compliance verification tests, allow only specific VIM for specific users, etc.
- Test results should be persisted and should be available for human analysis later via LFN infrastructure.
- Provides test flow where author make flow across different test cases for a given program like compliance verification and  VNFREQS/SOL0004.
- Provide integration with OPNFV dovetail to run test cases across dovetail and ONAP VNFSDK.
- Uses Open CLI Platform (OCLIP) for deploying test cases and execute them.
- Available as docker container.


- `More details <https://onap.readthedocs.io/en/latest/submodules/vnfsdk/model.git/docs/index.html>`_