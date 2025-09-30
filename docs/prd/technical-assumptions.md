# Technical Assumptions

## Repository Structure

**Structure**: Monorepo

**Rationale**: A monorepo with Next.js provides optimal development experience, shared types between frontend/backend, and simplified deployment. Since this is a full-stack web application with shared business logic, keeping everything in one repository reduces complexity.

**Repository Layout**:
```
life-os-1/
├── src/
│   ├── app/                    # Next.js 14 App Router pages
│   │   ├── daily/             # Daily Tracker page
│   │   ├── calories/          # Calories tracking page
│   │   ├── injections/        # Injections page
│   │   ├── nirvana/           # Nirvana Life page
│   │   ├── winners-bible/     # Winners Bible page
│   │   ├── analytics/         # Analytics dashboard
│   │   ├── settings/          # Settings configuration
│   │   ├── bmr-calculator/    # BMR calculator tool
│   │   └── layout.tsx         # Root layout with providers
│   ├── components/            # Reusable React components
│   │   ├── Navigation.tsx     # Sidebar, mobile nav, header
│   │   ├── forms/             # Form components
│   │   ├── charts/            # Chart components (recharts)
│   │   └── ui/                # Base UI components
│   ├── lib/
│   │   ├── supabase/          # Supabase client and utilities
│   │   │   ├── client.ts      # Browser Supabase client
│   │   │   ├── server.ts      # Server-side Supabase client
│   │   │   └── middleware.ts  # Auth middleware
│   │   ├── hooks/             # Custom React hooks
│   │   └── utils/             # Utility functions
│   ├── types/                 # TypeScript type definitions
│   │   └── index.ts           # Shared types (matches DB schema)
│   └── styles/
│       └── globals.css        # Design System styles
├── public/
│   └── fonts/                 # National2Condensed, ESKlarheit fonts
��── supabase/
│   ├── migrations/            # Database migration SQL files
│   └── functions/             # Edge Functions (if needed)
├── .env.local                 # Environment variables (Supabase URL/keys)
├── package.json
├── tsconfig.json
├── next.config.js
└── tailwind.config.ts
```

## Service Architecture

**Architecture**: Serverless Monolith (Next.js on Vercel + Supabase Backend)

**Frontend**: Next.js 14+ with App Router
- Server Components for initial page loads (faster performance)
- Client Components for interactive features
- API Routes for server-side business logic when needed

**Backend**: Supabase (Serverless PostgreSQL + Auth + Storage + Realtime)
- PostgreSQL database with automatic scaling
- Row Level Security for data isolation
- Supabase Auth for user management
- Realtime subscriptions for live updates
- Edge Functions for complex server-side logic (if needed)

**Rationale**: This architecture provides:
- Zero devops overhead (Vercel handles frontend, Supabase handles backend)
- Automatic scaling for both frontend and database
- Built-in authentication and real-time capabilities
- Developer-friendly with instant API generation from database schema

## Testing Requirements

**Testing Strategy**: Unit + Integration Testing

**Unit Tests**:
- Utility functions (date formatting, calculation logic)
- React component logic (using React Testing Library)
- Supabase query functions

**Integration Tests**:
- User flows (authentication, creating entries, viewing analytics)
- Database operations with test database
- API route handlers

**Test Tools**:
- **Jest** - Test runner and assertion library
- **React Testing Library** - Component testing
- **Playwright** (optional) - E2E tests for critical user journeys

**Coverage Target**: 70% code coverage for core business logic

**CI/CD Integration**: Tests run automatically on push via GitHub Actions before deployment

## Additional Technical Assumptions and Requests

**Technology Stack**:
- **Language**: TypeScript (strict mode enabled)
- **Frontend Framework**: Next.js 14+ (React 18)
- **Styling**: Tailwind CSS 4.0 + Custom Design System
- **Backend**: Supabase (PostgreSQL + Auth + Realtime)
- **Charts/Visualizations**: Recharts library
- **Icons**: Heroicons (outline and solid variants)
- **Date Handling**: date-fns for timezone-aware date operations
- **HTTP Client**: Native fetch + Supabase client
- **State Management**: React Context API for global state, Zustand for complex client state (if needed)

**Deployment**:
- **Frontend Hosting**: Vercel (automatic deployments from GitHub main branch)
- **Database**: Supabase cloud (free tier supports up to 500MB database, 2GB file storage, 50,000 monthly active users)
- **Environment**: Staging and Production environments (separate Supabase projects)
- **Domain**: Custom domain with SSL (managed by Vercel)

**Authentication Flow**:
- Supabase Auth handles all authentication logic
- JWT tokens stored in httpOnly cookies for security
- Automatic session refresh on token expiration
- Protected routes using Next.js middleware checking auth state

**Database Schema Principles**:
- User ID as primary foreign key across all user data tables
- Timestamps (created_at, updated_at) on all tables via triggers
- Soft deletes where appropriate (deleted_at column)
- Indexes on frequently queried columns (user_id, date, timestamp)
- RLS policies enforcing user data isolation

**Performance Optimizations**:
- Next.js Image component for optimized image loading
- React.memo for expensive component renders
- Supabase query result caching (with invalidation on mutations)
- Lazy loading for analytics charts (only load when tab is viewed)
- Code splitting by route (automatic with Next.js App Router)

**Error Handling**:
- Global error boundary for uncaught React errors
- Toast notifications for user-facing errors
- Detailed error logging to console in development
- Sanitized error messages in production
- Retry logic for failed Supabase queries

---
