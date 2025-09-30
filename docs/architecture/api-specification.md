# API Specification

Life OS uses **Supabase Client SDK** for API interactions, which provides a type-safe, auto-generated API from the PostgreSQL schema. This eliminates the need for a traditional REST or GraphQL API specification.

## Supabase Client Pattern

All database operations use the Supabase JavaScript client with automatic TypeScript types:

```typescript
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database.types'; // Auto-generated

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Example: Fetch user's profile
const { data: profile, error } = await supabase
  .from('profiles')
  .select('*')
  .eq('id', userId)
  .single();

// Example: Insert food entry
const { data: foodEntry, error } = await supabase
  .from('food_entries')
  .insert({
    user_id: userId,
    date: '2025-01-30',
    time: '12:30:00',
    name: 'Chicken Salad',
    calories: 450,
    protein: 35,
    carbs: 20,
    fat: 18
  })
  .select()
  .single();

// Example: Real-time subscription
const channel = supabase
  .channel('food-changes')
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'food_entries',
    filter: `user_id=eq.${userId}`
  }, (payload) => {
    console.log('Food entry changed:', payload);
  })
  .subscribe();
```

## Authentication API

Supabase Auth provides built-in methods:

```typescript
// Sign up
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'securepassword',
  options: {
    emailRedirectTo: 'https://lifeos.app/auth/callback'
  }
});

// Sign in
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'securepassword'
});

// OAuth sign in
const { data, error } = await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: {
    redirectTo: 'https://lifeos.app/auth/callback'
  }
});

// Sign out
const { error } = await supabase.auth.signOut();

// Get current user
const { data: { user } } = await supabase.auth.getUser();
```

## Next.js API Routes (When Needed)

For complex server-side operations, we use Next.js API Routes:

**Example: BMR Calculation with Profile Update**

```typescript
// app/api/calculate-bmr/route.ts
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  const { height, weight, age, gender } = await request.json();

  // Mifflin-St Jeor Equation
  let bmr: number;
  if (gender === 'male') {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5;
  } else if (gender === 'female') {
    bmr = 10 * weight + 6.25 * height - 5 * age - 161;
  } else {
    // Average for 'other'
    const male = 10 * weight + 6.25 * height - 5 * age + 5;
    const female = 10 * weight + 6.25 * height - 5 * age - 161;
    bmr = (male + female) / 2;
  }

  // Update profile
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data, error } = await supabase
    .from('profiles')
    .update({ bmr: Math.round(bmr), height, weight, age, gender })
    .eq('id', user.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ bmr: Math.round(bmr), profile: data });
}
```

---
