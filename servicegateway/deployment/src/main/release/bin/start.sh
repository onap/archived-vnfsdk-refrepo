#!/bin/bash
#check user
CUR_PATH=$(cd `dirname $0`;pwd)
SCRIPT_PATH=$0
IPMC_USER="`stat -c '%U' ${SCRIPT_PATH}`"
export IPMC_USER
CURRENT_USER="`/usr/bin/id -u -n`"
if [ "${IPMC_USER}" != "${CURRENT_USER}" ]
then
    echo "only ${IPMC_USER} can execute this script."
    exit 1
fi

umask 027

if [ -z "$JAVA_HOME" ]
then
	echo "There is no JAVA_HOME"
	exit 1
fi

if [ -z "$CATALINA_HOME" ]
then
	echo "There is no CATALINA_HOME"
	exit 1
fi

if [ -z "$APP_ROOT" ]
then
	echo "There is no APP_ROOT"
	exit 1
fi



export CATALINA_BASE=$APP_ROOT
export COMPLETE_PROCESS_NAME=$PROCESS_NAME-$NODE_ID-$PROCESS_SLOT
LOG_PATH=$_APP_LOG_DIR/$COMPLETE_PROCESS_NAME

JAVA_OPTS="-Dfile.encoding=UTF-8"
JAVA_OPTS="$JAVA_OPTS -Dlog.dir=$LOG_PATH"
export TOMCAT_LOG_DIR=$_APP_LOG_DIR/$COMPLETE_PROCESS_NAME/tomcatlog
mkdir -p $TOMCAT_LOG_DIR
export TOMCAT_WORK_DIR=$_APP_SHARE_DIR/$COMPLETE_PROCESS_NAME/tomcatwork
export CATALINA_OUT=$TOMCAT_LOG_DIR/catalina.out
JAVA_OPTS="$JAVA_OPTS -DTOMCAT_LOG_DIR=$TOMCAT_LOG_DIR  -DTOMCAT_WORK_DIR=$TOMCAT_WORK_DIR -DNFW=$COMPLETE_PROCESS_NAME -Dprocname=$COMPLETE_PROCESS_NAME "
export JAVA_OPTS="$JAVA_OPTS -server -Xms32m -Xmx256m -XX:InitialCodeCacheSize=32m -XX:ReservedCodeCacheSize=64m -XX:MetaspaceSize=32m -XX:MaxMetaspaceSize=128m -XX:+DisableExplicitGC -XX:+UseConcMarkSweepGC -XX:+UseCMSInitiatingOccupancyOnly -XX:CMSInitiatingOccupancyFraction=62 -XX:-UseLargePages -XX:+UseFastAccessorMethods -XX:+CMSClassUnloadingEnabled -Dbsp.app.datasource=ServiceGatewaydb"
export LOGGING_CONFIG="-DNFW=$COMPLETE_PROCESS_NAME -Djava.util.logging.config.file=$CATALINA_BASE/conf/logging.properties"

$CATALINA_HOME/bin/catalina.sh start

result=0;$CUR_PATH/../../../../manager/agent/tools/shscript/syslogutils.sh "$(basename $0)" "$result" "Execute($#):$CUR_PATH/$0 $@";exit $result
