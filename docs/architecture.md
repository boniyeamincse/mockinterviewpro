# Mock Interview Platform - Laravel API & React Frontend Documentation

## Table of Contents
1. [Project Architecture](#project-architecture)
2. [Folder Structure](#folder-structure)
3. [Database Schema](#database-schema)
4. [Authentication & Authorization](#authentication--authorization)
5. [API Endpoints Documentation](#api-endpoints-documentation)
6. [React Component Structure](#react-component-structure)
7. [API Integration](#api-integration)
8. [Development Setup](#development-setup)
9. [Deployment](#deployment)

---

## Project Architecture

### Tech Stack

**Backend:**
- Framework: Laravel 10+
- Database: MySQL/PostgreSQL
- Authentication: JWT (JSON Web Tokens)
- Payment Gateway: Stripe/PayPal
- Real-time: WebSocket (Laravel Echo)
- Video: Agora SDK / Twilio
- Cache: Redis
- Queue: Laravel Queue with Supervisor

**Frontend:**
- Library: React 18+
- State Management: Redux Toolkit / Zustand
- UI Framework: Material-UI / Tailwind CSS
- HTTP Client: Axios
- Video: Agora React SDK / TwilioVideo
- Form Management: React Hook Form
- Routing: React Router v6
- Real-time: Socket.io

### Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    Client Layer (React)                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │  Student     │  │  Trainer     │  │  Admin       │          │
│  │  Dashboard   │  │  Dashboard   │  │  Dashboard   │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│         ↑                  ↑                  ↑                 │
│         └──────────────────┴──────────────────┘                 │
│                           ↑                                     │
│                    Redux Store / State                          │
│                           ↑                                     │
├─────────────────────────────────────────────────────────────────┤
│                    API Gateway Layer (Axios)                    │
│         HTTP Requests (REST) + WebSocket                        │
├─────────────────────────────────────────────────────────────────┤
│                    Server Layer (Laravel)                       │
│  ┌────────────────────────────────────────────────────────┐    │
│  │  Routes → Controllers → Services → Models/Repositories│    │
│  └────────────────────────────────────────────────────────┘    │
│         ↑                                      ↑                │
│    Authentication                         Business Logic       │
│    (JWT Middleware)                                             │
│         ↑                                      ↓                │
│  ┌──────────────────────────────────────────────────────┐      │
│  │             Database Layer                          │      │
│  │  MySQL/PostgreSQL + Redis Cache + File Storage      │      │
│  └──────────────────────────────────────────────────────┘      │
│         ↑                                                       │
│    Queues (Notifications, Emails)                              │
│    Payment Processing                                          │
│    Video Streaming                                             │
└─────────────────────────────────────────────────────────────────┘
```

---

## Folder Structure

### Backend (Laravel)

```
mock-interview-platform/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── AuthController.php
│   │   │   ├── StudentController.php
│   │   │   ├── TrainerController.php
│   │   │   ├── EventController.php
│   │   │   ├── BookingController.php
│   │   │   ├── SessionController.php
│   │   │   ├── PaymentController.php
│   │   │   ├── ReviewController.php
│   │   │   ├── AdminController.php
│   │   │   ├── AnalyticsController.php
│   │   │   └── ReportController.php
│   │   ├── Middleware/
│   │   │   ├── JwtMiddleware.php
│   │   │   ├── RoleMiddleware.php
│   │   │   ├── AdminMiddleware.php
│   │   │   ├── TrainerMiddleware.php
│   │   │   └── StudentMiddleware.php
│   │   └── Requests/
│   │       ├── LoginRequest.php
│   │       ├── RegisterRequest.php
│   │       ├── CreateEventRequest.php
│   │       ├── BookSessionRequest.php
│   │       ├── ReviewRequest.php
│   │       └── PaymentRequest.php
│   ├── Models/
│   │   ├── User.php
│   │   ├── Student.php
│   │   ├── Trainer.php
│   │   ├── Event.php
│   │   ├── Session.php
│   │   ├── Booking.php
│   │   ├── Payment.php
│   │   ├── Review.php
│   │   ├── Category.php
│   │   ├── Message.php
│   │   ├── Notification.php
│   │   └── Report.php
│   ├── Services/
│   │   ├── AuthService.php
│   │   ├── EventService.php
│   │   ├── BookingService.php
│   │   ├── PaymentService.php
│   │   ├── SessionService.php
│   │   ├── ReviewService.php
│   │   ├── NotificationService.php
│   │   ├── VideoService.php
│   │   └── AnalyticsService.php
│   ├── Repositories/
│   │   ├── UserRepository.php
│   │   ├── EventRepository.php
│   │   ├── BookingRepository.php
│   │   ├── PaymentRepository.php
│   │   └── ReviewRepository.php
│   ├── Events/ (Laravel Events)
│   │   ├── UserRegistered.php
│   │   ├── SessionScheduled.php
│   │   ├── PaymentProcessed.php
│   │   ├── ReviewSubmitted.php
│   │   └── SessionCompleted.php
│   ├── Listeners/
│   │   ├── SendWelcomeEmail.php
│   │   ├── SendSessionReminder.php
│   │   ├── NotifyPaymentConfirmation.php
│   │   ├── NotifyReviewSubmitted.php
│   │   └── UpdateTrainerStats.php
│   ├── Jobs/
│   │   ├── SendEmailJob.php
│   │   ├── ProcessPaymentJob.php
│   │   ├── GenerateInvoiceJob.php
│   │   ├── UpdateAnalyticsJob.php
│   │   └── SendReminderJob.php
│   ├── Exceptions/
│   │   ├── InvalidPaymentException.php
│   │   ├── SessionConflictException.php
│   │   ├── InsufficientBalanceException.php
│   │   └── UnauthorizedException.php
│   └── Resources/ (API Resources)
│       ├── UserResource.php
│       ├── EventResource.php
│       ├── BookingResource.php
│       ├── PaymentResource.php
│       ├── ReviewResource.php
│       └── SessionResource.php
├── database/
│   ├── migrations/
│   │   ├── 2024_01_01_000000_create_users_table.php
│   │   ├── 2024_01_01_000001_create_students_table.php
│   │   ├── 2024_01_01_000002_create_trainers_table.php
│   │   ├── 2024_01_01_000003_create_events_table.php
│   │   ├── 2024_01_01_000004_create_sessions_table.php
│   │   ├── 2024_01_01_000005_create_bookings_table.php
│   │   ├── 2024_01_01_000006_create_payments_table.php
│   │   ├── 2024_01_01_000007_create_reviews_table.php
│   │   ├── 2024_01_01_000008_create_categories_table.php
│   │   ├── 2024_01_01_000009_create_notifications_table.php
│   │   └── 2024_01_01_000010_create_messages_table.php
│   ├── seeders/
│   │   ├── UserSeeder.php
│   │   ├── CategorySeeder.php
│   │   ├── EventSeeder.php
│   │   └── ReviewSeeder.php
│   └── factories/
│       ├── UserFactory.php
│       ├── EventFactory.php
│       └── BookingFactory.php
├── routes/
│   ├── api.php
│   ├── web.php
│   └── channels.php
├── config/
│   ├── app.php
│   ├── auth.php
│   ├── database.php
│   ├── payment.php
│   ├── video.php
│   └── mail.php
├── storage/
│   ├── logs/
│   ├── uploads/
│   │   ├── avatars/
│   │   ├── event-images/
│   │   └── session-recordings/
│   └── videos/
├── tests/
│   ├── Unit/
│   │   ├── PaymentServiceTest.php
│   │   ├── BookingServiceTest.php
│   │   └── EventServiceTest.php
│   └── Feature/
│       ├── AuthenticationTest.php
│       ├── BookingTest.php
│       ├── PaymentTest.php
│       └── ReviewTest.php
├── .env
├── .env.example
└── composer.json
```

### Frontend (React)

```
mock-interview-web/
├── public/
│   ├── index.html
│   ├── favicon.ico
│   └── manifest.json
├── src/
│   ├── components/
│   │   ├── auth/
│   │   │   ├── LoginForm.jsx
│   │   │   ├── RegisterForm.jsx
│   │   │   ├── ForgotPasswordForm.jsx
│   │   │   ├── TwoFactorSetup.jsx
│   │   │   └── VerifyEmail.jsx
│   │   ├── common/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Loading.jsx
│   │   │   ├── ErrorBoundary.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── Breadcrumb.jsx
│   │   │   └── Pagination.jsx
│   │   ├── student/
│   │   │   ├── dashboard/
│   │   │   │   ├── StudentDashboard.jsx
│   │   │   │   ├── UpcomingSessionsCard.jsx
│   │   │   │   ├── StatsCards.jsx
│   │   │   │   └── QuickLinksWidget.jsx
│   │   │   ├── explore/
│   │   │   │   ├── ExploreTrainers.jsx
│   │   │   │   ├── BrowseEvents.jsx
│   │   │   │   ├── TrainerCard.jsx
│   │   │   │   ├── EventCard.jsx
│   │   │   │   ├── AdvancedSearch.jsx
│   │   │   │   ├── FilterSidebar.jsx
│   │   │   │   └── CompareTrainers.jsx
│   │   │   ├── bookings/
│   │   │   │   ├── MyBookings.jsx
│   │   │   │   ├── UpcomingBookings.jsx
│   │   │   │   ├── BookingCard.jsx
│   │   │   │   ├── RescheduleModal.jsx
│   │   │   │   └── CancelBookingModal.jsx
│   │   │   ├── sessions/
│   │   │   │   ├── SessionJoin.jsx
│   │   │   │   ├── VideoInterface.jsx
│   │   │   │   ├── ChatPanel.jsx
│   │   │   │   ├── NotesPanel.jsx
│   │   │   │   └── EndSessionModal.jsx
│   │   │   ├── reviews/
│   │   │   │   ├── ReviewList.jsx
│   │   │   │   ├── ReviewForm.jsx
│   │   │   │   ├── RatingStars.jsx
│   │   │   │   └── ReviewCard.jsx
│   │   │   └── payment/
│   │   │       ├── CheckoutPage.jsx
│   │   │       ├── PaymentForm.jsx
│   │   │       ├── PaymentHistory.jsx
│   │   │       └── Invoice.jsx
│   │   ├── trainer/
│   │   │   ├── dashboard/
│   │   │   │   ├── TrainerDashboard.jsx
│   │   │   │   ├── EarningsCard.jsx
│   │   │   │   ├── ScheduleWidget.jsx
│   │   │   │   └── ReviewsWidget.jsx
│   │   │   ├── events/
│   │   │   │   ├── EventManagement.jsx
│   │   │   │   ├── CreateEventForm.jsx
│   │   │   │   ├── EditEventForm.jsx
│   │   │   │   ├── EventList.jsx
│   │   │   │   └── PublishModal.jsx
│   │   │   ├── earnings/
│   │   │   │   ├── EarningsPage.jsx
│   │   │   │   ├── BalanceCard.jsx
│   │   │   │   ├── WithdrawModal.jsx
│   │   │   │   ├── TransactionHistory.jsx
│   │   │   │   └── ReportsPage.jsx
│   │   │   ├── students/
│   │   │   │   ├── StudentsList.jsx
│   │   │   │   ├── ReviewManagement.jsx
│   │   │   │   ├── RespondToReview.jsx
│   │   │   │   └── StudentFeedback.jsx
│   │   │   └── sessions/
│   │   │       ├── SessionList.jsx
│   │   │       ├── SessionPrep.jsx
│   │   │       └── SessionRecordings.jsx
│   │   ├── admin/
│   │   │   ├── dashboard/
│   │   │   │   ├── AdminDashboard.jsx
│   │   │   │   ├── KeyMetricsCards.jsx
│   │   │   │   └── SystemStatus.jsx
│   │   │   ├── users/
│   │   │   │   ├── UserManagement.jsx
│   │   │   │   ├── StudentList.jsx
│   │   │   │   ├── TrainerList.jsx
│   │   │   │   ├── ApprovalQueue.jsx
│   │   │   │   └── BlockUser.jsx
│   │   │   ├── analytics/
│   │   │   │   ├── AnalyticsDashboard.jsx
│   │   │   │   ├── Charts.jsx
│   │   │   │   ├── RevenueReport.jsx
│   │   │   │   └── UserActivityChart.jsx
│   │   │   ├── payments/
│   │   │   │   ├── PaymentManagement.jsx
│   │   │   │   ├── TransactionList.jsx
│   │   │   │   ├── DisputeManagement.jsx
│   │   │   │   └── RefundModal.jsx
│   │   │   ├── moderation/
│   │   │   │   ├── ContentModeration.jsx
│   │   │   │   ├── ReportedContent.jsx
│   │   │   │   ├── BannedUsers.jsx
│   │   │   │   └── AppealsList.jsx
│   │   │   └── settings/
│   │   │       ├── PlatformSettings.jsx
│   │   │       ├── CommissionSettings.jsx
│   │   │       ├── PaymentGatewayConfig.jsx
│   │   │       └── EmailTemplates.jsx
│   │   └── profile/
│   │       ├── ProfilePage.jsx
│   │       ├── EditProfileForm.jsx
│   │       ├── ChangePassword.jsx
│   │       ├── SecuritySettings.jsx
│   │       ├── NotificationPreferences.jsx
│   │       └── PrivacySettings.jsx
│   ├── pages/
│   │   ├── HomePage.jsx
│   │   ├── NotFoundPage.jsx
│   │   ├── UnauthorizedPage.jsx
│   │   ├── ServerErrorPage.jsx
│   │   └── MaintenancePage.jsx
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useApi.js
│   │   ├── useFetch.js
│   │   ├── useDebounce.js
│   │   ├── useLocalStorage.js
│   │   ├── useWindowSize.js
│   │   └── useNotification.js
│   ├── services/
│   │   ├── api.js
│   │   ├── authService.js
│   │   ├── studentService.js
│   │   ├── trainerService.js
│   │   ├── eventService.js
│   │   ├── bookingService.js
│   │   ├── paymentService.js
│   │   ├── reviewService.js
│   │   ├── adminService.js
│   │   ├── videoService.js
│   │   ├── analyticsService.js
│   │   └── uploadService.js
│   ├── store/ (Redux)
│   │   ├── index.js
│   │   ├── slices/
│   │   │   ├── authSlice.js
│   │   │   ├── userSlice.js
│   │   │   ├── eventSlice.js
│   │   │   ├── bookingSlice.js
│   │   │   ├── reviewSlice.js
│   │   │   ├── paymentSlice.js
│   │   │   ├── notificationSlice.js
│   │   │   └── adminSlice.js
│   │   └── thunks/
│   │       ├── authThunks.js
│   │       ├── eventThunks.js
│   │       ├── bookingThunks.js
│   │       └── paymentThunks.js
│   ├── utils/
│   │   ├── constants.js
│   │   ├── helpers.js
│   │   ├── validators.js
│   │   ├── formatters.js
│   │   ├── errors.js
│   │   └── apiErrorHandler.js
│   ├── styles/
│   │   ├── index.css
│   │   ├── themes.css
│   │   ├── responsive.css
│   │   └── variables.css
│   ├── assets/
│   │   ├── images/
│   │   ├── icons/
│   │   └── fonts/
│   ├── i18n/
│   │   ├── en.json
│   │   ├── bn.json
│   │   └── i18n.js
│   ├── App.jsx
│   ├── App.css
│   ├── index.jsx
│   └── index.css
├── .env
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
└── vite.config.js
```

---

## Database Schema

### Database Diagram

```
┌──────────────────────────────────────────────────────────────────┐
│                        USERS TABLE                               │
│  id | name | email | phone | password | role | status | created │
│  PK  FK    UK      UK                                             │
└──────────────────────────────────────────────────────────────────┘
        │                │                    │
        ├────────────────┼────────────────────┤
        ↓                ↓                    ↓
  ┌─────────────┐ ┌────────────────┐ ┌────────────────┐
  │  STUDENTS   │ │   TRAINERS     │ │  ADMINS        │
  │  Table      │ │   Table        │ │  Table         │
  │             │ │                │ │                │
  │ user_id(PK) │ │ user_id(PK)    │ │ user_id(PK)    │
  │ bio         │ │ qualifications │ │ permissions    │
  │ learning    │ │ expertise      │ │ access_level   │
  │ goals       │ │ rating         │ │ created        │
  └─────────────┘ │ balance        │ └────────────────┘
                  │ total_earnings │
                  │ commissions    │
                  │ created        │
                  └────────────────┘
                         │
                         ↓
              ┌──────────────────────┐
              │   EVENTS TABLE       │
              │                      │
              │ id (PK)              │
              │ trainer_id (FK)      │
              │ category_id (FK)     │
              │ title                │
              │ description          │
              │ total_sessions       │
              │ session_duration     │
              │ pricing              │
              │ status               │
              │ created_at           │
              └──────────────────────┘
                         │
                         ↓
              ┌──────────────────────┐
              │   SESSIONS TABLE     │
              │                      │
              │ id (PK)              │
              │ event_id (FK)        │
              │ session_number       │
              │ scheduled_at         │
              │ duration             │
              │ status               │
              │ recorded_url         │
              └──────────────────────┘
                         │
                         ↓
              ┌──────────────────────┐
              │   BOOKINGS TABLE     │
              │                      │
              │ id (PK)              │
              │ student_id (FK)      │
              │ session_id (FK)      │
              │ status               │
              │ booked_at            │
              │ cancelled_at         │
              └──────────────────────┘
                         │
                         ↓
              ┌──────────────────────┐
              │   PAYMENTS TABLE     │
              │                      │
              │ id (PK)              │
              │ booking_id (FK)      │
              │ amount               │
              │ commission           │
              │ trainer_amount       │
              │ status               │
              │ method               │
              │ paid_at              │
              └──────────────────────┘
                         │
                         ↓
              ┌──────────────────────┐
              │   REVIEWS TABLE      │
              │                      │
              │ id (PK)              │
              │ student_id (FK)      │
              │ trainer_id (FK)      │
              │ booking_id (FK)      │
              │ rating               │
              │ comment              │
              │ created_at           │
              └──────────────────────┘
```

### Table Definitions

#### Users Table
```sql
CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    password VARCHAR(255) NOT NULL,
    role ENUM('student', 'trainer', 'admin') NOT NULL DEFAULT 'student',
    status ENUM('active', 'inactive', 'blocked', 'pending') DEFAULT 'pending',
    email_verified_at TIMESTAMP NULL,
    phone_verified_at TIMESTAMP NULL,
    last_login_at TIMESTAMP NULL,
    avatar_url VARCHAR(255),
    bio TEXT,
    two_factor_enabled BOOLEAN DEFAULT FALSE,
    two_factor_secret VARCHAR(255),
    remember_token VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    INDEX(email),
    INDEX(role),
    INDEX(status)
);
```

#### Students Table
```sql
CREATE TABLE students (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL UNIQUE,
    bio TEXT,
    learning_goals TEXT,
    target_interviews VARCHAR(255),
    skill_level ENUM('beginner', 'intermediate', 'advanced') DEFAULT 'beginner',
    total_sessions_booked INT DEFAULT 0,
    total_sessions_completed INT DEFAULT 0,
    total_amount_spent DECIMAL(10, 2) DEFAULT 0,
    average_rating DECIMAL(3, 2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX(user_id),
    INDEX(skill_level)
);
```

#### Trainers Table
```sql
CREATE TABLE trainers (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL UNIQUE,
    qualifications TEXT,
    expertise_areas VARCHAR(500),
    years_of_experience INT,
    hourly_rate DECIMAL(8, 2),
    bank_account_id BIGINT,
    total_sessions_conducted INT DEFAULT 0,
    total_earnings DECIMAL(12, 2) DEFAULT 0,
    total_commission_deducted DECIMAL(12, 2) DEFAULT 0,
    current_balance DECIMAL(12, 2) DEFAULT 0,
    average_rating DECIMAL(3, 2) DEFAULT 0,
    total_reviews INT DEFAULT 0,
    is_verified BOOLEAN DEFAULT FALSE,
    verification_date TIMESTAMP NULL,
    status ENUM('active', 'inactive', 'suspended') DEFAULT 'inactive',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX(user_id),
    INDEX(is_verified),
    INDEX(status)
);
```

#### Events Table
```sql
CREATE TABLE events (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    trainer_id BIGINT NOT NULL,
    category_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description LONGTEXT,
    interview_type VARCHAR(100),
    topics VARCHAR(500),
    total_sessions INT NOT NULL,
    session_duration INT NOT NULL, -- in minutes
    pricing_per_session DECIMAL(10, 2),
    total_package_price DECIMAL(10, 2),
    max_students_per_slot INT DEFAULT 1,
    status ENUM('draft', 'published', 'archived', 'suspended') DEFAULT 'draft',
    process_description LONGTEXT,
    prerequisites TEXT,
    resources_provided LONGTEXT,
    cancellation_policy TEXT,
    thumbnail_url VARCHAR(255),
    banner_url VARCHAR(255),
    demo_video_url VARCHAR(255),
    total_bookings INT DEFAULT 0,
    completion_rate DECIMAL(5, 2) DEFAULT 0,
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    published_at TIMESTAMP NULL,
    FOREIGN KEY (trainer_id) REFERENCES trainers(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id),
    INDEX(trainer_id),
    INDEX(status),
    INDEX(is_featured)
);
```

#### Sessions Table
```sql
CREATE TABLE sessions (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    event_id BIGINT NOT NULL,
    session_number INT NOT NULL,
    scheduled_date DATE NOT NULL,
    scheduled_time TIME NOT NULL,
    duration INT NOT NULL, -- in minutes
    max_students INT DEFAULT 1,
    current_bookings INT DEFAULT 0,
    status ENUM('scheduled', 'ongoing', 'completed', 'cancelled') DEFAULT 'scheduled',
    recorded_url VARCHAR(255),
    recording_enabled BOOLEAN DEFAULT FALSE,
    notes TEXT,
    session_token VARCHAR(255),
    agora_channel_name VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    INDEX(event_id),
    INDEX(scheduled_date),
    INDEX(status)
);
```

#### Bookings Table
```sql
CREATE TABLE bookings (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    student_id BIGINT NOT NULL,
    session_id BIGINT NOT NULL,
    trainer_id BIGINT NOT NULL,
    event_id BIGINT NOT NULL,
    booking_number VARCHAR(50) UNIQUE,
    status ENUM('confirmed', 'attended', 'cancelled', 'no-show', 'rescheduled') DEFAULT 'confirmed',
    booked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    cancelled_at TIMESTAMP NULL,
    attended_at TIMESTAMP NULL,
    cancellation_reason TEXT,
    refund_status ENUM('none', 'pending', 'completed', 'failed') DEFAULT 'none',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE,
    FOREIGN KEY (trainer_id) REFERENCES trainers(id),
    FOREIGN KEY (event_id) REFERENCES events(id),
    INDEX(student_id),
    INDEX(session_id),
    INDEX(status),
    UNIQUE(student_id, session_id)
);
```

#### Payments Table
```sql
CREATE TABLE payments (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    booking_id BIGINT NOT NULL UNIQUE,
    student_id BIGINT NOT NULL,
    trainer_id BIGINT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    commission_percent DECIMAL(5, 2) DEFAULT 15,
    commission_amount DECIMAL(10, 2),
    trainer_amount DECIMAL(10, 2),
    payment_status ENUM('pending', 'processing', 'completed', 'failed', 'refunded') DEFAULT 'pending',
    payment_method ENUM('card', 'mobile_banking', 'wallet', 'bank_transfer') NOT NULL,
    transaction_id VARCHAR(255) UNIQUE,
    gateway_response JSON,
    paid_at TIMESTAMP NULL,
    refunded_at TIMESTAMP NULL,
    refund_reason TEXT,
    invoice_url VARCHAR(255),
    receipt_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES students(id),
    FOREIGN KEY (trainer_id) REFERENCES trainers(id),
    INDEX(student_id),
    INDEX(trainer_id),
    INDEX(payment_status),
    INDEX(paid_at)
);
```

#### Reviews Table
```sql
CREATE TABLE reviews (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    booking_id BIGINT NOT NULL,
    student_id BIGINT NOT NULL,
    trainer_id BIGINT NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment LONGTEXT,
    tags VARCHAR(255),
    is_helpful BOOLEAN DEFAULT FALSE,
    helpful_count INT DEFAULT 0,
    trainer_response TEXT,
    trainer_responded_at TIMESTAMP NULL,
    is_featured BOOLEAN DEFAULT FALSE,
    is_flagged BOOLEAN DEFAULT FALSE,
    flag_reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (trainer_id) REFERENCES trainers(id) ON DELETE CASCADE,
    INDEX(trainer_id),
    INDEX(rating),
    INDEX(created_at),
    UNIQUE(booking_id)
);
```

#### Categories Table
```sql
CREATE TABLE categories (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) UNIQUE,
    description TEXT,
    icon_url VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX(is_active),
    INDEX(display_order)
);
```

#### Notifications Table
```sql
CREATE TABLE notifications (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    message LONGTEXT,
    type ENUM('booking', 'payment', 'review', 'session', 'message', 'system') NOT NULL,
    related_id BIGINT,
    related_type VARCHAR(50),
    read_at TIMESTAMP NULL,
    is_read BOOLEAN DEFAULT FALSE,
    action_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX(user_id),
    INDEX(is_read),
    INDEX(created_at)
);
```

#### Messages Table
```sql
CREATE TABLE messages (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    sender_id BIGINT NOT NULL,
    receiver_id BIGINT NOT NULL,
    subject VARCHAR(255),
    body LONGTEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP NULL,
    archived_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX(sender_id),
    INDEX(receiver_id),
    INDEX(is_read)
);
```

---

## Authentication & Authorization

### JWT (JSON Web Tokens) Flow

```
┌──────────────┐
│  User Login  │
└──────┬───────┘
       │
       ↓
┌──────────────────────────────────────────────┐
│  POST /api/auth/login                        │
│  { email, password }                         │
└──────┬───────────────────────────────────────┘
       │
       ↓
┌──────────────────────────────────────────────┐
│  Verify Credentials                          │
└──────┬───────────────────────────────────────┘
       │
       ↓
┌──────────────────────────────────────────────┐
│  Generate JWT Token                          │
│  Header: { alg: HS256, typ: JWT }           │
│  Payload: {                                  │
│    user_id: 123,                            │
│    role: 'student',                         │
│    iat: 1234567890,                         │
│    exp: 1234571490                          │
│  }                                           │
│  Signature: HMACSHA256(header.payload)      │
└──────┬───────────────────────────────────────┘
       │
       ↓
┌──────────────────────────────────────────────┐
│  Return JWT Token + Refresh Token            │
│  {                                           │
│    access_token: "eyJhbG...",               │
│    refresh_token: "eyJhbG...",              │
│    expires_in: 3600,                        │
│    token_type: "Bearer"                     │
│  }                                           │
└──────┬───────────────────────────────────────┘
       │
       ↓
┌──────────────────────────────────────────────┐
│  Store in React State / localStorage         │
└──────┬───────────────────────────────────────┘
       │
       ↓
┌──────────────────────────────────────────────┐
│  Future API Requests                         │
│  Header: Authorization: Bearer <token>      │
└──────┬───────────────────────────────────────┘
       │
       ↓
┌──────────────────────────────────────────────┐
│  JwtMiddleware validates token               │
└──────┬───────────────────────────────────────┘
       │
       ↓
┌──────────────────────────────────────────────┐
│  Grant/Deny Access                           │
└──────────────────────────────────────────────┘
```

### Laravel Authentication Setup

```php
// config/auth.php
'guards' => [
    'api' => [
        'driver' => 'jwt',
        'provider' => 'users',
        'hash' => false,
    ],
],

// app/Http/Middleware/JwtMiddleware.php
class JwtMiddleware
{
    public function handle($request, Closure $next)
    {
        try {
            $token = JWTAuth::parseToken();
            $user = $token->authenticate();
        } catch (Exception $e) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }
        
        return $next($request);
    }
}
```

### Role-Based Access Control (RBAC)

```php
// app/Http/Middleware/RoleMiddleware.php
class RoleMiddleware
{
    public function handle($request, Closure $next, ...$roles)
    {
        $user = Auth::user();
        
        if (!in_array($user->role, $roles)) {
            return response()->json(['error' => 'Forbidden'], 403);
        }
        
        return $next($request);
    }
}

// routes/api.php
Route::middleware(['auth:api', 'role:student'])->group(function () {
    Route::post('/bookings', 'BookingController@store');
});

Route::middleware(['auth:api', 'role:trainer'])->group(function () {
    Route::post('/events', 'EventController@store');
});

Route::middleware(['auth:api', 'role:admin'])->group(function () {
    Route::get('/admin/users', 'AdminController@listUsers');
});
```

### React Authentication Setup

```javascript
// src/services/authService.js
const authService = {
    login: async (email, password) => {
        const response = await axios.post('/api/auth/login', { email, password });
        localStorage.setItem('accessToken', response.data.access_token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        return response.data;
    },
    
    logout: () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
    },
    
    getCurrentUser: () => {
        return JSON.parse(localStorage.getItem('user'));
    },
    
    isAuthenticated: () => {
        return !!localStorage.getItem('accessToken');
    }
};

// src/hooks/useAuth.js
const useAuth = () => {
    const dispatch = useDispatch();
    const { user, isAuthenticated } = useSelector(state => state.auth);
    
    const login = async (email, password) => {
        const data = await authService.login(email, password);
        dispatch(setUser(data.user));
        dispatch(setToken(data.access_token));
    };
    
    return { user, isAuthenticated, login };
};
```

---

## API Endpoints Documentation

### Base URL
```
http://localhost:8000/api/v1
```

### Authentication Endpoints

#### 1. Register User
```
POST /auth/register
Content-Type: application/json

{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "Password@123",
    "password_confirmation": "Password@123",
    "role": "student" | "trainer",
    "phone": "+8801234567890"
}

Response: 201 Created
{
    "message": "User registered successfully",
    "user": {
        "id": 1,
        "name": "John Doe",
        "email": "john@example.com",
        "role": "student"
    },
    "access_token": "eyJhbGciOiJIUzI1NiIs...",
    "token_type": "Bearer",
    "expires_in": 3600
}
```

#### 2. Login
```
POST /auth/login
Content-Type: application/json

{
    "email": "john@example.com",
    "password": "Password@123"
}

Response: 200 OK
{
    "message": "Login successful",
    "user": {
        "id": 1,
        "name": "John Doe",
        "email": "john@example.com",
        "role": "student",
        "avatar_url": "https://..."
    },
    "access_token": "eyJhbGciOiJIUzI1NiIs...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIs...",
    "token_type": "Bearer",
    "expires_in": 3600
}
```

#### 3. Refresh Token
```
POST /auth/refresh
Header: Authorization: Bearer <token>

Response: 200 OK
{
    "access_token": "eyJhbGciOiJIUzI1NiIs...",
    "token_type": "Bearer",
    "expires_in": 3600
}
```

#### 4. Logout
```
POST /auth/logout
Header: Authorization: Bearer <token>

Response: 200 OK
{
    "message": "Logout successful"
}
```

#### 5. Get Current User
```
GET /auth/me
Header: Authorization: Bearer <token>

Response: 200 OK
{
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student",
    "avatar_url": "https://...",
    "email_verified_at": "2024-01-15T10:30:00Z"
}
```

### Events Endpoints (Trainer)

#### 1. Create Event
```
POST /events
Header: Authorization: Bearer <token>
Content-Type: application/json

{
    "title": "JavaScript Interview Masterclass",
    "description": "Complete JavaScript interview preparation...",
    "category_id": 1,
    "interview_type": "Technical",
    "topics": "Promises, Callbacks, Async/Await",
    "total_sessions": 12,
    "session_duration": 30,
    "pricing_per_session": 100,
    "total_package_price": 1000,
    "max_students_per_slot": 1,
    "process_description": "...",
    "prerequisites": "Basic JavaScript knowledge",
    "resources_provided": "Code samples, notes",
    "cancellation_policy": "Full refund before 24 hours"
}

Response: 201 Created
{
    "id": 1,
    "trainer_id": 1,
    "title": "JavaScript Interview Masterclass",
    "status": "draft",
    "created_at": "2024-01-15T10:30:00Z"
}
```

#### 2. List Events (Trainer)
```
GET /events
Header: Authorization: Bearer <token>

Query Parameters:
- status=published|draft|archived
- page=1
- per_page=10
- sort=created_at

Response: 200 OK
{
    "data": [
        {
            "id": 1,
            "title": "JavaScript Interview Masterclass",
            "status": "published",
            "total_bookings": 15,
            "completion_rate": 80,
            "created_at": "2024-01-15T10:30:00Z"
        }
    ],
    "pagination": {
        "total": 25,
        "per_page": 10,
        "current_page": 1,
        "last_page": 3
    }
}
```

#### 3. Get Event Details
```
GET /events/:id
Header: Authorization: Bearer <token>

Response: 200 OK
{
    "id": 1,
    "trainer_id": 1,
    "trainer": {
        "id": 1,
        "name": "Expert Trainer",
        "rating": 4.8
    },
    "title": "JavaScript Interview Masterclass",
    "description": "...",
    "total_sessions": 12,
    "pricing": 1000,
    "sessions": [
        {
            "id": 1,
            "session_number": 1,
            "scheduled_date": "2024-02-01",
            "scheduled_time": "10:00:00",
            "status": "scheduled"
        }
    ],
    "created_at": "2024-01-15T10:30:00Z"
}
```

#### 4. Update Event
```
PUT /events/:id
Header: Authorization: Bearer <token>
Content-Type: application/json

{
    "title": "Updated Title",
    "description": "Updated description"
}

Response: 200 OK
{
    "message": "Event updated successfully",
    "data": { ... }
}
```

#### 5. Publish Event
```
POST /events/:id/publish
Header: Authorization: Bearer <token>

Response: 200 OK
{
    "message": "Event published successfully",
    "status": "published"
}
```

#### 6. Archive Event
```
POST /events/:id/archive
Header: Authorization: Bearer <token>

Response: 200 OK
{
    "message": "Event archived successfully"
}
```

#### 7. Delete Event
```
DELETE /events/:id
Header: Authorization: Bearer <token>

Response: 200 OK
{
    "message": "Event deleted successfully"
}
```

### Bookings Endpoints (Student)

#### 1. Get Available Sessions
```
GET /events/:id/sessions
Query Parameters:
- start_date=2024-02-01
- end_date=2024-02-28

Response: 200 OK
{
    "data": [
        {
            "id": 1,
            "session_number": 1,
            "scheduled_date": "2024-02-01",
            "scheduled_time": "10:00:00",
            "duration": 30,
            "available_slots": 1,
            "current_bookings": 0
        }
    ]
}
```

#### 2. Book Session
```
POST /bookings
Header: Authorization: Bearer <token>
Content-Type: application/json

{
    "session_id": 1,
    "event_id": 1
}

Response: 201 Created
{
    "id": 1,
    "booking_number": "BK-2024-001",
    "session_id": 1,
    "student_id": 1,
    "status": "confirmed",
    "booked_at": "2024-01-15T10:30:00Z",
    "total_amount": 100
}
```

#### 3. Get My Bookings
```
GET /bookings
Header: Authorization: Bearer <token>

Query Parameters:
- status=confirmed|attended|cancelled
- page=1
- per_page=10

Response: 200 OK
{
    "data": [
        {
            "id": 1,
            "booking_number": "BK-2024-001",
            "event": {
                "id": 1,
                "title": "JavaScript Interview"
            },
            "trainer": {
                "id": 1,
                "name": "Expert Trainer"
            },
            "session": {
                "scheduled_date": "2024-02-01",
                "scheduled_time": "10:00:00"
            },
            "status": "confirmed",
            "booked_at": "2024-01-15T10:30:00Z"
        }
    ]
}
```

#### 4. Cancel Booking
```
DELETE /bookings/:id
Header: Authorization: Bearer <token>
Content-Type: application/json

{
    "cancellation_reason": "Schedule conflict"
}

Response: 200 OK
{
    "message": "Booking cancelled successfully",
    "refund_status": "pending"
}
```

#### 5. Reschedule Booking
```
POST /bookings/:id/reschedule
Header: Authorization: Bearer <token>
Content-Type: application/json

{
    "new_session_id": 5
}

Response: 200 OK
{
    "message": "Booking rescheduled successfully",
    "new_session": { ... }
}
```

### Payments Endpoints

#### 1. Process Payment
```
POST /payments
Header: Authorization: Bearer <token>
Content-Type: application/json

{
    "booking_id": 1,
    "payment_method": "card",
    "card_token": "tok_visa"
}

Response: 201 Created
{
    "id": 1,
    "booking_id": 1,
    "amount": 100,
    "commission": 15,
    "trainer_amount": 85,
    "status": "completed",
    "transaction_id": "txn_12345",
    "paid_at": "2024-01-15T10:30:00Z"
}
```

#### 2. Get Payment History
```
GET /payments
Header: Authorization: Bearer <token>

Query Parameters:
- user_type=student|trainer
- status=completed|pending|failed
- page=1

Response: 200 OK
{
    "data": [
        {
            "id": 1,
            "booking_id": 1,
            "amount": 100,
            "status": "completed",
            "paid_at": "2024-01-15T10:30:00Z"
        }
    ]
}
```

#### 3. Get Invoice
```
GET /payments/:id/invoice
Header: Authorization: Bearer <token>

Response: 200 OK
{
    "url": "https://storage/invoices/INV-001.pdf"
}
```

#### 4. Request Refund
```
POST /payments/:id/refund
Header: Authorization: Bearer <token>
Content-Type: application/json

{
    "reason": "Session not attended"
}

Response: 200 OK
{
    "message": "Refund requested successfully",
    "refund_status": "pending"
}
```

### Reviews Endpoints

#### 1. Submit Review
```
POST /reviews
Header: Authorization: Bearer <token>
Content-Type: application/json

{
    "booking_id": 1,
    "trainer_id": 1,
    "rating": 5,
    "comment": "Excellent session! Very helpful.",
    "tags": "engaging,knowledgeable"
}

Response: 201 Created
{
    "id": 1,
    "booking_id": 1,
    "rating": 5,
    "comment": "Excellent session! Very helpful.",
    "created_at": "2024-01-15T10:30:00Z"
}
```

#### 2. Get Trainer Reviews
```
GET /trainers/:id/reviews
Query Parameters:
- sort=latest|helpful|rating
- rating=5|4|3|2|1
- page=1

Response: 200 OK
{
    "data": [
        {
            "id": 1,
            "student": {
                "id": 1,
                "name": "Student Name"
            },
            "rating": 5,
            "comment": "Excellent session!",
            "helpful_count": 12,
            "trainer_response": "Thank you!",
            "created_at": "2024-01-15T10:30:00Z"
        }
    ],
    "average_rating": 4.8,
    "total_reviews": 45
}
```

#### 3. Update Review (Trainer Response)
```
PUT /reviews/:id/respond
Header: Authorization: Bearer <token>
Content-Type: application/json

{
    "response": "Thank you for the feedback! Glad I could help."
}

Response: 200 OK
{
    "message": "Response posted successfully",
    "trainer_response": "..."
}
```

### Analytics Endpoints (Admin)

#### 1. Dashboard Statistics
```
GET /admin/analytics/dashboard
Header: Authorization: Bearer <token>

Response: 200 OK
{
    "total_users": 1500,
    "total_trainers": 50,
    "total_students": 1450,
    "total_revenue": 150000,
    "commission_collected": 22500,
    "active_sessions_today": 12,
    "new_users_this_month": 150
}
```

#### 2. Revenue Report
```
GET /admin/analytics/revenue
Header: Authorization: Bearer <token>

Query Parameters:
- start_date=2024-01-01
- end_date=2024-01-31
- group_by=day|week|month

Response: 200 OK
{
    "data": [
        {
            "date": "2024-01-01",
            "total_revenue": 5000,
            "commission": 750,
            "transactions": 50
        }
    ],
    "total": 150000
}
```

#### 3. User Activity
```
GET /admin/analytics/user-activity
Query Parameters:
- period=7days|30days|90days
- user_type=student|trainer

Response: 200 OK
{
    "active_users": 850,
    "new_users": 150,
    "inactive_users": 600,
    "daily_active_users": 450,
    "charts": { ... }
}
```

### Admin Endpoints

#### 1. List All Users
```
GET /admin/users
Header: Authorization: Bearer <token>

Query Parameters:
- role=student|trainer|admin
- status=active|inactive|blocked
- search=query
- page=1

Response: 200 OK
{
    "data": [
        {
            "id": 1,
            "name": "User Name",
            "email": "user@example.com",
            "role": "student",
            "status": "active"
        }
    ]
}
```

#### 2. Approve Trainer
```
POST /admin/trainers/:id/approve
Header: Authorization: Bearer <token>

Response: 200 OK
{
    "message": "Trainer approved successfully",
    "status": "active"
}
```

#### 3. Block User
```
POST /admin/users/:id/block
Header: Authorization: Bearer <token>
Content-Type: application/json

{
    "reason": "Inappropriate behavior"
}

Response: 200 OK
{
    "message": "User blocked successfully"
}
```

#### 4. Handle Dispute
```
POST /admin/disputes/:id/resolve
Header: Authorization: Bearer <token>
Content-Type: application/json

{
    "resolution": "refund",
    "amount": 100,
    "notes": "Refund processed"
}

Response: 200 OK
{
    "message": "Dispute resolved successfully"
}
```

---

## React Component Structure

### Component Hierarchy

```
App
├── Layout
│   ├── Navbar
│   │   ├── Logo
│   │   ├── Navigation
│   │   └── UserMenu
│   ├── Sidebar
│   │   └── NavItems
│   ├── Routes
│   │   ├── StudentDashboard
│   │   │   ├── StatsCards
│   │   │   ├── UpcomingSessionsCard
│   │   │   ├── RecommendedTrainers
│   │   │   └── ActivityFeed
│   │   ├── StudentExplore
│   │   │   ├── FilterSidebar
│   │   │   ├── TrainerList
│   │   │   └── TrainerCard
│   │   ├── StudentBookings
│   │   │   ├── BookingTabs
│   │   │   ├── BookingCard
│   │   │   └── RescheduleModal
│   │   ├── SessionJoin
│   │   │   ├── VideoInterface
│   │   │   ├── ChatPanel
│   │   │   └── NotesPanel
│   │   ├── TrainerDashboard
│   │   │   ├── EarningsCard
│   │   │   ├── ScheduleWidget
│   │   │   └── ReviewsWidget
│   │   ├── TrainerEvents
│   │   │   ├── CreateEventForm
│   │   │   ├── EventList
│   │   │   └── EditEventForm
│   │   ├── AdminDashboard
│   │   │   ├── KeyMetricsCards
│   │   │   ├── RevenueChart
│   │   │   └── UserActivityChart
│   │   ├── AdminUsers
│   │   │   ├── UserFilters
│   │   │   ├── UserTable
│   │   │   └── UserActions
│   │   └── ProfilePage
│   │       ├── ProfileForm
│   │       └── PreferencesForm
│   └── Footer
└── Modals
    ├── ConfirmDialog
    ├── NotificationToast
    └── LoadingOverlay
```

### Key Components

#### Student Dashboard
```jsx
// StudentDashboard.jsx
const StudentDashboard = () => {
  const { user } = useAuth();
  const [upcomingSessions, setUpcomingSessions] = useState([]);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchUpcomingSessions();
    fetchStats();
  }, []);

  return (
    <Dashboard>
      <Header title="Welcome, {user.name}!" />
      <StatsCards stats={stats} />
      <UpcomingSessionsWidget sessions={upcomingSessions} />
      <RecommendedTrainersWidget />
      <ActivityFeedWidget />
    </Dashboard>
  );
};
```

#### Video Interface
```jsx
// SessionJoin.jsx
const SessionJoin = ({ bookingId }) => {
  const videoRef = useRef();
  const [localStream, setLocalStream] = useState(null);
  const [remoteStreams, setRemoteStreams] = useState({});

  useEffect(() => {
    initializeVideo();
  }, []);

  const initializeVideo = async () => {
    const stream = await navigator.mediaDevices
      .getUserMedia({ video: true, audio: true });
    setLocalStream(stream);
    videoRef.current.srcObject = stream;
  };

  return (
    <VideoContainer>
      <TrainerVideo remoteStreams={remoteStreams} />
      <StudentVideo ref={videoRef} />
      <ChatPanel />
      <ControlPanel />
    </VideoContainer>
  );
};
```

#### Payment Processing
```jsx
// CheckoutPage.jsx
const CheckoutPage = ({ bookingId }) => {
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [processing, setProcessing] = useState(false);

  const handlePayment = async (cardDetails) => {
    setProcessing(true);
    try {
      const response = await paymentService.processPayment({
        booking_id: bookingId,
        payment_method: paymentMethod,
        card: cardDetails
      });
      navigateTo('/payment-success');
    } catch (error) {
      showError(error.message);
    }
    setProcessing(false);
  };

  return (
    <CheckoutContainer>
      <OrderSummary bookingId={bookingId} />
      <PaymentForm onSubmit={handlePayment} />
    </CheckoutContainer>
  );
};
```

---

## API Integration

### Axios Setup

```javascript
// src/services/api.js
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to every request
apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 and refresh token
apiClient.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 401) {
      try {
        const newToken = await refreshToken();
        localStorage.setItem('accessToken', newToken);
        return apiClient(error.config);
      } catch {
        localStorage.removeItem('accessToken');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

### Service Integration

```javascript
// src/services/studentService.js
import api from './api';

const studentService = {
  getUpcomingBookings: () => 
    api.get('/bookings?status=confirmed'),
  
  bookSession: (sessionId) =>
    api.post('/bookings', { session_id: sessionId }),
  
  getAvailableSessions: (eventId) =>
    api.get(`/events/${eventId}/sessions`),
  
  submitReview: (reviewData) =>
    api.post('/reviews', reviewData)
};

export default studentService;
```

---

## Development Setup

### Laravel Setup

```bash
# Clone repository
git clone <repo-url>
cd mock-interview-platform

# Install dependencies
composer install

# Create .env file
cp .env.example .env

# Generate application key
php artisan key:generate

# Set JWT secret
php artisan jwt:secret

# Run migrations
php artisan migrate

# Seed database
php artisan db:seed

# Start development server
php artisan serve
```

### React Setup

```bash
# Navigate to frontend
cd mock-interview-web

# Install dependencies
npm install

# Create .env file
echo "REACT_APP_API_URL=http://localhost:8000/api" > .env

# Start development server
npm run dev
```

---

## Deployment

### Laravel Deployment

```bash
# Build for production
composer install --optimize-autoloader --no-dev

# Run migrations
php artisan migrate --force

# Clear caches
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Generate JWT secret
php artisan jwt:secret

# Set proper permissions
chmod -R 755 storage bootstrap/cache
```

### React Deployment

```bash
# Build for production
npm run build

# Output in 'dist' folder
# Deploy to static hosting or serve with nginx
```

---

*Last Updated: May 18, 2026*
*Version: 1.0*
