#!/bin/bash
#check user
if [ "root" = "`/usr/bin/id -u -n`" ];then
    echo "root has been forbidden to execute the shell."
    exit 1
fi

if [[ -z ${APP_ROOT} ]];then
     echo "APP_ROOT is empty."
     exit 1
fi

if [[ -z ${_APP_LOG_DIR} ]];then
     echo "_APP_LOG_DIR is empty."
     exit 1
fi

#HORNETQ_CONF=$APP_ROOT/etc

#chmod 400 $HORNETQ_CONF/engine.json
