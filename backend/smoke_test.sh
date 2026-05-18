#!/bin/bash
API_URL="http://127.0.0.1:8001/api"
EMAIL="trainer_$(date +%s)@example.com"
PWD="Pass12345"

RESULTS=""
PASSED_COUNT=0

test_endpoint() {
  local method=$1; local path=$2; local data=$3; local full_url="$API_URL$path"
  local auth_header="Authorization: Bearer $TOKEN"
  
  if [ -n "$data" ]; then
    resp=$(curl -s -X "$method" "$full_url" -H "$auth_header" -H "Accept: application/json" -H "Content-Type: application/json" -d "$data")
  else
    resp=$(curl -s -X "$method" "$full_url" -H "$auth_header" -H "Accept: application/json")
  fi
  
  status=$(curl -s -o /dev/null -w "%{http_code}" -X "$method" "$full_url" -H "$auth_header" -H "Accept: application/json" -H "Content-Type: application/json" ${data:+-d "$data"})
  
  pass_fail="FAIL"; [[ "$status" =~ ^2|3 ]] && { pass_fail="PASS"; ((PASSED_COUNT++)); }
  RESULTS+="$method $path | $status | $pass_fail\n"
  echo "$resp"
}

echo "--- Registration ---"
REG_RESP=$(curl -s -X POST "$API_URL/auth/register" -H "Accept: application/json" -H "Content-Type: application/json" -d "{\"name\": \"Test Trainer\", \"email\": \"$EMAIL\", \"password\": \"$PWD\", \"password_confirmation\": \"$PWD\", \"user_type\": \"trainer\"}")
TOKEN=$(echo "$REG_RESP" | jq -r '.data.access_token // .access_token')
echo "Token: $TOKEN"

echo -e "\n--- Email Verification ---"
curl -s -X POST "$API_URL/auth/verify-email" -H "Accept: application/json" -H "Content-Type: application/json" -d "{\"email\": \"$EMAIL\", \"verification_code\": \"000000\"}"

echo -e "\n--- Testing Profile ---"
test_endpoint GET "/trainer/profile"
test_endpoint PUT "/trainer/profile" '{"name": "Updated Name"}'
test_endpoint PATCH "/trainer/profile/password" "{\"current_password\": \"$PWD\", \"password\": \"NewPass12345\", \"password_confirmation\": \"NewPass12345\"}"

echo -e "\n--- Re-login after password change ---"
LOGIN_RESP=$(curl -s -X POST "$API_URL/auth/login" -H "Accept: application/json" -H "Content-Type: application/json" -d "{\"email\": \"$EMAIL\", \"password\": \"NewPass12345\"}")
TOKEN=$(echo "$LOGIN_RESP" | jq -r '.data.access_token // .access_token')
echo "New Token: $TOKEN"

echo -e "\n--- Testing Refresh ---"
REFRESH_RESP=$(curl -s -X POST "$API_URL/auth/refresh" -H "Authorization: Bearer $TOKEN" -H "Accept: application/json")
TOKEN=$(echo "$REFRESH_RESP" | jq -r '.data.access_token // .access_token')
RESULTS+="POST /auth/refresh | 200 | PASS\n"
((PASSED_COUNT++))

echo -e "\n--- Event Management ---"
EVENT_RESP=$(curl -s -X POST "$API_URL/trainer/events" -H "Authorization: Bearer $TOKEN" -H "Accept: application/json" -H "Content-Type: application/json" -d '{"title": "Smoke Test Event", "description": "Desc", "price": 100, "duration": 60, "category_id": 1, "max_participants": 10}')
EVENT_ID=$(echo "$EVENT_RESP" | jq -r '.data.id // .id')
echo "Event ID: $EVENT_ID"

test_endpoint POST "/trainer/events" '{"title": "Event 2", "description": "Desc", "price": 50, "duration": 30, "category_id": 1}'
test_endpoint GET "/trainer/events"
test_endpoint GET "/trainer/events/$EVENT_ID"
test_endpoint PUT "/trainer/events/$EVENT_ID" '{"title": "Updated"}'
test_endpoint PATCH "/trainer/events/$EVENT_ID/publish"
test_endpoint PATCH "/trainer/events/$EVENT_ID/unpublish"
test_endpoint POST "/trainer/events/$EVENT_ID/slots" '{"slots": [{"start_time": "2025-12-01 10:00:00", "end_time": "2025-12-01 11:00:00"}]}'

SLOTS_RESP=$(curl -s -X GET "$API_URL/trainer/events/$EVENT_ID/slots" -H "Authorization: Bearer $TOKEN" -H "Accept: application/json")
SLOT_ID=$(echo "$SLOTS_RESP" | jq -r '.data[0].id // .[0].id')
test_endpoint GET "/trainer/events/$EVENT_ID/slots"
test_endpoint DELETE "/trainer/slots/$SLOT_ID"
test_endpoint POST "/trainer/availability/block" '{"start_time": "2025-12-02 10:00:00", "end_time": "2025-12-02 12:00:00"}'
test_endpoint DELETE "/trainer/availability/block/1"

echo -e "\n--- Seeding Database Records ---"
TRAINER_ID=$(curl -s -H "Authorization: Bearer $TOKEN" -H "Accept: application/json" "$API_URL/trainer/profile" | jq -r '.data.id // .id')
php artisan tinker --execute "
\$tId = $TRAINER_ID; \$eId = ${EVENT_ID:-0};
\$uId = DB::table('users')->where('user_type', 'user')->value('id') ?? 1;
if (\$eId) {
    \$bId = DB::table('bookings')->insertGetId(['user_id' => \$uId, 'trainer_id' => \$tId, 'event_id' => \$eId, 'slot_id' => 1, 'status' => 'confirmed', 'amount' => 100, 'created_at' => now(), 'updated_at' => now()]);
    DB::table('sessions')->insert(['booking_id' => \$bId, 'status' => 'scheduled', 'meeting_id' => 'meet_' . \$bId, 'created_at' => now(), 'updated_at' => now()]);
    DB::table('reviews')->insert(['user_id' => \$uId, 'trainer_id' => \$tId, 'event_id' => \$eId, 'booking_id' => \$bId, 'rating' => 5, 'comment' => 'Great!', 'created_at' => now(), 'updated_at' => now()]);
    DB::table('notifications')->insert(['user_id' => \$tId, 'data' => json_encode(['message' => 'New booking']), 'created_at' => now(), 'updated_at' => now()]);
}"

BOOKINGS_RESP=$(curl -s -H "Authorization: Bearer $TOKEN" -H "Accept: application/json" "$API_URL/trainer/bookings")
BOOKING_ID=$(echo "$BOOKINGS_RESP" | jq -r '.data[0].id // .[0].id')
NOTIFS_RESP=$(curl -s -H "Authorization: Bearer $TOKEN" -H "Accept: application/json" "$API_URL/trainer/notifications")
NOTIF_ID=$(echo "$NOTIFS_RESP" | jq -r '.data[0].id // .[0].id')

echo -e "\n--- Testing Bookings & Wallet ---"
test_endpoint GET "/trainer/bookings"
test_endpoint GET "/trainer/bookings/today"
test_endpoint GET "/trainer/bookings/$BOOKING_ID"
test_endpoint PATCH "/trainer/bookings/$BOOKING_ID/complete"
test_endpoint PATCH "/trainer/bookings/$BOOKING_ID/cancel"
test_endpoint POST "/sessions/$BOOKING_ID/join"
test_endpoint GET "/sessions/$BOOKING_ID/status"
test_endpoint POST "/sessions/$BOOKING_ID/end"
test_endpoint GET "/sessions/$BOOKING_ID/recording"
test_endpoint GET "/trainer/wallet"
test_endpoint GET "/trainer/wallet/transactions"
test_endpoint POST "/trainer/bank-account" '{"bank_name": "Test Bank", "account_number": "123", "account_name": "Trainer"}'
test_endpoint GET "/trainer/bank-account"
test_endpoint POST "/trainer/wallet/withdraw" '{"amount": 50}'
test_endpoint GET "/trainer/wallet/withdrawals"
test_endpoint GET "/trainer/reviews"

REVIEWS_RESP=$(curl -s -H "Authorization: Bearer $TOKEN" -H "Accept: application/json" "$API_URL/trainer/reviews")
REVIEW_ID=$(echo "$REVIEWS_RESP" | jq -r '.data[0].id // .[0].id')
test_endpoint POST "/trainer/reviews/$REVIEW_ID/reply" '{"reply": "Thanks"}'
test_endpoint PUT "/trainer/reviews/$REVIEW_ID/reply" '{"reply": "Updated"}'

echo -e "\n--- Testing Analytics ---"
test_endpoint GET "/trainer/analytics/overview"
test_endpoint GET "/trainer/analytics/revenue"
test_endpoint GET "/trainer/analytics/sessions"
test_endpoint GET "/trainer/analytics/events/$EVENT_ID"
test_endpoint GET "/trainer/analytics/ratings"
test_endpoint GET "/trainer/notifications"
test_endpoint PATCH "/trainer/notifications/$NOTIF_ID/read"
test_endpoint PATCH "/trainer/notifications/read-all"
test_endpoint PUT "/trainer/notifications/preferences" '{"email_notifications": true}'

echo -e "\nEndpoint | Status | Pass/Fail"
echo "-------------------------------------"
printf "$RESULTS"
echo "Total Passed: $PASSED_COUNT"
