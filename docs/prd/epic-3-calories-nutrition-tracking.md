# Epic 3: Calories & Nutrition Tracking

**Epic Goal**: Implement comprehensive calorie and nutrition tracking including food logging with macro breakdowns, exercise logging, food templates for quick entry, macro target tracking with progress visualization, and real-time calorie balance calculations. Users gain complete control over their nutritional intake and energy expenditure.

## Story 3.1: Calories Page Layout & Balance Display

As a **user**,
I want **to see my daily calorie balance calculated automatically**,
so that **I know if I'm in a surplus or deficit for the day**.

**Acceptance Criteria**:

1. Calories page created at `/app/calories/page.tsx`
2. Page title "Calories & Nutrition" with current date
3. Date picker to view historical dates (defaults to today)
4. Prominent calorie balance card displayed at top with formula:
   **Balance = BMR - Total Food Calories + Total Exercise Calories**
5. Balance card shows:
   - BMR value (from user profile)
   - Total calories consumed (sum of food entries)
   - Total calories burned (sum of exercise entries)
   - Net balance with large, bold number
6. Balance color-coded: Green (positive/surplus), Red (negative/deficit)
7. Balance updates in real-time as food/exercise entries added
8. If BMR not set in profile, show warning: "Set your BMR in Settings to see accurate balance."

## Story 3.2: Food Logging with Macro Tracking

As a **user**,
I want **to log food entries with calories and macros (carbs, protein, fat)**,
so that **I can track my nutritional intake precisely**.

**Acceptance Criteria**:

1. Supabase database table `food_entries` created with schema:
   - `id` (UUID, primary key)
   - `user_id` (UUID, foreign key to auth.users, not null)
   - `date` (DATE, not null)
   - `time` (TIME, not null)
   - `name` (TEXT, not null)
   - `calories` (INTEGER, not null)
   - `carbs` (NUMERIC, default 0)
   - `protein` (NUMERIC, default 0)
   - `fat` (NUMERIC, default 0)
   - `created_at` (TIMESTAMP)
2. RLS policy: Users can CRUD only their own food entries (user_id = auth.uid())
3. Index on (user_id, date) for fast daily queries
4. "Food Log" section on Calories page with table displaying:
   - Time | Food Name | Calories | Carbs (g) | Protein (g) | Fat (g) | Actions
5. "Add Food" form with fields:
   - Name (text input)
   - Calories (number input, required)
   - Carbs (number input, optional)
   - Protein (number input, optional)
   - Fat (number input, optional)
   - Time (time input, defaults to current time)
6. Submit button adds food entry to Supabase and refreshes list
7. Delete button (trash icon) on each table row removes entry
8. Food entries sorted by time (newest first)
9. Total calories, carbs, protein, fat displayed in table footer row (sum of all entries)
10. Empty state message when no food entries: "No food logged yet today. Add your first meal above."
11. Mobile-responsive: Table converts to card layout on small screens

## Story 3.3: Food Templates System

As a **user**,
I want **to create reusable food templates for frequently eaten meals**,
so that **I can quickly log common foods without re-entering macros every time**.

**Acceptance Criteria**:

1. Supabase database table `food_templates` created with schema:
   - `id` (UUID, primary key)
   - `user_id` (UUID, foreign key to auth.users, not null)
   - `name` (TEXT, not null)
   - `calories` (INTEGER, not null)
   - `carbs` (NUMERIC, default 0)
   - `protein` (NUMERIC, default 0)
   - `fat` (NUMERIC, default 0)
   - `created_at` (TIMESTAMP)
2. RLS policy: Users can CRUD only their own templates (user_id = auth.uid())
3. "Add Food" form on Calories page includes template selector dropdown
4. Dropdown shows: "Quick Add Template" with list of user's saved templates
5. Selecting a template auto-fills form fields (name, calories, carbs, protein, fat)
6. User can still edit auto-filled values before submitting
7. Template management UI in Settings page (covered in Epic 7)
8. At least 5 templates supported per user initially

## Story 3.4: Exercise Logging & Calorie Burn

As a **user**,
I want **to log exercise activities with duration and calories burned**,
so that **my calorie balance accounts for my physical activity**.

**Acceptance Criteria**:

1. Supabase database table `exercise_entries` created with schema:
   - `id` (UUID, primary key)
   - `user_id` (UUID, foreign key to auth.users, not null)
   - `date` (DATE, not null)
   - `time` (TIME, not null)
   - `activity` (TEXT, not null)
   - `duration_minutes` (INTEGER, not null)
   - `calories_burned` (INTEGER, not null)
   - `created_at` (TIMESTAMP)
2. RLS policy: Users can CRUD only their own exercise entries (user_id = auth.uid())
3. Index on (user_id, date) for fast daily queries
4. "Exercise Log" section on Calories page with table displaying:
   - Time | Activity | Duration (min) | Calories Burned | Actions
5. "Add Exercise" form with fields:
   - Activity name (text input, e.g., "Running", "Weight Training")
   - Duration (number input, minutes)
   - Calories burned (number input)
   - Time (time input, defaults to current time)
6. Submit button adds exercise entry to Supabase and refreshes list
7. Delete button (trash icon) on each table row removes entry
8. Exercise entries sorted by time (newest first)
9. Total duration and calories burned displayed in table footer
10. Empty state message when no exercise entries: "No exercise logged today. Add your workout above."
11. Exercise calories automatically added to calorie balance calculation in real-time

## Story 3.5: Macro Targets & Progress Visualization

As a **user**,
I want **to set daily macro targets and see my progress toward them**,
so that **I can ensure I'm meeting my nutritional goals (e.g., hitting protein target)**.

**Acceptance Criteria**:

1. Supabase database table `macro_targets` created with schema:
   - `user_id` (UUID, primary key, foreign key to auth.users)
   - `daily_calories` (INTEGER, nullable)
   - `daily_carbs` (NUMERIC, nullable)
   - `daily_protein` (NUMERIC, nullable)
   - `daily_fat` (NUMERIC, nullable)
   - `updated_at` (TIMESTAMP)
2. RLS policy: Users can SELECT, UPDATE only their own targets (user_id = auth.uid())
3. "Macro Targets" section on Calories page displays 4 progress bars:
   - Calories: [Progress bar] 1800 / 2200 cal (82%)
   - Carbs: [Progress bar] 150 / 200g (75%)
   - Protein: [Progress bar] 120 / 150g (80%)
   - Fat: [Progress bar] 50 / 70g (71%)
4. Progress bars color-coded:
   - Green: 90-110% of target (on track)
   - Yellow: 70-89% or 111-120% (close)
   - Red: <70% or >120% (significantly over/under)
5. Actual values calculated from sum of food_entries for current date
6. Targets editable in Settings page (covered in Epic 7)
7. If no targets set, progress section shows message: "Set your macro targets in Settings to track progress."
8. Progress bars use Tailwind CSS or custom styled divs (no external library required)

---
