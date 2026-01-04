#!/usr/bin/env bash

# ---- Argument check ----
if [ "$#" -ne 1 ]; then
    echo "Usage: $0 <ENCRYPTION_PASSWORD>"
    echo
    echo "Example:"
    echo "  $0 mySecretPassword"
    exit 1
fi

PASSWORD="$1"

# ---- Constants ----
DB="/etc/pihole/pihole-FTL.db"
OUT_DIR="/var/www/html/dump"
OUT_FILE="${OUT_DIR}/data"

# ---- Ensure output directory exists ----
mkdir -p "$OUT_DIR"

# ---- Run query, process, and encrypt ----
/usr/bin/sqlite3 "$DB" \
"SELECT id, timestamp, client, domain
 FROM queries
 WHERE status IN (2,3,12,13,14,17)
   AND timestamp >= '$(($(date +%s) - 86400))'" \
| awk -F'|' '
BEGIN {
    print "["
}
{
    printf "%s  {\"id\": %d, \"timestamp\": %d, \"client\": \"%s\", \"domain\": \"%s\"}",
           (NR>1?",\n":""), $1, $2, $3, $4
}
END {
    print "\n]"
}
' \
| openssl enc -aes-256-cbc -salt -pbkdf2 -k "$PASSWORD" \
> "$OUT_FILE"

echo "Encrypted dump written to: $OUT_FILE"