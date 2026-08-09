# HostelHub — System Architecture Documentation

## Overview

HostelHub ("Smart Campus Living OS") is built as a decoupled, multi-tier SaaS platform consisting of a high-performance Next.js 14 frontend, an Express + TypeScript REST API backend, a PostgreSQL relational database managed by Prisma ORM, real-time WebSocket capabilities powered by Socket.IO, and dual-engine AI classification.

```
                      +-------------------------------------------------------+
                      |                   CLIENT LAYER                        |
                      | Next.js 14+ (App Router, TS, Tailwind, shadcn, Lucide) |
                      +-------------------------------------------------------+
                                        |                   ^
                              HTTP REST |                   | WebSockets
                                        v                   | (Socket.IO)
                      +-------------------------------------------------------+
                      |                   BACKEND LAYER                       |
                      | Express.js + TypeScript (Controllers, Services, Auth) |
                      +-------------------------------------------------------+
                        /                       |                     \
                       v                        v                      v
        +----------------------------+ +------------------+ +-----------------------+
        |   AI CLASSIFICATION ENGINE | | PRISMA ORM LAYER | | CLOUDINARY FILE ENGINE|
        | (Rule Fallback + OpenAI)   | | (Typesafe query) | | (Local fallback buffer)|
        +----------------------------+ +------------------+ +-----------------------+
                                                |
                                                v
                               +----------------------------------+
                               |     POSTGRESQL DATABASE          |
                               | (Relational data + Indexing)     |
                               +----------------------------------+
```

## Core Layers

### 1. Client Layer (`frontend/`)
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS with custom semantic tokens (`--primary`, `--background`, `--success`, `--warning`, `--danger`)
- **State & Communication**: Socket.IO Client for real-time notifications and complaint status shifts, custom API service handlers with standard error parsing.

### 2. Backend Layer (`backend/`)
- **Framework**: Node.js & Express with TypeScript
- **Security**: Helmet, CORS, JWT authentication, Zod request body validation, bcrypt password hashing.
- **Service Layer**: Business logic separated from HTTP controllers.

### 3. Database Layer (`prisma/`)
- **Database**: PostgreSQL
- **ORM**: Prisma for typesafe queries, migration management, and seeding.

### 4. AI Engine Abstraction
- Dual-engine complaint classification system:
  - **LLM Engine**: Extracts category, priority, SLA deadline, and location details from free-form text input.
  - **Rule-based Fallback**: Executes deterministic keyword analysis to ensure 100% uptime even without external API keys.
