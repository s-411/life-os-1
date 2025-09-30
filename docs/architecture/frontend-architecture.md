# Frontend Architecture

## Component Architecture

### Component Organization

```
src/
├── app/                          # Next.js 14 App Router
│   ├── layout.tsx                # Root layout with providers
│   ├── page.tsx                  # Landing/login page
│   ├── daily/
│   │   └── page.tsx              # Daily Tracker page
│   ├── calories/
│   │   └── page.tsx              # Calories tracking
│   ├── injections/
│   │   └── page.tsx              # Injections management
│   ├── nirvana/
│   │   └── page.tsx              # Nirvana Life tracking
│   ├── winners-bible/
│   │   └── page.tsx              # Winners Bible slideshow
│   ├── analytics/
│   │   └── page.tsx              # Analytics dashboard
│   ├── settings/
│   │   └── page.tsx              # Settings configuration
│   ├── bmr-calculator/
│   │   └── page.tsx              # BMR calculator tool
│   └── auth/
│       ├── login/
│       │   └── page.tsx          # Login page
│       ├── signup/
│       │   └── page.tsx          # Signup page
│       └── callback/
│           └── route.ts          # OAuth callback handler
├── components/
│   ├── Navigation.tsx            # Sidebar + mobile nav
│   ├── Header.tsx                # Top header component
│   ├── daily/
│   │   ├── MITList.tsx           # MITs display and management
│   │   ├── WeightEntry.tsx       # Weight input with BMI
│   │   ├── QuickActionCards.tsx  # Quick navigation cards
│   │   ├── WeeklyReview.tsx      # Friday review form
│   │   └── DailySummaryCard.tsx  # Mini analytics summary
│   ├── calories/
│   │   ├── FoodLogTable.tsx      # Food entries table
│   │   ├── AddFoodForm.tsx       # Food entry form
│   │   ├── ExerciseLogTable.tsx  # Exercise entries table
│   │   ├── AddExerciseForm.tsx   # Exercise entry form
│   │   └── MacroProgressBars.tsx # Macro targets visualization
│   ├── analytics/
│   │   ├── WeightChart.tsx       # Weight progress line chart
│   │   ├── CalorieBalanceChart.tsx # Calorie balance bar chart
│   │   ├── InjectionHeatmap.tsx  # Injection consistency heatmap
│   │   └── MITCompletionChart.tsx # MIT completion trends
│   ├── onboarding/
│   │   └── OnboardingWizard.tsx  # Multi-step setup wizard
│   └── ui/
│       ├── Button.tsx            # Design System button
│       ├── Card.tsx              # Design System card
│       ├── Input.tsx             # Design System input
│       ├── Modal.tsx             # Modal overlay component
│       └── Toast.tsx             # Notification toasts
├── lib/
│   ├── supabase/
│   │   ├── client.ts             # Browser Supabase client
│   │   ├── server.ts             # Server-side Supabase client
│   │   └── middleware.ts         # Auth middleware
│   ├── hooks/
│   │   ├── useAuth.ts            # Authentication hook
│   │   ├── useProfile.ts         # User profile hook
│   │   ├── useDailyEntry.ts      # Daily entry hook
│   │   ├── useFoodEntries.ts     # Food entries hook
│   │   └── useRealtime.ts        # Real-time subscription hook
│   └── utils/
│       ├── date.ts               # Timezone-aware date utilities
│       ├── calculations.ts       # BMR, BMI, calorie balance
│       └── validation.ts         # Form validation helpers
├── types/
│   ├── database.types.ts         # Auto-generated from Supabase schema
│   └── index.ts                  # Shared types
└── styles/
    └── globals.css               # Design System + Tailwind
```

### Component Template

Standard Next.js Server Component template:

```typescript
// app/daily/page.tsx
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import MITList from '@/components/daily/MITList';
import WeightEntry from '@/components/daily/WeightEntry';
import { Database } from '@/types/database.types';

export default async function DailyTrackerPage() {
  const supabase = createServerComponentClient<Database>({ cookies });

  // Check authentication
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/auth/login');
  }

  // Fetch initial data on server
  const today = new Date().toISOString().split('T')[0];

  const [profileData, dailyEntryData, mitsData] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase.from('daily_entries').select('*').eq('user_id', user.id).eq('date', today).maybeSingle(),
    supabase.from('mits').select('*').eq('user_id', user.id).eq('date', today).order('created_at', { ascending: true })
  ]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-national2 mb-8">Daily Tracker</h1>

      {/* Server-rendered components */}
      <MITList initialMITs={mitsData.data || []} />
      <WeightEntry
        initialWeight={dailyEntryData.data?.weight}
        userHeight={profileData.data?.height}
      />
    </div>
  );
}
```

Standard Client Component template:

```typescript
// components/daily/MITList.tsx
'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/database.types';
import { useRealtime } from '@/lib/hooks/useRealtime';

type MIT = Database['public']['Tables']['mits']['Row'];

interface MITListProps {
  initialMITs: MIT[];
}

export default function MITList({ initialMITs }: MITListProps) {
  const supabase = createClientComponentClient<Database>();
  const [mits, setMITs] = useState<MIT[]>(initialMITs);
  const [newMITTitle, setNewMITTitle] = useState('');

  // Real-time subscription
  useRealtime('mits', (payload) => {
    if (payload.eventType === 'INSERT') {
      setMITs((prev) => [...prev, payload.new as MIT]);
    } else if (payload.eventType === 'UPDATE') {
      setMITs((prev) => prev.map((mit) =>
        mit.id === payload.new.id ? (payload.new as MIT) : mit
      ));
    } else if (payload.eventType === 'DELETE') {
      setMITs((prev) => prev.filter((mit) => mit.id !== payload.old.id));
    }
  });

  const addMIT = async () => {
    if (!newMITTitle.trim() || mits.length >= 3) return;

    const { data, error } = await supabase
      .from('mits')
      .insert({
        title: newMITTitle,
        date: new Date().toISOString().split('T')[0],
      })
      .select()
      .single();

    if (data) {
      setNewMITTitle('');
    }
  };

  const toggleComplete = async (mit: MIT) => {
    await supabase
      .from('mits')
      .update({
        completed: !mit.completed,
        completed_at: !mit.completed ? new Date().toISOString() : null
      })
      .eq('id', mit.id);
  };

  return (
    <div className="card-mm p-6">
      <h2 className="text-2xl font-national2 mb-4">Today's MITs</h2>

      <div className="space-y-3">
        {mits.map((mit) => (
          <div key={mit.id} className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={mit.completed}
              onChange={() => toggleComplete(mit)}
              className="w-5 h-5"
            />
            <span className={mit.completed ? 'line-through text-gray-500' : ''}>
              {mit.title}
            </span>
          </div>
        ))}
      </div>

      {mits.length < 3 && (
        <div className="mt-4 flex gap-2">
          <input
            type="text"
            value={newMITTitle}
            onChange={(e) => setNewMITTitle(e.target.value)}
            placeholder="What's most important today?"
            className="input-mm flex-1"
            onKeyPress={(e) => e.key === 'Enter' && addMIT()}
          />
          <button onClick={addMIT} className="btn-mm">Add MIT</button>
        </div>
      )}
    </div>
  );
}
```

---

## State Management Architecture

### State Structure

Life OS uses a **hybrid state management approach**:

1. **React Context** for global auth/user state
2. **Zustand** for complex UI state (if needed, e.g., multi-step forms)
3. **Server state cached** by Supabase client
4. **Local component state** for ephemeral UI (form inputs, modals)

**Auth Context:**

```typescript
// lib/context/AuthContext.tsx
'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/database.types';
import { User } from '@supabase/supabase-js';

type Profile = Database['public']['Tables']['profiles']['Row'];

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const supabase = createClientComponentClient<Database>();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        setProfile(profile);
      }

      setLoading(false);
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user || null);
        if (session?.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
          setProfile(profile);
        } else {
          setProfile(null);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  };

  const refreshProfile = async () => {
    if (!user) return;
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    setProfile(profile);
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
```

### State Management Patterns

- **Server State First**: Prefer fetching fresh data from Supabase on each page load (Next.js Server Components)
- **Optimistic Updates**: Update UI immediately, then sync to server
- **Real-time Sync**: Subscribe to Supabase Realtime for live multi-device updates
- **Minimal Client State**: Keep only UI state (form inputs, modal open/closed) in client components

---

## Routing Architecture

### Route Organization

```
app/
├── layout.tsx                    # Root layout (AuthProvider, global styles)
├── page.tsx                      # Landing/marketing page
├── (auth)/                       # Auth route group (no sidebar)
│   ├── layout.tsx                # Auth-specific layout
│   ├── login/page.tsx
│   ├── signup/page.tsx
│   └── callback/route.ts         # OAuth callback
├── (app)/                        # Authenticated app routes (with sidebar)
│   ├── layout.tsx                # App layout with navigation
│   ├── daily/page.tsx            # /daily
│   ├── calories/page.tsx         # /calories
│   ├── injections/page.tsx       # /injections
│   ├── nirvana/page.tsx          # /nirvana
│   ├── winners-bible/page.tsx    # /winners-bible
│   ├── analytics/page.tsx        # /analytics
│   ├── settings/page.tsx         # /settings
│   └── bmr-calculator/page.tsx   # /bmr-calculator
└── api/                          # API routes
    ├── calculate-bmr/route.ts
    └── export-data/route.ts
```

### Protected Route Pattern

Protected routes use Next.js middleware:

```typescript
// middleware.ts (root level)
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Protected routes require authentication
  const protectedRoutes = ['/daily', '/calories', '/injections', '/nirvana', '/winners-bible', '/analytics', '/settings', '/bmr-calculator'];
  const isProtectedRoute = protectedRoutes.some((route) => req.nextUrl.pathname.startsWith(route));

  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // Redirect authenticated users away from auth pages
  const authRoutes = ['/login', '/signup'];
  const isAuthRoute = authRoutes.some((route) => req.nextUrl.pathname.startsWith(route));

  if (isAuthRoute && session) {
    return NextResponse.redirect(new URL('/daily', req.url));
  }

  return res;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
```

---

## Frontend Services Layer

### API Client Setup

Supabase client is used directly in components (no separate service layer needed for most cases):

```typescript
// lib/supabase/client.ts
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/database.types';

export const createClient = () => createClientComponentClient<Database>();
```

```typescript
// lib/supabase/server.ts
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database } from '@/types/database.types';

export const createServerClient = () => createServerComponentClient<Database>({ cookies });
```

### Service Example

For complex operations, create utility functions:

```typescript
// lib/services/calorie-balance.ts
import { Database } from '@/types/database.types';

type FoodEntry = Database['public']['Tables']['food_entries']['Row'];
type ExerciseEntry = Database['public']['Tables']['exercise_entries']['Row'];

interface CalorieBalanceParams {
  bmr: number;
  foodEntries: FoodEntry[];
  exerciseEntries: ExerciseEntry[];
}

export function calculateCalorieBalance({ bmr, foodEntries, exerciseEntries }: CalorieBalanceParams): number {
  const totalFoodCalories = foodEntries.reduce((sum, entry) => sum + entry.calories, 0);
  const totalExerciseCalories = exerciseEntries.reduce((sum, entry) => sum + entry.calories_burned, 0);

  // Balance = BMR - Food Consumed + Exercise Burned
  return bmr - totalFoodCalories + totalExerciseCalories;
}

export function getBalanceColor(balance: number): string {
  if (balance >= 0) return 'text-green-500'; // Surplus
  return 'text-red-500'; // Deficit
}
```

---
