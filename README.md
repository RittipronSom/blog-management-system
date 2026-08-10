# Blog

> Blog Management System — React · Node.js · MySQL

---

## Overview

Blog Management System คือเว็บแอปสำหรับจัดการบทความ ผู้ใช้สามารถสมัครสมาชิก เขียนบทความ แสดงความคิดเห็น และรับการแจ้งเตือนเมื่อมีคนคอมเมนต์ Super Admin จัดการผู้ใช้และเปิดใช้งานบัญชีใหม่ได้

## Tech Stack

| Layer    | Technology                          |
| -------- | ------------------------------------ |
| Frontend | React 19, Vite, React Router         |
| Backend  | Node.js, Express 5, JWT              |
| Database | MySQL (Aiven, managed cloud)         |

## Features

- **Authentication** — สมัครสมาชิก, เข้าสู่ระบบด้วย JWT
- **Blog** — สร้าง แก้ไข ลบ และค้นหาบทความ
- **Comments** — แสดงความคิดเห็นในหน้าบทความ
- **Notifications** — แจ้งเตือนเจ้าของบทความเมื่อมีคอมเมนต์ใหม่
- **Admin Panel** — Super Admin จัดการผู้ใช้, เปิดใช้งานบัญชี, แก้ไข role/status

## Project Structure

```
blog-management-system/
├── backend/          # REST API (Express)
├── frontend/         # React SPA (Vite)
└── database/         # MySQL schema & seed data
```

## Getting Started

### Prerequisites

- Node.js 18+
- MySQL 8+

### 1. Database

```bash
mysql -u root -p < database/schema.sql
```

Seed account (Super Admin):

| Field    | Value            |
| -------- | ---------------- |
| Email    | `fluke@test.com` |
| Password | `12345678`       |

> ผู้ใช้ที่สมัครใหม่จะได้สถานะ `PENDING` — Super Admin ต้อง activate ก่อนจึงจะ login ได้

### 2. Backend

```bash
cd backend
cp .env.example .env   # แก้ไข DB credentials
npm install
npm run dev
```

API: `http://localhost:5000`
Deployment: `https://blog-management-backend-05sk.onrender.com`

### 3. Frontend

```bash
cd frontend
cp .env.example .env # เรียก api จาก backend
npm install
npm run dev
```

App Deployment: `https://blog-management-system-rho.vercel.app`
App: `http://localhost:3001`

## API Endpoints

| Method | Path                       | Description           |
| ------ | --------------------------- | ---------------------- |
| POST   | `/api/auth/register`        | สมัครสมาชิก             |
| POST   | `/api/auth/login`           | เข้าสู่ระบบ             |
| GET    | `/api/blogs`                 | รายการบทความ            |
| POST   | `/api/blogs`                 | สร้างบทความ             |
| GET    | `/api/blogs/:id`             | รายละเอียดบทความ        |
| PUT    | `/api/blogs/:id`             | แก้ไขบทความ             |
| DELETE | `/api/blogs/:id`             | ลบบทความ                |
| GET    | `/api/comments/blog/:id`     | คอมเมนต์ของบทความ        |
| POST   | `/api/comments`              | เพิ่มคอมเมนต์            |
| GET    | `/api/notifications`         | การแจ้งเตือน             |
| GET    | `/api/users`                  | รายการผู้ใช้ (Admin)     |
| PATCH  | `/api/users/:id/activate`    | เปิดใช้งานผู้ใช้         |

## Deployment

| Service          | URL                                                      |
| ----------------- | --------------------------------------------------------- |
| Frontend (Vercel) | `https://blog-management-system-rho.vercel.app/login`     |
| Backend (Render)  | `https://blog-management-backend-05sk.onrender.com`       |
| Admin             | `https://blog-management-system-rho.vercel.app/admin`     |
| Database (Aiven)  | Managed MySQL — host: `mysql-9f3d532-blog-management.h.aivencloud.com:27447` (ต้องใช้ credentials จาก `.env`, ดู `.env.example`) |