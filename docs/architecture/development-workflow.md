# Development Workflow

## Local Development Setup

### Prerequisites

```bash
# Required software
node --version    # v18+
npm --version     # v9+
git --version

# Install Supabase CLI
npm install -g supabase

# Verify Supabase CLI
supabase --version
```

### Initial Setup

```bash
# Clone repository
git clone https://github.com/your-org/life-os.git
cd life-os

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Edit .env.local with your Supabase credentials
# NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
# NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Start local Supabase (optional, for local development)
supabase start

# Run database migrations
supabase db push

# Seed database with lifestyle modules
supabase db seed

# Generate TypeScript types from Supabase schema
npm run generate-types
```

### Development Commands

```bash
# Start all services (Next.js dev server + Supabase local)
npm run dev

# Start frontend only
npm run dev:next

# Start backend only (Supabase local)
supabase start

# Run tests
npm test                   # Unit + integration tests
npm run test:e2e           # E2E tests with Playwright
npm run test:watch         # Watch mode

# Linting and formatting
npm run lint               # ESLint
npm run format             # Prettier

# Database operations
npm run db:migrate         # Create new migration
npm run db:push            # Apply migrations
npm run db:reset           # Reset local database
npm run generate-types     # Generate TS types from schema

# Build for production
npm run build
npm start                  # Run production build locally
```

---

## Environment Configuration

### Required Environment Variables

```bash
# Frontend (.env.local)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Supabase project details (for local development)
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key  # Server-side only, NEVER expose to client

# Next.js configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000         # Development
# NEXT_PUBLIC_APP_URL=https://lifeos.app          # Production

# OAuth configuration (optional, configure in Supabase dashboard)
# NEXT_PUBLIC_GOOGLE_CLIENT_ID=...
# NEXT_PUBLIC_GITHUB_CLIENT_ID=...

# Shared
NODE_ENV=development                              # development | production
```

**Important**: Never commit `.env.local` to version control. Use `.env.example` as a template.

---
