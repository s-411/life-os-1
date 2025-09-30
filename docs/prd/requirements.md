# Requirements

## Functional Requirements

**FR1**: **User Authentication & Account Management**
The system shall provide secure user authentication via Supabase Auth supporting email/password, OAuth providers (Google, GitHub), and magic link sign-in. Each user shall have a completely isolated account with their own private health data.

**FR2**: **User Profile Configuration**
Users shall configure their health profile including BMR (Basal Metabolic Rate), gender, height, weight, age, and timezone. The system shall use these values for all personalized calculations throughout the application.

**FR3**: **Daily Tracking Hub**
The system shall provide a centralized Daily Tracker page displaying the current date (in user's timezone), daily MITs (Most Important Things) with completion checkboxes, weight entry, deep work session tracking, Winners Bible viewing status, and quick-action cards for common tasks.

**FR4**: **Weekly Objectives & Friday Review**
Every Friday, the Daily Tracker shall display a "Weekly Objectives Review" section where users can review their weekly goals, reflect on accomplishments, and note key observations. This data shall be stored and retrievable for historical analysis.

**FR5**: **Most Important Things (MITs) System**
Users shall add, complete, and manage up to 3 Most Important Things per day. Each MIT shall have a title, completion status, and timestamp. MITs shall persist per day and display completion statistics in analytics.

**FR6**: **Weight Tracking with BMI Calculation**
Users shall log daily weight measurements. The system shall automatically calculate and display BMI using the formula: `BMI = weight (kg) / (height (m))²`. Historical weight data shall be visualized in line charts on the Analytics page.

**FR7**: **Calorie & Macro Tracking**
Users shall log food entries with calories, carbohydrates, protein, and fat values. The system shall maintain a running total for the day and calculate the daily balance using: `Balance = BMR - Total Calories Consumed + Calories Burned from Exercise`.

**FR8**: **Food Templates System**
Users shall create reusable food templates with predefined macro values for frequently consumed meals. Templates shall be selectable from a dropdown for one-click food entry. Users can manage templates (add/edit/delete) in Settings.

**FR9**: **Exercise & Activity Tracking**
Users shall log exercise sessions with activity name, duration (minutes), and calories burned. Exercise calories shall automatically increment the daily calorie balance in real-time.

**FR10**: **Macro Target Tracking**
Users shall set daily macro targets (calories, carbs, protein, fat) in Settings. The Calories page shall display progress bars showing actual vs. target for each macro with percentage completion and color-coded status (green = on target, yellow = close, red = over/under).

**FR11**: **Injection & Compound Management**
Users shall track injections of various compounds (e.g., Ipamorellin, Retatrutide, Testosterone) with dosage amount, unit (mg/ml/mcg/IU), date, time, and optional notes. Users can manage their compound list in Settings by adding or removing compounds.

**FR12**: **Weekly Injection Targets & Progress**
Users shall set weekly dosage targets for each compound, specifying dose amount, frequency per week, and unit. The Injections page shall calculate and display weekly progress showing target vs actual dosage, injection count, percentage completion, and on-target status with visual indicators.

**FR13**: **Nirvana Life Tracking**
The system shall provide a dedicated Nirvana page for tracking mobility/gymnastics training sessions. Users select a session type (configurable in Settings), mark completion, and view completion history. The system tracks morning and night viewing of motivational content.

**FR14**: **Nirvana Session Types Configuration**
Users shall configure custom session types for Nirvana Life tracking in Settings (e.g., "Mobility Flow", "Handstand Practice", "Flexibility Training"). These types appear as selectable options on the Nirvana tracking page.

**FR15**: **Winners Bible Motivational System**
Users shall upload up to 15 motivational images in Settings. The Winners Bible page displays these images in a full-screen slideshow interface with navigation controls. Users mark morning and night viewing sessions, which are tracked on the Daily Tracker.

**FR16**: **Comprehensive Analytics Dashboard**
The system shall provide an Analytics page with multiple tabs:
- **Weight Progress**: Line chart of weight over time with trend analysis
- **Calorie Balance**: Daily balance visualization showing surplus/deficit patterns
- **Injection Consistency**: Heat maps and bar charts showing injection frequency and adherence to targets
- **MIT Completion Rate**: Statistics and trends for daily task completion
- **Weekly Review History**: Archive of all Friday weekly reviews with search and filter

**FR17**: **Time Range Filtering**
Analytics and history views shall support multiple time range filters: 3 days, 7 days, 30 days, 60 days, 90 days, and All Time. Filters shall apply to all visualizations and update charts in real-time.

**FR18**: **BMR Calculator Tool**
The system shall provide a dedicated BMR Calculator page using the Mifflin-St Jeor Equation:
- **Male**: `BMR = 10 × weight(kg) + 6.25 × height(cm) - 5 × age + 5`
- **Female**: `BMR = 10 × weight(kg) + 6.25 × height(cm) - 5 × age - 161`
- **Other**: Average of male and female formulas

Users can calculate their BMR and save it directly to their profile for use in calorie balance calculations.

**FR19**: **Data Export & Backup**
Users shall export all their health data as a JSON file from the Settings page. The export shall include profile data, all daily entries, food templates, injection targets, Nirvana sessions, and Winners Bible data.

**FR20**: **Data Import & Restoration**
Users shall import previously exported JSON data to restore their health tracking history. The system shall validate the import file format and merge data appropriately, preventing duplicates.

**FR21**: **Timezone Support**
The system shall respect the user's configured timezone for all date/time operations. Days shall change at midnight in the user's timezone. The system shall support major timezones globally.

**FR22**: **Responsive Design & Mobile Support**
The application shall be fully responsive, adapting to mobile, tablet, and desktop screen sizes. Mobile users shall access core features through a bottom navigation bar, while desktop users get a persistent sidebar and top header navigation.

**FR23**: **Real-Time Data Synchronization**
All user data changes shall synchronize instantly across devices using Supabase Realtime subscriptions. Multiple sessions of the same user account shall see updates without page refresh.

**FR24**: **Settings & Configuration Hub**
Users shall access a comprehensive Settings page to configure:
- Profile information (BMR, gender, height, weight)
- Timezone settings
- Macro targets
- Injection compounds list
- Injection targets with weekly goals
- Nirvana session types
- Food templates
- Winners Bible image management
- Daily Tracker feature toggles (weight, deep work, custom metrics)
- Data export/import

**FR25**: **History & Data Retrieval**
Users shall access historical data for any past date. The system shall support:
- Viewing complete daily entries from any previous day
- Searching and filtering historical entries by date range
- Analyzing trends across custom time periods
- Exporting historical data subsets

**FR26**: **Modular Habits & Lifestyle Tracking System**
The system shall provide a flexible, extensible module framework for tracking diverse lifestyle behaviors and habits. Users shall:
- Enable/disable tracking modules from Settings (toggle on/off)
- See enabled modules as interactive cards on the Daily Tracker hub
- Track modules with appropriate data types:
  - **Binary** (Yes/No, Done/Not Done): e.g., meditation completed, cold shower taken
  - **Counter** (numeric value): e.g., glasses of water, hours of sleep, servings of vegetables
  - **Goal-Based** (target + actual): e.g., 8 hours sleep target, 10,000 steps goal
- View all enabled modules in the Analytics Dashboard with streak tracking, totals, trends, and completion rates
- Export module data as part of standard data export functionality

The module system shall be architecturally designed for expansion: new modules can be added to the system schema without modifying core functional requirements or breaking existing functionality. Module definitions are stored as schema-level objects with metadata (name, description, type, unit, icon, category) and dynamically surfaced based on user settings.

**Architecture Note**: The modular system uses a single `lifestyle_modules` table defining available modules, a `user_module_settings` table for user enable/disable preferences, and a `module_entries` table for daily tracking data. This architecture allows future module additions via database seeding without PRD changes. See **Appendix A: Modular Habits & Lifestyle System** for module categories and examples.

## Non-Functional Requirements

**NFR1**: **Performance & Responsiveness**
The application shall load the initial page in under 2 seconds on a 4G mobile connection. Data queries shall return results in under 500ms. Real-time updates shall propagate to all connected clients within 1 second.

**NFR2**: **Database Design & Scalability**
The Supabase PostgreSQL database shall be normalized to 3NF (Third Normal Form) to eliminate redundancy. The schema shall support:
- Efficient querying with appropriate indexes on frequently accessed columns (user_id, date, timestamp)
- Row Level Security (RLS) policies ensuring users can only access their own data
- Automatic timestamps (created_at, updated_at) on all tables
- Cascading deletes where appropriate (e.g., deleting a user deletes all related data)

**NFR3**: **Data Isolation & Security**
Each user's data shall be completely isolated using Supabase Row Level Security. RLS policies shall enforce:
- Users can only SELECT, INSERT, UPDATE, DELETE their own records
- No user can access another user's data under any circumstance
- Admin users (if implemented) have separate elevated permissions
- All database operations must pass through authenticated Supabase client

**NFR4**: **Authentication Security**
User authentication shall follow security best practices:
- Passwords hashed with bcrypt (handled by Supabase Auth)
- JWT tokens for session management with automatic refresh
- OAuth integration for third-party providers
- Email verification for new accounts
- Password reset functionality via secure email links
- Session timeout after 30 days of inactivity (configurable)

**NFR5**: **Data Integrity & Validation**
All user inputs shall be validated on both client and server side:
- Required fields enforced via database constraints
- Data type validation (e.g., weight must be positive number)
- Range validation (e.g., BMI calculations require valid height/weight)
- Foreign key constraints for referential integrity
- Unique constraints where appropriate (e.g., one profile per user)

**NFR6**: **Availability & Reliability**
The application shall target 99.9% uptime, leveraging Supabase's infrastructure:
- Automatic failover and redundancy (managed by Supabase)
- Database backups every 24 hours with point-in-time recovery
- Error boundary components to gracefully handle client-side errors
- Retry logic for failed API calls with exponential backoff

**NFR7**: **Accessibility**
The application shall meet WCAG 2.1 AA standards:
- Semantic HTML structure for screen reader compatibility
- Keyboard navigation for all interactive elements
- Sufficient color contrast (4.5:1 for normal text, 3:1 for large text)
- Focus indicators visible on all interactive elements
- Alt text for all images and icons
- Form labels properly associated with inputs

**NFR8**: **Code Quality & Maintainability**
The codebase shall follow Next.js and React best practices:
- TypeScript for type safety across all components
- Component-based architecture with clear separation of concerns
- Reusable utility functions for common operations
- Consistent naming conventions (camelCase for variables, PascalCase for components)
- ESLint configuration for code quality enforcement
- Comprehensive inline comments for complex logic

**NFR9**: **Browser Compatibility**
The application shall support:
- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)
- Mobile browsers: Safari iOS (latest), Chrome Android (latest)

**NFR10**: **Monitoring & Error Tracking**
The application shall implement:
- Client-side error boundary to catch React errors
- Logging of critical errors to external service (e.g., Sentry)
- Supabase query performance monitoring
- User feedback mechanism for reporting issues

---
