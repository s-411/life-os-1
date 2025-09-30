# Deployment Architecture

## Deployment Strategy

**Frontend Deployment:**
- **Platform:** Vercel
- **Build Command:** `npm run build`
- **Output Directory:** `.next`
- **CDN/Edge:** Vercel Edge Network (automatic global distribution)

**Backend Deployment:**
- **Platform:** Supabase Cloud (fully managed)
- **Build Command:** `supabase db push` (migrations applied automatically)
- **Deployment Method:** Git-based continuous deployment

### Deployment Workflow

1. **Push to GitHub**: Developer pushes code to `main` branch
2. **GitHub Actions**: CI pipeline runs tests
3. **Vercel**: Automatically deploys frontend on test pass
4. **Supabase**: Migrations applied via Supabase CLI or dashboard
5. **Monitoring**: Vercel Analytics + Supabase Logs start tracking

---

## CI/CD Pipeline

```yaml
# .github/workflows/ci.yaml
name: CI Pipeline

on:
  pull_request:
    branches: [main]
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run linter
        run: npm run lint

      - name: Run unit tests
        run: npm test

      - name: Run build
        run: npm run build

      - name: Run E2E tests
        run: npm run test:e2e
        env:
          NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.SUPABASE_ANON_KEY }}

      - name: Upload test coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info
```

---

## Environments

| Environment | Frontend URL | Backend URL | Purpose |
|-------------|-------------|-------------|---------|
| Development | http://localhost:3000 | http://localhost:54321 (Supabase local) | Local development |
| Staging | https://staging.lifeos.app | https://staging-project.supabase.co | Pre-production testing |
| Production | https://lifeos.app | https://prod-project.supabase.co | Live environment |

**Branch Strategy:**
- `main` → Production (auto-deploy via Vercel)
- `staging` → Staging (auto-deploy via Vercel preview)
- `feature/*` → Preview deployments (Vercel preview URLs)

---
