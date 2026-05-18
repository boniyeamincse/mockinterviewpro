# InterviewPro — Backend API Specifications & Payload Contracts

This document contains the complete technical specifications and contract guidelines for consuming the **InterviewPro Laravel Backend API**. All endpoints are mapped to resolve requests securely, preserve data structure consistency, and comply with MariaDB relational schemas.

---

## 🔒 1. Base URL & Authentication

* **Base URL**: `http://localhost:8001/api`
* **Protocol**: HTTPS (Production) / HTTP (Local Development)
* **Auth Driver**: Laravel Sanctum (Token-Based Bearer Auth)
* **Header Contract**:
  ```http
  Accept: application/json
  Content-Type: application/json
  Authorization: Bearer <your_access_token_here>
  ```

---

## 🔑 2. Authentication & Profile Management

### A. Register New User
Creates a clean, active user account in the system database.

* **Endpoint**: `POST /auth/register`
* **Request Payload**:
  ```json
  {
    "name": "Rafiq Islam",
    "email": "rafiq@interviewpro.com",
    "password": "test@1234",
    "password_confirmation": "test@1234",
    "user_type": "trainer",
    "phone": "+8801700000000"
  }
  ```
* **Response Contract (`201 Created`)**:
  ```json
  {
    "success": true,
    "message": "User registered successfully",
    "data": {
      "user": {
        "id": 12,
        "name": "Rafiq Islam",
        "email": "rafiq@interviewpro.com",
        "user_type": "trainer",
        "is_active": true,
        "email_verified_at": null,
        "profile_image": null
      },
      "access_token": "1|qXyZ...",
      "token_type": "Bearer"
    }
  }
  ```

---

### B. Authenticate / Login User
Validates password hashes and updates the user's login timestamp.

* **Endpoint**: `POST /auth/login`
* **Request Payload**:
  ```json
  {
    "email": "trainer@interviewpro.com",
    "password": "test@1234"
  }
  ```
* **Response Contract (`200 OK`)**:
  ```json
  {
    "success": true,
    "message": "Login successful",
    "data": {
      "user": {
        "id": 2,
        "name": "Michael Chang",
        "email": "trainer@interviewpro.com",
        "user_type": "trainer",
        "is_active": true,
        "email_verified_at": "2026-05-18T08:00:00.000000Z",
        "profile_image": null
      },
      "access_token": "2|pTqX...",
      "token_type": "Bearer"
    }
  }
  ```

---

### C. Get Current Authenticated User
Fetches active session states, dynamic login flags, and token scopes.

* **Endpoint**: `GET /auth/me`
* **Headers**: `Authorization: Bearer <token>`
* **Response Contract (`200 OK`)**:
  ```json
  {
    "success": true,
    "message": "User retrieved successfully",
    "data": {
      "id": 2,
      "name": "Michael Chang",
      "email": "trainer@interviewpro.com",
      "user_type": "trainer",
      "is_active": true,
      "bio": "Ex-Google Staff Software Engineer",
      "last_login_at": "2026-05-18T09:25:00.000000Z",
      "permissions": ["view_dashboard", "manage_slots", "submit_feedback"]
    }
  }
  ```

---

### D. Update Profile Fields (Extended Candidate Fields)
Provides full update capabilities for candidate profiles, reflecting the extended schema migration attributes.

* **Endpoint**: `PUT /auth/profile`
* **Headers**: `Authorization: Bearer <token>`
* **Request Payload**:
  ```json
  {
    "name": "Boni Yeamin",
    "phone": "+8801812345678",
    "gender": "Male",
    "birthday": "2000-01-01",
    "academic_inst": "Bangladesh University of Engineering and Technology (BUET)",
    "academic_degree": "B.Sc. in Computer Science & Engineering",
    "academic_grad_year": 2023,
    "interests": "React.js, Golang, High-Concurrency APIs",
    "goals": "Full Stack Infrastructure Architect",
    "career_goal": "Senior Engineer"
  }
  ```
* **Response Contract (`200 OK`)**:
  ```json
  {
    "success": true,
    "message": "Profile updated successfully",
    "data": {
      "id": 1,
      "name": "Boni Yeamin",
      "email": "boniyeamin.cse1@gmail.com",
      "gender": "Male",
      "academic_inst": "Bangladesh University of Engineering and Technology (BUET)",
      "academic_degree": "B.Sc. in Computer Science & Engineering",
      "academic_grad_year": 2023,
      "interests": "React.js, Golang, High-Concurrency APIs"
    }
  }
  ```

---

## 📊 3. Tasks & Preparation Management

Allows candidates to coordinate operational tasks, checklist items, and milestones.

### A. List Candidates Tasks
* **Endpoint**: `GET /tasks`
* **Headers**: `Authorization: Bearer <token>`
* **Response Contract (`200 OK`)**:
  ```json
  {
    "success": true,
    "data": [
      {
        "id": 101,
        "title": "Practice 5 High-Concurrency System Design loops",
        "progress": 80,
        "category": "System Design",
        "checklist_count": 5,
        "completed_checklist_count": 4
      }
    ]
  }
  ```

---

## 📅 4. Live Sessions & Calendar Matching

Provides CRUD handlers for mock session schedules and live class allocations.

### A. Create a Scheduled Session
* **Endpoint**: `POST /events`
* **Request Payload**:
  ```json
  {
    "candidate_id": 1,
    "trainer_id": 2,
    "topic": "System Design & Scalability Mock",
    "scheduled_at": "2026-05-18 16:00:00",
    "duration_minutes": 60,
    "booking_amount_bdt": 15000.00
  }
  ```
* **Response Contract (`201 Created`)**:
  ```json
  {
    "success": true,
    "message": "Session matched successfully",
    "data": {
      "id": 88,
      "topic": "System Design & Scalability Mock",
      "scheduled_at": "2026-05-18T16:00:00.000000Z",
      "escrow_status": "held",
      "booking_amount_bdt": 15000.00
    }
  }
  ```

---

## 💳 5. Escrow Commission Split Ledger Algorithm

To support secure booking deposits in escrow, the backend API enforces an automatic **85% / 15% ledger distribution split** upon session completion sign-off:

$$\text{Gross Deposit (BDT)} = \text{Held in Escrow}$$
$$\text{Platform Flat Commission (15\%)} = \text{platform\_balance} \leftarrow \text{Gross} \times 0.15$$
$$\text{Trainer Net Payout (85\%)} = \text{trainer\_balance} \leftarrow \text{Gross} \times 0.85$$

* **Trigger**:
  Invoking `PUT /events/{event}/status` with `{"status": "completed"}` locks the candidate feedback rubric and automatically triggers the financial escrow transaction.
