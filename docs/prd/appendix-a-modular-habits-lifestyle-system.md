# Appendix A: Modular Habits & Lifestyle System

## Overview

The Modular Habits & Lifestyle Tracking System (FR26) provides a future-proof architecture for expanding the application's tracking capabilities without modifying core functional requirements. This appendix defines the module framework, data model, and initial module categories for reference purposes.

## Module Framework Architecture

**Core Principles**:
1. **Schema-Driven**: Modules are defined as database records, not hardcoded features
2. **User-Controlled**: Users toggle modules on/off in Settings; only enabled modules appear in Daily Tracker
3. **Type-Safe**: Each module has a defined data type (binary, counter, goal-based) determining UI and validation
4. **Analytics-Integrated**: All module data automatically flows into Analytics Dashboard for trend analysis
5. **Extensible**: New modules added via database seeding, no code changes required for expansion

## Database Schema Design

**Table: `lifestyle_modules`** (System-wide module definitions)
```sql
- id (UUID, primary key)
- name (TEXT, unique) -- e.g., "Meditation"
- description (TEXT) -- User-facing description
- category (TEXT) -- Health, Fitness, Mindset, Social, Productivity, Finance, Spiritual
- data_type (ENUM: 'binary', 'counter', 'goal-based')
- unit (TEXT, nullable) -- e.g., "glasses", "hours", "minutes", null for binary
- icon_name (TEXT) -- Heroicon name for UI
- default_goal (NUMERIC, nullable) -- Default target for goal-based modules
- sort_order (INTEGER) -- Display order in Settings
- is_active (BOOLEAN, default true) -- System-level enable/disable
- created_at (TIMESTAMP)
```

**Table: `user_module_settings`** (User preferences)
```sql
- id (UUID, primary key)
- user_id (UUID, foreign key to auth.users, not null)
- module_id (UUID, foreign key to lifestyle_modules, not null)
- enabled (BOOLEAN, default false)
- custom_goal (NUMERIC, nullable) -- User's personal goal override
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
- UNIQUE constraint: (user_id, module_id)
- RLS: Users can CRUD only their own settings
```

**Table: `module_entries`** (Daily tracking data)
```sql
- id (UUID, primary key)
- user_id (UUID, foreign key to auth.users, not null)
- module_id (UUID, foreign key to lifestyle_modules, not null)
- date (DATE, not null)
- value (NUMERIC) -- For counter/goal-based: numeric value; For binary: 1 (yes) or 0 (no)
- completed (BOOLEAN) -- For goal-based: true if value >= goal
- notes (TEXT, nullable)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
- UNIQUE constraint: (user_id, module_id, date)
- RLS: Users can CRUD only their own entries
- Index: (user_id, module_id, date)
```

## Module Data Types

**1. Binary Modules** (Yes/No Tracking)
- **UI**: Single checkbox or toggle button
- **Data Storage**: `value = 1` (completed) or `0` (not completed)
- **Analytics**: Streak tracking, completion percentage, calendar heat map
- **Examples**: Meditation completed, morning cold shower, journaling done, fasted today

**2. Counter Modules** (Numeric Tracking)
- **UI**: Number input field with +/- buttons
- **Data Storage**: `value = numeric count`
- **Analytics**: Daily totals, averages, line charts, trend analysis
- **Examples**: Glasses of water (8), hours of sleep (7.5), servings of vegetables (5), social interactions (3)

**3. Goal-Based Modules** (Target Achievement)
- **UI**: Number input + progress bar showing actual vs goal
- **Data Storage**: `value = actual amount`, `completed = true/false` (value >= goal)
- **Goal Source**: `custom_goal` from user_module_settings, or `default_goal` from lifestyle_modules
- **Analytics**: Goal achievement rate, streak tracking, progress over time
- **Examples**: 10,000 steps goal, 8 hours sleep target, 2000 calories burned, 30 min reading

## Module Categories & Examples

**IMPORTANT**: The following categories and examples are for **reference and planning purposes only**. They are NOT locked functional requirements. New modules can be added to the system at any time by inserting records into the `lifestyle_modules` table without modifying this PRD.

### **Health & Wellness**
| Module Name | Type | Unit | Default Goal | Description |
|-------------|------|------|--------------|-------------|
| Hydration | Counter | glasses | - | Track daily water intake |
| Sleep Hours | Goal-Based | hours | 8 | Log total sleep duration |
| Meditation | Binary | - | - | Daily meditation practice |
| Cold Shower | Binary | - | - | Morning cold exposure |
| Stretching | Binary | - | - | Daily stretching routine |
| Supplements Taken | Binary | - | - | Daily supplement compliance |
| Fasting Window | Counter | hours | - | Intermittent fasting duration |
| Vegetable Servings | Goal-Based | servings | 5 | Daily vegetable intake |

### **Fitness & Movement**
| Module Name | Type | Unit | Default Goal | Description |
|-------------|------|------|--------------|-------------|
| Steps | Goal-Based | steps | 10000 | Daily step count |
| Cardio Minutes | Goal-Based | minutes | 30 | Cardiovascular exercise |
| Strength Training | Binary | - | - | Resistance workout completed |
| Active Minutes | Goal-Based | minutes | 60 | Total active time |
| Mobility Work | Binary | - | - | Flexibility/mobility session |

### **Mindset & Mental Health**
| Module Name | Type | Unit | Default Goal | Description |
|-------------|------|------|--------------|-------------|
| Journaling | Binary | - | - | Daily journal entry |
| Gratitude Practice | Binary | - | - | Gratitude reflection |
| Reading | Goal-Based | minutes | 30 | Daily reading time |
| Learning | Goal-Based | minutes | 30 | Skill development time |
| Affirmations | Binary | - | - | Daily affirmations |
| Screen-Free Time | Goal-Based | hours | 2 | Time without screens |

### **Social & Relationships**
| Module Name | Type | Unit | Default Goal | Description |
|-------------|------|------|--------------|-------------|
| Quality Conversations | Counter | count | - | Meaningful interactions |
| Family Time | Goal-Based | minutes | 60 | Time with family |
| Social Interactions | Counter | count | - | Social engagements |
| Acts of Kindness | Counter | count | - | Helping others |

### **Productivity & Focus**
| Module Name | Type | Unit | Default Goal | Description |
|-------------|------|------|--------------|-------------|
| Deep Work | Goal-Based | hours | 4 | Focused work sessions |
| Inbox Zero | Binary | - | - | Email inbox cleared |
| No Social Media | Binary | - | - | Social media abstinence |
| Morning Routine | Binary | - | - | Morning protocol completed |
| Evening Routine | Binary | - | - | Evening protocol completed |

### **Financial & Career**
| Module Name | Type | Unit | Default Goal | Description |
|-------------|------|------|--------------|-------------|
| Expense Tracking | Binary | - | - | Logged all expenses |
| Budget Review | Binary | - | - | Reviewed financial status |
| Income Activity | Binary | - | - | Income-generating work |
| Savings Goal | Binary | - | - | Met daily savings target |

### **Spiritual & Purpose**
| Module Name | Type | Unit | Default Goal | Description |
|-------------|------|------|--------------|-------------|
| Prayer/Spiritual Practice | Binary | - | - | Spiritual connection time |
| Purpose Reflection | Binary | - | - | Reflected on life purpose |
| Nature Time | Goal-Based | minutes | 30 | Time spent in nature |
| Creative Expression | Goal-Based | minutes | 30 | Creative work/art |

## UI Integration Points

**Settings Page - Module Management Card**:
- Section: "Lifestyle Tracking Modules"
- Grouped by category (collapsible sections)
- Each module shows: Name, Description, Type indicator, Enable/Disable toggle
- Goal-based modules show additional input: "Your Goal" (editable numeric field)
- Enabled count displayed: "8 modules enabled"
- Search/filter by category or name

**Daily Tracker - Module Cards**:
- Only enabled modules displayed
- Cards arranged in grid (responsive: 1 col mobile, 2-3 cols desktop)
- Each card styled consistently with existing quick-action cards:
  - **Binary**: Large checkbox with module name and icon
  - **Counter**: "+/-" buttons with current count display
  - **Goal-Based**: Number input + progress bar (actual/goal) + percentage
- Module cards positioned below existing Daily Tracker sections (MITs, Weight, Deep Work)
- Card order determined by module sort_order or user preference

**Analytics Dashboard - Modules Tab**:
- New tab: "Lifestyle Modules"
- Module selector dropdown (shows only enabled modules)
- Time range filter applies to selected module
- Visualization adapts to module type:
  - **Binary**: Calendar heat map (green = completed, gray = not completed), streak display, completion percentage
  - **Counter**: Line chart of daily values, average value, total sum, trend indicator
  - **Goal-Based**: Bar chart with goal line overlay, achievement rate (%), best streak, average progress
- Statistics cards:
  - Current Streak
  - Total Days Tracked
  - Best Streak
  - Average Value (counter) or Achievement Rate (goal-based)

## Implementation Notes for Development Team

**Phase 1 - Core Infrastructure** (Epic 1 Extension):
- Create three database tables: `lifestyle_modules`, `user_module_settings`, `module_entries`
- Implement RLS policies for user data isolation
- Seed initial modules from Health & Wellness category (5-8 modules for MVP testing)

**Phase 2 - Settings Integration** (Epic 7 Extension):
- Build module management UI in Settings page
- Implement enable/disable toggle functionality
- Add goal customization for goal-based modules
- Category-based grouping and search

**Phase 3 - Daily Tracker Integration** (Epic 2 Extension):
- Fetch enabled modules for current user
- Render module cards dynamically based on data type
- Implement data entry logic for binary, counter, and goal-based types
- Real-time state updates on user interaction

**Phase 4 - Analytics Integration** (Epic 6 Extension):
- Add "Lifestyle Modules" tab to Analytics dashboard
- Build dynamic chart components adapting to module data type
- Implement streak calculation algorithm
- Statistics aggregation for selected time ranges

**Future Expansion Process**:
1. **Adding New Modules**: Insert records into `lifestyle_modules` table via migration or admin panel
2. **No Code Changes**: Module framework handles new entries automatically
3. **User Adoption**: New modules appear in Settings for users to enable
4. **Instant Analytics**: Module data immediately flows into Analytics without code updates

## Validation Rules

**Module Entry Validation**:
- Binary: Value must be 0 or 1
- Counter: Value must be non-negative integer or decimal (based on unit)
- Goal-Based: Value must be non-negative and comparable to goal
- Date: Cannot be in the future
- One entry per module per day per user (enforced by unique constraint)

**Module Settings Validation**:
- Custom goals must be positive numbers
- Custom goals only applicable to goal-based modules
- Cannot enable module without valid module_id

## Performance Considerations

**Query Optimization**:
- Index on `(user_id, module_id, date)` in `module_entries` for fast daily lookups
- Index on `(user_id, enabled)` in `user_module_settings` for active module retrieval
- Composite index on `(user_id, date)` for daily dashboard queries

**Data Volume Management**:
- Typical user: 10-20 enabled modules × 365 days = 3,650-7,300 entries/year
- 10,000 users: 36-73 million entries over 1 year (well within PostgreSQL limits)
- Pagination required for historical data views in Analytics
- Consider data retention policy for entries older than 2-3 years

## Success Metrics

**Module System KPIs**:
- Average modules enabled per user (target: 8-12)
- Module engagement rate (daily entries / enabled modules)
- Most popular modules by enable count
- Average streak length per module type
- User retention correlation with module usage

---
