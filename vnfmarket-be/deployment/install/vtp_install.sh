#!/bin/bash

#*******************************************************************************
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
#*******************************************************************************
# VTP Installation script supported Ubuntu 16.04 64 bit
#
# Following the guidelines given below:
# source < this file >
#
# Install:
#    vtp_download
#    vtp_backend_install
#    vtp_controller_install
# Start:
#    vtp_start
#    vtp_trace
# Stop:
#    vtp_stop
# Uninstall
#    vtp_purge
#
# Happy VTPing ...
#
export OCLIP_DOWNLOAD_URL="https://nexus.onap.org/content/repositories/autorelease-114174/org/onap/cli/cli-zip/2.0.6/cli-zip-2.0.6.zip"
export VTP_DOWNLOAD_URL="https://nexus.onap.org/content/repositories/autorelease-114194/org/onap/vnfsdk/refrepo/vnf-sdk-marketplace/1.2.1/vnf-sdk-marketplace-1.2.1.war"
export CSAR_VALIDATE_DOWNLOAD_URL="https://nexus.onap.org/content/repositories/autorelease-114111/org/onap/vnfsdk/validation/csarvalidation-deployment/1.1.5/csarvalidation-deployment-1.1.5.zip"
export TOMCAT8_DOWNLOAD_URL="https://archive.apache.org/dist/tomcat/tomcat-8/v8.5.30/bin/apache-tomcat-8.5.30.tar.gz"
export SAMPLE_VTP_CSAR="https://github.com/onap/vnfsdk-validation/raw/master/csarvalidation/src/test/resources/VoLTE.csar"

export VTP_STAGE_DIR=/opt/vtp_stage

export OPEN_CLI_HOME=/opt/oclip
export PATH=$OPEN_CLI_HOME/bin:$PATH
export CATALINA_HOME=/opt/controller
export JAVA_HOME=/usr/lib/jvm/java-8-openjdk-amd64/

export VTP_TRACK_MARK=++++++++++++++++++++++++

function vtp_download() {
    echo $VTP_TRACK_MARK Downloading VTP binaries and setup the dependencies ...

    apt-get install -y tar wget unzip

    mkdir -p $VTP_STAGE_DIR

    if [ ! -f $VTP_STAGE_DIR/CLI.zip ]
    then
        wget -O $VTP_STAGE_DIR/CLI.zip $OCLIP_DOWNLOAD_URL
    else
        echo $VTP_TRACK_MARK $OCLIP_DOWNLOAD_URL already downloded
    fi

    if [ ! -f $VTP_STAGE_DIR/CSAR-VALIDATE.zip ]
    then
        wget -O $VTP_STAGE_DIR/CSAR-VALIDATE.zip $CSAR_VALIDATE_DOWNLOAD_URL
        wget -O $VTP_STAGE_DIR/CSAR.csar $SAMPLE_VTP_CSAR
    else
        echo $VTP_TRACK_MARK $CSAR_VALIDATE_DOWNLOAD_URL already downloded
    fi

    if [ ! -f $VTP_STAGE_DIR/TOMCAT.tar.gz ]
    then
        wget -O $VTP_STAGE_DIR/TOMCAT.tar.gz $TOMCAT8_DOWNLOAD_URL
    else
        echo $VTP_TRACK_MARK $TOMCAT8_DOWNLOAD_URL already downloded
    fi

    if [ ! -f $VTP_STAGE_DIR/VTP.zip ]
    then
        wget -O $VTP_STAGE_DIR/VTP.zip $VTP_DOWNLOAD_URL
    else
        echo $VTP_TRACK_MARK $VTP_DOWNLOAD_URL already downloded
    fi

    if [ ! -d $JAVA_HOME ]
    then
        apt-get install -y openjdk-8-jre
    else
        echo $VTP_TRACK_MARK JAVA already installed
    fi
}

function vtp_backend_install() {
    if [ ! -f $OPEN_CLI_HOME/bin/oclip.sh ]
    then
        echo $VTP_TRACK_MARK Installing VTP Backend...

        mkdir -p $OPEN_CLI_HOME
        unzip $VTP_STAGE_DIR/CLI.zip -d $OPEN_CLI_HOME
        ln -s $OPEN_CLI_HOME/bin/oclip.sh $OPEN_CLI_HOME/bin/oclip

        echo $VTP_TRACK_MARK Installing CSAR Validation Test cases
        mkdir -p $OPEN_CLI_HOME/CSAR-VALIDATE
        unzip $VTP_STAGE_DIR/CSAR-VALIDATE.zip -d $OPEN_CLI_HOME/CSAR-VALIDATE
        cp $OPEN_CLI_HOME/CSAR-VALIDATE/validation-csar-*.jar $OPEN_CLI_HOME/lib

        echo $VTP_TRACK_MARK Configuring VTP Backend...
        cp $OPEN_CLI_HOME/conf/oclip.service /etc/systemd/system
        systemctl daemon-reload
        systemctl status oclip
    else
        echo "VTP Backend already installed"
    fi
}

function vtp_controller_install() {
    if [ ! -d $CATALINA_HOME ]
    then
        echo $VTP_TRACK_MARK Installing Tomcat 8.5.3 ...
        mkdir -p $CATALINA_HOME
        tar --strip-components=1 -xf $VTP_STAGE_DIR/TOMCAT.tar.gz -C $CATALINA_HOME
        rm -rf $CATALINA_HOME/webapps
        mkdir -p $CATALINA_HOME/webapps/ROOT

        unzip $VTP_STAGE_DIR/VTP.zip -d $CATALINA_HOME/webapps/ROOT
        echo 'export CATALINA_OPTS="$CATALINA_OPTS -Xms64m -Xmx256m -XX:MaxPermSize=64m"' > $CATALINA_HOME/bin/setenv.sh
        echo 'export JAVA_OPTS="$JAVA_OPTS -Djava.security.egd=file:/dev/./urandom"' >> $CATALINA_HOME/bin/setenv.sh
    else
        echo "VTP Controller already installed"
    fi
}

function vtp_start() {
    echo $VTP_TRACK_MARK Starting VTP Backend...
    systemctl start oclip
    systemctl status oclip --no-pager

    echo $VTP_TRACK_MARK Starting VTP Controller...
    $CATALINA_HOME/bin/startup.sh
}

function vtp_stop() {
    echo $VTP_TRACK_MARK Starting VTP Backend...
    systemctl stop oclip
    systemctl status oclip --no-pager

    echo $VTP_TRACK_MARK Starting VTP Controller...
    $CATALINA_HOME/bin/shutdown.sh
}

function vtp_purge() {
    #Stop services
    vtp_stop

    #Stop tracking
    jobs -p | xargs kill -9

    echo $VTP_TRACK_MARK Purging VTP...
    rm -rf $OPEN_CLI_HOME
    rm -rf $CATALINA_HOME
}

function vtp_trace() {
    tailf $CATALINA_HOME/logs/catalina.out &
    tailf $OPEN_CLI_HOME/logs/open-cli.log &
}

