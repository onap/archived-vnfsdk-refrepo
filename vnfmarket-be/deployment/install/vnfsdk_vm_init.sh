#!/bin/bash
#
# Copyright 2020 Huawei Technologies Co., Ltd.
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

# Starts docker containers for VNFSDK VNF  repository.
# Version for Amsterdam/R1 uses docker-compose.

# be verbose
set -x

# Establish environment variables
NEXUS_USERNAME=$(cat /opt/config/nexus_username.txt)
NEXUS_PASSWD=$(cat /opt/config/nexus_password.txt)
NEXUS_DOCKER_REPO=$(cat /opt/config/nexus_docker_repo.txt)
DOCKER_IMAGE_VERSION=$(cat /opt/config/docker_version.txt)

# Refresh configuration and scripts
cd /opt/refrepo
git pull
cd vnfmarket-be/deployment/install

# Get image names used below from docker-compose environment file
source .env


# Refresh images
docker login -u $NEXUS_USERNAME -p $NEXUS_PASSWD $NEXUS_DOCKER_REPO
docker pull $NEXUS_DOCKER_REPO/onap/vnfsdk/refrepo:${REFREPO_TAG}
docker pull $NEXUS_DOCKER_REPO/onap/vnfsdk/refrepo:${POSTGRES_TAG}


# docker-compose is not in /usr/bin
/opt/docker/docker-compose down
/opt/docker/docker-compose up -d

