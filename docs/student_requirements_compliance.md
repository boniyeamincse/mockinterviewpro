# InterviewPro — Student & Candidate Features Compliance Specifications

This audit document details how every requested item on your **Student & Candidate Features Checklist** is mapped and verified across the **React + Vite Frontend** and **Laravel + MariaDB Backend**.

---

## 👤 1. Student Profile Checklist

| Requested Feature | Database Field / Model Hook | Frontend UI & Component |
| :--- | :--- | :--- |
| **Full Name** | `name` in `users` table | `profile.name` under Personal sub-tab |
| **Email** | `email` in `users` table | `profile.email` under Personal sub-tab |
| **Phone Number** | `phone` in `users` table | `profile.phone` under Personal sub-tab |
| **Profile Picture** | `profile_image` in `users` table | Camera/avatar uploader in profile sidebar |
| **Bio/About** | `bio` in `users` table | `profile.bio` under Personal sub-tab |
| **Skills** | `skills` in `users` table | Skills tag manager under Professional sub-tab |
| **Experience Level** | `experience_level` in `users` table | Selector under Professional sub-tab |
| **Career Goal** | `career_goal` in `users` table | Input under Academic sub-tab |
| **Resume/CV Upload** | `resume_path` in `users` table | Resume drag-and-drop uploader in sidebar |
| **Portfolio Links** | `portfolio_links` in `users` table | Input under Professional sub-tab |
| **GitHub/LinkedIn Profile** | `github_profile`, `linkedin_profile` | Inputs under Professional sub-tab |
| **Completed Sessions** | Custom count helper | Rendered on History & Reviews sub-tab |
| **Interview History** | `Booking` model relationships | Table list under History & Reviews sub-tab |
| **Certificates** | `certificates` in `users` table | Input under Professional sub-tab |
| **Earned Badges** | `earned_badges` string split | Dynamic capsule badges in sidebar |
| **Points / Rank** | `points`, `rank` in `users` table | Gamification glass badge in sidebar |
| **Reviews Given** | `Review` model relationship | Feed list under History & Reviews sub-tab |

* **Completed Migration File**: `2026_05_22_120000_add_missing_student_profile_fields_to_users_table.php`
* **Controller Handler**: [StudentProfileController.php](file:///home/boni/Desktop/moc/backend/app/Http/Controllers/StudentProfileController.php)

---

## 🔍 2. Session Discovery Checklist

* **Component**: [FindTrainer.jsx](file:///home/boni/Desktop/moc/frontend/src/pages/FindTrainer.jsx) & [BrowseEvents.jsx](file:///home/boni/Desktop/moc/frontend/src/pages/BrowseEvents.jsx)

* **Features**:
  * **Browse sessions & Search by keyword**: Built-in reactive query filter triggering custom hooks.
  * **Filters**:
    * **Category**: Integrated interactive category lists (Software Eng, Data Science, etc.).
    * **Price**: Range slider mapping BDT thresholds.
    * **Skill**: Text keyword lookups.
    * **Teacher Rating**: Real-time Star icon badges.
  * **Save Wishlist & Favorites**: Handled via secure backend endpoint interactions `/api/student/wishlist`.

---

## 📄 3. Session Details Page Checklist

* **Component**: [BookSession.jsx](file:///home/boni/Desktop/moc/frontend/src/pages/BookSession.jsx) & [CourseDetails.jsx](file:///home/boni/Desktop/moc/frontend/src/pages/CourseDetails.jsx)

* **Information Rendered**:
  * **Title & Description**: Premium Outfit headings.
  * **Teacher Profile & Rating**: Avatar, verified badges, rating statistics.
  * **Tags & Duration**: Color-coded category tags.
  * **Session Schedule**: Interactive schedule cards.
  * **Session Price**: Highlighted cyan-to-purple gradient BDT price indicators.

---

## 📅 4. Booking System Checklist

* **Component**: [Dashboard.jsx](file:///home/boni/Desktop/moc/frontend/src/pages/Dashboard.jsx) & [BookSession.jsx](file:///home/boni/Desktop/moc/frontend/src/pages/BookSession.jsx)

* **Actions**:
  * **Book interview sessions**: Single-click reservation flow.
  * **Select time slot**: Interactive time-slot grid.
  * **Cancel & Reschedule booking**: Seamlessly backed by PUT/PATCH status transitions on the Laravel models.
  * **Reminders**: Integrated notifications feed.
* **Booking Status Compliance**:
  * Enforced model enum values: `Pending`, `Confirmed`, `Completed`, `Cancelled`, `Refunded`, `Expired`.

---

## 💳 5. Payment System Checklist

* **Component**: [PaymentPage.jsx](file:///home/boni/Desktop/moc/frontend/src/pages/PaymentPage.jsx)

* **Supported Methods**:
  * **bKash**, **Nagad**, **Rocket**, **SSLCommerz**, **Stripe**, **Card**, **Manual**.
* **Features**:
  * **Secure checkout**: SSL transaction indicators.
  * **Invoice generation**: Auto-compiled receipts for completed transactions.
  * **Payment history**: Direct audit ledger on the Student Dashboard.
  * **Escrow system**: Held balances with automatic flat commissions on sign-off.

---

## 📊 6. Student Dashboard Sections

* **Component**: [Dashboard.jsx](file:///home/boni/Desktop/moc/frontend/src/pages/Dashboard.jsx)

* **Overview grid & panels**:
  * **Overview metrics**: Quick cards showing total bookings, upcoming sessions, paid events, and ratings.
  * **Lists**: Upcoming sessions, Completed sessions, Booking history, Payments registry, Notifications.
  * **Sidebar**: Profile strength calculation progress bar, Gamified XP tracker, badge lists.
