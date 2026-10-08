# Project Documentation (AGENT.md)

## Project Overview
"Reflections" is a Next.js application for personalized, MBTI-aware journaling, with mood tracking, goals, and writing insights.

**Tech Stack:**
- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS, Shadcn UI
- **Database:** PostgreSQL with Prisma ORM
- **Auth:** NextAuth.js (v5 beta)
- **State/Data:** Server Actions, React Server Components

## Directory Structure
- `app/`: Application routes and pages.
    - `(main)/`: Main authenticated application routes (Dashboard, Journal, etc.).
    - `components/`: Colocated components specific to routes.
    - `api/`: API routes (when not using Server Actions).
- `components/`: Shared reusable UI components (buttons, dialogs, layouts).
- `lib/`:
    - `actions/`: Server Actions for data mutation and fetching.
    - `hooks/`: Custom React hooks.
    - `utils.ts`: Helper functions.
- `prisma/`: Database schema and migrations.

## Conventions & Patterns
- **Colocation**: Feature-specific components are located within their respective route directories (e.g., `app/(main)/dashboard/components`).
- **Filenames**: Use `kebab-case` for all files and directories.
- **Server Components**: Prefer Server Components by default. Use `"use client"` only for interactive components.
- **Data Fetching**: Use Server Actions for both fetching (in Server Components) and mutations (in Client Components).
- **Styling**: Use utility classes (Tailwind). Avoid CSS modules unless necessary.

## Domain Knowledge
- **MBTI**: The app personalizes content based on the user's MBTI type.
- **Journaling**: Users can create entries with rich text (Tiptap).
- **Life Streak**: An analytics metric tracking consistency.

## Do's and Don'ts
- **DO** use `shadcn` components for UI primitives.
- **DO** type all props and states explicitly.
- **DON'T** import server-only code (like Prisma) directly into client components. Use Server Actions.
- **DON'T** leave unused files; keep the project lean.

## Common Tasks
- **Start Dev Server**: `npm run dev`
- **Database Migration**: `npx prisma migrate dev`
- **View Database**: `npx prisma studio`
- **Docker Build**: `docker compose up --build`

## Setup & Configuration
### 1. Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

**Required Variables:**
- `DATABASE_URL`: Connection string for PostgreSQL (e.g., `postgresql://...`).
- `NEXTAUTH_SECRET`: Generate with `openssl rand -base64 32`.
- `NEXTAUTH_URL`: `http://localhost:3000` (for dev).

**Optional (External Services):**
- `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET`: Optional, for Google sign-in.
    - Create credentials in Google Cloud Console.
    - Authorized Redirect URI: `http://localhost:3000/api/auth/callback/google` (sign-in only)

### 2. Database Setup
```bash
npx prisma generate
npx prisma db push
```

### 3. Development Server
```bash
npm run dev
```
