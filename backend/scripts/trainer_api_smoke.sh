#!/usr/bin/env bash
set -uo pipefail

BASE="${BASE:-http://127.0.0.1:8001/api}"
EMAIL="trainer$(date +%s)$RANDOM@example.com"
PASS="Pass12345"
TMP_DIR="/tmp/moc_trainer_smoke"
mkdir -p "$TMP_DIR"

pass_count=0
fail_count=0

json_get() {
  curl -s -H 'Accept: application/json' -H "Authorization: Bearer $TOKEN" "$1"
}

json_post() {
  curl -s -X POST "$1" -H 'Content-Type: application/json' -H 'Accept: application/json' -H "Authorization: Bearer $TOKEN" -d "$2"
}

json_put() {
  curl -s -X PUT "$1" -H 'Content-Type: application/json' -H 'Accept: application/json' -H "Authorization: Bearer $TOKEN" -d "$2"
}

json_patch() {
  curl -s -X PATCH "$1" -H 'Content-Type: application/json' -H 'Accept: application/json' -H "Authorization: Bearer $TOKEN" -d "$2"
}

json_delete() {
  curl -s -X DELETE "$1" -H 'Accept: application/json' -H "Authorization: Bearer $TOKEN"
}

run_check() {
  local method="$1"
  local endpoint="$2"
  local body="${3:-}"
  local url="$BASE$endpoint"
  local out_file="$TMP_DIR/resp.json"
  local code

  if [ "$method" = "GET" ]; then
    code=$(curl -s -o "$out_file" -w '%{http_code}' -H 'Accept: application/json' -H "Authorization: Bearer $TOKEN" "$url")
  elif [ "$method" = "DELETE" ]; then
    code=$(curl -s -o "$out_file" -w '%{http_code}' -X DELETE -H 'Accept: application/json' -H "Authorization: Bearer $TOKEN" "$url")
  else
    code=$(curl -s -o "$out_file" -w '%{http_code}' -X "$method" -H 'Content-Type: application/json' -H 'Accept: application/json' -H "Authorization: Bearer $TOKEN" -d "$body" "$url")
  fi

  if [[ "$code" =~ ^2 ]]; then
    pass_count=$((pass_count + 1))
    echo "PASS | $code | $method $endpoint"
  else
    fail_count=$((fail_count + 1))
    echo "FAIL | $code | $method $endpoint"
    cat "$out_file"
    echo
  fi
}

ensure_server() {
  if ! lsof -i :8001 >/dev/null 2>&1; then
    php artisan serve --host=127.0.0.1 --port=8001 >/tmp/moc_trainer_server.log 2>&1 &
    sleep 2
  fi
}

cd "$(dirname "$0")/.." || exit 1
ensure_server

reg_resp=$(curl -s -X POST "$BASE/auth/register" -H 'Content-Type: application/json' -H 'Accept: application/json' -d "{\"name\":\"Trainer Smoke\",\"email\":\"$EMAIL\",\"password\":\"$PASS\",\"password_confirmation\":\"$PASS\",\"user_type\":\"trainer\"}")
verify_resp=$(curl -s -X POST "$BASE/auth/verify-email" -H 'Content-Type: application/json' -H 'Accept: application/json' -d "{\"email\":\"$EMAIL\",\"verification_code\":\"000000\"}")
login_resp=$(curl -s -X POST "$BASE/auth/login" -H 'Content-Type: application/json' -H 'Accept: application/json' -d "{\"email\":\"$EMAIL\",\"password\":\"$PASS\"}")

TOKEN=$(echo "$login_resp" | php -r '$j=json_decode(stream_get_contents(STDIN),true); echo $j["data"]["access_token"] ?? "";')
TRAINER_ID=$(echo "$login_resp" | php -r '$j=json_decode(stream_get_contents(STDIN),true); echo $j["data"]["user"]["id"] ?? "";')

if [ -z "$TOKEN" ] || [ -z "$TRAINER_ID" ]; then
  echo "Could not authenticate trainer user"
  echo "$reg_resp"
  echo "$verify_resp"
  echo "$login_resp"
  exit 1
fi

event_resp=$(json_post "$BASE/trainer/events" '{"title":"Smoke Event","category":"software_engineering","interview_type":"technical","description":"desc","topics_covered":["A"],"total_sessions":2,"duration_minutes":60,"price_bdt":500,"cancellation_policy":"24h","timezone":"UTC"}')
EVENT_ID=$(echo "$event_resp" | php -r '$j=json_decode(stream_get_contents(STDIN),true); echo $j["data"]["id"] ?? "";')

slot_resp=$(json_post "$BASE/trainer/events/$EVENT_ID/slots" '{"slots":[{"starts_at":"2026-06-01T10:00:00+00:00","ends_at":"2026-06-01T11:00:00+00:00"}]}')
SLOT_ID=$(echo "$slot_resp" | php -r '$j=json_decode(stream_get_contents(STDIN),true); echo $j["data"][0]["id"] ?? "";')

if [ -z "$SLOT_ID" ] && command -v mysql >/dev/null 2>&1; then
  SLOT_ID=$(mysql -h 127.0.0.1 -u root --skip-ssl -D mock -Nse "SELECT id FROM event_slots WHERE event_id=$EVENT_ID ORDER BY id DESC LIMIT 1")
fi

if [ -z "$SLOT_ID" ] && command -v mysql >/dev/null 2>&1; then
  mysql -h 127.0.0.1 -u root --skip-ssl -D mock -e "INSERT INTO event_slots (event_id, starts_at, ends_at, status, created_at, updated_at) VALUES ($EVENT_ID, NOW(), DATE_ADD(NOW(), INTERVAL 1 HOUR), 'open', NOW(), NOW());"
  SLOT_ID=$(mysql -h 127.0.0.1 -u root --skip-ssl -D mock -Nse "SELECT id FROM event_slots WHERE event_id=$EVENT_ID ORDER BY id DESC LIMIT 1")
fi

json_post "$BASE/trainer/availability/block" '{"blocked_date":"2026-06-05","reason":"busy"}' >/dev/null
BLOCK_ID=$(php -r '$db=new PDO("mysql:host=127.0.0.1;dbname=mock","root",""); echo $db->query("select id from availability_blocks order by id desc limit 1")->fetchColumn();')

if command -v mysql >/dev/null 2>&1; then
  mysql -h 127.0.0.1 -u root --skip-ssl -D mock -e "INSERT INTO bookings (event_id, trainer_id, status, scheduled_at, created_at, updated_at) VALUES ($EVENT_ID, $TRAINER_ID, 'upcoming', NOW(), NOW(), NOW());"
  BOOKING_ID=$(mysql -h 127.0.0.1 -u root --skip-ssl -D mock -Nse "SELECT id FROM bookings WHERE trainer_id=$TRAINER_ID ORDER BY id DESC LIMIT 1")

  mysql -h 127.0.0.1 -u root --skip-ssl -D mock -e "INSERT INTO reviews (event_id, booking_id, trainer_id, rating, comment, created_at, updated_at) VALUES ($EVENT_ID, $BOOKING_ID, $TRAINER_ID, 5, 'great', NOW(), NOW());"
  REVIEW_ID=$(mysql -h 127.0.0.1 -u root --skip-ssl -D mock -Nse "SELECT id FROM reviews WHERE trainer_id=$TRAINER_ID ORDER BY id DESC LIMIT 1")

  mysql -h 127.0.0.1 -u root --skip-ssl -D mock -e "INSERT INTO trainer_notifications (user_id, title, message, type, created_at, updated_at) VALUES ($TRAINER_ID, 'n', 'm', 'info', NOW(), NOW());"
  NOTIF_ID=$(mysql -h 127.0.0.1 -u root --skip-ssl -D mock -Nse "SELECT id FROM trainer_notifications WHERE user_id=$TRAINER_ID ORDER BY id DESC LIMIT 1")

  mysql -h 127.0.0.1 -u root --skip-ssl -D mock -e "INSERT INTO wallet_transactions (user_id, type, source, amount_bdt, status, created_at, updated_at) VALUES ($TRAINER_ID, 'credit', 'session', 1000, 'settled', NOW(), NOW());"
fi

echo "IDs: trainer=$TRAINER_ID event=$EVENT_ID slot=$SLOT_ID block=$BLOCK_ID booking=$BOOKING_ID review=$REVIEW_ID notif=$NOTIF_ID"

run_check GET "/trainer/profile"
run_check PUT "/trainer/profile" '{"bio":"updated","expertise":["system design"]}'

run_check GET "/trainer/events"
run_check GET "/trainer/events/$EVENT_ID"
run_check PUT "/trainer/events/$EVENT_ID" '{"price_bdt":700}'
run_check PATCH "/trainer/events/$EVENT_ID/publish" '{}'
run_check PATCH "/trainer/events/$EVENT_ID/unpublish" '{}'
run_check GET "/trainer/events/$EVENT_ID/slots"
run_check DELETE "/trainer/slots/$SLOT_ID"
run_check DELETE "/trainer/availability/block/$BLOCK_ID"

run_check GET "/trainer/bookings"
run_check GET "/trainer/bookings/today"
run_check GET "/trainer/bookings/$BOOKING_ID"
run_check PATCH "/trainer/bookings/$BOOKING_ID/complete" '{}'
run_check PATCH "/trainer/bookings/$BOOKING_ID/cancel" '{"reason":"test"}'

run_check POST "/sessions/$BOOKING_ID/join" '{}'
run_check GET "/sessions/$BOOKING_ID/status"
run_check POST "/sessions/$BOOKING_ID/end" '{}'
run_check GET "/sessions/$BOOKING_ID/recording"

run_check GET "/trainer/wallet"
run_check GET "/trainer/wallet/transactions"
run_check POST "/trainer/bank-account" '{"account_type":"bkash","mobile_wallet":"0170000000"}'
run_check GET "/trainer/bank-account"
run_check POST "/trainer/wallet/withdraw" '{"amount_bdt":200}'
run_check GET "/trainer/wallet/withdrawals"

run_check GET "/trainer/reviews"
run_check POST "/trainer/reviews/$REVIEW_ID/reply" '{"reply":"thanks"}'
run_check PUT "/trainer/reviews/$REVIEW_ID/reply" '{"reply":"updated thanks"}'

run_check GET "/trainer/analytics/overview"
run_check GET "/trainer/analytics/revenue"
run_check GET "/trainer/analytics/sessions"
run_check GET "/trainer/analytics/events/$EVENT_ID"
run_check GET "/trainer/analytics/ratings"

run_check GET "/trainer/notifications"
run_check PATCH "/trainer/notifications/$NOTIF_ID/read" '{}'
run_check PATCH "/trainer/notifications/read-all" '{}'
run_check PUT "/trainer/notifications/preferences" '{"email_enabled":true,"sms_enabled":false,"push_enabled":true}'

refresh_resp=$(json_post "$BASE/auth/refresh" '{}')
NEW_TOKEN=$(echo "$refresh_resp" | php -r '$j=json_decode(stream_get_contents(STDIN),true); echo $j["data"]["access_token"] ?? "";')
if [ -n "$NEW_TOKEN" ]; then
  TOKEN="$NEW_TOKEN"
  pass_count=$((pass_count + 1))
  echo "PASS | 200 | POST /auth/refresh"
else
  fail_count=$((fail_count + 1))
  echo "FAIL | 401 | POST /auth/refresh"
  echo "$refresh_resp"
fi

run_check PATCH "/trainer/profile/password" '{"current_password":"Pass12345","password":"Pass12346","password_confirmation":"Pass12346"}'

echo "SUMMARY: pass=$pass_count fail=$fail_count"
exit 0
