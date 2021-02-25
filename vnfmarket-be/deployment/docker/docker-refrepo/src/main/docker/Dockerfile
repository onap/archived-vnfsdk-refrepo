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
# vnf-sdk-marketplace/target/Dockerfile
#

# 10-basebuild.txt

FROM openjdk:11-jre-slim
ARG DEBIAN_FRONTEND=noninteractive

ENV JAVA_VERSION_MAJOR=11 \
    JAVA_VERSION_MINOR=08 \
    JAVA_HOME=/usr/lib/jvm/default-jvm \
    PATH=${PATH}:/usr/lib/jvm/default-jvm/bin/ \
    CATALINA_HOME=/service

# Install required libraries
RUN apt-get update && apt-get install -y \
    curl \
    procps \
    g++ \
    make \
    nano \
    nginx \
    sudo \
    unzip \
    wget \
 && rm -rf /var/lib/apt/lists/* \
 && sudo mkdir -p /usr/lib/jvm/default-jvm \
 && sudo ln -s /usr/local/openjdk-11/* /usr/lib/jvm/default-jvm

# Installing Node
ENV NVM_DIR /usr/local/nvm
ENV NODE_VERSION 14.16.0
SHELL ["/bin/bash", "--login", "-i", "-c"]
RUN mkdir -p $NVM_DIR && curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.2/install.sh | NVM_DIR=$NVM_DIR bash
RUN source /root/.bashrc && nvm install $NODE_VERSION
SHELL ["/bin/bash", "--login", "-c"]
ENV NODE_PATH $NVM_DIR/v$NODE_VERSION/lib/node_modules
ENV PATH $NVM_DIR/versions/node/v$NODE_VERSION/bin:$PATH

# Download and set up Tomcat
WORKDIR /service
RUN wget -q https://archive.apache.org/dist/tomcat/tomcat-8/v8.5.30/bin/apache-tomcat-8.5.30.tar.gz && \
    tar --strip-components=1 -xf apache-tomcat-8.5.30.tar.gz && \
    rm -f apache-tomcat-8.5.30.tar.gz && rm -rf webapps && mkdir -p webapps/ROOT && \
    echo 'export CATALINA_OPTS="$CATALINA_OPTS -Xms64m -Xmx256m -XX:MaxPermSize=64m"' > /service/bin/setenv.sh

# Copy artifacts
WORKDIR /service
COPY nginx.conf /etc/nginx/nginx.conf
COPY certgen.sh /service
COPY instance-config.sh .
COPY instance-init.sh .
COPY instance-run.sh .
COPY instance-workaround.sh .
COPY docker-entrypoint.sh .
COPY install-vtp.sh .
COPY vtp-tc.sh .
COPY LICENSE ./ONAP_LICENSE

# Configure NGINX
RUN mkdir -p /etc/nginx/ssl && \
    chown -R www-data:www-data /var/lib/nginx

# Generate certificates
RUN chmod +x /service/certgen.sh  && \
    /service/certgen.sh

# Set up microservice
ADD ./STAGE  /service
RUN chmod +x /service/bin/*.sh && \
    cd /service/webapps/onapui/vnfmarket && \
    npm install phantomjs-prebuilt@2.1.14 --ignore-scripts && \
    npm install

# VTP setup
RUN chmod a+x /service/install-vtp.sh && \
    chmod a+x /service/vtp-tc.sh && \
    /service/install-vtp.sh

# Create group and user
RUN groupadd -r vnfadmin && useradd -m --no-log-init -r -g vnfadmin vnfadmin && \
    usermod -aG sudo vnfadmin && echo "vnfadmin ALL=(ALL) NOPASSWD: ALL" >> /etc/sudoers && \
    chmod -R 777 /usr/local/

USER vnfadmin

# Define mountable directories.
VOLUME ["/etc/nginx/sites-enabled", "/etc/nginx/certs", "/etc/nginx/conf.d", "/var/log/nginx", "/var/www/html"]

EXPOSE 8702
EXPOSE 8703
EXPOSE 50051

ENTRYPOINT ["/service/docker-entrypoint.sh"]
