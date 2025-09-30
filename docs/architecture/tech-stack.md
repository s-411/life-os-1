# Tech Stack

## Technology Stack Table

| Category | Technology | Version | Purpose | Rationale |
|----------|-----------|---------|---------|-----------|
| Frontend Language | TypeScript | 5.3+ | Type-safe development across entire stack | Catch errors at compile-time, better IDE support, self-documenting code |
| Frontend Framework | Next.js | 14.2+ | React framework with App Router | Built-in SSR/SSG, excellent DX, automatic code splitting, Vercel-optimized |
| UI Component Library | Headless UI | 2.0+ | Accessible unstyled components | WCAG compliance out of the box, pairs perfectly with Tailwind |
| State Management | React Context + Zustand | 4.5+ | Global client-side state | Context for auth/user state, Zustand for complex UI state if needed |
| Backend Language | TypeScript | 5.3+ | Server-side logic in Next.js API routes | Code sharing with frontend, consistent type system |
| Backend Framework | Supabase | Latest | Backend-as-a-Service platform | Managed database, auth, storage, real-time in one platform |
| API Style | Supabase Client SDK | 2.39+ | Direct database queries with RLS | Auto-generated from schema, type-safe, eliminates REST boilerplate |
| Database | PostgreSQL | 15+ | Primary data store | ACID compliance, mature ecosystem, excellent JSON support |
| Cache | Supabase Query Cache | Built-in | Client-side query result caching | Reduces redundant database queries, built into Supabase client |
| File Storage | Supabase Storage | Built-in | Winners Bible images, profile pictures | S3-compatible, integrated auth, automatic CDN |
| Authentication | Supabase Auth | Built-in | User authentication and session management | Email/password, OAuth, magic links, JWT tokens, email verification |
| Frontend Testing | Jest + React Testing Library | 29+ / 14+ | Unit and component tests | Industry standard, excellent React integration |
| Backend Testing | Jest + Supabase Test Helpers | 29+ | Database query and API route tests | Reuse Jest knowledge, Supabase provides test utilities |
| E2E Testing | Playwright | 1.40+ | Critical user journey tests | Fast, reliable, multi-browser support |
| Build Tool | Next.js | 14.2+ | Build orchestration | Built-in optimized build pipeline |
| Bundler | Turbopack | Built-in | Fast development builds | Next.js default, faster than Webpack |
| IaC Tool | Supabase CLI | 1.142+ | Database migrations, local development | Version-controlled schema changes, local Supabase instance |
| CI/CD | GitHub Actions | Latest | Automated testing and deployment | Free for public repos, excellent GitHub integration |
| Monitoring | Vercel Analytics + Supabase Logs | Built-in | Performance and error monitoring | Zero-config monitoring for both platforms |
| Logging | Console + Supabase Logs | Built-in | Application logging | Development: console, Production: Supabase dashboard |
| CSS Framework | Tailwind CSS | 4.0+ | Utility-first styling | Rapid UI development, excellent with Next.js, design system implementation |
| Icons | Heroicons | 2.1+ | UI icon library | Beautiful open-source icons, outline + solid variants |
| Charts | Recharts | 2.10+ | Data visualization | React-friendly, composable charts, good documentation |
| Date Handling | date-fns | 3.0+ | Timezone-aware date operations | Lightweight, tree-shakable, excellent timezone support |

---
