#/bin/sh
openssl req -nodes -newkey rsa:2048 -keyout example.key -out example.csr -subj "/C=IN/ST=Bangalore/L=Bangalore/O=Global Security/OU=ONAP/CN=example.com"
