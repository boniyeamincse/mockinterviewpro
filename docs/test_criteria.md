# InterviewPro Platform — Testing Criteria & QA Checklist

This document details the quality assurance validation checklists and automated testing criteria for both the **React + Vite Frontend** and the **Laravel + MariaDB Backend**.

---

## 🎨 1. Frontend Verification Criteria

### A. Dynamic SPA Navigation
* **Path Coverage**:
  * [x] `/` (Landing Page): Hero CTA, grid features, Candidate/Trainer pathways.
  * [x] `/login` & `/register`: Glassmorphic auth cards, dynamic student/trainer toggle switch.
  * [x] `/dashboard` (Candidate Workspace): Real-time upcoming sessions, preparation tasks, profile switcher.
  * [x] `/trainers` (Find a Trainer): Dynamic sidebar filtering, search triggers, expert rating displays.
  * [x] `/become-trainer` (Become a Trainer): Multi-step onboarding application with rate estimator.

### B. Profile Strengths & Scoring System
* **Weighted Completeness Checklist**:
  * Name: `10%`
  * Email: `10%`
  * Avatar Photo (Custom or Default): `10%`
  * Gender Select: `10%`
  * Birthday Picker: `10%`
  * Academic Institution / Degree details: `20%`
  * Custom Coding Interests: `15%`
  * Target Career Focus / Goals: `15%`
* **Pass Criteria**:
  * Real-time calculation triggers instantly on keystroke/value changes.
  * Reaching **>= 75%** completeness must display the premium green **"Verified Profile Strong"** badge.
  * Progress bar renders smooth CSS transition widths between HSL tailored gradient points.

### C. Client Storage & Persistence
* [ ] Local Storage Sync: Form modifications (Gender, Birthday, BUET degrees, career focus) must automatically stringify and store under `'user'` local space on save.
* [ ] Persistent State: On browser tab reload, dashboard header must fetch stored state and display dynamic greet message (e.g. *Boni Yeamin*).

---

## 💻 2. Backend Verification Criteria

### A. Database User Schema Compliance
Ensure the `users` table holds the following custom columns added via migration `2026_05_18_084200_add_candidate_profile_fields_to_users_table.php`:
* `gender` (varchar/string, nullable)
* `birthday` (date, nullable)
* `academic_inst` (varchar/string, nullable)
* `academic_degree` (varchar/string, nullable)
* `academic_grad_year` (integer, nullable)
* `interests` (text, nullable)
* `goals` (text, nullable)
* `career_goal` (varchar/string, nullable)

### B. API Route Authentication Contracts
* **Base URL**: `http://localhost:8001/api`
* **POST `/auth/register`**:
  * Fields: `name`, `email`, `password`, `password_confirmation`, `user_type` (student/trainer/admin).
  * Check: Returns `201 Created` with a plaintext Sanctum Bearer token.
* **POST `/auth/login`**:
  * Fields: `email`, `password`.
  * Check: Validates hashes, updates `last_login_at`, returns custom formatted user block.
* **PUT `/auth/profile`** (Protected):
  * Headers: `Authorization: Bearer <token>`
  * Action: Updates any combination of the 8 candidate profile fields cleanly, returning a `200 OK` JSON response.

### C. Escrow & Commission Logic
* [ ] **Automated 85/15 Commission Split**:
  * BDT payments are verified and held in escrow when booking.
  * Flat `15%` is allocated to the InterviewPro platform on completion.
  * Flat `85%` is released directly to the Trainer's ledger.

---

## ⚙️ 3. Execution Commands

### Run Backend Unit Tests
Execute the Laravel test suite with headless terminal output:
```bash
cd /home/boni/Desktop/moc/backend
vendor/bin/phpunit
```

### Run Local Development Servers
To start the end-to-end integration env:
```bash
# Terminal 1: Laravel Backend
cd /home/boni/Desktop/moc/backend
php artisan serve --port=8001

# Terminal 2: React Frontend
cd /home/boni/Desktop/moc/frontend
npm run dev
```
