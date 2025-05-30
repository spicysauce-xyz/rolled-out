cat <<EOF > /usr/share/nginx/html/config.json
{
  "apiHost": "${API_HOST}",
  "apiPort": "${API_PORT}",
  "apiBasePath": "${API_BASE_PATH}"
}
EOF

# Start Nginx
exec nginx -g 'daemon off;'
