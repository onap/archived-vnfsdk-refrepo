#!/bin/bash
#
# Copyright 2017 Huawei Technologies Co., Ltd.
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

# Configure MSB IP address
MSB_IP=`echo $MSB_ADDR | cut -d: -f 1`
sed -i "s|msb\.openo\.org|${MSB_IP}|" etc/conf/restclient.json
cat etc/conf/restclient.json

# Configure self IP address for MSB
sed -i "s|10\.229\.47\.199|$SERVICE_IP|" etc/microservice/marketplace_rest.json
cat etc/microservice/marketplace_rest.json
echo

sed -i "s|IP=.*|IP=$MSB_IP|" webapps/ROOT/WEB-INF/classes/marketplace.properties
cat webapps/ROOT/WEB-INF/classes/marketplace.properties
echo

