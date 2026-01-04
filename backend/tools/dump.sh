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
"SELECT client || '|' || domain
 FROM queries
 WHERE status IN (2,3,12,13,14,17)
   AND timestamp >= '$(($(date +%s) - 86400))'" \
| sort \
| uniq -c \
| sort -n -r \
| awk '
BEGIN {
    print "["
}
{
    split($2, a, "|")
    printf "%s  {\"count\": %d, \"client\": \"%s\", \"domain\": \"%s\"}",
           (NR>1?",\n":""), $1, a[1], a[2]
}
END {
    print "\n]"
}
' \
| openssl enc -aes-256-cbc -salt -pbkdf2 -k "$PASSWORD" \
> "$OUT_FILE"

echo "Encrypted dump written to: $OUT_FILE"