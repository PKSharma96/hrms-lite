# HRMS Lite: Enterprise Attendance Intelligence

**HRMS Lite** is a high-fidelity, mobile-first attendance management system designed for modern workforces. It provides real-time analytics, secure personnel tracking, and a streamlined administrative experience with a premium, glassmorphic UI.

---

## 🚀 Key Features

- **Intelligence Dashboard**: Real-time visualization of workforce engagement trends and daily presence metrics.
- **Secure Access Control**: Enterprise-grade login gateway with role-based session management.
- **Personnel Registry**: Comprehensive employee onboarding and offboarding with automated reference ID generation and data export (CSV).
- **Attendance Timeline**: Simplified presence marking flow with localized synchronization indicators and filtering.
- **Mobile-First Design**: Fully responsive navigation drawer and adaptive layouts for on-the-go management.
- **Cloud Persistence**: Integrated heartbeat mechanism to ensure 100% backend availability on deployment platforms like Render.
- **Sophisticated Feedback**: Non-blocking toast notifications and contextual loaders for a premium user experience.

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 18 (Vite)
- **Styling**: Tailwind CSS (Modern Glassmorphism)
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **API Client**: Axios (with centralized request/response interceptors)
- **Date Handling**: Date-fns

### Backend
- **Framework**: FastAPI (Python 3.10+)
- **ORM**: SQLAlchemy
- **Database**: PostgreSQL (Optimized for Neon/Remote instances)
- **Deployment**: Configured for Render & Vercel

---

## ⚙️ Quick Start

### 1. Prerequisites
- Node.js (v16+)
- Python (v3.10+)
- PostgreSQL Database URL

### 2. Backend Setup
```bash
cd hrms-lite/backend
pip install -r requirements.txt
# Set DATABASE_URL in your environment
uvicorn app:app --reload
```

### 3. Frontend Setup
```bash
cd hrms-lite/frontend
npm install
# Set VITE_API_URL in .env if different from localhost:8000
npm run dev
```

---

## 🔐 Credentials (Demo)
By default, the system initializes with the following administrative credentials:
- **Username**: `Admin`
- **Password**: `12345`

---

## ☁️ Deployment Notes
HRMS Lite is optimized for the Render/Vercel ecosystem. The frontend includes an automated **40-second heartbeat** that pings the backend root `/` to prevent deployment hibernation, ensuring the platform is always ready for interaction.

---

## 📄 License
HRMS Lite is developed as a standalone attendance management solution. All rights reserved.
