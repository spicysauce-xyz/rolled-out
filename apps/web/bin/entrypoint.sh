cat <<EOF > /usr/share/nginx/html/config.json
{
  "apiHost": "${API_HOST}",
  "apiPort": "${API_PORT}",
  "apiPath": "${API_PATH}"
}
EOF

# Start Nginx
exec nginx -g 'daemon off;'
