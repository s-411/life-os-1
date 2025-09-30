# Security and Performance

## Security Requirements

**Frontend Security:**
- **CSP Headers**: `default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https://*.supabase.co;`
- **XSS Prevention**: React's built-in escaping + Content Security Policy
- **Secure Storage**: JWT tokens stored in httpOnly cookies (managed by Supabase Auth)

**Backend Security:**
- **Input Validation**: All API routes validate inputs with Zod schemas
- **Rate Limiting**: Supabase provides built-in rate limiting (configurable in dashboard)
- **CORS Policy**: Configured in Supabase dashboard to allow only production domain

**Authentication Security:**
- **Token Storage**: JWT tokens in httpOnly cookies (not accessible to JavaScript)
- **Session Management**: 30-day sliding window (configurable in Supabase Auth)
- **Password Policy**: Minimum 8 characters, enforced by Supabase Auth

**Row Level Security:**
- All tables have RLS policies enforcing `auth.uid() = user_id`
- No user can access another user's data under any circumstance
- RLS policies tested in migration files

---

## Performance Optimization

**Frontend Performance:**
- **Bundle Size Target**: < 200KB initial JavaScript (measured with `next build`)
- **Loading Strategy**: Next.js automatic code splitting + React.lazy for heavy components
- **Caching Strategy**:
  - Static assets cached for 1 year (`Cache-Control: public, max-age=31536000, immutable`)
  - API responses cached client-side with Supabase query cache
  - Vercel Edge Cache for static pages

**Backend Performance:**
- **Response Time Target**: < 500ms for database queries (measured with Supabase performance insights)
- **Database Optimization**:
  - Indexes on `(user_id, date)` for all daily data tables
  - EXPLAIN ANALYZE used to verify query plans
  - Connection pooling managed by Supabase (PgBouncer)
- **Caching Strategy**:
  - Supabase client-side query cache (5 minutes default)
  - No server-side cache needed (Supabase handles this)

---
