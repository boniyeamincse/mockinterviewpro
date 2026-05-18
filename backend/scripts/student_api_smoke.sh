#!/usr/bin/env bash
set -uo pipefail

BASE="${BASE:-http://127.0.0.1:8001/api}"
EMAIL="student$(date +%s)$RANDOM@example.com"
PASS="Pass12345"
TMP_DIR="/tmp/moc_student_smoke"
mkdir -p "$TMP_DIR"

pass_count=0
fail_count=0
TOKEN=""

run() {
  local method="$1"; shift
  local endpoint="$1"; shift
  local body="${1:-}"
  local url="$BASE$endpoint"
  local out_file="$TMP_DIR/resp.json"
  local code

  if [ "$method" = "GET" ]; then
    code=$(curl -s -o "$out_file" -w '%{http_code}' -H 'Accept: application/json' ${TOKEN:+-H "Authorization: Bearer $TOKEN"} "$url")
  elif [ "$method" = "DELETE" ]; then
    code=$(curl -s -o "$out_file" -w '%{http_code}' -X DELETE -H 'Accept: application/json' ${TOKEN:+-H "Authorization: Bearer $TOKEN"} "$url")
  else
    code=$(curl -s -o "$out_file" -w '%{http_code}' -X "$method" -H 'Content-Type: application/json' -H 'Accept: application/json' ${TOKEN:+-H "Authorization: Bearer $TOKEN"} -d "$body" "$url")
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
    php artisan serve --host=127.0.0.1 --port=8001 >/tmp/moc_student_server.log 2>&1 &
    sleep 2
  fi
}

cd "$(dirname "$0")/.." || exit 1
ensure_server

# seed trainer and published event with two open slots and one trainer review target
if command -v mysql >/dev/null 2>&1; then
  TRAINER_EMAIL="trainer_public_$RANDOM@example.com"
  mysql -h 127.0.0.1 -u root --skip-ssl -D mock -e "INSERT INTO users (name,email,password,user_type,is_active,email_verified_at,created_at,updated_at) VALUES ('Public Trainer','$TRAINER_EMAIL','\$2y\$12\$m2Q0jz8X1mC4fI7nV2an1OiWKP8YfztYHf3M24u3D3W5g4Q0mG7uW','trainer',1,NOW(),NOW(),NOW());"
  TRAINER_ID=$(mysql -h 127.0.0.1 -u root --skip-ssl -D mock -Nse "SELECT id FROM users WHERE email='$TRAINER_EMAIL' ORDER BY id DESC LIMIT 1")

  mysql -h 127.0.0.1 -u root --skip-ssl -D mock -e "INSERT INTO events (user_id,title,category,interview_type,description,topics_covered,total_sessions,duration_minutes,price_bdt,cancellation_policy,timezone,status,published_at,created_at,updated_at) VALUES ($TRAINER_ID,'Published Event','software_engineering','technical','desc','[\"topic\"]',5,60,800,'24h','UTC','published',NOW(),NOW(),NOW());"
  EVENT_ID=$(mysql -h 127.0.0.1 -u root --skip-ssl -D mock -Nse "SELECT id FROM events WHERE user_id=$TRAINER_ID ORDER BY id DESC LIMIT 1")

  mysql -h 127.0.0.1 -u root --skip-ssl -D mock -e "INSERT INTO event_slots (event_id,starts_at,ends_at,status,created_at,updated_at) VALUES ($EVENT_ID, DATE_ADD(NOW(), INTERVAL 1 DAY), DATE_ADD(DATE_ADD(NOW(), INTERVAL 1 DAY), INTERVAL 1 HOUR), 'open', NOW(), NOW()), ($EVENT_ID, DATE_ADD(NOW(), INTERVAL 2 DAY), DATE_ADD(DATE_ADD(NOW(), INTERVAL 2 DAY), INTERVAL 1 HOUR), 'open', NOW(), NOW());"
  SLOT1_ID=$(mysql -h 127.0.0.1 -u root --skip-ssl -D mock -Nse "SELECT id FROM event_slots WHERE event_id=$EVENT_ID ORDER BY id ASC LIMIT 1")
  SLOT2_ID=$(mysql -h 127.0.0.1 -u root --skip-ssl -D mock -Nse "SELECT id FROM event_slots WHERE event_id=$EVENT_ID ORDER BY id DESC LIMIT 1")
fi

# auth flow
REG=$(curl -s -X POST "$BASE/auth/register" -H 'Content-Type: application/json' -H 'Accept: application/json' -d "{\"name\":\"Student Smoke\",\"email\":\"$EMAIL\",\"password\":\"$PASS\",\"password_confirmation\":\"$PASS\",\"user_type\":\"student\"}")
run POST "/auth/verify-email" "{\"email\":\"$EMAIL\",\"verification_code\":\"000000\"}"
LOGIN=$(curl -s -X POST "$BASE/auth/login" -H 'Content-Type: application/json' -H 'Accept: application/json' -d "{\"email\":\"$EMAIL\",\"password\":\"$PASS\"}")
TOKEN=$(echo "$LOGIN" | php -r '$j=json_decode(stream_get_contents(STDIN),true); echo $j["data"]["access_token"] ?? "";')
STUDENT_ID=$(echo "$LOGIN" | php -r '$j=json_decode(stream_get_contents(STDIN),true); echo $j["data"]["user"]["id"] ?? "";')

if [ -z "$TOKEN" ]; then
  echo "Auth failed"
  echo "$LOGIN"
  exit 1
fi

echo "IDs: student=$STUDENT_ID trainer=${TRAINER_ID:-} event=${EVENT_ID:-} slot1=${SLOT1_ID:-} slot2=${SLOT2_ID:-}"

# Auth & profile (7)
run GET "/student/profile"
run PUT "/student/profile" '{"bio":"student bio","goals":"get better","career_goal":"SWE"}'
run PATCH "/student/profile/password" '{"current_password":"Pass12345","password":"Pass12346","password_confirmation":"Pass12346"}'
run POST "/auth/login" "{\"email\":\"$EMAIL\",\"password\":\"Pass12346\"}"
RELOGIN=$(curl -s -X POST "$BASE/auth/login" -H 'Content-Type: application/json' -H 'Accept: application/json' -d "{\"email\":\"$EMAIL\",\"password\":\"Pass12346\"}")
TOKEN=$(echo "$RELOGIN" | php -r '$j=json_decode(stream_get_contents(STDIN),true); echo $j["data"]["access_token"] ?? "";')
REF=$(curl -s -X POST "$BASE/auth/refresh" -H 'Content-Type: application/json' -H 'Accept: application/json' -H "Authorization: Bearer $TOKEN" -d '{}')
NEW_TOKEN=$(echo "$REF" | php -r '$j=json_decode(stream_get_contents(STDIN),true); echo $j["data"]["access_token"] ?? "";')
[ -n "$NEW_TOKEN" ] && TOKEN="$NEW_TOKEN" && echo "PASS | 200 | POST /auth/refresh" || { echo "FAIL | 401 | POST /auth/refresh"; echo "$REF"; fail_count=$((fail_count+1)); }
AUTH_TOKEN="$TOKEN"

# Discovery (6)
TOKEN=""
run GET "/events"
run GET "/events/$EVENT_ID"
run GET "/events/search?q=Event"
run GET "/events/$EVENT_ID/slots"
run GET "/trainers/$TRAINER_ID/profile"
run GET "/trainers/$TRAINER_ID/reviews"
TOKEN="$AUTH_TOKEN"

# Wishlist + bookings
run POST "/student/wishlist/$EVENT_ID" '{}'
run GET "/student/wishlist"
run DELETE "/student/wishlist/$EVENT_ID"

run POST "/student/bookings" "{\"event_id\":$EVENT_ID,\"slot_id\":$SLOT1_ID}"
BOOKING_ID=$(php -r '$db=new PDO("mysql:host=127.0.0.1;dbname=mock","root",""); echo $db->query("SELECT id FROM bookings ORDER BY id DESC LIMIT 1")->fetchColumn();')
run GET "/student/bookings"
run GET "/student/bookings/$BOOKING_ID"
run GET "/student/bookings/upcoming"
run PATCH "/student/bookings/$BOOKING_ID/reschedule" "{\"slot_id\":$SLOT2_ID}"
run PATCH "/student/bookings/$BOOKING_ID/cancel" '{"reason":"cannot attend"}'

# Sessions (3)
run POST "/sessions/$BOOKING_ID/join" '{}'
run GET "/sessions/$BOOKING_ID/status"
run GET "/sessions/$BOOKING_ID/recording"

# Payments (5)
run POST "/student/payments/initiate" "{\"booking_id\":$BOOKING_ID,\"amount_bdt\":800}"
PAY_ID=$(php -r '$db=new PDO("mysql:host=127.0.0.1;dbname=mock","root",""); echo $db->query("SELECT id FROM payments ORDER BY id DESC LIMIT 1")->fetchColumn();')
run POST "/student/payments/verify" "{\"payment_id\":$PAY_ID,\"success\":true}"
run GET "/student/payments"
run GET "/student/payments/$PAY_ID"
run GET "/student/payments/$PAY_ID/receipt"

# Reviews (5)
run POST "/student/reviews" "{\"event_id\":$EVENT_ID,\"booking_id\":$BOOKING_ID,\"rating\":5,\"comment\":\"great\"}"
REVIEW_ID=$(php -r '$db=new PDO("mysql:host=127.0.0.1;dbname=mock","root",""); echo $db->query("SELECT id FROM reviews WHERE student_id IS NOT NULL ORDER BY id DESC LIMIT 1")->fetchColumn();')
run GET "/student/reviews"
run PUT "/student/reviews/$REVIEW_ID" '{"rating":4,"comment":"updated"}'
run POST "/student/reviews/$REVIEW_ID/report" '{"reason":"rude reply"}'
run DELETE "/student/reviews/$REVIEW_ID"

# Notifications (4)
if command -v mysql >/dev/null 2>&1; then
  mysql -h 127.0.0.1 -u root --skip-ssl -D mock -e "INSERT INTO student_notifications (user_id,title,message,type,created_at,updated_at) VALUES ($STUDENT_ID,'n','m','info',NOW(),NOW());"
fi
NOTIF_ID=$(php -r '$db=new PDO("mysql:host=127.0.0.1;dbname=mock","root",""); echo $db->query("SELECT id FROM student_notifications ORDER BY id DESC LIMIT 1")->fetchColumn();')
run GET "/student/notifications"
run PATCH "/student/notifications/$NOTIF_ID/read" '{}'
run PATCH "/student/notifications/read-all" '{}'
run PUT "/student/notifications/preferences" '{"email_enabled":true,"sms_enabled":false,"push_enabled":true}'

# logout last
run POST "/auth/logout" '{}'

echo "SUMMARY: pass=$pass_count fail=$fail_count"
