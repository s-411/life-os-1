# Data Models

## User Profile

**Purpose:** Stores user health configuration and personal settings for BMR calculations and timezone preferences.

**Key Attributes:**
- `id`: UUID (primary key, foreign key to auth.users) - Supabase auth user ID
- `bmr`: INTEGER (not null) - Basal Metabolic Rate in calories
- `gender`: TEXT (enum: 'male'|'female'|'other') - Gender for BMR calculations
- `height`: NUMERIC (not null) - Height in centimeters
- `weight`: NUMERIC (not null) - Current weight in kilograms
- `age`: INTEGER (not null) - Age in years
- `timezone`: TEXT (not null, default 'UTC') - IANA timezone identifier
- `created_at`: TIMESTAMP - Record creation timestamp
- `updated_at`: TIMESTAMP - Last update timestamp

### TypeScript Interface

```typescript
export interface Profile {
  id: string; // UUID
  bmr: number;
  gender: 'male' | 'female' | 'other';
  height: number; // cm
  weight: number; // kg
  age: number;
  timezone: string; // e.g., 'America/New_York'
  created_at: string; // ISO 8601
  updated_at: string; // ISO 8601
}
```

### Relationships

- One-to-One with `auth.users` (Supabase Auth)
- Referenced by all user-owned data tables via `user_id` foreign key

---

## Daily Entry

**Purpose:** Tracks date-specific health data including weight, deep work completion, and Winners Bible viewing status.

**Key Attributes:**
- `id`: UUID (primary key)
- `user_id`: UUID (foreign key to profiles.id, not null)
- `date`: DATE (not null) - Date in user's timezone
- `weight`: NUMERIC (nullable) - Daily weight measurement in kg
- `deep_work_completed`: BOOLEAN (default false) - Deep work session completion
- `winners_bible_morning`: BOOLEAN (default false) - Morning Winners Bible viewed
- `winners_bible_night`: BOOLEAN (default false) - Night Winners Bible viewed
- `created_at`: TIMESTAMP
- `updated_at`: TIMESTAMP

### TypeScript Interface

```typescript
export interface DailyEntry {
  id: string;
  user_id: string;
  date: string; // YYYY-MM-DD format
  weight: number | null;
  deep_work_completed: boolean;
  winners_bible_morning: boolean;
  winners_bible_night: boolean;
  created_at: string;
  updated_at: string;
}
```

### Relationships

- Many-to-One with `profiles` (each user has many daily entries)
- One-to-Many with `mits` (each daily entry can have up to 3 MITs)
- Unique constraint: `(user_id, date)` ensures one entry per user per day

---

## MIT (Most Important Thing)

**Purpose:** Tracks daily focus tasks with completion status.

**Key Attributes:**
- `id`: UUID (primary key)
- `user_id`: UUID (foreign key to profiles.id, not null)
- `date`: DATE (not null)
- `title`: TEXT (not null) - MIT description
- `completed`: BOOLEAN (default false)
- `completed_at`: TIMESTAMP (nullable) - Completion timestamp
- `created_at`: TIMESTAMP
- `updated_at`: TIMESTAMP

### TypeScript Interface

```typescript
export interface MIT {
  id: string;
  user_id: string;
  date: string; // YYYY-MM-DD
  title: string;
  completed: boolean;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}
```

### Relationships

- Many-to-One with `profiles`
- Grouped by `date` (max 3 MITs per user per day enforced in application logic)

---

## Food Entry

**Purpose:** Logs food consumption with calorie and macro tracking.

**Key Attributes:**
- `id`: UUID (primary key)
- `user_id`: UUID (foreign key to profiles.id, not null)
- `date`: DATE (not null)
- `time`: TIME (not null)
- `name`: TEXT (not null) - Food description
- `calories`: INTEGER (not null)
- `carbs`: NUMERIC (default 0) - Carbohydrates in grams
- `protein`: NUMERIC (default 0) - Protein in grams
- `fat`: NUMERIC (default 0) - Fat in grams
- `created_at`: TIMESTAMP

### TypeScript Interface

```typescript
export interface FoodEntry {
  id: string;
  user_id: string;
  date: string;
  time: string; // HH:MM:SS format
  name: string;
  calories: number;
  carbs: number;
  protein: number;
  fat: number;
  created_at: string;
}
```

### Relationships

- Many-to-One with `profiles`
- May reference `food_templates` (not enforced by FK)

---

## Food Template

**Purpose:** Reusable food entries for frequently consumed meals.

**Key Attributes:**
- `id`: UUID (primary key)
- `user_id`: UUID (foreign key to profiles.id, not null)
- `name`: TEXT (not null)
- `calories`: INTEGER (not null)
- `carbs`: NUMERIC (default 0)
- `protein`: NUMERIC (default 0)
- `fat`: NUMERIC (default 0)
- `created_at`: TIMESTAMP

### TypeScript Interface

```typescript
export interface FoodTemplate {
  id: string;
  user_id: string;
  name: string;
  calories: number;
  carbs: number;
  protein: number;
  fat: number;
  created_at: string;
}
```

### Relationships

- Many-to-One with `profiles`
- Used as templates for creating `food_entries`

---

## Exercise Entry

**Purpose:** Logs exercise activities with calorie burn for balance calculations.

**Key Attributes:**
- `id`: UUID (primary key)
- `user_id`: UUID (foreign key to profiles.id, not null)
- `date`: DATE (not null)
- `time`: TIME (not null)
- `activity`: TEXT (not null) - Exercise description
- `duration_minutes`: INTEGER (not null)
- `calories_burned`: INTEGER (not null)
- `created_at`: TIMESTAMP

### TypeScript Interface

```typescript
export interface ExerciseEntry {
  id: string;
  user_id: string;
  date: string;
  time: string;
  activity: string;
  duration_minutes: number;
  calories_burned: number;
  created_at: string;
}
```

### Relationships

- Many-to-One with `profiles`

---

## Macro Targets

**Purpose:** User-defined daily macro goals for progress tracking.

**Key Attributes:**
- `user_id`: UUID (primary key, foreign key to profiles.id)
- `daily_calories`: INTEGER (nullable)
- `daily_carbs`: NUMERIC (nullable)
- `daily_protein`: NUMERIC (nullable)
- `daily_fat`: NUMERIC (nullable)
- `updated_at`: TIMESTAMP

### TypeScript Interface

```typescript
export interface MacroTargets {
  user_id: string;
  daily_calories: number | null;
  daily_carbs: number | null;
  daily_protein: number | null;
  daily_fat: number | null;
  updated_at: string;
}
```

### Relationships

- One-to-One with `profiles`

---

## Injection Compound

**Purpose:** Manages list of compounds user tracks for injection logging.

**Key Attributes:**
- `id`: UUID (primary key)
- `user_id`: UUID (foreign key to profiles.id, not null)
- `name`: TEXT (not null) - Compound name (e.g., "Testosterone", "Ipamorellin")
- `unit`: TEXT (enum: 'mg'|'ml'|'mcg'|'IU') - Dosage unit
- `created_at`: TIMESTAMP

### TypeScript Interface

```typescript
export interface InjectionCompound {
  id: string;
  user_id: string;
  name: string;
  unit: 'mg' | 'ml' | 'mcg' | 'IU';
  created_at: string;
}
```

### Relationships

- Many-to-One with `profiles`
- One-to-Many with `injection_entries`
- One-to-One with `injection_targets`

---

## Injection Entry

**Purpose:** Logs individual injection events with dosage and timing.

**Key Attributes:**
- `id`: UUID (primary key)
- `user_id`: UUID (foreign key to profiles.id, not null)
- `compound_id`: UUID (foreign key to injection_compounds.id, not null)
- `date`: DATE (not null)
- `time`: TIME (not null)
- `dosage`: NUMERIC (not null)
- `notes`: TEXT (nullable)
- `created_at`: TIMESTAMP

### TypeScript Interface

```typescript
export interface InjectionEntry {
  id: string;
  user_id: string;
  compound_id: string;
  date: string;
  time: string;
  dosage: number;
  notes: string | null;
  created_at: string;
}
```

### Relationships

- Many-to-One with `profiles`
- Many-to-One with `injection_compounds`

---

## Injection Target

**Purpose:** Weekly dosage goals for each compound.

**Key Attributes:**
- `id`: UUID (primary key)
- `user_id`: UUID (foreign key to profiles.id, not null)
- `compound_id`: UUID (foreign key to injection_compounds.id, not null)
- `weekly_dosage`: NUMERIC (not null) - Target weekly dosage
- `frequency_per_week`: INTEGER (not null) - Target injection count per week
- `created_at`: TIMESTAMP
- `updated_at`: TIMESTAMP

### TypeScript Interface

```typescript
export interface InjectionTarget {
  id: string;
  user_id: string;
  compound_id: string;
  weekly_dosage: number;
  frequency_per_week: number;
  created_at: string;
  updated_at: string;
}
```

### Relationships

- Many-to-One with `profiles`
- Many-to-One with `injection_compounds`

---

## Nirvana Session

**Purpose:** Tracks mobility/gymnastics training session completions.

**Key Attributes:**
- `id`: UUID (primary key)
- `user_id`: UUID (foreign key to profiles.id, not null)
- `session_type_id`: UUID (foreign key to nirvana_session_types.id, not null)
- `date`: DATE (not null)
- `completed_at`: TIMESTAMP (not null)
- `created_at`: TIMESTAMP

### TypeScript Interface

```typescript
export interface NirvanaSession {
  id: string;
  user_id: string;
  session_type_id: string;
  date: string;
  completed_at: string;
  created_at: string;
}
```

### Relationships

- Many-to-One with `profiles`
- Many-to-One with `nirvana_session_types`

---

## Nirvana Session Type

**Purpose:** User-configurable session types for Nirvana tracking.

**Key Attributes:**
- `id`: UUID (primary key)
- `user_id`: UUID (foreign key to profiles.id, not null)
- `name`: TEXT (not null) - Session type name (e.g., "Mobility Flow")
- `created_at`: TIMESTAMP

### TypeScript Interface

```typescript
export interface NirvanaSessionType {
  id: string;
  user_id: string;
  name: string;
  created_at: string;
}
```

### Relationships

- Many-to-One with `profiles`
- One-to-Many with `nirvana_sessions`

---

## Winners Bible Image

**Purpose:** Stores motivational images for slideshow feature.

**Key Attributes:**
- `id`: UUID (primary key)
- `user_id`: UUID (foreign key to profiles.id, not null)
- `storage_path`: TEXT (not null) - Supabase Storage path
- `display_order`: INTEGER (not null) - Order in slideshow (1-15)
- `created_at`: TIMESTAMP

### TypeScript Interface

```typescript
export interface WinnersBibleImage {
  id: string;
  user_id: string;
  storage_path: string;
  display_order: number;
  created_at: string;
}
```

### Relationships

- Many-to-One with `profiles`
- Max 15 images per user enforced in application logic

---

## Weekly Review

**Purpose:** Friday weekly reflection and goal-setting entries.

**Key Attributes:**
- `id`: UUID (primary key)
- `user_id`: UUID (foreign key to profiles.id, not null)
- `week_start_date`: DATE (not null) - Monday of the week
- `review_date`: DATE (not null) - Friday when review created
- `objectives`: TEXT (nullable)
- `accomplishments`: TEXT (nullable)
- `observations`: TEXT (nullable)
- `next_week_focus`: TEXT (nullable)
- `created_at`: TIMESTAMP
- `updated_at`: TIMESTAMP

### TypeScript Interface

```typescript
export interface WeeklyReview {
  id: string;
  user_id: string;
  week_start_date: string;
  review_date: string;
  objectives: string | null;
  accomplishments: string | null;
  observations: string | null;
  next_week_focus: string | null;
  created_at: string;
  updated_at: string;
}
```

### Relationships

- Many-to-One with `profiles`
- Unique constraint: `(user_id, week_start_date)` ensures one review per week

---

## Lifestyle Module (Modular Habits System)

**Purpose:** Defines available tracking modules (system-level configuration).

**Key Attributes:**
- `id`: UUID (primary key)
- `name`: TEXT (not null) - Module name (e.g., "Water Intake")
- `description`: TEXT - Module description
- `type`: TEXT (enum: 'binary'|'counter'|'goal') - Data type
- `unit`: TEXT (nullable) - Unit of measurement (e.g., "glasses", "hours")
- `icon`: TEXT (nullable) - Icon identifier
- `category`: TEXT - Grouping category (e.g., "hydration", "sleep")
- `created_at`: TIMESTAMP

### TypeScript Interface

```typescript
export interface LifestyleModule {
  id: string;
  name: string;
  description: string;
  type: 'binary' | 'counter' | 'goal';
  unit: string | null;
  icon: string | null;
  category: string;
  created_at: string;
}
```

### Relationships

- One-to-Many with `user_module_settings`
- One-to-Many with `module_entries`

---

## User Module Setting

**Purpose:** User-specific enable/disable preferences for modules.

**Key Attributes:**
- `user_id`: UUID (foreign key to profiles.id, not null)
- `module_id`: UUID (foreign key to lifestyle_modules.id, not null)
- `enabled`: BOOLEAN (default true)
- `goal_value`: NUMERIC (nullable) - For goal-type modules
- `updated_at`: TIMESTAMP

### TypeScript Interface

```typescript
export interface UserModuleSetting {
  user_id: string;
  module_id: string;
  enabled: boolean;
  goal_value: number | null;
  updated_at: string;
}
```

### Relationships

- Composite primary key: `(user_id, module_id)`
- Many-to-One with `profiles`
- Many-to-One with `lifestyle_modules`

---

## Module Entry

**Purpose:** Daily tracking data for enabled lifestyle modules.

**Key Attributes:**
- `id`: UUID (primary key)
- `user_id`: UUID (foreign key to profiles.id, not null)
- `module_id`: UUID (foreign key to lifestyle_modules.id, not null)
- `date`: DATE (not null)
- `value`: NUMERIC (not null) - Actual value tracked
- `created_at`: TIMESTAMP

### TypeScript Interface

```typescript
export interface ModuleEntry {
  id: string;
  user_id: string;
  module_id: string;
  date: string;
  value: number; // For binary: 1 = true, 0 = false
  created_at: string;
}
```

### Relationships

- Many-to-One with `profiles`
- Many-to-One with `lifestyle_modules`
- Unique constraint: `(user_id, module_id, date)`

---
