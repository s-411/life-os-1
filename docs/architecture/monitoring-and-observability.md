# Monitoring and Observability

## Monitoring Stack

- **Frontend Monitoring:** Vercel Analytics (built-in, zero-config)
- **Backend Monitoring:** Supabase Dashboard (query performance, RLS policy hits)
- **Error Tracking:** Console logging (development), Supabase Logs (production)
- **Performance Monitoring:** Vercel Speed Insights + Chrome Lighthouse CI

## Key Metrics

**Frontend Metrics:**
- Core Web Vitals (LCP, FID, CLS)
- JavaScript errors (tracked by Vercel Analytics)
- API response times (client-side timing API)
- User interactions (custom events via Vercel Analytics)

**Backend Metrics:**
- Request rate (Supabase dashboard)
- Error rate (Supabase logs)
- Response time (Supabase performance insights)
- Database query performance (EXPLAIN ANALYZE in migrations)

**Custom Metrics:**
- Daily active users (Supabase Auth dashboard)
- Average MITs completed per user (analytics query)
- Food entries per day (analytics query)
- Weekly review completion rate (analytics query)

## Monitoring Dashboard Access

- **Vercel Dashboard**: https://vercel.com/your-org/life-os
- **Supabase Dashboard**: https://app.supabase.com/project/your-project-id
- **GitHub Actions**: https://github.com/your-org/life-os/actions

---
