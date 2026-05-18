#!/usr/bin/env bash
set -uo pipefail

BASE="${BASE:-http://127.0.0.1:8001/api}"
TMP_DIR="/tmp/moc_admin_smoke"
mkdir -p "$TMP_DIR"

ADMIN_EMAIL="admin$(date +%s)$RANDOM@example.com"
PASS="Pass12345"
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
  local -a args

  args=(-s -o "$out_file" -w '%{http_code}' -H 'Accept: application/json')
  if [ -n "$TOKEN" ]; then
    args+=(-H "Authorization: Bearer $TOKEN")
  fi

  if [ "$method" = "GET" ]; then
    code=$(curl "${args[@]}" "$url")
  elif [ "$method" = "DELETE" ]; then
    code=$(curl "${args[@]}" -X DELETE "$url")
  else
    code=$(curl "${args[@]}" -X "$method" -H 'Content-Type: application/json' -d "$body" "$url")
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
    php artisan serve --host=127.0.0.1 --port=8001 >/tmp/moc_admin_server.log 2>&1 &
    sleep 2
  fi
}

cd "$(dirname "$0")/.." || exit 1
ensure_server

# create admin account via normal register flow
curl -s -X POST "$BASE/auth/register" -H 'Content-Type: application/json' -H 'Accept: application/json' -d "{\"name\":\"Admin Smoke\",\"email\":\"$ADMIN_EMAIL\",\"password\":\"$PASS\",\"password_confirmation\":\"$PASS\",\"user_type\":\"admin\"}" >/dev/null
run POST "/auth/verify-email" "{\"email\":\"$ADMIN_EMAIL\",\"verification_code\":\"000000\"}"

ADMIN_LOGIN=$(curl -s -X POST "$BASE/auth/admin/login" -H 'Content-Type: application/json' -H 'Accept: application/json' -d "{\"email\":\"$ADMIN_EMAIL\",\"password\":\"$PASS\"}")
TOKEN=$(echo "$ADMIN_LOGIN" | php -r '$j=json_decode(stream_get_contents(STDIN),true); echo $j["data"]["access_token"] ?? "";')
ADMIN_ID=$(echo "$ADMIN_LOGIN" | php -r '$j=json_decode(stream_get_contents(STDIN),true); echo $j["data"]["user"]["id"] ?? "";')

if [ -z "$TOKEN" ]; then
  echo "Admin login failed"
  echo "$ADMIN_LOGIN"
  exit 1
fi

# seed a trainer + student + event + booking + payment + review + withdrawal
if command -v mysql >/dev/null 2>&1; then
  TMAIL="admin_seed_trainer_$RANDOM@example.com"
  SMAIL="admin_seed_student_$RANDOM@example.com"
  mysql -h 127.0.0.1 -u root --skip-ssl -D mock -e "INSERT INTO users (name,email,password,user_type,is_active,is_approved,email_verified_at,created_at,updated_at) VALUES ('Seed Trainer','$TMAIL','\$2y\$12\$m2Q0jz8X1mC4fI7nV2an1OiWKP8YfztYHf3M24u3D3W5g4Q0mG7uW','trainer',1,0,NOW(),NOW(),NOW());"
  mysql -h 127.0.0.1 -u root --skip-ssl -D mock -e "INSERT INTO users (name,email,password,user_type,is_active,is_approved,email_verified_at,created_at,updated_at) VALUES ('Seed Student','$SMAIL','\$2y\$12\$m2Q0jz8X1mC4fI7nV2an1OiWKP8YfztYHf3M24u3D3W5g4Q0mG7uW','student',1,1,NOW(),NOW(),NOW());"
  TRAINER_ID=$(mysql -h 127.0.0.1 -u root --skip-ssl -D mock -Nse "SELECT id FROM users WHERE email='$TMAIL' ORDER BY id DESC LIMIT 1")
  STUDENT_ID=$(mysql -h 127.0.0.1 -u root --skip-ssl -D mock -Nse "SELECT id FROM users WHERE email='$SMAIL' ORDER BY id DESC LIMIT 1")

  mysql -h 127.0.0.1 -u root --skip-ssl -D mock -e "INSERT INTO events (user_id,title,category,interview_type,description,topics_covered,total_sessions,duration_minutes,price_bdt,cancellation_policy,timezone,status,is_flagged,created_at,updated_at) VALUES ($TRAINER_ID,'Admin Seed Event','software_engineering','technical','desc','[\"topic\"]',3,60,700,'24h','UTC','published',0,NOW(),NOW());"
  EVENT_ID=$(mysql -h 127.0.0.1 -u root --skip-ssl -D mock -Nse "SELECT id FROM events WHERE user_id=$TRAINER_ID ORDER BY id DESC LIMIT 1")

  mysql -h 127.0.0.1 -u root --skip-ssl -D mock -e "INSERT INTO bookings (event_id,trainer_id,student_id,status,is_disputed,scheduled_at,created_at,updated_at) VALUES ($EVENT_ID,$TRAINER_ID,$STUDENT_ID,'upcoming',1,NOW(),NOW(),NOW());"
  BOOKING_ID=$(mysql -h 127.0.0.1 -u root --skip-ssl -D mock -Nse "SELECT id FROM bookings WHERE event_id=$EVENT_ID ORDER BY id DESC LIMIT 1")

  PREF="APAY$RANDOM"
  mysql -h 127.0.0.1 -u root --skip-ssl -D mock -e "INSERT INTO payments (user_id,booking_id,reference,amount_bdt,status,gateway,created_at,updated_at) VALUES ($STUDENT_ID,$BOOKING_ID,'$PREF',700,'paid','mock',NOW(),NOW());"
  PAYMENT_ID=$(mysql -h 127.0.0.1 -u root --skip-ssl -D mock -Nse "SELECT id FROM payments WHERE reference='$PREF' ORDER BY id DESC LIMIT 1")

  mysql -h 127.0.0.1 -u root --skip-ssl -D mock -e "INSERT INTO reviews (event_id,booking_id,trainer_id,student_id,rating,comment,is_flagged,created_at,updated_at) VALUES ($EVENT_ID,$BOOKING_ID,$TRAINER_ID,$STUDENT_ID,4,'ok',1,NOW(),NOW());"
  REVIEW_ID=$(mysql -h 127.0.0.1 -u root --skip-ssl -D mock -Nse "SELECT id FROM reviews WHERE event_id=$EVENT_ID ORDER BY id DESC LIMIT 1")

  mysql -h 127.0.0.1 -u root --skip-ssl -D mock -e "INSERT INTO withdrawal_requests (user_id,amount_bdt,status,requested_at,created_at,updated_at) VALUES ($TRAINER_ID,500,'pending',NOW(),NOW(),NOW());"
  WITHDRAWAL_ID=$(mysql -h 127.0.0.1 -u root --skip-ssl -D mock -Nse "SELECT id FROM withdrawal_requests WHERE user_id=$TRAINER_ID ORDER BY id DESC LIMIT 1")

  mysql -h 127.0.0.1 -u root --skip-ssl -D mock -e "INSERT INTO admin_notifications (admin_id,title,message,type,created_at,updated_at) VALUES ($ADMIN_ID,'a','b','info',NOW(),NOW());"
fi

echo "IDs: admin=$ADMIN_ID trainer=$TRAINER_ID student=$STUDENT_ID event=$EVENT_ID booking=$BOOKING_ID payment=$PAYMENT_ID review=$REVIEW_ID withdrawal=$WITHDRAWAL_ID"

# Auth/admin account
run GET "/admin/me"
run PATCH "/admin/me/password" '{"current_password":"Pass12345","password":"Pass12346","password_confirmation":"Pass12346"}'
ADMIN_LOGIN2=$(curl -s -X POST "$BASE/auth/admin/login" -H 'Content-Type: application/json' -H 'Accept: application/json' -d "{\"email\":\"$ADMIN_EMAIL\",\"password\":\"Pass12346\"}")
TOKEN=$(echo "$ADMIN_LOGIN2" | php -r '$j=json_decode(stream_get_contents(STDIN),true); echo $j["data"]["access_token"] ?? "";')
NEW=$(curl -s -X POST "$BASE/auth/admin/refresh" -H 'Content-Type: application/json' -H 'Accept: application/json' -H "Authorization: Bearer $TOKEN" -d '{}')
NT=$(echo "$NEW" | php -r '$j=json_decode(stream_get_contents(STDIN),true); echo $j["data"]["access_token"] ?? "";')
[ -n "$NT" ] && TOKEN="$NT"
if [ -n "$NT" ]; then
  pass_count=$((pass_count + 1))
  echo "PASS | 200 | POST /auth/admin/refresh"
else
  fail_count=$((fail_count + 1))
  echo "FAIL | 401 | POST /auth/admin/refresh"
  echo "$NEW"
fi

# trainer management
run GET "/admin/trainers"
run GET "/admin/trainers/$TRAINER_ID"
run GET "/admin/trainers/pending"
run PATCH "/admin/trainers/$TRAINER_ID/approve" '{}'
run PATCH "/admin/trainers/$TRAINER_ID/suspend" '{}'
run PATCH "/admin/trainers/$TRAINER_ID/reinstate" '{}'
run POST "/admin/trainers/$TRAINER_ID/note" '{"note":"watch quality"}'

# student management
run GET "/admin/students"
run GET "/admin/students/$STUDENT_ID"
run PATCH "/admin/students/$STUDENT_ID/suspend" '{}'
run PATCH "/admin/students/$STUDENT_ID/reinstate" '{}'
run POST "/admin/students/$STUDENT_ID/note" '{"note":"good student"}'

# event management
run GET "/admin/events"
run GET "/admin/events/$EVENT_ID"
run PATCH "/admin/events/$EVENT_ID/flag" '{"reason":"policy"}'
run GET "/admin/events/flagged"
run PATCH "/admin/events/$EVENT_ID/unpublish" '{}'
run PATCH "/admin/events/$EVENT_ID/publish" '{}'

# booking oversight
run GET "/admin/bookings"
run GET "/admin/bookings/$BOOKING_ID"
run GET "/admin/bookings/disputed"
run PATCH "/admin/bookings/$BOOKING_ID/cancel" '{"reason":"ops override"}'
run PATCH "/admin/bookings/$BOOKING_ID/complete" '{}'
run POST "/admin/bookings/$BOOKING_ID/note" '{"note":"resolved"}'

# finance
run GET "/admin/payments"
run GET "/admin/payments/$PAYMENT_ID"
run POST "/admin/payments/$PAYMENT_ID/refund" '{"amount_bdt":100,"reason":"manual"}'
run GET "/admin/withdrawals"
run GET "/admin/withdrawals/pending"
run PATCH "/admin/withdrawals/$WITHDRAWAL_ID/approve" '{}'
run PATCH "/admin/withdrawals/$WITHDRAWAL_ID/reject" '{"reason":"duplicate"}'
run GET "/admin/wallets"
run GET "/admin/wallets/company"
run GET "/admin/finance/summary"

# reviews
run GET "/admin/reviews"
run GET "/admin/reviews/flagged"
run GET "/admin/reviews/$REVIEW_ID"
run PATCH "/admin/reviews/$REVIEW_ID/clear-flag" '{}'
run DELETE "/admin/reviews/$REVIEW_ID/reply"

# analytics
run GET "/admin/analytics/overview"
run GET "/admin/analytics/revenue"
run GET "/admin/analytics/sessions"
run GET "/admin/analytics/users"
run GET "/admin/analytics/categories"
run GET "/admin/analytics/top-trainers"
run GET "/admin/analytics/retention"
run GET "/admin/analytics/export"

# notifications + broadcast
run GET "/admin/notifications"
run PATCH "/admin/notifications/read-all" '{}'
run POST "/admin/broadcast" '{"target_role":"all","title":"maintenance","message":"tonight"}'
run GET "/admin/broadcast/history"
run POST "/admin/notifications/email" "{\"user_id\":$STUDENT_ID,\"subject\":\"hello\",\"message\":\"msg\"}"
run GET "/admin/notifications/logs"

# settings
run GET "/admin/settings"
run PUT "/admin/settings/commission" '{"trainer_percent":85}'
run PUT "/admin/settings/min-price" '{"min_price_bdt":200}'
run PUT "/admin/settings/categories" '{"categories":["software_engineering","data_science"]}'
run PUT "/admin/settings/cancellation-policy" '{"policy":"24h"}'
run PUT "/admin/settings/recording" '{"enabled":true}'
run GET "/admin/settings/audit-log"

# destructive end
run DELETE "/admin/reviews/$REVIEW_ID"
run DELETE "/admin/students/$STUDENT_ID"
run DELETE "/admin/trainers/$TRAINER_ID"
run DELETE "/admin/events/$EVENT_ID"

run POST "/auth/admin/logout" '{}'

echo "SUMMARY: pass=$pass_count fail=$fail_count"
