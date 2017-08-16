#!/bin/bash
#
# Copyright 2016-2017 Huawei Technologies Co., Ltd.
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
#
# This file was auto-generated by gen-all-dockerfiles.sh; do not modify manually.
#
# vnf-sdk-marketplace/target/docker-entrypoint.sh
#

if [ -z "$SERVICE_IP" ]; then
    export SERVICE_IP=`hostname -i`
fi
echo
echo Environment Variables:
echo "SERVICE_IP=$SERVICE_IP"


# Configure service based on docker environment variables
./instance-config.sh

# Start mysql
chown -R mysql /var/lib/mysql
chgrp -R mysql /var/lib/mysql
su mysql -c /usr/bin/mysqld_safe &

# Perform one-time config
if [ ! -e init.log ]; then
    # Perform workarounds due to defects in release binary
    ./instance-workaround.sh

    # Init mysql; set root password
    ./init-mysql.sh

    # microservice-specific one-time initialization
    ./instance-init.sh

    date > init.log
fi

# Start the microservice
./instance-run.sh

