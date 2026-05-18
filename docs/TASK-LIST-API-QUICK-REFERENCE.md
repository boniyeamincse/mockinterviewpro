# Task List API - Quick Reference

**API Base URL:** `http://localhost:8001/api`  
**Authentication:** JWT Bearer Token  
**Content-Type:** `application/json`

---

## 🚀 Quick Start

### 1. Authenticate
```bash
curl -X POST http://localhost:8001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
```

**Response:**
```json
{
  "data": {
    "access_token": "eyJhbGc...",
    "token_type": "Bearer",
    "expires_in": 3600
  }
}
```

### 2. Use Token in Requests
```bash
curl -X GET http://localhost:8001/api/tasks \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 📋 Task Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/tasks` | Create task |
| GET | `/tasks` | List tasks |
| GET | `/tasks/{id}` | Get task details |
| PUT | `/tasks/{id}` | Update task |
| DELETE | `/tasks/{id}` | Delete task |
| PUT | `/tasks/{id}/progress` | Update progress |
| GET | `/tasks/stats` | Get statistics |
| POST | `/tasks/bulk/update` | Update multiple |
| POST | `/tasks/bulk/delete` | Delete multiple |

---

## 🎨 Category Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/tasks/categories` | Create category |
| GET | `/tasks/categories` | List categories |
| GET | `/tasks/categories/{id}` | Get category |
| PUT | `/tasks/categories/{id}` | Update category |
| DELETE | `/tasks/categories/{id}` | Delete category |

---

## ✅ Checklist Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/tasks/{id}/checklist` | Add item |
| PUT | `/tasks/{id}/checklist/{item}` | Update item |
| DELETE | `/tasks/{id}/checklist/{item}` | Delete item |

---

## 🔍 Query Parameters

### Filtering Tasks
```bash
?status=pending              # pending, in_progress, completed
?priority=high               # high, medium, low
?category_id=1               # Filter by category
?session_id=5                # Filter by session
?my_tasks=true               # Only current user's tasks
```

### Searching
```bash
?search=behavioral           # Search title/description
?sort_by=due_date            # created_at, due_date, priority, title
?sort_order=asc              # asc or desc
```

### Pagination
```bash
?page=1                      # Page number
?per_page=15                 # Items per page (max 100)
```

---

## 📝 Request Examples

### Create Task
```bash
curl -X POST http://localhost:8001/api/tasks \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Practice questions",
    "description": "Prepare for interview",
    "priority": "high",
    "due_date": "2026-05-25",
    "estimated_hours": 2.5,
    "category_id": 1,
    "tags": ["preparation", "interview"]
  }'
```

### List Tasks
```bash
curl -X GET "http://localhost:8001/api/tasks?status=pending&priority=high&sort_by=due_date" \
  -H "Authorization: Bearer TOKEN"
```

### Update Task
```bash
curl -X PUT http://localhost:8001/api/tasks/1 \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "in_progress",
    "priority": "medium"
  }'
```

### Update Progress
```bash
curl -X PUT http://localhost:8001/api/tasks/1/progress \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "progress_percentage": 75,
    "actual_hours": 2.0
  }'
```

### Add Checklist Item
```bash
curl -X POST http://localhost:8001/api/tasks/1/checklist \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Review materials",
    "order": 1
  }'
```

### Get Statistics
```bash
curl -X GET http://localhost:8001/api/tasks/stats \
  -H "Authorization: Bearer TOKEN"
```

---

## 💾 Task Fields

| Field | Type | Required | Example |
|-------|------|----------|---------|
| title | string | ✅ | "Practice questions" |
| description | string | | "Prepare STAR answers" |
| priority | enum | | high, medium, low |
| status | enum | | pending, in_progress, completed |
| due_date | date | | 2026-05-25 |
| estimated_hours | decimal | | 2.5 |
| actual_hours | decimal | | 1.5 |
| category_id | integer | | 1 |
| session_id | integer | | 5 |
| tags | array | | ["prep", "interview"] |
| progress_percentage | integer | | 0-100 |

---

## 🏷️ Priority Levels

```
HIGH    → #FF5733 (Red)        - Urgent tasks
MEDIUM  → #FFC300 (Orange)     - Normal priority
LOW     → #28A745 (Green)      - Can wait
```

---

## 📊 Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Success |
| 201 | Created - New resource |
| 400 | Bad Request - Invalid data |
| 401 | Unauthorized - No token |
| 403 | Forbidden - No permission |
| 404 | Not Found - Resource missing |
| 422 | Validation Error |
| 429 | Rate Limited |
| 500 | Server Error |

---

## 🔒 Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    "id": 1,
    "title": "Task title",
    "status": "pending"
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "title": ["Title is required"]
  },
  "code": "VALIDATION_ERROR"
}
```

---

## 🎯 Common Queries

### Get All Pending High-Priority Tasks
```bash
http://localhost:8001/api/tasks?status=pending&priority=high
```

### Search for Behavioral Questions
```bash
http://localhost:8001/api/tasks?search=behavioral&my_tasks=true
```

### Get Tasks Due This Week (Sorted by Date)
```bash
http://localhost:8001/api/tasks?sort_by=due_date&sort_order=asc
```

### Get Completed Tasks (Page 2, 20 per page)
```bash
http://localhost:8001/api/tasks?status=completed&page=2&per_page=20
```

---

## 🛠️ Helper Commands

### Setup
```bash
cd /home/boni/Desktop/moc/backend
php artisan migrate              # Run migrations
php artisan serve               # Start server
```

### Testing
```bash
# Get current tasks
curl http://localhost:8001/api/tasks -H "Authorization: Bearer TOKEN"

# Count tasks
curl http://localhost:8001/api/tasks/stats -H "Authorization: Bearer TOKEN"
```

### Database
```sql
-- View all tasks
SELECT * FROM tasks;

-- View task statistics
SELECT status, COUNT(*) FROM tasks GROUP BY status;

-- Find overdue tasks
SELECT * FROM tasks WHERE due_date < NOW() AND status != 'completed';
```

---

## 🔗 Related Documentation

- **Full API Docs:** `TASK-LIST-API-DOCUMENTATION.md`
- **Setup Guide:** `TASK-LIST-API-SETUP.md`
- **Architecture:** `architecture.md`
- **Project Index:** `README.md`

---

## 📞 Support

For detailed documentation, see:
- `/home/boni/Desktop/moc/docs/TASK-LIST-API-DOCUMENTATION.md`
- `/home/boni/Desktop/moc/docs/TASK-LIST-API-SETUP.md`

---

*Last Updated: May 18, 2026*  
*Quick Reference v1.0*
