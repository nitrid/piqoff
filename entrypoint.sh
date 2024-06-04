#!/bin/sh

# Config dosyasını ayarla
cat <<EOT > /app/config.js
export default 
{
    server: "$DB_SERVER",
    database: "$DB_DATABASE",
    uid: "$DB_UID",
    pwd: "$DB_PWD",
    trustedConnection: false,
    debug: false,
    db_path: "/app/data",
    port: "$APP_PORT",
    hostPath: "/app/www/public"
}
EOT

# Uygulamayı başlat
exec node server.js
