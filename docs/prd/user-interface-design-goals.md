# User Interface Design Goals

## Overall UX Vision

The Life OS employs a distinctive **dark theme aesthetic** that prioritizes focus, reduces eye strain, and creates a premium, modern feel. The design system centers around a signature **bright blue accent color (#00A1FE)** used sparingly for primary actions, active states, and data visualization highlights against the dark background.

The interface follows a **data-dense but organized** approach, recognizing that health tracking users want comprehensive information at a glance without excessive scrolling. Information hierarchy is established through strategic use of:
- **Card-based layouts** with subtle borders to group related content
- **Typography hierarchy** using National2Condensed (bold, condensed headings) and ESKlarheit (clean, readable body text)
- **Color-coded status indicators** (green = good/complete, orange = warning, red = critical/over-limit, blue = primary actions)
- **Responsive grid systems** that adapt from multi-column desktop layouts to single-column mobile views

The overall experience should feel **professional, precise, and empowering**—like a high-end fitness tracking device or premium health monitoring dashboard. Users should feel confident in the accuracy of their data and motivated by clear visualizations of their progress.

## Key Interaction Paradigms

1. **Quick-Action Cards**: Dashboard-style cards on the Daily Tracker provide one-tap access to common tasks (log food, add injection, view analytics). Each card displays current status at a glance.

2. **Inline Editing**: Where appropriate, users can edit data directly in tables or lists without navigating to separate edit screens (e.g., toggling MIT completion, editing weight).

3. **Modal Forms for Complex Input**: Adding new items with multiple fields (injections, food entries) uses modal overlays that keep users in context while providing focused input space.

4. **Persistent Navigation**: Desktop users have a sidebar with icon + label navigation always visible. Mobile users get a sticky bottom navigation bar with the 4 most important pages.

5. **Date Navigation**: Any page with date-specific data includes a date picker/navigator, allowing users to quickly jump to past dates for historical review or data entry.

6. **Real-Time Feedback**: All calculations (calorie balance, macro percentages, injection progress) update instantly as users enter data, providing immediate feedback.

7. **Progressive Disclosure**: Advanced features and settings are tucked away but easily accessible, preventing overwhelm for new users while remaining available for power users.

## Core Screens and Views

1. **Daily Tracker** (Home/Dashboard)
   - Current date display with timezone indicator
   - Daily MITs section with add/complete functionality
   - Weight entry with BMI calculation
   - Deep work session tracking
   - Winners Bible viewing status (morning/night)
   - Quick-action cards (Calories Summary, Injections Summary, Nirvana Status)
   - Weekly Objectives Review section (Fridays only)

2. **Calories Page**
   - Macro targets overview with progress bars
   - Daily calorie balance calculation with visual indicator
   - Food log table (time, name, calories, carbs, protein, fat, actions)
   - Add food form with template selector
   - Exercise log table (time, activity, duration, calories, actions)
   - Add exercise form
   - Historical data access via date picker

3. **Injections Page**
   - Add injection form (compound selector, date, time, dosage, unit, notes)
   - Weekly dosage analysis cards (one per compound showing target vs actual, progress %)
   - Injection history table with filters (time range, compound)
   - Statistics overview (total injections, compounds tracked, weekly count, last injection)

4. **Nirvana Page**
   - Current session selection (dropdown of configured session types)
   - Mark session complete button
   - Session history with completion dates
   - Morning/night motivational content viewing tracker

5. **Winners Bible Page**
   - Full-screen image slideshow viewer
   - Navigation arrows (previous/next)
   - Image indicator dots
   - Mark morning viewed / Mark night viewed buttons
   - Viewing status display (morning ✓, night ✓)

6. **Analytics Page**
   - Tab navigation (Weight Progress, Calorie Balance, Injection Consistency, MIT Completion, Weekly Reviews)
   - Time range selector (3/7/30/60/90 days, All Time)
   - Interactive charts (line charts for weight/calories, bar charts for injections, completion heat maps)
   - Summary statistics cards for each metric
   - Export data button

7. **Settings Page**
   - Profile Settings card (BMR, gender, height, weight)
   - Timezone Settings card
   - Macro Targets card
   - Injection Compounds card (list with add/remove)
   - Injection Targets card (weekly goals per compound)
   - Nirvana Session Types card (configurable list)
   - Food Templates card (manage reusable meal entries)
   - Winners Bible card (upload/manage up to 15 images)
   - Daily Tracker Settings card (toggle weight, deep work, custom metrics)
   - Data Management card (export, import, clear all data)

8. **BMR Calculator Page**
   - Input form (height, weight, age, gender)
   - Calculate button
   - Results display with calculated BMR value
   - Save to Profile button
   - Educational content explaining BMR and the Mifflin-St Jeor equation

## Accessibility

**Target Level**: WCAG 2.1 AA Compliance

- All interactive elements keyboard navigable
- Screen reader support with semantic HTML and ARIA labels
- Color contrast ratio of at least 4.5:1 for all text
- Focus indicators clearly visible on dark background
- Form inputs properly labeled and associated
- Error messages announced to screen readers
- Alt text for all images and icons

## Branding

**Design System Identity**: "Design System"

- **Primary Brand Color**: `#00A1FE` (bright blue) - used for primary buttons, links, active navigation, and chart highlights
- **Dark Theme Colors**:
  - `#1f1f1f` - Main background (dark)
  - `#2a2a2a` - Card/secondary background (dark2)
  - `#ffffff` - Primary text (white)
  - `#ababab` - Secondary/muted text (gray)

- **Typography**:
  - **Headings**: National2Condensed (bold, condensed sans-serif) - creates strong visual hierarchy
  - **Body Text**: ESKlarheit (clean, modern sans-serif) - optimized for readability

- **Signature Elements**:
  - 100px border radius buttons (extremely rounded "pill" shape) for primary actions - distinctive branding element
  - Glass morphism effects on overlay cards (subtle transparency + backdrop blur)
  - Rating tile grids with 0.5 precision (e.g., 5.0-10.0 scale for hotness ratings)
  - Subtle hover effects with color transitions (0.2s fast, 0.3s medium)

- **Component Patterns**:
  - `.btn-primary` - Primary blue buttons with 100px border radius
  - `.btn-secondary` - Outlined buttons with gray border
  - `.card` - Standard dark card with subtle border
  - `.glass-card` - Transparent card with backdrop blur effect
  - `.input-field` - Dark input fields with blue focus ring

## Target Devices and Platforms

**Platform**: Web Responsive (all devices)

- **Desktop**: Optimized for 1920×1080 and 2560×1440 displays
  - Sidebar navigation (256px width) + top header
  - Multi-column layouts where appropriate
  - Data-dense tables and visualizations

- **Tablet**: Optimized for iPad (1024×768) and similar
  - Collapsed sidebar (icon-only) or hidden sidebar with hamburger menu
  - Top header navigation with full labels
  - Responsive grid that adapts to available width

- **Mobile**: Optimized for iPhone (390×844) and Android phones
  - Bottom navigation bar (fixed position) showing top 4 pages
  - Hamburger menu for additional pages
  - Single-column layouts
  - Touch-optimized interactive elements (minimum 44×44px tap targets)
  - Tables converted to card-based layouts for better mobile viewing

---
