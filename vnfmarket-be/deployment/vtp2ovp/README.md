This command helps to port VTP results into LFV OVP format.

Install guide
==============
on the VTP server machine, follow the steps given below for installing this tool.

1. Copy the python script vtp2ovp-result.py into folder scripts under VTP home OPEN_CLI_HOME
2. Copy the yaml file vtp2ovp-result-2019-schema.yaml into folder open-cli-schema under VTP home OPEN_CLI_HOME
3. Run oclip schema-refresh 
4. Run this tool by typing 
	oclip --product LFN-OVP vtp2ovp-result --help
	Sample command usage:
		oclip.sh --product LFN-OVP vtp2ovp-result  --tar-path /tmp --execution-id 1234567890-1567139793554 --vtp-home /opt/vtp


