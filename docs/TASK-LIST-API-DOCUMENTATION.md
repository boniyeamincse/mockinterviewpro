# Task List API Documentation

**Version:** 1.0  
**Base URL:** `http://localhost:8001/api`  
**Authentication:** JWT Bearer Token  
**Last Updated:** May 18, 2026

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Authentication](#authentication)
3. [Endpoints](#endpoints)
   - [Task Management](#task-management)
   - [Task Categories](#task-categories)
   - [Task Progress](#task-progress)
4. [Response Formats](#response-formats)
5. [Error Handling](#error-handling)
6. [Rate Limiting](#rate-limiting)
7. [Examples](#examples)

---

## Overview

The Task List API manages preparation tasks, session planning tasks, and learning objectives. It allows students and trainers to:

- Create and manage tasks
- Track task progress
- Organize tasks by categories
- Set priorities and deadlines
- Share tasks with other users
- Archive completed tasks

### Use Cases

1. **Student Preparation:** Track tasks needed before a mock interview session
2. **Trainer Planning:** Create task templates for common preparation areas
3. **Session Planning:** Link tasks to specific interview sessions
4. **Progress Tracking:** Monitor student preparation progress

---

## Authentication

All endpoints require JWT Bearer token authentication.

### Header Format
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Getting a Token

```bash
curl -X POST http://localhost:8001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

Response:
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "token_type": "Bearer",
    "expires_in": 3600,
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
}
```

---

## Endpoints

### Task Management

#### 1. Create Task
**Create a new task**

- **Method:** `POST`
- **Endpoint:** `/tasks`
- **Authentication:** Required
- **Role:** Student, Trainer, Admin

##### Request Body

```json
{
  "title": "Practice common behavioral questions",
  "description": "Prepare answers for STAR method questions",
  "category_id": 1,
  "priority": "high",
  "due_date": "2026-05-25",
  "session_id": 5,
  "estimated_hours": 2.5,
  "status": "pending",
  "tags": ["preparation", "behavioral"]
}
```

##### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| title | string | Yes | Task title (max 255 chars) |
| description | string | No | Detailed task description |
| category_id | integer | No | Task category ID |
| priority | string | No | Priority level: `low`, `medium`, `high` (default: `medium`) |
| due_date | date | No | Task due date (format: YYYY-MM-DD) |
| session_id | integer | No | Link to session ID |
| estimated_hours | decimal | No | Estimated time needed (in hours) |
| status | string | No | Task status: `pending`, `in_progress`, `completed` (default: `pending`) |
| tags | array | No | Tags for categorization |

##### Response (201 Created)

```json
{
  "success": true,
  "message": "Task created successfully",
  "data": {
    "id": 42,
    "user_id": 1,
    "title": "Practice common behavioral questions",
    "description": "Prepare answers for STAR method questions",
    "category_id": 1,
    "priority": "high",
    "due_date": "2026-05-25",
    "session_id": 5,
    "estimated_hours": 2.5,
    "status": "pending",
    "tags": ["preparation", "behavioral"],
    "created_at": "2026-05-18T10:30:00Z",
    "updated_at": "2026-05-18T10:30:00Z"
  }
}
```

##### Example cURL

```bash
curl -X POST http://localhost:8001/api/tasks \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Practice common behavioral questions",
    "description": "Prepare answers for STAR method questions",
    "category_id": 1,
    "priority": "high",
    "due_date": "2026-05-25",
    "estimated_hours": 2.5
  }'
```

---

#### 2. List Tasks
**Get list of tasks with filtering and pagination**

- **Method:** `GET`
- **Endpoint:** `/tasks`
- **Authentication:** Required
- **Role:** Student, Trainer, Admin

##### Query Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| page | integer | 1 | Page number for pagination |
| per_page | integer | 15 | Items per page (max: 100) |
| status | string | - | Filter by status: `pending`, `in_progress`, `completed` |
| priority | string | - | Filter by priority: `low`, `medium`, `high` |
| category_id | integer | - | Filter by category ID |
| session_id | integer | - | Filter by session ID |
| sort_by | string | `created_at` | Sort field: `created_at`, `due_date`, `priority`, `title` |
| sort_order | string | `desc` | Sort order: `asc`, `desc` |
| search | string | - | Search in title and description |
| my_tasks | boolean | false | Show only current user's tasks |

##### Response (200 OK)

```json
{
  "success": true,
  "message": "Tasks retrieved successfully",
  "data": [
    {
      "id": 42,
      "user_id": 1,
      "title": "Practice common behavioral questions",
      "description": "Prepare answers for STAR method questions",
      "category_id": 1,
      "priority": "high",
      "due_date": "2026-05-25",
      "session_id": 5,
      "estimated_hours": 2.5,
      "status": "pending",
      "tags": ["preparation", "behavioral"],
      "created_at": "2026-05-18T10:30:00Z",
      "updated_at": "2026-05-18T10:30:00Z"
    },
    {
      "id": 41,
      "user_id": 1,
      "title": "Research company background",
      "description": "Learn about company history and values",
      "category_id": 2,
      "priority": "medium",
      "due_date": "2026-05-23",
      "session_id": 5,
      "estimated_hours": 1.5,
      "status": "in_progress",
      "tags": ["research"],
      "created_at": "2026-05-17T14:20:00Z",
      "updated_at": "2026-05-18T09:15:00Z"
    }
  ],
  "pagination": {
    "current_page": 1,
    "per_page": 15,
    "total": 42,
    "last_page": 3
  }
}
```

##### Example cURL

```bash
# Get all pending tasks sorted by due date
curl -X GET "http://localhost:8001/api/tasks?status=pending&sort_by=due_date&sort_order=asc" \
  -H "Authorization: Bearer {token}"

# Search tasks
curl -X GET "http://localhost:8001/api/tasks?search=behavioral&my_tasks=true" \
  -H "Authorization: Bearer {token}"

# Filter by session
curl -X GET "http://localhost:8001/api/tasks?session_id=5&sort_by=priority" \
  -H "Authorization: Bearer {token}"
```

---

#### 3. Get Task Details
**Retrieve detailed information about a specific task**

- **Method:** `GET`
- **Endpoint:** `/tasks/{id}`
- **Authentication:** Required
- **Role:** Task owner, Trainer, Admin

##### Parameters

| Parameter | Type | Location | Description |
|-----------|------|----------|-------------|
| id | integer | URL | Task ID |

##### Response (200 OK)

```json
{
  "success": true,
  "message": "Task retrieved successfully",
  "data": {
    "id": 42,
    "user_id": 1,
    "title": "Practice common behavioral questions",
    "description": "Prepare answers for STAR method questions",
    "category_id": 1,
    "priority": "high",
    "due_date": "2026-05-25",
    "session_id": 5,
    "estimated_hours": 2.5,
    "actual_hours": 1.5,
    "status": "in_progress",
    "tags": ["preparation", "behavioral"],
    "progress_percentage": 60,
    "checklist_items": [
      {
        "id": 1,
        "title": "Review STAR method",
        "completed": true,
        "order": 1
      },
      {
        "id": 2,
        "title": "Write down example stories",
        "completed": false,
        "order": 2
      }
    ],
    "attachments": [
      {
        "id": 1,
        "filename": "star-method-guide.pdf",
        "url": "/storage/tasks/attachments/star-method-guide.pdf",
        "size": 2048000,
        "uploaded_at": "2026-05-18T10:30:00Z"
      }
    ],
    "created_at": "2026-05-18T10:30:00Z",
    "updated_at": "2026-05-18T11:45:00Z",
    "completed_at": null
  }
}
```

##### Example cURL

```bash
curl -X GET http://localhost:8001/api/tasks/42 \
  -H "Authorization: Bearer {token}"
```

---

#### 4. Update Task
**Update an existing task**

- **Method:** `PUT`
- **Endpoint:** `/tasks/{id}`
- **Authentication:** Required
- **Role:** Task owner, Admin

##### Request Body

```json
{
  "title": "Practice common behavioral questions",
  "description": "Prepare answers for STAR method questions - Updated",
  "status": "in_progress",
  "priority": "high",
  "due_date": "2026-05-25",
  "estimated_hours": 3,
  "tags": ["preparation", "behavioral", "updated"]
}
```

##### Response (200 OK)

```json
{
  "success": true,
  "message": "Task updated successfully",
  "data": {
    "id": 42,
    "user_id": 1,
    "title": "Practice common behavioral questions",
    "description": "Prepare answers for STAR method questions - Updated",
    "status": "in_progress",
    "priority": "high",
    "due_date": "2026-05-25",
    "estimated_hours": 3,
    "tags": ["preparation", "behavioral", "updated"],
    "updated_at": "2026-05-18T12:00:00Z"
  }
}
```

##### Example cURL

```bash
curl -X PUT http://localhost:8001/api/tasks/42 \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "in_progress",
    "estimated_hours": 3
  }'
```

---

#### 5. Delete Task
**Delete a task**

- **Method:** `DELETE`
- **Endpoint:** `/tasks/{id}`
- **Authentication:** Required
- **Role:** Task owner, Admin

##### Response (200 OK)

```json
{
  "success": true,
  "message": "Task deleted successfully",
  "data": null
}
```

##### Example cURL

```bash
curl -X DELETE http://localhost:8001/api/tasks/42 \
  -H "Authorization: Bearer {token}"
```

---

#### 6. Bulk Update Tasks
**Update multiple tasks at once**

- **Method:** `POST`
- **Endpoint:** `/tasks/bulk/update`
- **Authentication:** Required
- **Role:** Student, Trainer, Admin

##### Request Body

```json
{
  "task_ids": [42, 41, 40],
  "status": "completed",
  "priority": "low"
}
```

##### Response (200 OK)

```json
{
  "success": true,
  "message": "3 tasks updated successfully",
  "data": {
    "updated": 3,
    "failed": 0
  }
}
```

---

#### 7. Bulk Delete Tasks
**Delete multiple tasks**

- **Method:** `POST`
- **Endpoint:** `/tasks/bulk/delete`
- **Authentication:** Required
- **Role:** Task owner, Admin

##### Request Body

```json
{
  "task_ids": [42, 41, 40]
}
```

##### Response (200 OK)

```json
{
  "success": true,
  "message": "3 tasks deleted successfully",
  "data": {
    "deleted": 3
  }
}
```

---

### Task Categories

#### 1. Create Category
**Create a new task category**

- **Method:** `POST`
- **Endpoint:** `/tasks/categories`
- **Authentication:** Required
- **Role:** Trainer, Admin

##### Request Body

```json
{
  "name": "Behavioral Questions",
  "description": "Category for behavioral interview prep",
  "color": "#FF5733",
  "icon": "star"
}
```

##### Response (201 Created)

```json
{
  "success": true,
  "message": "Category created successfully",
  "data": {
    "id": 1,
    "name": "Behavioral Questions",
    "description": "Category for behavioral interview prep",
    "color": "#FF5733",
    "icon": "star",
    "created_at": "2026-05-18T10:30:00Z"
  }
}
```

---

#### 2. List Categories
**Get all task categories**

- **Method:** `GET`
- **Endpoint:** `/tasks/categories`
- **Authentication:** Required

##### Query Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| page | integer | Page number (default: 1) |
| per_page | integer | Items per page (default: 50) |

##### Response (200 OK)

```json
{
  "success": true,
  "message": "Categories retrieved successfully",
  "data": [
    {
      "id": 1,
      "name": "Behavioral Questions",
      "description": "Category for behavioral interview prep",
      "color": "#FF5733",
      "icon": "star",
      "task_count": 15,
      "created_at": "2026-05-18T10:30:00Z"
    },
    {
      "id": 2,
      "name": "Technical Preparation",
      "description": "Technical skill development",
      "color": "#3498DB",
      "icon": "code",
      "task_count": 8,
      "created_at": "2026-05-18T10:30:00Z"
    }
  ],
  "pagination": {
    "current_page": 1,
    "per_page": 50,
    "total": 2,
    "last_page": 1
  }
}
```

---

#### 3. Update Category
**Update a category**

- **Method:** `PUT`
- **Endpoint:** `/tasks/categories/{id}`
- **Authentication:** Required
- **Role:** Admin

##### Response (200 OK)

```json
{
  "success": true,
  "message": "Category updated successfully",
  "data": {
    "id": 1,
    "name": "Behavioral Questions",
    "updated_at": "2026-05-18T12:00:00Z"
  }
}
```

---

#### 4. Delete Category
**Delete a category**

- **Method:** `DELETE`
- **Endpoint:** `/tasks/categories/{id}`
- **Authentication:** Required
- **Role:** Admin

##### Response (200 OK)

```json
{
  "success": true,
  "message": "Category deleted successfully"
}
```

---

### Task Progress

#### 1. Update Task Progress
**Update task progress percentage and hours**

- **Method:** `PUT`
- **Endpoint:** `/tasks/{id}/progress`
- **Authentication:** Required
- **Role:** Task owner

##### Request Body

```json
{
  "progress_percentage": 75,
  "actual_hours": 2.5,
  "notes": "Working on example stories"
}
```

##### Response (200 OK)

```json
{
  "success": true,
  "message": "Progress updated successfully",
  "data": {
    "id": 42,
    "progress_percentage": 75,
    "actual_hours": 2.5,
    "status": "in_progress",
    "updated_at": "2026-05-18T14:30:00Z"
  }
}
```

---

#### 2. Get Task Stats
**Get task statistics and analytics**

- **Method:** `GET`
- **Endpoint:** `/tasks/stats`
- **Authentication:** Required

##### Query Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| session_id | integer | Filter stats by session |
| date_from | date | Start date (YYYY-MM-DD) |
| date_to | date | End date (YYYY-MM-DD) |

##### Response (200 OK)

```json
{
  "success": true,
  "message": "Stats retrieved successfully",
  "data": {
    "total_tasks": 42,
    "pending_tasks": 10,
    "in_progress_tasks": 15,
    "completed_tasks": 17,
    "total_hours": 85.5,
    "completed_hours": 42.3,
    "average_completion_rate": 68.5,
    "high_priority_tasks": 8,
    "overdue_tasks": 3,
    "tasks_due_today": 2,
    "tasks_due_this_week": 12
  }
}
```

---

#### 3. Add Checklist Item
**Add item to task checklist**

- **Method:** `POST`
- **Endpoint:** `/tasks/{id}/checklist`
- **Authentication:** Required
- **Role:** Task owner

##### Request Body

```json
{
  "title": "Write down example stories",
  "order": 2
}
```

##### Response (201 Created)

```json
{
  "success": true,
  "message": "Checklist item added successfully",
  "data": {
    "id": 2,
    "task_id": 42,
    "title": "Write down example stories",
    "completed": false,
    "order": 2,
    "created_at": "2026-05-18T14:30:00Z"
  }
}
```

---

#### 4. Update Checklist Item
**Mark checklist item as complete/incomplete**

- **Method:** `PUT`
- **Endpoint:** `/tasks/{task_id}/checklist/{item_id}`
- **Authentication:** Required

##### Request Body

```json
{
  "completed": true
}
```

##### Response (200 OK)

```json
{
  "success": true,
  "message": "Checklist item updated",
  "data": {
    "id": 2,
    "task_id": 42,
    "title": "Write down example stories",
    "completed": true,
    "updated_at": "2026-05-18T14:45:00Z"
  }
}
```

---

#### 5. Delete Checklist Item
**Remove checklist item**

- **Method:** `DELETE`
- **Endpoint:** `/tasks/{task_id}/checklist/{item_id}`
- **Authentication:** Required

##### Response (200 OK)

```json
{
  "success": true,
  "message": "Checklist item deleted"
}
```

---

## Response Formats

### Success Response (200, 201)

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Response data here
  }
}
```

### Error Response (400, 401, 403, 404, 500)

```json
{
  "success": false,
  "message": "Error message describing what went wrong",
  "errors": {
    "field_name": ["Error detail for this field"]
  },
  "code": "ERROR_CODE"
}
```

---

## Error Handling

### HTTP Status Codes

| Code | Status | Description |
|------|--------|-------------|
| 200 | OK | Request successful |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Invalid request parameters |
| 401 | Unauthorized | Missing or invalid authentication token |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 422 | Unprocessable Entity | Validation error |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Server Error | Internal server error |

### Common Errors

#### Authentication Error
```json
{
  "success": false,
  "message": "Unauthenticated",
  "code": "UNAUTHENTICATED"
}
```

#### Authorization Error
```json
{
  "success": false,
  "message": "Unauthorized to perform this action",
  "code": "UNAUTHORIZED"
}
```

#### Validation Error
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "title": ["Title is required"],
    "due_date": ["Due date must be a valid date"]
  },
  "code": "VALIDATION_ERROR"
}
```

#### Not Found Error
```json
{
  "success": false,
  "message": "Task not found",
  "code": "NOT_FOUND"
}
```

---

## Rate Limiting

### Limits

- **Anonymous requests:** 60 requests per minute
- **Authenticated requests:** 300 requests per minute
- **Bulk operations:** 30 operations per minute

### Rate Limit Headers

```
X-RateLimit-Limit: 300
X-RateLimit-Remaining: 299
X-RateLimit-Reset: 1234567890
```

### Rate Limit Exceeded

```json
{
  "success": false,
  "message": "Rate limit exceeded. Please retry after 60 seconds",
  "code": "RATE_LIMIT_EXCEEDED"
}
```

---

## Examples

### Complete Workflow Example

#### 1. Create a Task Category
```bash
curl -X POST http://localhost:8001/api/tasks/categories \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Behavioral Questions",
    "description": "Behavioral interview preparation",
    "color": "#FF5733",
    "icon": "star"
  }'
```

#### 2. Create a Task
```bash
curl -X POST http://localhost:8001/api/tasks \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Practice behavioral questions",
    "description": "Prepare STAR method answers",
    "category_id": 1,
    "priority": "high",
    "due_date": "2026-05-25",
    "estimated_hours": 2.5
  }'
```

#### 3. Add Checklist Items
```bash
curl -X POST http://localhost:8001/api/tasks/42/checklist \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Review STAR method",
    "order": 1
  }'
```

#### 4. Update Progress
```bash
curl -X PUT http://localhost:8001/api/tasks/42/progress \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "progress_percentage": 50,
    "actual_hours": 1.2
  }'
```

#### 5. Get Stats
```bash
curl -X GET http://localhost:8001/api/tasks/stats \
  -H "Authorization: Bearer {token}"
```

---

### Advanced Query Examples

#### Filter by Multiple Criteria
```bash
curl -X GET "http://localhost:8001/api/tasks?status=in_progress&priority=high&sort_by=due_date&sort_order=asc&page=1&per_page=20" \
  -H "Authorization: Bearer {token}"
```

#### Search with Pagination
```bash
curl -X GET "http://localhost:8001/api/tasks?search=behavioral&my_tasks=true&page=2&per_page=10" \
  -H "Authorization: Bearer {token}"
```

#### Export to CSV (Future Enhancement)
```bash
curl -X GET "http://localhost:8001/api/tasks/export?format=csv&status=completed" \
  -H "Authorization: Bearer {token}" \
  -o tasks.csv
```

---

## Webhooks (Future Enhancement)

### Event Types

- `task.created` - Task created
- `task.updated` - Task updated
- `task.completed` - Task marked as completed
- `task.deleted` - Task deleted
- `task.progress_updated` - Task progress changed

---

## Pagination

All list endpoints support pagination with the following parameters:

| Parameter | Type | Default | Max |
|-----------|------|---------|-----|
| page | integer | 1 | - |
| per_page | integer | 15 | 100 |

### Pagination Response
```json
{
  "pagination": {
    "current_page": 1,
    "per_page": 15,
    "total": 42,
    "last_page": 3,
    "from": 1,
    "to": 15
  }
}
```

---

## Sorting

Supported sort fields:
- `created_at` (default)
- `updated_at`
- `due_date`
- `priority`
- `title`
- `status`
- `progress_percentage`

Sort order: `asc` or `desc` (default: `desc`)

---

## Filtering

### By Status
```
?status=pending
?status=in_progress
?status=completed
```

### By Priority
```
?priority=low
?priority=medium
?priority=high
```

### By Date Range
```
?date_from=2026-05-01&date_to=2026-05-31
```

### Combination
```
?status=pending&priority=high&category_id=1&sort_by=due_date
```

---

## Field Validation

### Title
- Required
- String
- Max length: 255 characters
- Min length: 3 characters

### Description
- Optional
- String
- Max length: 5000 characters

### Priority
- Optional
- Enum: `low`, `medium`, `high`
- Default: `medium`

### Status
- Optional
- Enum: `pending`, `in_progress`, `completed`
- Default: `pending`

### Due Date
- Optional
- Date format: YYYY-MM-DD
- Must be today or in the future

### Estimated Hours
- Optional
- Decimal
- Min: 0.5
- Max: 1000

### Tags
- Optional
- Array of strings
- Max 10 tags per task

---

## Best Practices

1. **Authentication:** Always include the Authorization header with a valid JWT token
2. **Rate Limiting:** Implement exponential backoff for rate limit errors
3. **Pagination:** Use reasonable page sizes (15-50 items)
4. **Filtering:** Combine filters to reduce response size
5. **Caching:** Cache category lists as they change infrequently
6. **Error Handling:** Check for error codes and handle appropriately
7. **Timeouts:** Set appropriate request timeouts (30 seconds recommended)
8. **Compression:** Request gzip compression with Accept-Encoding header

---

## SDK/Client Libraries

### JavaScript/Node.js
```javascript
const axios = require('axios');

const client = axios.create({
  baseURL: 'http://localhost:8001/api',
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

// Create task
const task = await client.post('/tasks', {
  title: 'Practice questions',
  priority: 'high'
});

// List tasks
const tasks = await client.get('/tasks?status=pending');

// Update task
const updated = await client.put(`/tasks/${task.id}`, {
  status: 'completed'
});
```

### Python
```python
import requests

headers = {'Authorization': f'Bearer {token}'}

# Create task
response = requests.post(
  'http://localhost:8001/api/tasks',
  json={'title': 'Practice questions', 'priority': 'high'},
  headers=headers
)

# List tasks
response = requests.get(
  'http://localhost:8001/api/tasks?status=pending',
  headers=headers
)
```

---

## Versioning

Current API version: **v1**

Future versions will be available at:
- `/api/v2/tasks`
- `/api/v3/tasks`

---

## Support & Documentation

- **API Base:** http://localhost:8001
- **Documentation:** /docs/TASK-LIST-API-DOCUMENTATION.md
- **Status Page:** http://localhost:8001/status
- **Support Email:** support@mocinterviewplatform.com

---

*Last Updated: May 18, 2026*  
*API Version: 1.0*  
*Status: Production Ready ✅*
