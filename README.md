# SkyraQR — Enterprise B2B QR SaaS Platform Monorepo

> **Internal Project Codename:** `SkyraQR`  
> **Parent Company:** `Skyra Tech`  
> **Commercial Product Name:** `TBD` (Commercial brand selection prior to launch; zero architectural lock-in)  
> **Documentation Suite:** [`documentation/`](./documentation)

---

## 1. Overview & Architecture

SkyraQR is an enterprise-grade, multi-tenant B2B SaaS platform designed for high-performance dynamic QR code generation, context-aware routing, responsive micro-landing pages, privacy-preserving scan telemetry, and autonomous AI-agent workflows via the Model Context Protocol (MCP).

### 1.1 Strict Separation of Concerns Architecture

$$\text{Browser} \longrightarrow \text{Next.js UI (apps/web)} \longrightarrow \text{NestJS API (apps/api)} \longrightarrow \text{Shared Domain Services} \longrightarrow \text{PostgreSQL (Supabase)}$$

- **Presentation Tier (`apps/web`):** Built with **Next.js 14+ (App Router)**, React 18, Tailwind CSS, and Lucide React. Responsible strictly for client-side state, UI views, responsive micro-landing pages, and frontend routing.
  - **CRITICAL RULE:** Next.js **MUST NOT** directly connect to PostgreSQL or Supabase database tables.
  - Next.js **MUST NOT** duplicate authoritative business logic, authorization rules, entitlement checks, or billing logic.
  - Server Actions, if used, act strictly as presentation/API adapters that delegate business mutations to the NestJS API via HTTP client calls.
- **Authoritative Business Tier (`apps/api`):** Built with **NestJS 10+** using the high-performance **Fastify HTTP adapter**. Responsible for all authentication, authorization (RBAC), multi-tenant scoping, subscription entitlement enforcement, QR short-code collision handling, dynamic routing rules, vector QR exports, audit logging, and MCP tool execution.
- **Data Persistence Tier (Supabase):** PostgreSQL 16 managed database providing 57 relational tables with UUIDv7 sequential primary keys and declarative monthly range partitioning for high-frequency scan events. *(Note: Database schema migration and Redis are integrated in subsequent phases; Redis is deferred per architecture).*

---

## 2. Monorepo Structure

The repository is managed using **pnpm workspaces** and **Turborepo**:

```
skyra-qr-code-generator/
├── apps/
│   ├── web/                        # Next.js 14+ App Router frontend
│   │   ├── src/
│   │   │   └── app/                # App Router pages, layout, styles
│   │   ├── next.config.mjs         # Next.js configuration & API proxy rewrites
│   │   ├── tailwind.config.ts      # Tailwind CSS configuration
│   │   ├── tsconfig.json           # Extends @skyra/typescript-config/nextjs
│   │   └── package.json            # @skyra/web
│   │
│   └── api/                        # NestJS 10+ with Fastify HTTP adapter
│       ├── src/
│       │   ├── health/             # Liveness, readiness, and system info probes
│       │   ├── app.module.ts       # Root application module
│       │   └── main.ts             # Fastify adapter bootstrap & CORS setup
│       ├── nest-cli.json           # NestJS CLI configuration
│       ├── tsconfig.json           # Extends @skyra/typescript-config/nestjs
│       └── package.json            # @skyra/api
│
├── packages/
│   ├── shared/                     # Shared TypeScript types, constants, DTOs
│   │   ├── src/
│   │   │   ├── constants/          # Codename, ports, QR types catalog
│   │   │   ├── types/              # HealthCheckResponse, ApiResponse, SystemInfo
│   │   │   └── index.ts            # Entrypoint
│   │   ├── tsconfig.json
│   │   └── package.json            # @skyra/shared
│   │
│   ├── eslint-config/              # Shared ESLint configurations
│   │   ├── index.js                # Base config
│   │   ├── nextjs.js               # Next.js specific rules
│   │   ├── nestjs.js               # NestJS specific rules
│   │   └── package.json            # @skyra/eslint-config
│   │
│   └── typescript-config/          # Shared TypeScript configurations
│       ├── base.json               # Base TS config
│       ├── nextjs.json             # Next.js TS config
│       ├── nestjs.json             # NestJS TS config
│       └── package.json            # @skyra/typescript-config
│
├── documentation/                  # Authoritative Architectural Specifications
│   ├── 01_BUSINESS_REQUIREMENTS_DOCUMENT.md
│   ├── 02_SYSTEM_ARCHITECTURE_DOCUMENT.md
│   ├── 03_DATABASE_ARCHITECTURE_DOCUMENT.md
│   └── 04_DEVELOPMENT_IMPLEMENTATION_PLAN.md
│
├── .env.example                    # Global environment variable template
├── .gitignore                      # Monorepo gitignore
├── package.json                    # Workspace root scripts & dev dependencies
├── pnpm-workspace.yaml             # pnpm workspace definition
├── turbo.json                      # Turborepo task pipeline
├── README.md                       # Local development guide
└── LICENSE                         # MIT License
```

---

## 3. Getting Started

### 3.1 Prerequisites

- **Node.js:** `v20.0.0` or higher (`node -v`)
- **pnpm:** `v10.0.0` or higher (`pnpm -v`)
- **Git:** Installed and configured

### 3.2 Installation

Clone the repository and install all workspace dependencies:

```bash
# 1. Clone the repository
git clone https://github.com/SkyraTech/skyra-qr-code-generator.git
cd skyra-qr-code-generator

# 2. Copy the environment variables template
cp .env.example .env

# 3. Install dependencies across all apps and packages
pnpm install
```

### 3.3 Running in Development

Start both the Next.js frontend and the NestJS API concurrently using Turborepo:

```bash
pnpm dev
```

The services will be accessible at:
- **Frontend (Next.js):** [http://localhost:3000](http://localhost:3000)
- **Authoritative API (NestJS + Fastify):** [http://localhost:4000](http://localhost:4000)
- **API Health Check Probe:** [http://localhost:4000/health](http://localhost:4000/health)
- **API Liveness Probe:** [http://localhost:4000/health/liveness](http://localhost:4000/health/liveness)
- **API Readiness Probe:** [http://localhost:4000/health/readiness](http://localhost:4000/health/readiness)

To run applications individually:
```bash
# Run only the Next.js web application
pnpm dev:web

# Run only the NestJS API application
pnpm dev:api
```

---

## 4. Available Scripts

| Command | Description |
| :--- | :--- |
| `pnpm dev` | Starts all monorepo apps concurrently in development watch mode |
| `pnpm dev:web` | Starts only the Next.js frontend on port 3000 |
| `pnpm dev:api` | Starts only the NestJS Fastify backend on port 4000 |
| `pnpm build` | Builds all packages and applications via Turborepo |
| `pnpm build:web` | Builds production bundle for Next.js |
| `pnpm build:api` | Compiles NestJS backend into `dist/` |
| `pnpm check-types` | Executes TypeScript type checking (`tsc --noEmit`) across all workspaces |
| `pnpm lint` | Runs ESLint across all workspaces |
| `pnpm clean` | Purges build caches and generated artifacts |

---

## 5. Verification & Health Probes

The NestJS Fastify backend exposes lightweight health-check probes:

```json
// GET http://localhost:4000/health
{
  "status": "ok",
  "service": "skyra-api",
  "version": "1.0.0",
  "environment": "development",
  "timestamp": "2026-09-02T07:45:00.000Z",
  "uptimeSeconds": 42,
  "checks": {
    "api": "ok",
    "database": "ok",
    "redis": "pending"
  }
}
```

The Next.js landing page features a live connection card that verifies connectivity to this endpoint in real time.

---

## 6. Database Foundation & Migrations (Phase 1)

SkyraQR utilizes **PostgreSQL 16+** as its authoritative transactional data store, managed through **Prisma ORM** and declarative raw SQL migrations.

### 6.1 Database Architecture Highlights
- **57 Relational Tables:** Fully normalized 3NF data model organized across 12 functional groups as documented in [`03_DATABASE_ARCHITECTURE_DOCUMENT.md`](./documentation/03_DATABASE_ARCHITECTURE_DOCUMENT.md).
- **Dual-Guarantee UUIDv7:** RFC 9562 time-ordered UUIDv7 keys generated both at the database layer via PostgreSQL PL/pgSQL function `uuid_generate_v7()` as column defaults, and at the application layer via TypeScript `uuidv7`.
- **Declarative Monthly Partitioning:** The high-throughput `scan_events` telemetry table is partitioned by range on `scanned_at TIMESTAMPTZ` with primary key `(id, scanned_at)` and initial monthly child partitions (`scan_events_YYYY_MM`).
- **Privacy-by-Design:** `scan_events` contains zero raw IP columns; telemetry uses HMAC-SHA256 salted hashes (`visitor_hash`). `INET` datatypes are strictly confined to security and audit ledgers.
- **Monetary Standardization:** All currency values are strictly standardized on `NUMERIC(12,2)`.
- **Soft Deletion:** Partial unique indexes (`WHERE deleted_at IS NULL`) allow clean re-creation of short codes and domain slugs.

### 6.2 Database Environment Setup
Configure your connection strings in `apps/api/.env`:
```env
# Supabase Direct PostgreSQL
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.fmvnxfwfnpbcswvpgppm.supabase.co:5432/postgres"
DIRECT_URL="postgresql://postgres:[YOUR-PASSWORD]@db.fmvnxfwfnpbcswvpgppm.supabase.co:5432/postgres"
```

### 6.3 Database CLI Commands
| Command | Description |
| :--- | :--- |
| `pnpm --filter @skyra/api prisma:generate` | Generates the strongly-typed Prisma Client |
| `pnpm --filter @skyra/api prisma:deploy` | Applies pending migrations to the active database |
| `pnpm --filter @skyra/api seed` | Deterministically seeds 16 QR types, 27 permissions, plans, and features |
| `pnpm --filter @skyra/api test:db` | Executes the 10-group automated database verification test suite |
| `pnpm --filter @skyra/api prisma:reset` | Completely drops, recreates, re-migrates, and re-seeds the database |

---

## 7. Hosting & Deployment Roadmap

- **Frontend (`apps/web`):** Designed for seamless zero-config deployment on **Vercel**.
- **Backend API (`apps/api`):** Deployable on **Vercel Serverless / Cloud Containers** (Render, Railway, Fly.io, AWS ECS, or GCP Cloud Run) without monorepo restructuring.
- **Database:** Supabase PostgreSQL 16 managed cluster (Connection pooler on port 6543, direct migration port on 5432).
- **Redis:** Non-authoritative caching and telemetry streams (deferred to subsequent phases).

---

## 7. License

Distributed under the MIT License. See [`LICENSE`](./LICENSE) for more details.  
Copyright &copy; 2026 **Skyra Tech**. All rights reserved.
