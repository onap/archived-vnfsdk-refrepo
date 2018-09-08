#!/bin/bash
#
# Copyright 2018 Huawei Technologies Co., Ltd.
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

export _PWD=`pwd`

echo ################ Check for java
apt-get install -y wget unzip

#check for java
java -version
if [ $? == 127 ]
then
    apt-get install -y openjdk-8-jre
fi

echo ################ Install OCLIP

VTP_LATEST_BINARY="https://nexus.onap.org/service/local/artifact/maven/redirect?r=releases&g=org.onap.cli&a=cli-zip&e=zip&v=LATEST"
VTP_INSTALL_DIR=/opt/vtp
VTP_ZIP=vtp.zip

mkdir -p $VTP_INSTALL_DIR
cd $VTP_INSTALL_DIR

wget -O $VTP_ZIP $VTP_LATEST_BINARY
unzip $VTP_ZIP
echo clean up the irrelevent products
rm -rf ./lib/cli-products*.jar

export OPEN_CLI_HOME=$VTP_INSTALL_DIR
export OPEN_CLI_PRODUCT_IN_USE=onap-vtp

cd $OPEN_CLI_HOME

if [ ! -d ./data ]; then mkdir ./data; fi
if [ ! -d ./open-cli-schema ]; then mkdir ./open-cli-schema; fi

for cmd in ./bin/oclip.sh ./bin/oclip-rcli.sh ./bin/oclip-cmdflow-server.sh
do
   sed '18i export OPEN_CLI_HOME=/opt/vtp' $cmd > ${cmd}_
   mv ${cmd}_ ${cmd}
done

chmod +x ./bin/oclip.sh
chmod +x ./bin/oclip-rcli.sh
chmod +x ./bin/oclip-cmdflow-server.sh

ln -sf $OPEN_CLI_HOME/bin/oclip-rcli.sh /usr/bin/vtp-cli
ln -sf $OPEN_CLI_HOME/bin/oclip-cmdflow-server.sh /usr/bin/vtp-tc

echo ################ Deploy sample csar validation test case
CSARVALIDATOR_LATEST_BINARY="https://nexus.onap.org/service/local/artifact/maven/redirect?r=releases&g=org.onap.vnfsdk.validation&a=csarvalidation-deployment&e=zip&v=LATEST"
CSARVAL_ZIP=csarvalidator.zip
wget -O $CSARVAL_ZIP $CSARVALIDATOR_LATEST_BINARY
unzip -d csarvalidator $CSARVAL_ZIP
echo install csarvalidator into vtp
cp csarvalidator/*.jar $VTP_INSTALL_DIR/lib/
rm -rf csarvalidator $CSARVAL_ZIP $VTP_ZIP
cd -

echo ################ Install as service
cp $_PWD/vtp-tc.sh /etc/init.d && update-rc.d vtp-tc.sh defaults

echo ################ Done
