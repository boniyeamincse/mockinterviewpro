# 🎓 Mock Interview Event Booking System - Quick Start Guide

## 📱 Access the Features

### For Students: Book a Mock Interview Session

**Browse Available Events:**
- URL: `http://localhost:5173/browse-events`
- Features:
  - 🔍 Search events by title, description, or category
  - 🏷️ Filter by category (Software Engineering, Data Science, etc.)
  - 💰 Filter by price range
  - 👨‍🏫 See trainer information
  - ⏱️ View session duration and number of sessions
  - 📚 Browse topics covered

**Book a Session:**
1. Click "Book" on any event → `/student/book-session/:eventId`
2. Select your preferred time slot
3. Review the booking summary
4. Agree to cancellation & reschedule policies
5. Click "Proceed to Payment"

**Make Payment:**
1. Fill in card details (test card: any 13+ digit number)
2. Enter cardholder name, expiry, CVV
3. Click "Pay [amount] BDT"
4. Payment will process (mock gateway)

**View Your Bookings:**
- URL: `http://localhost:5173/student/bookings`
- Features:
  - 📋 View all your scheduled sessions
  - 🔄 Filter by status (Upcoming, Completed, Cancelled)
  - ▶️ Join session button (available 15 min before start)
  - 📹 Download recording after session
  - ⭐ Leave review after completion
  - ❌ Cancel upcoming sessions

---

### For Trainers: Create Interview Events

**Create an Event:**
- URL: `http://localhost:5173/trainer/create-event`
- Fill in:
  - 📝 Event title (e.g., "Software Engineer Mock Interview - System Design")
  - 📂 Category (Software Engineering, Data Science, Product Management, etc.)
  - 🎯 Interview type (Technical, Behavioral, System Design, Mixed)
  - 📖 Description (what students should expect)
  - 🔖 Topics covered (add multiple, e.g., Arrays, Trees, Databases)
  - ❓ Sample questions (optional, max 5)
  - 📋 Process overview (explain how interview will proceed)
  - ⏱️ Duration (30, 45, 60, or 90 minutes)
  - 📊 Total sessions (how many slots available)
  - 💵 Price in BDT (200-100000)
  - 📋 Cancellation policy
  - 🔄 Reschedule policy
- Click "Create Event"

**After Creating:**
1. Add time slots to the event
2. Publish the event
3. Students can now book your sessions

---

## 🗂️ Complete URL Map

| Feature | URL | User Type |
|---------|-----|-----------|
| Browse Events | `/browse-events` | Student |
| Book Session | `/student/book-session/:eventId` | Student |
| Payment | `/student/payment/:bookingId` | Student |
| My Bookings | `/student/bookings` | Student |
| Create Event | `/trainer/create-event` | Trainer |
| Trainer Dashboard | `/trainer/dashboard` | Trainer |
| Edit Profile | `/trainer/profile/edit` | Trainer |

---

## 💳 Test Payment Details

**Mock Payment Gateway:**
- Card Number: `4532123456789010` (any 13+ digit number)
- Cardholder: Any name
- Expiry: Any future date (MM/YY)
- CVV: Any 3-4 digit number

Payment will automatically succeed after form submission.

---

## 🎯 Example Workflows

### Workflow 1: Student Books a Session
```
1. Go to /browse-events
2. Search for "Software Engineer"
3. Filter by category "Software Engineering"
4. Find an event with price under 5000 BDT
5. Click "Book"
6. Select a time slot
7. Check the summary and agree to terms
8. Click "Proceed to Payment"
9. Enter card details and pay
10. Redirected to /student/bookings
11. Your session now appears in "Upcoming"
```

### Workflow 2: Trainer Creates and Manages Events
```
1. Go to /trainer/create-event
2. Enter event details:
   - Title: "System Design Interview Prep"
   - Category: "Software Engineering"
   - Topics: ["System Design", "Scalability", "Databases", "APIs"]
   - Price: 1200 BDT
3. Click "Create Event"
4. Add time slots (e.g., Monday 10:00 AM, Wednesday 2:00 PM)
5. Publish the event
6. Students can now book your sessions
7. View bookings in /trainer/bookings
8. Once session is done, mark as completed
```

---

## 🔄 Data Flow

### Booking Process:
```
Student Views Event
    ↓
Selects Time Slot
    ↓
Creates Booking (POST /api/student/bookings)
    ↓
Initiates Payment (POST /api/student/payments/initiate)
    ↓
Verifies Payment (POST /api/student/payments/verify)
    ↓
Booking confirmed, appears in /student/bookings
```

### Event Creation:
```
Trainer fills form
    ↓
POSTs to /api/trainer/events
    ↓
Event created in DRAFT status
    ↓
Trainer adds slots to event
    ↓
Trainer publishes event
    ↓
Event visible in /browse-events
    ↓
Students can book
```

---

## 🛠️ Database Tables Used

- **events** - Event information (title, description, price, etc.)
- **event_slots** - Individual time slots
- **bookings** - Student bookings
- **payments** - Payment records
- **session_rooms** - Video room info (for future)
- **users** - User accounts

---

## 💡 Key Features

✅ **Search & Filter**
- Full-text search across event titles, descriptions, topics
- Category filtering (8+ categories)
- Price range filtering

✅ **Time Slot Management**
- Calendar-based slot selection
- Date & time formatted clearly
- Slot availability tracking
- Prevent double-booking

✅ **Payment Processing**
- Mock payment gateway
- Order summary with breakdown
- Payment status tracking
- Receipt generation

✅ **Booking Management**
- View all bookings with filters
- Cancel upcoming sessions
- Join session (with time restrictions)
- View completed session details
- Download recordings
- Leave reviews

✅ **Event Management**
- Trainer can create events with detailed info
- Add topics and sample questions
- Set pricing and policies
- Manage availability
- Publish/unpublish
- View booking analytics

---

## 🐛 Troubleshooting

**Events not showing in Browse?**
- Events must be in "published" status
- Check filters (category, price range)
- Try different search terms

**Can't join session?**
- Session must be upcoming (not past)
- Must be within 15 minutes before start time
- Check booking status

**Payment not processing?**
- Ensure all card fields are filled
- Card number should be 13+ digits
- CVV should be 3-4 digits

**Event creation failed?**
- Title and description are required
- Must have at least 1 topic
- Price must be 200-100000 BDT

---

## 📞 Support

For issues or questions:
1. Check the API endpoints in backend documentation
2. Verify authentication token is valid
3. Check browser console for error messages
4. Verify database migrations have run

---

**System Ready! 🚀**

Start exploring the mock interview platform at `http://localhost:5173/browse-events`
