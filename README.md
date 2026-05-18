# InterviewPro — Premium Mock Interview Platform

InterviewPro is a next-generation 1-on-1 mock interview preparation platform built to help candidates ace FAANG and top-tier tech loops. It supports secure escrow payments (85/15 commission split), real-time session tracking, and comprehensive profile matching.

---

## 🎨 Design Theme & Core Architecture
* **Frontend**: Modern **React + Vite** single-page application (SPA).
  * Outfitted with Outfit typography, vibrant HSL tailored color palettes, custom blurs, and glassmorphic panels.
  * Real-time search sidebar, dynamic price sliders, and detailed tags.
  * Interactive **Profile Completeness Tracker** that dynamically scores profile strength (100% target progress).
* **Backend**: **Laravel + MariaDB** secure API.
  * Extensively matched schema models to align perfectly with frontend fields.
  * Seeded pre-verified accounts for Candidates, Trainers, and Admins.

---

## 🚀 Setup & Launch Guide

### 1. Database Setup (MariaDB)
Start the database service and ensure you have created a database named `mock`:
```bash
# Connect to MariaDB/MySQL
mysql -h 127.0.0.1 -u root --skip-ssl -e "CREATE DATABASE IF NOT EXISTS mock;"
```

### 2. Backend Installation (Laravel)
Navigate to the `backend` folder and run dependencies and migrations:
```bash
cd backend
composer install
php artisan migrate
php artisan db:seed
php artisan serve --port=8001
```

### 3. Frontend Installation (React + Vite)
Navigate to the `frontend` folder, install npm packages, and boot the Vite server:
```bash
cd frontend
npm install
npm run dev
```
*Frontend will run locally on: `http://localhost:5173/`*

---

## 🔑 Seeded Login Credentials

| Role | Email | Password | Pre-Filled State |
| :--- | :--- | :--- | :--- |
| **Candidate** | `boniyeamin.cse1@gmail.com` | `test@1234` | 100% Strength (BUET, Male, React/Go) |
| **Trainer** | `trainer@interviewpro.com` | `test@1234` | Ex-Google Staff Engineer profile |
| **Admin** | `admin@interviewpro.com` | `test@1234` | Platform operations manager |

*All seeded emails are pre-verified for instant access.*

---

## ⚙️ Project Verification Checklist
* Run PHPUnit Feature Tests:
  ```bash
  cd backend
  vendor/bin/phpunit
  ```
* Dynamic criteria are documented inside [docs/test_criteria.md](file:///home/boni/Desktop/moc/docs/test_criteria.md).
* Seed credentials details can be found inside [docs/cadential.md](file:///home/boni/Desktop/moc/docs/cadential.md).
