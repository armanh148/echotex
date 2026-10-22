# Ecotex Inc. - Enterprise Sustainable Packaging Platform

Full-stack production platform for **Ecotex Inc.**, featuring an industrial sustainable packaging catalog, custom volume RFQ calculators, wholesale purchasing, dynamic content management, real-time customer messaging, and an executive administration portal.

---

## Repository Structure

```
ecotexinc/
├── frontend/                     # React 19 + TypeScript + Vite + Tailwind CSS v4
│   ├── public/                   # Static assets, fallback media, and brand vectors
│   ├── src/
│   │   ├── admin/                # Executive Backoffice & Content Management System
│   │   ├── components/           # Reusable UI modules, catalog, and calculators
│   │   ├── context/              # React Context state providers
│   │   ├── services/             # REST API client services
│   │   └── store/                # Persistent client state (Zustand)
│   ├── .env.example              # Frontend environment configuration template
│   ├── package.json              # Frontend client dependencies and scripts
│   ├── tsconfig.json             # TypeScript compiler settings
│   ├── vercel.json               # SPA routing rewrite configuration for Vercel
│   └── vite.config.ts            # Vite bundler and development proxy setup
│
├── backend/                      # Node.js + Express + Neon PostgreSQL
│   ├── api/
│   │   └── index.js              # Serverless entrypoint for Vercel deployment
│   ├── src/
│   │   ├── config/               # Environment configuration and path resolution
│   │   ├── controllers/          # Business logic handlers
│   │   ├── database/             # Neon PostgreSQL schema and dual-storage engine
│   │   ├── middleware/           # Security headers, JWT auth, rate limiters
│   │   ├── routes/               # Modular REST API endpoints
│   │   └── utils/                # Token signing and Winston-style logger
│   ├── uploads/                  # Managed catalog media assets
│   ├── db.json                   # Local persistent storage mirror
│   ├── .env.example              # Backend environment configuration template
│   ├── package.json              # Backend server dependencies and scripts
│   ├── test.js                   # Automated API integration and regression suite
│   └── vercel.json               # Serverless function rewrite rules for Vercel
│
├── .gitignore                    # Global monorepo ignore rules
├── package.json                  # Root monorepo workspace orchestration
└── README.md                     # Documentation and deployment guide
```

---

## Technology Stack

- **Frontend Client:** React 19, TypeScript, Vite, Tailwind CSS v4, Lucide Icons, Motion, Zustand.
- **Backend API:** Node.js, Express, Neon PostgreSQL (`pg`), JSON Web Tokens (`jsonwebtoken`), Bcrypt, Multer, Helmet, CORS, Express Rate Limit.
- **Hosting Targets:** Vercel, Render, Railway, DigitalOcean, or Linux VPS with Nginx.

---

## Quick Start (Local Development)

### Prerequisites
- Node.js 18.x or higher
- npm 9.x or higher

### 1. Installation
Install all dependencies across both packages using the root monorepo command:
```bash
npm run install:all
```
Or install individually:
```bash
cd backend && npm install
cd ../frontend && npm install
```

### 2. Environment Configuration

**Frontend:**
```bash
cd frontend
cp .env.example .env
```
In development, Vite proxies `/api` and `/uploads` directly to `http://localhost:3001`, so `VITE_API_URL=/api` is ready out of the box.

**Backend:**
```bash
cd backend
cp .env.example .env
```
Configure your `.env` variables (e.g., `PORT=3001`, `JWT_SECRET`, and optional `DATABASE_URL` for Neon PostgreSQL).

### 3. Start Development Servers

Run backend and frontend in separate terminals:

```bash
# Terminal 1 - Backend Server (runs on http://localhost:3001)
npm run dev:backend

# Terminal 2 - Frontend Client (runs on http://localhost:3000)
npm run dev:frontend
```

---

## Deployment Guide

### Option 1: Vercel (Recommended)

#### Frontend on Vercel:
1. Import this repository into Vercel.
2. In **Project Settings**:
   - **Root Directory:** Set to `frontend`
   - **Framework Preset:** Vite (detected automatically)
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
3. In **Environment Variables**:
   - Add `VITE_API_URL` set to your live backend URL (e.g., `https://api.yourdomain.com/api` or your backend Vercel URL).

#### Backend on Vercel:
1. Create a second project on Vercel from the same repository.
2. In **Project Settings**:
   - **Root Directory:** Set to `backend`
   - **Framework Preset:** Other
3. In **Environment Variables**:
   - Add `DATABASE_URL` (Neon PostgreSQL connection string)
   - Add `JWT_SECRET` (A strong random secret string)
   - Add `CORS_ORIGIN` (Your live frontend URL)
   - Add `NODE_ENV=production`

---

### Option 2: Render / Railway (Recommended for Backend)

#### Deploy Backend as a Web Service:
- **Root Directory:** `backend`
- **Environment:** `Node`
- **Build Command:** `npm install`
- **Start Command:** `npm start`
- **Port:** Set to `3001` or bind to `PORT` environment variable.
- **Environment Variables:**
  - `PORT=3001`
  - `NODE_ENV=production`
  - `DATABASE_URL=<your-neon-postgres-connection-string>`
  - `JWT_SECRET=<strong-random-key>`
  - `CORS_ORIGIN=https://<your-frontend-domain>.vercel.app`

---

### Option 3: Traditional Linux VPS / Nginx Reverse Proxy

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    # Static Frontend SPA
    location / {
        root /var/www/ecotex/frontend/dist;
        try_files $uri $uri/ /index.html;
    }

    # Backend API Endpoints
    location /api/ {
        proxy_pass http://127.0.0.1:3001/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Uploads Static Files
    location /uploads/ {
        proxy_pass http://127.0.0.1:3001/uploads/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
    }
}
```

---

## Environment Variables Reference

### Backend (`backend/.env`)

| Variable | Description | Default |
|---|---|---|
| `PORT` | HTTP port for backend server | `3001` |
| `NODE_ENV` | Environment mode (`development` or `production`) | `development` |
| `DATABASE_URL` | Neon PostgreSQL pooled connection URI | Optional (falls back to local `db.json`) |
| `JWT_SECRET` | Secret key for signing and validating JWT tokens | Industrial Secret |
| `JWT_EXPIRES_IN` | Token validity duration | `7d` |
| `CORS_ORIGIN` | Allowed CORS origins (`*` or comma-separated URLs) | `*` |
| `MAX_UPLOAD_SIZE_MB` | Maximum allowed payload/upload size | `25` |

### Frontend (`frontend/.env`)

| Variable | Description | Default |
|---|---|---|
| `VITE_API_URL` | Base endpoint URL for all API communications | `/api` |

---

## Testing & Quality Assurance

To execute the backend automated test suite:
```bash
npm run test:backend
```

To build and verify the frontend bundle:
```bash
npm run build:frontend
```
