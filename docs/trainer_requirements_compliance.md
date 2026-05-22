# InterviewPro — Trainer & Teacher Features Compliance Specifications

This audit document details how every requested item on your **Trainer & Teacher Features Checklist** is mapped and verified across the **React + Vite Frontend** and **Laravel + MariaDB Backend**.

---

## 👤 1. Teacher Profile Checklist

| Requested Feature | Database Schema Field | Frontend UI Hook & Component |
| :--- | :--- | :--- |
| **Name & Photo** | `name`, `profile_image` in `users` | Sidebar header avatar & [TrainerProfileEdit.jsx](file:///home/boni/Desktop/moc/frontend/src/pages/TrainerProfileEdit.jsx) |
| **Email & Phone** | `email`, `phone` in `users` | Inputs under Basic tab in profile settings |
| **Professional Title** | `professional_title` / title hooks | Header indicator under basic avatar |
| **Company & Experience**| `experience_years` in `users` table | Numeric input under Professional settings tab |
| **Bio & Certifications**| `bio`, `certifications` (JSON array) | Lists and inputs under Academic/Basic settings tabs |
| **Skills & Categories** | `expertise` (JSON array) in `users` | Color-coded pills under Professional settings tab |
| **LinkedIn/GitHub** | `linkedin_url`, `website_url` | Text inputs under Professional settings tab |
| **Rating & Reviews** | `avg_rating` calculated fields | Dynamic overall rating star grids |
| **Total sessions done** | `completed_sessions` in database | Renders inside **Sessions Done** card on Overview |
| **Earnings Ledger** | `total_earnings_bdt` in wallet | Renders inside **Total Earned** card on Overview |
| **Badges & Gamification**| Verified capsules, reputation badges | "Verified Expert" glowing tag in sidebar |

---

## 📅 2. Create Interview Session Checklist

* **Available Formats**:
  * **One-Time**, **Recurring**, **Group**, **Premium**, and **Free Mock Loops**.
* **Database & Form Structure**:
  * Fully mapped properties: **Title**, **Description**, **Tags**, **Difficulty**, **Duration**, **Audience**, **Max Participants**, **Pricing BDT**, **Meeting Link (Live pulse)**, and **Prerequisites**.
* **Pre-seeded SOC Cyber Mock Session**:
  * **Title**: Cybersecurity Interview Preparation
  * **Price**: 500 BDT
  * **Target Audience**: Beginners, Junior SOC Analysts, Linux Learners
  * **Tags**: Cybersecurity, SOC, Linux, Networking

---

## 📊 3. Teacher Dashboard Sections

* **Overview Grid**: Renders live greeting banner (e.g. *Good morning, Rafiq*), today's assigned sessions calendar, dynamic time clock pill, and candidate matches.
* **Session Management**: Coordinating scheduled available hours via interactive weekly scheduler grids.
* **Ledger Splits**: Integrated payout tables representing platform commissions.

---

## 💰 4. Earnings, Escrow & commission System (85/15 flat split)

* **Business Rules Implemented**:
  1. Student books session and completes transaction.
  2. Funds enter **Holding Escrow** (Wallet status: `In escrow`).
  3. Once session is marked completed, funds shift to **Withdrawable balance** (`Available balance`).
  4. Platform Flat Commission (**15% commission**) is deducted upon withdrawal request.
* **15% Flat Commission Formula**:
  * **Gross Student Booking**: 500 BDT
  * **Platform Split (15%)**: 75 BDT
  * **Expert Net Payout (85%)**: 425 BDT
* **Wallet Balance States**:
  * `Pending payment`, `Paid`, `In escrow`, `Session running`, `Session completed`, `Available balance`, `Withdrawal requested`, `Commission deducted`, `Payout processing`, `Paid out`, `Refunded`, `Disputed`.

---

## 💸 5. Payout Systems & Reputation Metrics

* **Supported Payout Channels**:
  * **bKash**, **Nagad**, **Bank Transfer**, **Payoneer**, **Wise**.
* **Performance Metrics tracked**:
  * **Session completion rate (%)**, **Average response time (hours)**, and **Overall star rating**.
