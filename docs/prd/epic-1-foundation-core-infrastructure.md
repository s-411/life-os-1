# Epic 1: Foundation & Core Infrastructure

**Epic Goal**: Establish the foundational Next.js + Supabase project with authentication, user profile management, design system implementation, and core navigation structure. By the end of this epic, users can sign up, log in, configure their health profile, and navigate the application shell.

## Story 1.1: Project Initialization & Supabase Integration

As a **developer**,
I want **to initialize the Next.js project with Supabase integration**,
so that **the foundation is in place for building the application**.

**Acceptance Criteria**:

1. Next.js 14 project created with TypeScript and Tailwind CSS 4.0 configured
2. Supabase project created with development and production environments
3. Supabase client initialized for browser and server contexts
4. Environment variables configured (.env.local with NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY)
5. Design System globals.css file integrated with theme variables and component styles
6. Font files (National2Condensed, ESKlarheit) added to public/fonts/ and loaded via @font-face
7. Project builds successfully and runs on localhost with no errors
8. Basic folder structure created (app/, components/, lib/, types/, styles/)

## Story 1.2: Authentication System Implementation

As a **new user**,
I want **to sign up for an account and log in securely**,
so that **I can access my personal health tracking data**.

**Acceptance Criteria**:

1. Sign up page created with email/password form using Supabase Auth
2. Email verification sent to new users (configurable via Supabase dashboard)
3. Login page created with email/password form
4. "Forgot Password" flow implemented (password reset email link)
5. OAuth integration available for Google and GitHub sign-in (optional but UI prepared)
6. Successful authentication redirects user to Daily Tracker (/daily)
7. Failed authentication displays clear error messages
8. User session persists across page reloads via Supabase auth state
9. Logout functionality clears session and redirects to login page
10. Protected routes middleware checks authentication status and redirects unauthenticated users to login

## Story 1.3: User Profile Schema & Management

As a **authenticated user**,
I want **to create and manage my health profile with BMR, gender, height, and weight**,
so that **the application can personalize calculations and tracking**.

**Acceptance Criteria**:

1. Supabase database table `profiles` created with schema:
   - `id` (UUID, primary key, foreign key to auth.users)
   - `bmr` (INTEGER, not null)
   - `gender` (TEXT, enum: 'male'|'female'|'other')
   - `height` (NUMERIC, in cm)
   - `weight` (NUMERIC, in kg)
   - `timezone` (TEXT)
   - `created_at` (TIMESTAMP)
   - `updated_at` (TIMESTAMP)
2. RLS policy: Users can only SELECT, UPDATE their own profile row (user_id = auth.uid())
3. First-time user redirected to profile setup wizard after sign-up
4. Profile setup form captures BMR, gender, height, weight, and timezone
5. BMR Calculator link provided for users who don't know their BMR
6. Profile data saved to Supabase `profiles` table via client mutation
7. TypeScript types defined for Profile interface matching database schema
8. Profile data fetched and displayed on Settings page for editing
9. Profile updates save successfully and show confirmation toast notification

## Story 1.4: Core Navigation & Layout Structure

As a **authenticated user**,
I want **to navigate between different pages using a sidebar and mobile bottom navigation**,
so that **I can easily access all features of the application**.

**Acceptance Criteria**:

1. Desktop sidebar navigation component created with:
   - App logo/brand at top
   - Navigation links for: Daily, Calories, Injections, Nirvana, Winners Bible, Analytics, Settings
   - Icons from Heroicons (outline for inactive, solid for active)
   - Active state styling with primary color background
   - Fixed width 256px on desktop
2. Mobile bottom navigation component created with:
   - Fixed position at bottom of viewport
   - 4 primary navigation items (Daily, Calories, Injections, Analytics)
   - Hamburger menu for remaining pages
   - Active state indicator
3. Top header navigation component created for desktop with:
   - Logo on left
   - Horizontal navigation links in center
   - Icon-only buttons on right (Settings, Logout)
4. Navigation components use Next.js Link for client-side routing
5. Active route determined via usePathname() hook
6. Layout wrapper component integrates navigation based on screen size (responsive)
7. All navigation links functional and route to correct pages (even if pages show placeholder content initially)

## Story 1.5: Timezone Configuration & Date Utilities

As a **user**,
I want **to configure my timezone so days change at midnight in my local time**,
so that **my daily tracking accurately reflects my schedule**.

**Acceptance Criteria**:

1. Timezone selector added to profile setup and Settings page
2. Dropdown populated with common timezones (at least 20 major cities/regions)
3. Selected timezone saved to `profiles.timezone` column in Supabase
4. Utility function created to get current date in user's timezone
5. Utility function created to convert UTC timestamps to user's local time
6. Date utilities use date-fns with timezone support (date-fns-tz)
7. All date displays throughout app use user's configured timezone
8. Default timezone set to browser timezone if user hasn't configured one
9. Settings page shows current time in user's selected timezone as preview

---
