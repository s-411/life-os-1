# Epic 6: Analytics & Data Visualization

**Epic Goal**: Build a comprehensive analytics dashboard providing visual insights into weight progress, calorie balance trends, injection consistency, MIT completion rates, and weekly review history. Users can analyze their health data across multiple time ranges with interactive charts and statistical summaries.

## Story 6.1: Analytics Page Structure & Navigation

As a **user**,
I want **to navigate between different analytics views using tabs**,
so that **I can easily explore various aspects of my health data**.

**Acceptance Criteria**:

1. Analytics page created at `/app/analytics/page.tsx`
2. Page title "Analytics Dashboard"
3. Tab navigation component with 5 tabs:
   - Weight Progress
   - Calorie Balance
   - Injection Consistency
   - MIT Completion
   - Weekly Reviews
4. Active tab highlighted with primary color underline or background
5. Tab content area displays selected view below tabs
6. Time range filter selector (3/7/30/60/90 days, All Time) positioned prominently
7. Selected time range applies to all analytics views
8. Time range state persists across tab switches during session
9. Loading states displayed while data fetches

## Story 6.2: Weight Progress Visualization

As a **user**,
I want **to see my weight over time in a line chart**,
so that **I can visualize trends and progress toward my goals**.

**Acceptance Criteria**:

1. Weight Progress tab displays line chart using Recharts library
2. X-axis: Date (formatted as "Jan 30" or similar short format)
3. Y-axis: Weight (kg)
4. Line color: primary color (#00A1FE)
5. Data points marked with circles
6. Hover tooltip shows exact date and weight value
7. Chart responsive: Full width on mobile, constrained on desktop
8. Data fetched from `daily_entries.weight` for user within selected time range
9. Statistics cards displayed above chart:
   - Current Weight
   - Starting Weight (first weight in time range)
   - Change (+/- difference)
   - Average Weight
10. If no weight data available, show message: "No weight data yet. Log your weight on the Daily Tracker."
11. Chart adapts Y-axis scale to data range (e.g., 65-75kg, not 0-100kg)

## Story 6.3: Calorie Balance Trend Analysis

As a **user**,
I want **to see my daily calorie balance over time in a chart**,
so that **I can identify patterns of surplus and deficit days**.

**Acceptance Criteria**:

1. Calorie Balance tab displays bar chart using Recharts library
2. X-axis: Date
3. Y-axis: Calorie balance (positive and negative values)
4. Bars color-coded: Green (positive balance), Red (negative balance)
5. Zero line clearly marked on Y-axis
6. Hover tooltip shows date and exact balance value
7. Data calculated per day: `Balance = BMR - Total Food Calories + Exercise Calories`
8. Statistics cards displayed above chart:
   - Average Daily Balance
   - Total Surplus Days (count)
   - Total Deficit Days (count)
   - Largest Surplus
   - Largest Deficit
9. If insufficient data (no food/exercise logs), show message: "Start logging food and exercise to see calorie balance trends."
10. Chart scrollable if data exceeds viewport width (especially for long time ranges)

## Story 6.4: Injection Consistency Heat Map

As a **user**,
I want **to see my injection consistency visualized as a heat map or calendar view**,
so that **I can identify patterns and gaps in my injection schedule**.

**Acceptance Criteria**:

1. Injection Consistency tab displays calendar-style heat map
2. Each day represented as a square/cell colored by injection count:
   - No injections: Gray
   - 1 injection: Light blue
   - 2 injections: Medium blue
   - 3+ injections: Dark blue
3. Hover tooltip shows date and injection count + compound names
4. Date range limited to 90 days max for readability (override time filter if needed)
5. Statistics cards displayed:
   - Total Injections
   - Most Consistent Compound (highest frequency)
   - Average Injections per Week
   - Longest Streak (consecutive days with injections)
6. Optional: Bar chart showing injections per compound (count)
7. If no injection data, show message: "Start logging injections to see consistency patterns."

## Story 6.5: MIT Completion Rate Statistics

As a **user**,
I want **to see my MIT completion rate over time**,
so that **I can track how consistently I'm accomplishing my daily priorities**.

**Acceptance Criteria**:

1. MIT Completion tab displays completion statistics
2. Line chart showing completion percentage over time:
   - X-axis: Date
   - Y-axis: Completion % (0-100%)
   - Completion % calculated per day: `(completed MITs / total MITs) × 100`
3. Only include days where MITs were created (skip days with zero MITs)
4. Statistics cards displayed:
   - Overall Completion Rate (%)
   - Total MITs Created
   - Total MITs Completed
   - Current Streak (consecutive days with 100% completion)
   - Best Streak
5. Completion rate color-coded: Green (≥80%), Yellow (50-79%), Red (<50%)
6. If no MIT data, show message: "Add MITs to your Daily Tracker to see completion trends."

## Story 6.6: Weekly Reviews Archive & Search

As a **user**,
I want **to browse and search my past weekly reviews**,
so that **I can reflect on my progress and revisit previous insights**.

**Acceptance Criteria**:

1. Weekly Reviews tab displays list of all past weekly reviews
2. Each review card shows:
   - Week dates (e.g., "Week of Jan 22-28, 2025")
   - Review date (Friday when created)
   - Objectives snippet (first 100 chars)
   - "View Full Review" expand button
3. Clicking expand reveals full review content:
   - This Week's Objectives
   - Key Accomplishments
   - Important Observations
   - Next Week's Focus
4. Reviews sorted by date (newest first)
5. Search box filters reviews by keyword match in any field
6. Date range filter applies to review creation date
7. Empty state: "No weekly reviews yet. Complete your first review on a Friday!"
8. Export button to download all reviews as JSON or text file

---
