# SpendSmart – Expense Tracker

A full-stack expense tracking app with JWT auth, category management, analytics charts, and a clean responsive UI.

![Stack](https://img.shields.io/badge/React-TypeScript-blue) ![Stack](https://img.shields.io/badge/Node.js-Express-green) ![Stack](https://img.shields.io/badge/PostgreSQL-Render-blue)

## Features

- JWT-based register / login / protected routes
- Add, view, delete income and expense transactions
- Category breakdown with pie chart
- 6-month trend bar chart (Recharts)
- Month filter on dashboard
- Rate limiting on the API
- Fully responsive

## Tech Stack

| Layer    | Tech                                      |
|----------|-------------------------------------------|
| Frontend | React 18, TypeScript, Tailwind CSS, Zustand, React Router v6, Recharts |
| Backend  | Node.js, Express, JWT, bcryptjs, express-rate-limit |
| Database | PostgreSQL (Supabase / Railway / Render)  |
| Deploy   | Vercel (frontend) + Render (backend)      |

## Project Structure

```
expense-tracker/
├── client/               # React + Vite frontend
│   └── src/
│       ├── components/   # Navbar, ExpenseList, ExpenseModal, ProtectedRoute
│       ├── pages/        # AuthPage, Dashboard
│       ├── hooks/        # useExpenses, useSummary, useCategories
│       ├── store/        # Zustand auth store
│       ├── lib/          # Axios instance with interceptors
│       └── types/        # TypeScript interfaces
└── server/               # Express REST API
    └── src/
        ├── controllers/  # auth.js, expenses.js, categories.js
        ├── middleware/   # auth.js (JWT verification)
        ├── routes/       # auth.js, expenses.js
        └── db/           # PostgreSQL pool + schema init
```

## API Endpoints

| Method | Route                       | Auth | Description             |
|--------|-----------------------------|------|-------------------------|
| POST   | /api/auth/register          | ❌   | Register new user       |
| POST   | /api/auth/login             | ❌   | Login, returns JWT      |
| GET    | /api/auth/me                | ✅   | Get current user        |
| GET    | /api/expenses               | ✅   | List expenses (filters) |
| POST   | /api/expenses               | ✅   | Create expense          |
| PUT    | /api/expenses/:id           | ✅   | Update expense          |
| DELETE | /api/expenses/:id           | ✅   | Delete expense          |
| GET    | /api/expenses/summary       | ✅   | Analytics summary       |
| GET    | /api/expenses/categories    | ✅   | List categories         |
| POST   | /api/expenses/categories    | ✅   | Create category         |
| DELETE | /api/expenses/categories/:id| ✅   | Delete category         |

## Local Setup

### 1. Clone

```bash
git clone https://github.com/YOUR_USERNAME/expense-tracker.git
cd expense-tracker
```

### 2. Backend

```bash
cd server
npm install
cp .env.example .env   # fill in your values
npm run dev
```

### 3. Frontend

```bash
cd client
npm install
cp .env.example .env
npm run dev
```

Open http://localhost:5173

## Deployment

### Backend → Render (free)

1. Push to GitHub
2. Go to [render.com](https://render.com) → New → Blueprint
3. Connect your repo — it uses `render.yaml` automatically
4. Render creates the PostgreSQL DB and web service together

### Frontend → Vercel (free)

1. Go to [vercel.com](https://vercel.com) → New Project → import your repo
2. Set root directory to `client`
3. Add env variable: `VITE_API_URL=https://your-render-service.onrender.com/api`
4. Deploy

## Interview Talking Points

- JWT stateless auth with bcrypt password hashing
- PostgreSQL relational schema (users → categories → expenses)
- Axios interceptors for auto token injection and 401 redirect
- Zustand persisted auth store
- Rate limiting (100 req / 15 min per IP)
- Aggregation queries with PostgreSQL window functions
