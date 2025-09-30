# Coding Standards

## Critical Fullstack Rules

- **Type Sharing:** Always define shared types in `src/types/` and import from there. Never duplicate type definitions between frontend and backend.
- **API Calls:** Use Supabase client directly in components. For complex operations, create utility functions in `src/lib/services/`.
- **Environment Variables:** Access only through config objects in `src/lib/config.ts`, never `process.env` directly (except in Next.js config files).
- **Error Handling:** All API routes must use the standard error handler pattern (try/catch with NextResponse.json).
- **State Updates:** Never mutate state directly - use React setState, Zustand actions, or Supabase mutations.
- **Database Queries:** Always filter by `user_id` to leverage RLS policies. Never assume RLS will catch mistakes.
- **Timestamps:** Use UTC timestamps in database, convert to user's timezone only in UI.
- **Real-time Subscriptions:** Clean up subscriptions in useEffect return to prevent memory leaks.

## Naming Conventions

| Element | Frontend | Backend | Example |
|---------|----------|---------|---------|
| Components | PascalCase | - | `UserProfile.tsx` |
| Hooks | camelCase with 'use' | - | `useAuth.ts` |
| API Routes | kebab-case | kebab-case | `/api/user-profile` |
| Database Tables | - | snake_case | `user_profiles` |
| Database Columns | - | snake_case | `created_at` |
| TypeScript Types | PascalCase | PascalCase | `Profile` |
| Functions | camelCase | camelCase | `calculateBMR` |
| Constants | UPPER_SNAKE_CASE | UPPER_SNAKE_CASE | `MAX_MITS_PER_DAY` |

---
