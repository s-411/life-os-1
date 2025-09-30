# Testing Strategy

## Testing Pyramid

```
         E2E Tests
        /        \
    Integration Tests
    /            \
Frontend Unit  Backend Unit
```

**Test Distribution Target:**
- 70% Unit tests (fast, isolated)
- 20% Integration tests (API + database)
- 10% E2E tests (critical user journeys)

---

## Test Organization

### Frontend Tests

```
tests/unit/
├── utils/
│   ├── date.test.ts          # Timezone utilities
│   ├── calculations.test.ts  # BMR, BMI, calorie balance
│   └── validation.test.ts    # Form validation
├── hooks/
│   ├── useAuth.test.ts
│   └── useFoodEntries.test.ts
└── components/
    ├── MITList.test.tsx
    ├── FoodLogTable.test.tsx
    └── MacroProgressBars.test.tsx
```

### Backend Tests

```
tests/integration/
├── api/
│   ├── calculate-bmr.test.ts
│   └── export-data.test.ts
└── database/
    ├── rls-policies.test.ts  # Verify RLS isolation
    └── migrations.test.ts    # Verify schema integrity
```

### E2E Tests

```
tests/e2e/
├── auth.spec.ts              # Sign up, login, logout
├── daily-tracker.spec.ts     # MITs, weight entry, quick actions
├── calories.spec.ts          # Food/exercise logging, macro tracking
└── analytics.spec.ts         # Chart rendering, time filters
```

---

## Test Examples

### Frontend Component Test

```typescript
// tests/unit/components/MITList.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import MITList from '@/components/daily/MITList';

// Mock Supabase client
jest.mock('@supabase/auth-helpers-nextjs', () => ({
  createClientComponentClient: jest.fn(),
}));

describe('MITList Component', () => {
  const mockSupabase = {
    from: jest.fn(() => ({
      insert: jest.fn(() => ({
        select: jest.fn(() => ({
          single: jest.fn(() => Promise.resolve({ data: mockNewMIT, error: null })),
        })),
      })),
      update: jest.fn(() => ({
        eq: jest.fn(() => Promise.resolve({ data: null, error: null })),
      })),
    })),
    channel: jest.fn(() => ({
      on: jest.fn().mockReturnThis(),
      subscribe: jest.fn(),
    })),
  };

  beforeEach(() => {
    (createClientComponentClient as jest.Mock).mockReturnValue(mockSupabase);
  });

  it('renders initial MITs', () => {
    const initialMITs = [
      { id: '1', title: 'Complete project proposal', completed: false, user_id: 'user1', date: '2025-01-30', completed_at: null, created_at: '2025-01-30T08:00:00Z', updated_at: '2025-01-30T08:00:00Z' },
    ];

    render(<MITList initialMITs={initialMITs} />);

    expect(screen.getByText('Complete project proposal')).toBeInTheDocument();
  });

  it('adds a new MIT when form submitted', async () => {
    const mockNewMIT = {
      id: '2',
      title: 'Review PRD',
      completed: false,
      user_id: 'user1',
      date: '2025-01-30',
      completed_at: null,
      created_at: '2025-01-30T09:00:00Z',
      updated_at: '2025-01-30T09:00:00Z',
    };

    render(<MITList initialMITs={[]} />);

    const input = screen.getByPlaceholderText("What's most important today?");
    const addButton = screen.getByText('Add MIT');

    fireEvent.change(input, { target: { value: 'Review PRD' } });
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(mockSupabase.from).toHaveBeenCalledWith('mits');
    });
  });

  it('toggles MIT completion status', async () => {
    const initialMITs = [
      { id: '1', title: 'Test MIT', completed: false, user_id: 'user1', date: '2025-01-30', completed_at: null, created_at: '2025-01-30T08:00:00Z', updated_at: '2025-01-30T08:00:00Z' },
    ];

    render(<MITList initialMITs={initialMITs} />);

    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);

    await waitFor(() => {
      expect(mockSupabase.from().update).toHaveBeenCalled();
    });
  });
});
```

### Backend API Test

```typescript
// tests/integration/api/calculate-bmr.test.ts
import { POST } from '@/app/api/calculate-bmr/route';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { NextRequest } from 'next/server';

jest.mock('@supabase/auth-helpers-nextjs');

describe('POST /api/calculate-bmr', () => {
  const mockSupabase = {
    auth: {
      getUser: jest.fn(),
    },
    from: jest.fn(() => ({
      update: jest.fn(() => ({
        eq: jest.fn(() => ({
          select: jest.fn(() => ({
            single: jest.fn(() => Promise.resolve({ data: mockProfile, error: null })),
          })),
        })),
      })),
    })),
  };

  beforeEach(() => {
    (createRouteHandlerClient as jest.Mock).mockReturnValue(mockSupabase);
  });

  it('calculates BMR correctly for male', async () => {
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: { id: 'user1' } },
      error: null,
    });

    const mockProfile = {
      id: 'user1',
      bmr: 2145,
      gender: 'male',
      height: 180,
      weight: 82,
      age: 30,
      timezone: 'UTC',
      created_at: '2025-01-30T00:00:00Z',
      updated_at: '2025-01-30T00:00:00Z',
    };

    const request = new NextRequest('http://localhost:3000/api/calculate-bmr', {
      method: 'POST',
      body: JSON.stringify({
        height: 180,
        weight: 82,
        age: 30,
        gender: 'male',
      }),
    });

    const response = await POST(request);
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json.bmr).toBe(2145); // 10*82 + 6.25*180 - 5*30 + 5 = 2145
  });

  it('returns 401 for unauthenticated requests', async () => {
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: null },
      error: new Error('Not authenticated'),
    });

    const request = new NextRequest('http://localhost:3000/api/calculate-bmr', {
      method: 'POST',
      body: JSON.stringify({
        height: 180,
        weight: 82,
        age: 30,
        gender: 'male',
      }),
    });

    const response = await POST(request);

    expect(response.status).toBe(401);
  });
});
```

### E2E Test

```typescript
// tests/e2e/daily-tracker.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Daily Tracker', () => {
  test.beforeEach(async ({ page }) => {
    // Login as test user
    await page.goto('/login');
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'testpassword123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/daily');
  });

  test('displays current date', async ({ page }) => {
    const today = new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    await expect(page.locator('text=' + today)).toBeVisible();
  });

  test('adds a new MIT', async ({ page }) => {
    await page.fill('input[placeholder="What\'s most important today?"]', 'Complete E2E tests');
    await page.click('button:has-text("Add MIT")');

    await expect(page.locator('text=Complete E2E tests')).toBeVisible();
  });

  test('toggles MIT completion', async ({ page }) => {
    // Add MIT first
    await page.fill('input[placeholder="What\'s most important today?"]', 'Test MIT');
    await page.click('button:has-text("Add MIT")');

    // Toggle completion
    const checkbox = page.locator('input[type="checkbox"]').first();
    await checkbox.click();

    // Verify completed state (strikethrough)
    await expect(page.locator('text=Test MIT')).toHaveCSS('text-decoration', /line-through/);
  });

  test('logs daily weight with BMI calculation', async ({ page }) => {
    await page.fill('input[placeholder="Enter today\'s weight (kg)"]', '82.5');
    await page.click('button:has-text("Save")');

    // Assuming user profile has height of 180cm
    // BMI = 82.5 / (1.8)^2 = 25.5
    await expect(page.locator('text=/BMI: 25.5/')).toBeVisible();
  });
});
```

---
