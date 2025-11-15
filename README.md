# 🍬 Sweet Shop Management System

A full-stack Sweet Shop inventory and sales management system built with:

- **Frontend:** React + TypeScript + Vite
- **Backend:** Node.js + Express + TypeScript
- **Database:** PostgreSQL (via Docker)
- **ORM:** Prisma
- **Auth:** JWT-based authentication (Admin + User roles)
- **Tests:** Jest (backend), Vitest + Testing Library (frontend)

This project fulfills all requirements of an end-to-end CRUD + search application with real authentication, pagination, admin controls, and unit test coverage.

---

## 📸 Screenshots

> Replace these with your actual screenshots

### Login Page

`/screenshots/login.png`

### Sweet Listing (User View)

`/screenshots/sweets.png`

### Admin Dashboard

`/screenshots/admin.png`

---

## 🚀 Features

### 👤 Authentication

- Register / Login using JWT
- `/api/me` endpoint to fetch user profile
- Role-based routes (Admin / User)

### 🍬 Sweet Management

- CRUD for sweets (Admin only)
- Stock management: Purchase + Restock
- Pagination (10 items per page)
- Search by:

  - Name
  - Category
  - Price range

### 🧩 Additional

- Beautiful UI with responsiveness
- Fully typed TypeScript across frontend & backend
- Prisma migrations + seeding

---

# 🛠️ Setup Instructions

This project has **two main apps**:

```
/backend
/frontend
```

You must have:

- Node.js 18+
- Docker & Docker Compose
- npm or yarn

---

# 1️⃣ Backend Setup (Node + Express + Prisma)

### 1. Navigate into the backend

```bash
cd backend
```

### 2. Copy `.env.example` → `.env`

```bash
cp .env.example .env
```

Ensure these exist inside `.env`:

```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/sweetshop_dev"
JWT_SECRET="your-secret"
ADMIN_EMAIL="admin@local.test"
ADMIN_PASSWORD="adminpass"
```

---

### 3. Start PostgreSQL using Docker

Run this from the **repo root**:

```bash
docker compose up -d
```

This starts:

- PostgreSQL 15
- Port: **5432**

---

### 4. Prisma Setup

#### Generate Prisma Client

```bash
cd backend
npx prisma generate
```

#### Run Migrations

```bash
npx prisma migrate dev --name init
```

#### Seed Database (creates admin + 50 sweet items)

```bash
npm run db:seed
```

---

### 5. Start Backend API

```bash
npm run dev
```

Backend runs on:

```
http://localhost:4000
```

---

# 2️⃣ Frontend Setup (React + Vite + TypeScript)

### 1. Navigate to frontend

```bash
cd frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start development server

```bash
npm run dev
```

Frontend runs on:

```
http://localhost:5173
```

---

# 3️⃣ Running Tests

### Backend (Jest)

```bash
cd backend
npm test
```

### Frontend (Vitest)

```bash
cd frontend
npm test
```

---

# 4️⃣ API Endpoints Summary

### Auth

| Method | Endpoint           | Description        |
| ------ | ------------------ | ------------------ |
| POST   | /api/auth/register | Register user      |
| POST   | /api/auth/login    | Login              |
| GET    | /api/me            | Get logged-in user |

### Sweets

| Method | Endpoint                 | Description           |
| ------ | ------------------------ | --------------------- |
| GET    | /api/sweets?page=1       | Paginated list        |
| GET    | /api/sweets/search       | Search sweets         |
| POST   | /api/sweets              | Create sweet (Admin)  |
| GET    | /api/sweets/:id          | Fetch sweet by ID     |
| PUT    | /api/sweets/:id          | Update sweet (Admin)  |
| DELETE | /api/sweets/:id          | Delete sweet (Admin)  |
| POST   | /api/sweets/:id/purchase | Purchase sweet        |
| POST   | /api/sweets/:id/restock  | Restock sweet (Admin) |

---

# 🌱 Database Seeding

The seed script creates:

- 1 Admin user (from `.env`)
- 50 sweets across 5 categories
- Random price & stock values

Run the seed:

```bash
npm run db:seed
```

---

# 🧠 My AI Usage (Mandatory Section)

A transparent summary of how AI contributed to this project.

### ✔️ Tools Used

- **OpenAI ChatGPT**
- **GitHub Copilot (minimal use)**

### ✔️ How AI Was Used

I intentionally limited AI usage to these areas:

#### 1. **Unit Testing**

- Used AI to help generate initial Jest and Vitest test scaffolding.
- All test logic was reviewed and modified manually.

#### 2. **Debugging Errors**

AI helped diagnose issues such as:

- Express middleware hanging
- Prisma migration conflicts
- React Testing Library edge cases

#### 3. **Database Seeding Assistance**

- Used AI to refine the script structure (batching, randomizers, categories).

### ✔️ What AI _Was Not_ Used For

- ❌ No AI-generated app architecture
- ❌ No AI for solving core logic or endpoints
- ❌ No AI-generated UI or components
- ❌ No AI-generated search, pagination, or auth logic

All major implementation decisions and code were written manually.

### ✔️ Reflection

AI improved developer velocity by:

- Acting as a debugging assistant
- Helping bootstrap tests and seeds
- Reducing trial‑and‑error time in isolated cases

However, all core development, architecture, business logic, and frontend experience were crafted by me.

---

# 🌐 Deployment (Optional)

If deployed, add your link here:

```
https://your-live-demo.com
```

---

# 📁 Project Structure

```
.
├── backend
│   ├── prisma/
│   ├── src/
│   └── tests/
└── frontend
    ├── src/
    └── public/
```

---

# 🙌 Final Notes

This project includes:
✔ Pagination
✔ Search
✔ CRUD
✔ JWT Auth
✔ Admin Dashboard
✔ Dockerized PostgreSQL
✔ Prisma setup
✔ Frontend + Backend tests
✔ Complete AI usage documentation

All requirements for the assignment have been fulfilled.
