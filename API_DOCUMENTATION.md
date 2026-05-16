# API Documentation — Smart Leads Dashboard

Base URL: `http://localhost:5000/api`

All protected routes require the header:
```
Authorization: Bearer <token>
```

---

## Auth

### POST /auth/register
Register a new user.

**Request body:**
```json
{
  "name": "Rahul Sharma",
  "email": "rahul@example.com",
  "password": "secret123",
  "role": "sales"
}
```
- `role` is optional — defaults to `"sales"`. Accepted: `"admin"` | `"sales"`

**Response 201:**
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "664f...",
      "name": "Rahul Sharma",
      "email": "rahul@example.com",
      "role": "sales",
      "createdAt": "2026-05-16T10:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

**Error 409** — email already registered.

---

### POST /auth/login
Login with existing credentials.

**Request body:**
```json
{
  "email": "rahul@example.com",
  "password": "secret123"
}
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "user": { "_id": "...", "name": "Rahul Sharma", "email": "rahul@example.com", "role": "sales" },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

**Error 401** — invalid email or password.

---

### GET /auth/me
Get current authenticated user. 🔒

**Response 200:**
```json
{
  "success": true,
  "data": {
    "user": { "_id": "...", "name": "Rahul Sharma", "email": "rahul@example.com", "role": "sales" }
  }
}
```

---

## Leads

### GET /leads 🔒
Get paginated list of leads with optional filters.

**Query parameters:**

| Param | Type | Values | Default |
|-------|------|--------|---------|
| status | string | New, Contacted, Qualified, Lost | — |
| source | string | Website, Instagram, Referral | — |
| search | string | any | — |
| sort | string | latest, oldest | latest |
| page | number | any positive integer | 1 |
| limit | number | 1–100 | 10 |

**Example:**
```
GET /api/leads?status=Qualified&source=Instagram&search=rahul&sort=latest&page=1
```

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "664f...",
      "name": "Rahul Sharma",
      "email": "rahul@example.com",
      "status": "Qualified",
      "source": "Instagram",
      "createdAt": "2026-05-16T10:00:00.000Z",
      "updatedAt": "2026-05-16T10:00:00.000Z"
    }
  ],
  "meta": {
    "total": 42,
    "page": 1,
    "limit": 10,
    "totalPages": 5,
    "hasNext": true,
    "hasPrev": false
  }
}
```

---

### GET /leads/export 🔒
Export leads as a CSV file. Supports the same filters as GET /leads (except page/limit).

**Example:**
```
GET /api/leads/export?status=Qualified&source=Instagram
```

**Response:** CSV file download with headers:
```
Name, Email, Status, Source, Created At
```

---

### GET /leads/:id 🔒
Get a single lead by ID.

**Response 200:**
```json
{
  "success": true,
  "data": {
    "_id": "664f...",
    "name": "Rahul Sharma",
    "email": "rahul@example.com",
    "status": "Qualified",
    "source": "Instagram",
    "createdAt": "2026-05-16T10:00:00.000Z",
    "updatedAt": "2026-05-16T10:00:00.000Z"
  }
}
```

**Error 404** — lead not found.

---

### POST /leads 🔒
Create a new lead.

**Request body:**
```json
{
  "name": "Priya Mehta",
  "email": "priya@example.com",
  "status": "New",
  "source": "Website"
}
```
- `status` is optional — defaults to `"New"`
- `source` is required

**Response 201:**
```json
{
  "success": true,
  "data": {
    "_id": "664f...",
    "name": "Priya Mehta",
    "email": "priya@example.com",
    "status": "New",
    "source": "Website",
    "createdAt": "2026-05-16T10:00:00.000Z",
    "updatedAt": "2026-05-16T10:00:00.000Z"
  }
}
```

---

### PATCH /leads/:id 🔒
Update an existing lead. All fields are optional.

**Request body:**
```json
{
  "status": "Contacted",
  "source": "Referral"
}
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "_id": "664f...",
    "name": "Priya Mehta",
    "email": "priya@example.com",
    "status": "Contacted",
    "source": "Referral",
    "createdAt": "2026-05-16T10:00:00.000Z",
    "updatedAt": "2026-05-16T11:00:00.000Z"
  }
}
```

**Error 404** — lead not found.

---

### DELETE /leads/:id 🔒 Admin only
Delete a lead permanently.

**Response 200:**
```json
{
  "success": true,
  "message": "Lead deleted successfully"
}
```

**Error 403** — insufficient permissions (non-admin).  
**Error 404** — lead not found.

---

## Error responses

All errors follow this format:

```json
{
  "success": false,
  "message": "Error description here"
}
```

| Status | Meaning |
|--------|---------|
| 400 | Validation error / bad request |
| 401 | Missing or invalid token |
| 403 | Forbidden — insufficient role |
| 404 | Resource not found |
| 409 | Conflict — duplicate entry |
| 500 | Internal server error |

---

## RBAC Summary

| Action | Admin | Sales |
|--------|-------|-------|
| Register / Login | ✅ | ✅ |
| View leads | ✅ | ✅ |
| Create lead | ✅ | ✅ |
| Update lead | ✅ | ✅ |
| Delete lead | ✅ | ❌ |
| Export CSV | ✅ | ✅ |
