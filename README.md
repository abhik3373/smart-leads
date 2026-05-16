# Smart Leads Dashboard

A full-stack Lead Management Dashboard built with the MERN stack and TypeScript.

## Tech Stack

**Frontend**: React 18, TypeScript, TailwindCSS, Zustand, React Router v6, Axios  
**Backend**: Node.js, Express, TypeScript, MongoDB, Mongoose, JWT, Zod  
**DevOps**: Docker, Docker Compose

## Features

- JWT-based authentication with bcrypt password hashing
- Role-Based Access Control (Admin / Sales)
- Full Leads CRUD with validation
- Advanced filtering: status, source, name/email search (debounced), sort
- Backend pagination (10 per page) with metadata
- CSV export (filtered)
- Responsive UI with loading + empty states

## Getting Started

### Prerequisites
- Node.js 20+
- MongoDB (local or Atlas)

### Backend

```bash
cd backend
cp .env.example .env       # fill in MONGODB_URI and JWT_SECRET
npm install
npm run dev                # runs on :5000
```

### Frontend

```bash
cd frontend
npm install
npm run dev                # runs on :5173
```

### Docker (recommended)

```bash
cp backend/.env.example .env
# Set JWT_SECRET in .env
docker-compose up --build
```

Backend → http://localhost:5000  
Frontend → run separately with `npm run dev` or deploy to Vercel

## API Reference

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| POST | /api/auth/register | — | — | Register user |
| POST | /api/auth/login | — | — | Login |
| GET | /api/auth/me | ✓ | Any | Get current user |
| GET | /api/leads | ✓ | Any | List leads (filters + pagination) |
| GET | /api/leads/export | ✓ | Any | Export CSV |
| GET | /api/leads/:id | ✓ | Any | Get single lead |
| POST | /api/leads | ✓ | Any | Create lead |
| PATCH | /api/leads/:id | ✓ | Any | Update lead |
| DELETE | /api/leads/:id | ✓ | Admin | Delete lead |

### Query params for GET /api/leads

| Param | Values | Description |
|-------|--------|-------------|
| status | New, Contacted, Qualified, Lost | Filter by status |
| source | Website, Instagram, Referral | Filter by source |
| search | string | Search name or email |
| sort | latest, oldest | Sort order |
| page | number | Page number (default: 1) |
| limit | number | Per page (default: 10) |

## Project Structure

```
smart-leads/
├── backend/src/
│   ├── config/         # DB + env validation
│   ├── controllers/    # Route handlers
│   ├── middleware/     # Auth, RBAC, validation, error handler
│   ├── models/         # Mongoose schemas
│   ├── routes/         # Express routers
│   ├── schemas/        # Zod validation schemas
│   ├── services/       # Business logic
│   └── utils/          # asyncHandler, CSV export
├── frontend/src/
│   ├── api/            # Axios instance + typed API calls
│   ├── components/     # Reusable UI components
│   ├── hooks/          # useDebounce
│   ├── pages/          # LoginPage, RegisterPage, DashboardPage
│   ├── store/          # Zustand stores
│   └── types/          # Shared TypeScript interfaces
└── docker-compose.yml
```
