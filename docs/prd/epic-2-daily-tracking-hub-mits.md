# Epic 2: Daily Tracking Hub & MITs

**Epic Goal**: Build the Daily Tracker page as the central hub for daily activities, featuring the MITs (Most Important Things) system, weight tracking with BMI calculation, deep work session tracking, and weekly objectives review section (Fridays). Users can manage their daily priorities and track core health metrics.

## Story 2.1: Daily Tracker Page Layout & Date Display

As a **user**,
I want **to see the current date prominently displayed on my Daily Tracker**,
so that **I know which day's data I'm viewing and entering**.

**Acceptance Criteria**:

1. Daily Tracker page created at `/app/daily/page.tsx`
2. Current date displayed prominently at top in user's timezone
3. Date format: "Monday, January 30th, 2025" (full day name, month, ordinal day, year)
4. Page title "Daily Tracker" displayed with MM design system heading styles
5. Page layout uses card-based design with dark background
6. Responsive layout: single column on mobile, multi-column grid on desktop
7. Page accessible via "Daily" link in navigation

## Story 2.2: MITs (Most Important Things) System

As a **user**,
I want **to add up to 3 Most Important Things for each day and mark them complete**,
so that **I can focus on my top priorities and track my daily accomplishments**.

**Acceptance Criteria**:

1. Supabase database table `mits` created with schema:
   - `id` (UUID, primary key)
   - `user_id` (UUID, foreign key to auth.users, not null)
   - `date` (DATE, not null)
   - `title` (TEXT, not null)
   - `completed` (BOOLEAN, default false)
   - `completed_at` (TIMESTAMP, nullable)
   - `created_at` (TIMESTAMP)
   - `updated_at` (TIMESTAMP)
2. RLS policy: Users can CRUD only their own MITs (user_id = auth.uid())
3. Unique constraint: (user_id, date, title) to prevent duplicate MITs
4. Daily Tracker displays "Today's MITs" section with card styling
5. Add MIT form with single text input (placeholder: "What's most important today?")
6. Add button disabled when 3 MITs already exist for the day
7. Each MIT displayed with checkbox and title text
8. Clicking checkbox toggles completed status and saves to Supabase
9. Completed MITs show with strikethrough text and faded appearance
10. Delete button (×) on each MIT to remove it
11. MITs load from Supabase for current date on page load
12. Empty state message displayed when no MITs exist: "Add your first MIT to focus on what matters most today."

## Story 2.3: Daily Weight Tracking with BMI Calculation

As a **user**,
I want **to log my daily weight and see my BMI automatically calculated**,
so that **I can track my weight progress and understand my body composition**.

**Acceptance Criteria**:

1. Supabase database table `daily_entries` created with schema:
   - `id` (UUID, primary key)
   - `user_id` (UUID, foreign key to auth.users, not null)
   - `date` (DATE, not null, unique per user)
   - `weight` (NUMERIC, nullable)
   - `deep_work_completed` (BOOLEAN, default false)
   - `winners_bible_morning` (BOOLEAN, default false)
   - `winners_bible_night` (BOOLEAN, default false)
   - `created_at` (TIMESTAMP)
   - `updated_at` (TIMESTAMP)
2. RLS policy: Users can CRUD only their own daily entries (user_id = auth.uid())
3. Unique constraint: (user_id, date) ensures one entry per day per user
4. "Weight Tracking" card displayed on Daily Tracker
5. Weight input field (number, step 0.1, placeholder "Enter today's weight (kg)")
6. Save button persists weight to `daily_entries.weight` for current date
7. BMI calculation displayed immediately after weight entered using formula: `BMI = weight(kg) / (height(m))²`
8. Height retrieved from user's profile (stored in cm, converted to m for calculation)
9. BMI displayed with 1 decimal precision (e.g., "BMI: 24.2")
10. BMI color-coded: Green (<25), Yellow (25-30), Red (>30)
11. Previously entered weight for the day pre-fills input field on page load
12. Toast notification on successful weight save

## Story 2.4: Deep Work Session Tracking

As a **user**,
I want **to mark when I've completed my deep work session for the day**,
so that **I can track my productivity consistency**.

**Acceptance Criteria**:

1. "Deep Work Session" card displayed on Daily Tracker
2. Large checkbox labeled "Deep Work Session Completed"
3. Checkbox state bound to `daily_entries.deep_work_completed` for current date
4. Clicking checkbox toggles state and saves to Supabase immediately
5. Completed state shows checkmark with green background
6. Incomplete state shows empty checkbox with gray background
7. Checkbox state persists across page reloads
8. If no daily_entry exists for current date, creating one when checkbox toggled

## Story 2.5: Weekly Objectives Review (Friday Feature)

As a **user**,
I want **to see a Weekly Objectives Review section every Friday**,
so that **I can reflect on my week, note accomplishments, and plan ahead**.

**Acceptance Criteria**:

1. Supabase database table `weekly_reviews` created with schema:
   - `id` (UUID, primary key)
   - `user_id` (UUID, foreign key to auth.users, not null)
   - `week_start_date` (DATE, not null) // Monday of the week
   - `review_date` (DATE, not null) // Friday when review created
   - `objectives` (TEXT, nullable)
   - `accomplishments` (TEXT, nullable)
   - `observations` (TEXT, nullable)
   - `next_week_focus` (TEXT, nullable)
   - `created_at` (TIMESTAMP)
   - `updated_at` (TIMESTAMP)
2. RLS policy: Users can CRUD only their own reviews (user_id = auth.uid())
3. Unique constraint: (user_id, week_start_date) ensures one review per week
4. "Weekly Objectives Review" section displayed ONLY on Fridays
5. Section shows prominently with distinct styling (gradient border or highlighted card)
6. Form fields:
   - "This Week's Objectives" (textarea)
   - "Key Accomplishments" (textarea)
   - "Important Observations" (textarea)
   - "Next Week's Focus" (textarea)
7. Save button persists review to Supabase
8. If review already exists for current week, form pre-fills with existing data
9. Success message shown after saving: "Weekly review saved! 🎉"
10. Section hidden on non-Friday days
11. Link to Analytics page to view past weekly reviews

## Story 2.6: Quick Action Cards for Navigation

As a **user**,
I want **to see quick-action cards summarizing my calories, injections, and Nirvana status**,
so that **I can quickly navigate to those sections and see my progress at a glance**.

**Acceptance Criteria**:

1. "Quick Actions" section displayed on Daily Tracker below MITs and weight tracking
2. Three cards displayed in responsive grid (1 column mobile, 3 columns desktop):
   - **Calories Summary Card**
   - **Injections Summary Card**
   - **Nirvana Status Card**
3. **Calories Summary Card** shows:
   - Icon (FireIcon)
   - "Calorie Balance" title
   - Current balance value (e.g., "+450 cal" or "-320 cal")
   - Color-coded: Green (positive), Red (negative)
   - Click navigates to /calories
4. **Injections Summary Card** shows:
   - Icon (BeakerIcon)
   - "Injections This Week" title
   - Count of injections in past 7 days
   - Click navigates to /injections
5. **Nirvana Status Card** shows:
   - Icon (UserIcon)
   - "Nirvana Life" title
   - Session completion indicator (e.g., "2/7 sessions this week")
   - Click navigates to /nirvana
6. Cards styled with hover effects (scale slightly, border color change)
7. Cards use MM design system card-mm class
8. Loading states displayed while data fetches (skeleton loaders)

---
