cat <<EOF > /usr/share/nginx/html/config.json
{
  "apiHost": "${API_HOST}",
  "apiPort": "${API_PORT}"
}
EOF

# Start Nginx
exec nginx -g 'daemon off;'
