# HostelHub — Smart Campus Living OS 🏢⚡

> **"Everything your hostel needs. One smart place."**

HostelHub is a full-stack SaaS platform designed to modernize university hostel life. It replaces fragmented WhatsApp groups, paper forms, and manual registers with an integrated digital ecosystem connecting **Students**, **Wardens**, **Maintenance Staff**, and **Administrators**.

---

## 🌟 Key Features

- **Campus Pulse UI**: A real-time operational timeline capturing daily hostel activity, menu updates, notice broadcasts, and complaint updates.
- **Smart AI Complaint Engine**: Conversational issue reporting featuring dual-engine classification (NLP/LLM + deterministic fallback rule classifier) with priority, category, and location auto-detection.
- **Vertical Progress Timeline**: Interactive complaint status tracking from reporting -> assignment -> technician on route -> repair -> resolution.
- **Hostel Health Score**: Operational metric (0–100) aggregating complaint resolution speed, student satisfaction, maintenance load, mess ratings, and attendance.
- **Visual Room Visualizer**: Grid layout of blocks, rooms, and bed statuses (`AVAILABLE`, `FULL`, `MAINTENANCE`).
- **Mess Management & Rating Engine**: Weekly meal calendar, allergen info, and rating analytics for dining satisfaction.
- **3-Step Leave Workflow**: Fast leave request submission and Warden approval interface.
- **Emergency Red Alert Mode**: High-priority incident reporting for security, medical, or fire emergencies.

---

## 📐 Architecture

```
Browser (Next.js App Router)
   ↓
REST APIs / Socket.IO (Express + TypeScript)
   ↓
Service Layer & Dual-Engine AI Classifier
   ↓
Prisma ORM
   ↓
PostgreSQL Database
```

---

## 💻 Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, Lucide Icons, Framer Motion
- **Backend**: Node.js, Express, TypeScript, Socket.IO, Zod, JWT, bcrypt
- **Database**: PostgreSQL with Prisma ORM
- **Testing**: Jest / Integration tests

---

## 🔑 Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| **Administrator** | `admin@hostelhub.demo` | `demo1234` |
| **Warden** | `warden@hostelhub.demo` | `demo1234` |
| **Maintenance Staff** | `maintenance@hostelhub.demo` | `demo1234` |
| **Student** | `student@hostelhub.demo` | `demo1234` |

---

## 🛠️ Quick Start & Local Setup

### Prerequisites
- Node.js v18+ & npm
- PostgreSQL database URL (or local PostgreSQL server)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-org/hostelhub.git
   cd hostelhub
   ```

2. **Backend Setup**:
   ```bash
   cd backend
   npm install
   cp ../.env.example .env
   npm run prisma:generate
   npm run dev
   ```

3. **Frontend Setup**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

4. **Access Applications**:
   - Frontend Portal: `http://localhost:3000`
   - Backend API: `http://localhost:5000/api/health`

---

## 📚 Documentation Links
- [Architecture Overview](file:///c:/Users/balag/OneDrive/Desktop/hostel%20hub/docs/architecture.md)
- [Database Schema](file:///c:/Users/balag/OneDrive/Desktop/hostel%20hub/docs/database.md)
- [API Specifications](file:///c:/Users/balag/OneDrive/Desktop/hostel%20hub/docs/api.md)
- [Deployment Guide](file:///c:/Users/balag/OneDrive/Desktop/hostel%20hub/docs/deployment.md)
