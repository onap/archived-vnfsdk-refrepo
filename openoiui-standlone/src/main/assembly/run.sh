#!/bin/bash
DIRNAME=`dirname $0`
RUNHOME=`cd $DIRNAME/; pwd`
cd $RUNHOME
$JAVA_HOME/bin/java -Djava.security.egd=file:/dev/urandom -jar openoiui.jar
