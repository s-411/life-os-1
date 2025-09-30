# Unified Project Structure

```
life-os/
├── .github/                      # CI/CD workflows
│   └── workflows/
│       ├── ci.yaml               # Run tests on PR
│       └── deploy.yaml           # Deploy to Vercel on merge
├── src/
│   ├── app/                      # Next.js 14 App Router
│   │   ├── layout.tsx            # Root layout (AuthProvider, fonts)
│   │   ├── page.tsx              # Landing page
│   │   ├── globals.css           # Design System styles
│   │   ├── (auth)/               # Auth routes (no sidebar)
│   │   │   ├── layout.tsx
│   │   │   ├── login/page.tsx
│   │   │   ├── signup/page.tsx
│   │   │   └── callback/route.ts
│   │   ├── (app)/                # App routes (with sidebar)
│   │   │   ├── layout.tsx        # App layout with navigation
│   │   │   ├── daily/page.tsx
│   │   │   ├── calories/page.tsx
│   │   │   ├── injections/page.tsx
│   │   │   ├── nirvana/page.tsx
│   │   │   ├── winners-bible/page.tsx
│   │   │   ├── analytics/page.tsx
│   │   │   ├── settings/page.tsx
│   │   │   └── bmr-calculator/page.tsx
│   │   └── api/                  # API routes
│   │       ├── calculate-bmr/route.ts
│   │       ├── export-data/route.ts
│   │       └── import-data/route.ts
│   ├── components/               # React components
│   │   ├── Navigation.tsx
│   │   ├── Header.tsx
│   │   ├── daily/
│   │   │   ├── MITList.tsx
│   │   │   ├── WeightEntry.tsx
│   │   │   ├── QuickActionCards.tsx
│   │   │   ├── WeeklyReview.tsx
│   │   │   └── DailySummaryCard.tsx
│   │   ├── calories/
│   │   │   ├── FoodLogTable.tsx
│   │   │   ├── AddFoodForm.tsx
│   │   │   ├── ExerciseLogTable.tsx
│   │   │   ├── AddExerciseForm.tsx
│   │   │   └── MacroProgressBars.tsx
│   │   ├── analytics/
│   │   │   ├── WeightChart.tsx
│   │   │   ├── CalorieBalanceChart.tsx
│   │   │   ├── InjectionHeatmap.tsx
│   │   │   └── MITCompletionChart.tsx
│   │   ├── onboarding/
│   │   │   └── OnboardingWizard.tsx
│   │   └── ui/
│   │       ├── Button.tsx
│   │       ├── Card.tsx
│   │       ├── Input.tsx
│   │       ├── Modal.tsx
│   │       └── Toast.tsx
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts         # Browser Supabase client
│   │   │   ├── server.ts         # Server Supabase client
│   │   │   └── middleware.ts     # Auth middleware
│   │   ├── context/
│   │   │   └── AuthContext.tsx   # Global auth state
│   │   ├── hooks/
│   │   │   ├── useAuth.ts
│   │   │   ├── useProfile.ts
│   │   │   ├── useDailyEntry.ts
│   │   │   ├── useFoodEntries.ts
│   │   │   └── useRealtime.ts
│   │   ├── services/
│   │   │   ├── calorie-balance.ts
│   │   │   └── calculations.ts
│   │   ├── repositories/         # Optional: complex queries
│   │   │   ├── food-entries.ts
│   │   │   └── injection-entries.ts
│   │   └── utils/
│   │       ├── date.ts           # Timezone utilities
│   │       ├── validation.ts     # Form validation
│   │       └── format.ts         # Data formatting
│   ├── types/
│   │   ├── database.types.ts     # Auto-generated from Supabase CLI
│   │   └── index.ts              # Shared types
│   └── middleware.ts             # Next.js middleware (auth)
├── public/
│   ├── fonts/                    # National2Condensed, ESKlarheit
│   │   ├── National2Condensed-Bold.woff2
│   │   └── ESKlarheit-Regular.woff2
│   └── images/
│       └── logo.svg
├── supabase/
│   ├── migrations/               # SQL migration files
│   │   ├── 20250130000000_initial_schema.sql
│   │   └── 20250130000001_lifestyle_modules.sql
│   ├── functions/                # Supabase Edge Functions (Deno)
│   │   └── send-weekly-reminder/ # Example: Friday review reminder
│   ├── seed.sql                  # Seed data for lifestyle modules
│   └── config.toml               # Supabase local config
├── tests/
│   ├── unit/                     # Unit tests (Jest)
│   │   ├── utils/
│   │   └── services/
│   ├── integration/              # Integration tests (Jest)
│   │   ├── api/
│   │   └── database/
│   └── e2e/                      # E2E tests (Playwright)
│       ├── auth.spec.ts
│       ├── daily-tracker.spec.ts
│       └��─ calories.spec.ts
├── docs/
│   ├── prd.md
│   ├── front-end-spec.md
│   └── architecture.md           # This document
├── .env.local                    # Local environment variables
├── .env.example                  # Environment variables template
├── package.json
├── tsconfig.json
├── next.config.js
├── tailwind.config.ts
├── jest.config.js
├── playwright.config.ts
└── README.md
```

---
