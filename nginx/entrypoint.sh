#!/bin/sh

envsubst '$DOMAIN $API $CLIENT' < /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf

exec nginx -g 'daemon off;'
