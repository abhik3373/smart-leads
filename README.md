# Smart Leads Dashboard

A full-stack Lead Management Dashboard built with the MERN stack and TypeScript.

## 🚀 Live Demo

- **Frontend**: https://smart-leads-three.vercel.app
- **Backend**: smart-leads-api-mbl9.onrender.com

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
- Dark Mode support

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
Frontend → http://localhost:5173

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
│   ├── hooks/          # useDebounce, useDarkMode
│   ├── pages/          # LoginPage, RegisterPage, DashboardPage
│   ├── store/          # Zustand stores
│   └── types/          # Shared TypeScript interfaces
└── docker-compose.yml
```
