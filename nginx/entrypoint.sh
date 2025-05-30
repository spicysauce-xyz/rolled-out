#!/bin/sh

envsubst '$DOMAIN $API_PATH $CLIENT_PATH' < /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf

exec nginx -g 'daemon off;'
