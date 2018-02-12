#!/bin/sh
openssl req -nodes -newkey rsa:2048 -keyout example.key -out example.csr -subj "/C=IN/ST=Bangalore/L=Bangalore/O=Global Security/OU=ONAP/CN=example.com"
openssl x509 -req -in example.csr -signkey example.key -out cert.crt
cp -p cert.crt /etc/nginx/ssl/
systemctl enable nginx

