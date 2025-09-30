# Epic 4: Injection Management & Compound Tracking

**Epic Goal**: Create a comprehensive injection tracking system allowing users to log injections of various compounds, set weekly dosage targets, monitor adherence, and analyze injection patterns. Users can manage their medication/supplement injection schedules with precision.

## Story 4.1: Injection Compounds Configuration

As a **user**,
I want **to manage a list of compounds I inject**,
so that **I can quickly select from my compounds when logging injections**.

**Acceptance Criteria**:

1. Supabase database table `compounds` created with schema:
   - `id` (UUID, primary key)
   - `user_id` (UUID, foreign key to auth.users, not null)
   - `name` (TEXT, not null)
   - `created_at` (TIMESTAMP)
2. RLS policy: Users can CRUD only their own compounds (user_id = auth.uid())
3. Unique constraint: (user_id, name) prevents duplicate compound names per user
4. Compound management UI in Settings page (Epic 7)
5. Default compounds seeded for new users: ["Ipamorellin", "Retatrutide", "Testosterone"]
6. Compounds used as options in injection logging dropdown

## Story 4.2: Injection Logging with Details

As a **user**,
I want **to log injections with compound, dosage, unit, date, time, and optional notes**,
so that **I have a detailed record of all my injections**.

**Acceptance Criteria**:

1. Supabase database table `injections` created with schema:
   - `id` (UUID, primary key)
   - `user_id` (UUID, foreign key to auth.users, not null)
   - `compound` (TEXT, not null)
   - `dosage` (NUMERIC, not null)
   - `unit` (TEXT, not null) // mg, ml, mcg, IU
   - `date` (DATE, not null)
   - `time` (TIME, not null)
   - `notes` (TEXT, nullable)
   - `created_at` (TIMESTAMP)
2. RLS policy: Users can CRUD only their own injections (user_id = auth.uid())
3. Index on (user_id, date) for fast queries
4. Injections page created at `/app/injections/page.tsx`
5. "Add Injection" form displayed prominently with fields:
   - Compound (dropdown from user's compounds list)
   - Dosage (number input, step 0.1)
   - Unit (dropdown: mg, ml, mcg, IU)
   - Date (date picker, defaults to today)
   - Time (time input, defaults to current time)
   - Notes (text input, optional)
6. Submit button adds injection to Supabase and refreshes list
7. "Injection History" table displays:
   - Date | Time | Compound | Dosage + Unit | Notes | Actions
8. Delete button (trash icon) removes injection
9. Table sorted by timestamp (newest first)
10. Empty state message: "No injections logged yet. Add your first injection above."

## Story 4.3: Injection History Filtering

As a **user**,
I want **to filter my injection history by time range and compound**,
so that **I can focus on specific compounds or recent injections**.

**Acceptance Criteria**:

1. Time range filter dropdown on Injections page with options:
   - 3 Days
   - 7 Days (default)
   - 30 Days
   - 60 Days
   - 90 Days
   - All Time
2. Compound filter dropdown with options:
   - All Compounds (default)
   - [List of user's compounds]
   - Custom (compounds not in user's predefined list)
3. Injection history table updates immediately when filters changed
4. Filter state persists during session (stored in React state, not URL or database)
5. Statistics cards update based on filtered results
6. "Showing X injections" message displays filtered count

## Story 4.4: Weekly Injection Targets & Progress Tracking

As a **user**,
I want **to set weekly dosage targets for each compound and see my progress**,
so that **I can ensure I'm following my prescribed injection protocol**.

**Acceptance Criteria**:

1. Supabase database table `injection_targets` created with schema:
   - `id` (UUID, primary key)
   - `user_id` (UUID, foreign key to auth.users, not null)
   - `compound` (TEXT, not null)
   - `dose_amount` (NUMERIC, not null) // Single injection dose
   - `frequency` (INTEGER, not null) // Times per week
   - `unit` (TEXT, not null)
   - `enabled` (BOOLEAN, default true)
   - `created_at` (TIMESTAMP)
   - `updated_at` (TIMESTAMP)
2. RLS policy: Users can CRUD only their own targets (user_id = auth.uid())
3. Calculated weekly target: `weekly_target = dose_amount × frequency`
4. "Weekly Dosage Analysis" section on Injections page displays cards for each compound with target set
5. Each card shows:
   - Compound name
   - Target: `150mg/week` (weekly_target + unit)
   - Actual: `120mg` (sum of injections in last 7 days)
   - Progress: `80%` (actual / target × 100)
   - Injection count: `4/5` (actual injection count / frequency)
   - Status icon: ✓ Green (90-110%), ⚠️ Yellow (70-89% or 111-130%), ❌ Red (<70% or >130%)
6. Actual dosage calculated from injections in last 7 rolling days (not calendar week)
7. Cards color-coded by progress status
8. Target management in Settings page (Epic 7)
9. Empty state: "Set injection targets in Settings to track weekly progress."

## Story 4.5: Injection Statistics Overview

As a **user**,
I want **to see high-level statistics about my injection history**,
so that **I can quickly understand my injection patterns**.

**Acceptance Criteria**:

1. Statistics cards section displayed on Injections page (above history table)
2. Four cards displayed in responsive grid:
   - **Total Injections** (count based on current time filter)
   - **Compounds Tracked** (unique compound count)
   - **This Week** (injection count in last 7 days, regardless of filter)
   - **Last Injection** (date and compound of most recent injection)
3. Each card includes:
   - Icon (BeakerIcon with different colors)
   - Metric value (large, bold number)
   - Label describing metric
4. Cards styled with MM design system card-mm class
5. Statistics update in real-time as injections added/removed
6. Statistics reflect filtered data (except "This Week" and "Last Injection" which are always absolute)

---
