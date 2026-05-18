# Mock Interview Platform - Dashboard Documentation

## Table of Contents
1. [Dashboard Overview](#dashboard-overview)
2. [Student Dashboard](#student-dashboard)
3. [Trainer Dashboard](#trainer-dashboard)
4. [Admin Dashboard](#admin-dashboard)
5. [Menu Structure](#menu-structure)
6. [Navigation Flow](#navigation-flow)

---

## Dashboard Overview

The Mock Interview Platform includes three distinct dashboards tailored to different user roles:

- **Student Dashboard:** For learners booking sessions and tracking progress
- **Trainer Dashboard:** For professionals managing events and earning
- **Admin Dashboard:** For platform administrators managing users and content

Each dashboard features a comprehensive menu bar with sub-menus for easy navigation and task management.

---

## Student Dashboard

### Dashboard Layout

```
┌────────────────────────────────────────────────────────────────────┐
│ 🎓 Mock Interview Platform                    [Profile] [Logout]  │
├────────────────────────────────────────────────────────────────────┤
│ MENU BAR                                                           │
│ ┌─────────────────────────────────────────────────────────────┐  │
│ │ 🏠 Dashboard  │ 🔍 Explore  │ 📅 My Bookings  │ 💬 Reviews   │  │
│ │               │             │                │               │  │
│ │  • Overview   │ • Browse    │ • Upcoming     │ • My Reviews   │  │
│ │  • Statistics │ • Favorites │ • Completed    │ • Ratings      │  │
│ │  • Quick      │ • Advanced  │ • Cancelled    │ • Responses    │  │
│ │    Links      │   Search    │ • Reschedule   │               │  │
│ │              │ • Categories │               │               │  │
│ │              │ • Trainers   │               │               │  │
│ │              │ • Compare    │               │               │  │
│ └─────────────────────────────────────────────────────────────┘  │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│  MAIN CONTENT AREA                                                │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

### Menu Structure

#### 1. **Dashboard Menu**
```
Dashboard
├── Overview
│   ├── Welcome message
│   ├── Quick stats
│   ├── Recent activity
│   └── Performance metrics
├── Statistics
│   ├── Total sessions completed
│   ├── Interview types practiced
│   ├── Average ratings received
│   ├── Total amount spent
│   ├── Learning progress chart
│   └── Skill improvement trends
└── Quick Links
    ├── Browse trainers
    ├── My upcoming sessions
    ├── Payment history
    └── Profile settings
```

#### 2. **Explore Menu**
```
Explore
├── Browse Trainers
│   ├── All trainers
│   ├── Top rated
│   ├── New trainers
│   ├── Trainer search
│   ├── Filter by rating
│   └── Filter by expertise
├── Browse Events
│   ├── All events
│   ├── Featured events
│   ├── By category
│   │   ├── Technical Interviews
│   │   ├── Behavioral Interviews
│   │   ├── HR Interviews
│   │   ├── FAANG Specific
│   │   └── Industry Specific
│   ├── By difficulty level
│   │   ├── Beginner
│   │   ├── Intermediate
│   │   └── Advanced
│   └── By price range
├── Advanced Search
│   ├── Custom filters
│   ├── Multi-select options
│   ├── Date range selection
│   └── Save search
├── Favorites
│   ├── Saved trainers
│   ├── Saved events
│   ├── Wishlist
│   └── Recommendations
└── Compare Trainers
    ├── Side-by-side comparison
    ├── Rating comparison
    ├── Price comparison
    ├── Reviews comparison
    └── Generate report
```

#### 3. **My Bookings Menu**
```
My Bookings
├── Upcoming Sessions
│   ├── Calendar view
│   ├── List view
│   ├── Session details
│   ├── Reschedule session
│   ├── Download materials
│   └── Set reminders
├── Completed Sessions
│   ├── Session history
│   ├── View recordings
│   ├── Download certificate
│   ├── Feedback provided
│   └── Session notes
├── Cancelled Sessions
│   ├── Cancellation history
│   ├── Reason for cancellation
│   ├── Refund status
│   └── Rebook option
└── Reschedule
    ├── Available slots
    ├── Reschedule request
    ├── Confirmation
    └── New schedule details
```

#### 4. **Reviews Menu**
```
Reviews
├── My Reviews
│   ├── Reviews I've written
│   ├── Edit reviews
│   ├── Delete reviews
│   └── View impact
├── My Ratings
│   ├── Average rating
│   ├── Rating breakdown
│   ├── Trending ratings
│   └── Trainer responses
├── Trainer Responses
│   ├── View responses
│   ├── Mark as helpful
│   ├── Report inappropriate
│   └── Show more options
└── Leave Review
    ├── Select session
    ├── Rate trainer (1-5 stars)
    ├── Write review
    ├── Add tags
    └── Submit review
```

#### 5. **Account Menu** (Profile Icon)
```
Account
├── Profile Settings
│   ├── Edit profile
│   ├── Change photo
│   ├── Update bio
│   ├── Learning preferences
│   └── Goal interview types
├── Payment Methods
│   ├── Add payment method
│   ├── Edit payment method
│   ├── Delete payment method
│   ├── Set default method
│   └── Manage auto-pay
├── Wallet
│   ├── Current balance
│   ├── Add funds
│   ├── Transaction history
│   ├── Refund requests
│   └── Payment receipts
├── Security
│   ├── Change password
│   ├── Two-factor authentication
│   ├── Active sessions
│   ├── Login history
│   └── Device management
├── Preferences
│   ├── Notification settings
│   ├── Email preferences
│   ├── Language & timezone
│   ├── Theme (dark/light)
│   └── Privacy settings
├── Help & Support
│   ├── FAQ
│   ├── Contact support
│   ├── Report issue
│   ├── Feedback
│   └── Chat support
└── Logout
    └── Sign out from all devices
```

### Dashboard Content Sections

#### Upcoming Sessions Widget
- Session title and trainer name
- Date and time
- Duration and status
- "Join Session" button (when time is near)
- Session details link

#### Recommended Trainers Widget
- Top 3 recommended trainers
- Trainer photo and name
- Average rating
- Price per session
- "View Profile" button

#### Learning Progress Widget
- Interview types practiced
- Sessions completed
- Average rating given
- Next goals
- Progress chart

#### Recent Activity Feed
- Latest sessions completed
- Reviews submitted
- Payments made
- New bookings
- Status updates

---

## Trainer Dashboard

### Dashboard Layout

```
┌────────────────────────────────────────────────────────────────────┐
│ 👨‍🏫 Mock Interview Platform                   [Profile] [Logout]  │
├────────────────────────────────────────────────────────────────────┤
│ MENU BAR                                                           │
│ ┌─────────────────────────────────────────────────────────────┐  │
│ │ 🏠 Dashboard  │ 📅 Events  │ 💰 Earnings  │ 👥 Students    │  │
│ │               │            │              │                 │  │
│ │  • Overview   │ • All      │ • Balance    │ • Reviews       │  │
│ │  • Statistics │   Events   │ • Earnings   │ • Comments      │  │
│ │  • Tasks      │ • Create   │ • Withdraw   │ • Feedback      │  │
│ │              │   Event    │ • History    │ • Manage        │  │
│ │              │ • Edit     │ • Invoices   │   Responses     │  │
│ │              │   Event    │ • Reports    │ • Block Student │  │
│ │              │ • Publish  │              │ • Contact       │  │
│ │              │ • Archive  │              │                 │  │
│ │              │ • Duplicate│              │                 │  │
│ └─────────────────────────────────────────────────────────────┘  │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│  MAIN CONTENT AREA                                                │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

### Menu Structure

#### 1. **Dashboard Menu**
```
Dashboard
├── Overview
│   ├── Welcome message
│   ├── Key metrics summary
│   ├── This month's earnings
│   ├── Sessions completed this month
│   ├── Average rating
│   └── Recent activity
├── Statistics
│   ├── Total sessions conducted
│   ├── Total earnings
│   ├── Active events
│   ├── Average rating
│   ├── Student satisfaction
│   ├── Completion rate
│   ├── Cancellation rate
│   ├── Revenue chart
│   └── Session trend analysis
└── Tasks
    ├── Upcoming sessions
    ├── Pending reviews
    ├── Messages from students
    ├── Payments to withdraw
    └── Event expiring soon
```

#### 2. **Events Menu**
```
Events
├── All Events
│   ├── Active events
│   ├── Draft events
│   ├── Archived events
│   ├── Event list view
│   ├── Event calendar view
│   ├── Event performance
│   └── Filter & sort
├── Create Event
│   ├── Basic information
│   │   ├── Title
│   │   ├── Description
│   │   ├── Category
│   │   ├── Interview type
│   │   └── Topics covered
│   ├── Session Structure
│   │   ├── Number of sessions
│   │   ├── Session duration
│   │   ├── Session schedule
│   │   ├── Pricing per session
│   │   └── Total package price
│   ├── Availability
│   │   ├── Available dates
│   │   ├── Available times
│   │   ├── Timezone
│   │   ├── Max students per slot
│   │   └── Time between sessions
│   ├── Details
│   │   ├── Process/methodology
│   │   ├── What to expect
│   │   ├── Prerequisites
│   │   ├── Resources provided
│   │   └── Cancellation policy
│   ├── Media
│   │   ├── Event thumbnail
│   │   ├── Event banner
│   │   └── Demo video
│   └── Review & Publish
│       ├── Preview event
│       ├── Publish to platform
│       └── Share event link
├── Edit Event
│   ├── Modify event details
│   ├── Update pricing
│   ├── Change availability
│   ├── Add/remove sessions
│   ├── Update description
│   └── Save changes
├── Publish Event
│   ├── Pre-publish checklist
│   ├── Set visibility (Public/Private)
│   ├── Publish immediately
│   ├── Schedule publish date
│   └── Share to social media
├── Archive Event
│   ├── Archive old events
│   ├── View archived events
│   ├── Restore archived events
│   └── Delete permanently
└── Duplicate Event
    ├── Create copy of event
    ├── Modify and publish
    └── Quick relaunch
```

#### 3. **Earnings Menu**
```
Earnings
├── Balance
│   ├── Current balance
│   ├── Available to withdraw
│   ├── Pending balance
│   ├── Total earnings
│   └── Net earnings (after commission)
├── Earnings Report
│   ├── Earnings overview
│   ├── Earnings by event
│   ├── Earnings by month
│   ├── Earnings by session
│   ├── Custom date range
│   ├── Export report
│   └── Print report
├── Withdraw Funds
│   ├── View bank accounts
│   ├── Add bank account
│   ├── Edit bank account
│   ├── Withdraw balance
│   ├── Withdrawal history
│   ├── Pending withdrawals
│   └── Failed withdrawals
├── Transaction History
│   ├── All transactions
│   ├── Filter by type
│   ├── Filter by date
│   ├── Filter by status
│   ├── Transaction details
│   ├── Print receipt
│   └── Export history
├── Invoices
│   ├── Generate invoice
│   ├── Invoice history
│   ├── Download invoice
│   ├── Email invoice
│   ├── Tax documents
│   └── Financial reports
└── Reports
    ├── Monthly report
    ├── Quarterly report
    ├── Annual report
    ├── Custom report
    ├── Analytics
    └── Download reports
```

#### 4. **Students Menu**
```
Students
├── Reviews
│   ├── All reviews
│   ├── Recent reviews
│   ├── Top reviews
│   ├── Filter by rating
│   ├── View review details
│   ├── Review analytics
│   └── Average rating
├── Comments & Feedback
│   ├── Student comments
│   ├── Message from students
│   ├── Feedback received
│   ├── Response to comments
│   └── Track conversations
├── Manage Responses
│   ├── Reply to reviews
│   ├── Pin important reviews
│   ├── Mark as featured
│   ├── Edit/delete responses
│   └── Thank students
├── Block/Report
│   ├── Block inappropriate students
│   ├── Report abusive behavior
│   ├── View blocked students
│   ├── Unblock students
│   └── Report to admin
└── Contact Students
    ├── Send announcement
    ├── Send message
    ├── Email students
    ├── View contact history
    └── Manage notifications
```

#### 5. **Account Menu** (Profile Icon)
```
Account
├── Profile Settings
│   ├── Edit profile
│   ├── Change photo
│   ├── Update bio
│   ├── Add qualifications
│   ├── Expertise areas
│   ├── Experience level
│   └── Availability status
├── Bank Account
│   ├── Add bank account
│   ├── Edit bank account
│   ├── Set default account
│   ├── Remove account
│   ├── Verify account
│   └── Transaction receipts
├── Security
│   ├── Change password
│   ├── Two-factor authentication
│   ├── Active sessions
│   ├── Login history
│   ├── Device management
│   └── Suspicious activity
├── Preferences
│   ├── Notification settings
│   ├── Email preferences
│   ├── SMS preferences
│   ├── Language & timezone
│   ├── Theme (dark/light)
│   └── Privacy settings
├── Help & Support
│   ├── FAQ for trainers
│   ├── Contact support
│   ├── Report issue
│   ├── Request feature
│   ├── Chat support
│   └── Video tutorials
└── Logout
    └── Sign out from all devices
```

### Dashboard Content Sections

#### Overview Cards
- Total Earnings This Month
- Sessions Completed This Month
- Average Rating
- Pending Balance

#### Upcoming Sessions Widget
- Next 5 sessions
- Date, time, and student name
- Session status
- "Prepare" or "Join" buttons

#### Recent Reviews Widget
- Latest 5 reviews
- Star rating and date
- Reviewer name
- Review snippet
- "Reply" button

#### Performance Chart
- Monthly earnings trend
- Session completion rate
- Average rating over time
- Student booking trends

#### Recent Activity Feed
- New student bookings
- Session completions
- Review submissions
- Payments received
- System announcements

---

## Admin Dashboard

### Dashboard Layout

```
┌────────────────────────────────────────────────────────────────────┐
│ ⚙️ Admin Panel                                  [Profile] [Logout] │
├────────────────────────────────────────────────────────────────────┤
│ MENU BAR                                                           │
│ ┌─────────────────────────────────────────────────────────────┐  │
│ │ 🏠 Dashboard  │ 👥 Users  │ 📊 Analytics  │ 💳 Payments    │  │
│ │               │           │               │                │  │
│ │  • Overview   │ • Students│ • Platform    │ • Transactions │  │
│ │  • Key Stats  │ • Trainers│ • User        │ • Commission   │  │
│ │  • Alerts     │ • Approve │   Activity    │ • Disputes     │  │
│ │  • Reports    │ • Block   │ • Revenue     │ • Refunds      │  │
│ │              │ • Manage  │ • Performance │ • Reports      │  │
│ │              │ • Support │ • Trends      │                │  │
│ │              │           │ • Export      │                │  │
│ └─────────────────────────────────────────────────────────────┘  │
│ ┌─────────────────────────────────────────────────────────────┐  │
│ │ 📝 Content  │ ⚙️ Settings  │ 🔒 Moderation  │ 📧 Support    │  │
│ │             │              │                │               │  │
│ │ • Events    │ • Platform   │ • Reports      │ • Tickets     │  │
│ │ • Categories│ • Features   │ • Flagged      │ • Complaints  │  │
│ │ • Tags      │ • Billing    │ • Banned Users │ • Feedback    │  │
│ │ • FAQs      │ • API Keys   │ • Appeals      │ • Contact Us  │  │
│ │             │ • Email      │ • Escalations  │               │  │
│ │             │   Templates  │                │               │  │
│ │             │ • Integr.    │                │               │  │
│ └─────────────────────────────────────────────────────────────┘  │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│  MAIN CONTENT AREA                                                │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

### Menu Structure

#### 1. **Dashboard Menu**
```
Dashboard
├── Overview
│   ├── Total users (students & trainers)
│   ├── Active sessions today
│   ├── Total transactions
│   ├── Platform revenue
│   ├── Key metrics summary
│   └── System status
├── Key Statistics
│   ├── New users this month
│   ├── New events this month
│   ├── Total transactions
│   ├── Total revenue
│   ├── Average transaction value
│   ├── Commission collected
│   ├── Churn rate
│   └── User growth rate
├── Alerts
│   ├── Suspicious transactions
│   ├── Reported content
│   ├── System errors
│   ├── Failed payments
│   ├── Pending approvals
│   └── Critical alerts
└── Reports
    ├── Daily report
    ├── Weekly report
    ├── Monthly report
    ├── Quarterly report
    ├── Annual report
    └── Custom report
```

#### 2. **Users Menu**
```
Users
├── Students
│   ├── All students
│   ├── Active students
│   ├── Inactive students
│   ├── New students
│   ├── Student details
│   ├── Booking history
│   ├── Payment history
│   ├── Suspension management
│   ├── Export student data
│   └── Filter & search
├── Trainers
│   ├── All trainers
│   ├── Active trainers
│   ├── Inactive trainers
│   ├── New trainers
│   ├── Pending approval
│   ├── Trainer details
│   ├── Event management
│   ├── Earnings history
│   ├── Trainer verification
│   ├── Suspension management
│   ├── Export trainer data
│   └── Filter & search
├── Approve Users
│   ├── Pending trainer approvals
│   ├── Pending student requests
│   ├── Review qualifications
│   ├── Approve/Reject
│   ├── Request additional info
│   └── Approval history
├── Block Users
│   ├── Blocked students
│   ├── Blocked trainers
│   ├── Block reasons
│   ├── Suspension duration
│   ├── Unblock users
│   ├── Appeal requests
│   └── Block history
└── User Support
    ├── Contact users
    ├── Send announcements
    ├── Reset user password
    ├── Email users
    ├── View user activity
    └── Account recovery
```

#### 3. **Analytics Menu**
```
Analytics
├── Platform Analytics
│   ├── Total platform visits
│   ├── User growth rate
│   ├── Active user trends
│   ├── Session statistics
│   ├── Conversion rates
│   ├── User retention
│   ├── Churn analysis
│   └── Demographics
├── User Activity
│   ├── Most active users
│   ├── User engagement metrics
│   ├── User journey tracking
│   ├── Feature usage
│   ├── Page view analytics
│   ├── Click tracking
│   ├── Session duration
│   └── Bounce rate
├── Revenue Analytics
│   ├── Total revenue
│   ├── Platform commission
│   ├── Revenue by event
│   ├── Revenue by trainer
│   ├── Revenue trends
│   ├── Average transaction value
│   ├── Payment methods used
│   └── Revenue forecast
├── Performance Metrics
│   ├── Trainer performance
│   ├── Event performance
│   ├── User satisfaction
│   ├── Response times
│   ├── System performance
│   ├── Uptime metrics
│   ├── Load analysis
│   └── API performance
├── Trends
│   ├── Popular interview types
│   ├── Top trainers
│   ├── Top events
│   ├── Trending topics
│   ├── Seasonal trends
│   └── Prediction models
└── Export Analytics
    ├── Download reports
    ├── Schedule reports
    ├── Export to CSV
    ├── Export to PDF
    ├── Email reports
    └── Custom export
```

#### 4. **Payments Menu**
```
Payments
├── Transactions
│   ├── All transactions
│   ├── Recent transactions
│   ├── Pending transactions
│   ├── Failed transactions
│   ├── Transaction details
│   ├── Refund options
│   ├── Export transactions
│   └── Filter & search
├── Commission Management
│   ├── Commission rates
│   ├── Commission details
│   ├── Commission collected
│   ├── Commission payments
│   ├── Commission reports
│   ├── Adjust rates
│   └── Apply discount rules
├── Disputes & Refunds
│   ├── Pending disputes
│   ├── Resolved disputes
│   ├── Refund requests
│   ├── Process refund
│   ├── Chargeback management
│   ├── Dispute history
│   └── Export disputes
├── Payouts
│   ├── Trainer payouts
│   ├── Pending payouts
│   ├── Paid out history
│   ├── Payout schedule
│   ├── Manual payout
│   ├── Payout settings
│   └── Bank details
└── Reports
    ├── Payment report
    ├── Commission report
    ├── Revenue report
    ├── Refund report
    ├── Payout report
    └── Financial reports
```

#### 5. **Content Menu**
```
Content
├── Events
│   ├── All events
│   ├── Featured events
│   ├── Recent events
│   ├── Popular events
│   ├── Event details
│   ├── Event moderation
│   ├── Feature/unfeature
│   ├── Suspend event
│   ├── View statistics
│   └── Export events
├── Categories
│   ├── All categories
│   ├── Create category
│   ├── Edit category
│   ├── Delete category
│   ├── Category hierarchy
│   ├── Category statistics
│   └── Featured categories
├── Tags
│   ├── All tags
│   ├── Create tag
│   ├── Edit tag
│   ├── Delete tag
│   ├── Tag suggestions
│   └── Tag statistics
├── FAQs
│   ├── Manage FAQs
│   ├── Create FAQ
│   ├── Edit FAQ
│   ├── Delete FAQ
│   ├── FAQ categories
│   └── FAQ statistics
└── Resources
    ├── Upload resources
    ├── Manage resources
    ├── Resource library
    ├── Delete resources
    └── Resource access log
```

#### 6. **Settings Menu**
```
Settings
├── Platform Settings
│   ├── General settings
│   ├── Commission rates
│   ├── Payment terms
│   ├── Cancellation policy
│   ├── Session policies
│   └── Platform branding
├── Features
│   ├── Enable/disable features
│   ├── Feature flags
│   ├── Beta features
│   ├── Feature analytics
│   └── A/B testing
├── Billing & Plans
│   ├── Subscription plans
│   ├── Payment methods
│   ├── Billing cycles
│   ├── Discount codes
│   ├── Coupon management
│   └── Invoice templates
├── API Keys & Integrations
│   ├── Generate API keys
│   ├── API documentation
│   ├── Third-party integrations
│   ├── Webhook management
│   ├── Connected apps
│   └── Integration logs
├── Email Templates
│   ├── Confirmation emails
│   ├── Reminder emails
│   ├── Notification emails
│   ├── Marketing emails
│   ├── Edit templates
│   └── Test emails
└── System Configuration
    ├── Timezone settings
    ├── Language settings
    ├── Server settings
    ├── Database settings
    ├── Backup settings
    └── Cache settings
```

#### 7. **Moderation Menu**
```
Moderation
├── Reports
│   ├── All reports
│   ├── Pending reports
│   ├── Resolved reports
│   ├── Urgent reports
│   ├── Report details
│   ├── Report statistics
│   └── Export reports
├── Flagged Content
│   ├── Flagged reviews
│   ├── Flagged comments
│   ├── Flagged profiles
│   ├── Review flag reason
│   ├── Take action
│   └── Content history
├── Banned Users
│   ├── Banned students
│   ├── Banned trainers
│   ├── Ban reason
│   ├── Ban duration
│   ├── Permanent bans
│   ├── Temporary bans
│   └── Ban history
├── Appeals
│   ├── Pending appeals
│   ├── Review appeal
│   ├── Approve appeal
│   ├── Reject appeal
│   └── Appeal history
└── Escalations
    ├── Escalated issues
    ├── Priority levels
    ├── Escalation history
    ├── Team escalations
    └── Resolution tracking
```

#### 8. **Support Menu**
```
Support
├── Support Tickets
│   ├── All tickets
│   ├── Open tickets
│   ├── Closed tickets
│   ├── Pending tickets
│   ├── Ticket details
│   ├── Assign ticket
│   ├── Add response
│   ├── Close ticket
│   └── Export tickets
├── User Complaints
│   ├── All complaints
│   ├── Recent complaints
│   ├── Complaint status
│   ├── Complaint details
│   ├── Resolve complaint
│   ├── Complaint history
│   └── Export complaints
├── Feedback
│   ├── User feedback
│   ├── Feature requests
│   ├── Bug reports
│   ├── Feedback analysis
│   ├── Common issues
│   └── Feedback trends
├── Contact Us
│   ├── Contact form submissions
│   ├── Response history
│   ├── Contact templates
│   └── Contact statistics
└── System Announcements
    ├── Create announcement
    ├── Schedule announcement
    ├── Broadcast message
    ├── View announcements
    ├── Announcement history
    └── Target users
```

### Dashboard Content Sections

#### Key Metrics Cards
- Total Revenue
- Total Commission
- Active Users
- Active Sessions
- Platform Growth
- System Status

#### Recent Activity Feed
- New user registrations
- New event creations
- Flagged content
- Failed transactions
- System alerts
- User complaints

#### Charts & Graphs
- Revenue trends
- User growth chart
- Session activity chart
- Payment method distribution
- Top events chart
- Top trainers chart

#### Quick Actions
- Approve pending trainers
- Handle urgent disputes
- Process refunds
- Send announcements
- Block users
- Feature events

---

## Menu Structure

### Global Menu Bar Design

```
┌─────────────────────────────────────────────────────────────────┐
│ MAIN NAVIGATION                                                 │
│ ┌──────────┬──────────┬──────────┬──────────┬──────────┐        │
│ │ Dashboard│ Explore  │ Sessions │ Earnings │ Account  │        │
│ │    ▼     │    ▼     │    ▼     │    ▼     │    ▼     │        │
│ │ ┌───────┐ ┌───────┐ ┌───────┐ ┌───────┐ ┌───────┐  │        │
│ │ │Option1│ │Option1│ │Option1│ │Option1│ │Option1│  │        │
│ │ ├───────┤ ├───────┤ ├───────┤ ├───────┤ ├───────┤  │        │
│ │ │Option2│ │Option2│ │Option2│ │Option2│ │Option2│  │        │
│ │ ├───────┤ ├───────┤ ├───────┤ ├───────┤ ├───────┤  │        │
│ │ │Option3│ │Option3│ │Option3│ │Option3│ │Option3│  │        │
│ │ └───────┘ └───────┘ └───────┘ └───────┘ └───────┘  │        │
│ └──────────┴──────────┴──────────┴──────────┴──────────┘        │
└─────────────────────────────────────────────────────────────────┘
```

### Responsive Design Considerations

1. **Desktop View (1200px+)**
   - Full horizontal menu bar
   - All menu items visible
   - Dropdown on hover
   - Full content area

2. **Tablet View (768px - 1199px)**
   - Horizontal menu with scroll
   - Dropdowns on click
   - Adjusted content layout
   - Sidebar collapses

3. **Mobile View (<768px)**
   - Hamburger menu icon
   - Vertical menu slides in
   - Touch-friendly spacing
   - Full screen content

---

## Navigation Flow

### Student Navigation Path Example
```
Login
  ↓
Student Dashboard
  ├→ Explore → Browse Trainers → Select Trainer → View Details
  │
  ├→ Explore → Browse Events → Select Event → Checkout → Payment
  │
  ├→ My Bookings → Upcoming Sessions → Join Session
  │
  └→ Reviews → Leave Review → Submit Feedback
```

### Trainer Navigation Path Example
```
Login
  ↓
Trainer Dashboard
  ├→ Create Event → Fill Details → Publish
  │
  ├→ Events → Edit Event → Save Changes
  │
  ├→ Earnings → View Balance → Withdraw Funds
  │
  └→ Students → View Reviews → Respond to Comments
```

### Admin Navigation Path Example
```
Login
  ↓
Admin Dashboard
  ├→ Users → Trainers → Approve/Block
  │
  ├→ Analytics → Revenue Analytics → Export Report
  │
  ├→ Payments → Transactions → Handle Disputes
  │
  ├→ Moderation → Reports → Take Action
  │
  └→ Settings → Platform Settings → Configure
```

---

## Menu Icons Reference

| Icon | Menu Item | Purpose |
|------|-----------|---------|
| 🏠 | Dashboard | Main overview and stats |
| 🔍 | Explore | Browse content and search |
| 📅 | Calendar/Bookings | Session scheduling |
| 💬 | Reviews | Feedback and ratings |
| 👤 | Profile/Account | User settings |
| 📊 | Analytics | Data and reports |
| 💳 | Payments | Payment processing |
| ⚙️ | Settings | Configuration |
| 🔒 | Security | Safety features |
| 👥 | Users/Students | User management |
| 📝 | Content | Content management |
| 📧 | Support | Help and support |
| 🚪 | Logout | Sign out |

---

## Breadcrumb Navigation

```
Student Example:
Dashboard → Explore → Browse Events → Technical Interviews → FAANG Specific

Trainer Example:
Dashboard → Events → All Events → Create Event → Session Structure

Admin Example:
Dashboard → Users → Trainers → Pending Approval → Approve Trainer
```

---

## User Experience Guidelines

### Menu Behavior
- **Hover Effect:** Highlight menu items on hover (desktop)
- **Active State:** Show current page in menu
- **Submenu Animation:** Smooth slide-in transition
- **Mobile:** Tap to expand/collapse submenus
- **Accessibility:** Keyboard navigation support

### Consistency
- Same menu structure for similar user roles
- Consistent icon usage
- Consistent naming conventions
- Logical grouping of related items
- Clear visual hierarchy

### Performance
- Lazy load menu items
- Cache menu structure
- Minimize menu requests
- Fast menu rendering
- Smooth animations

---

*Last Updated: May 18, 2026*
*Version: 1.0*
