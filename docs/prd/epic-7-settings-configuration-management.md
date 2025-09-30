# Epic 7: Settings & Configuration Management

**Epic Goal**: Create a centralized Settings hub where users can manage all application preferences, configurations, and data. This includes profile settings, timezone, macro targets, injection compounds and targets, Nirvana session types, food templates, Winners Bible images, Daily Tracker feature toggles, and data import/export functionality.

## Story 7.1: Settings Page Layout & Profile Settings

As a **user**,
I want **to edit my profile settings (BMR, gender, height, weight)**,
so that **the application calculations remain accurate as my body changes**.

**Acceptance Criteria**:

1. Settings page created at `/app/settings/page.tsx`
2. Page title "Settings"
3. Card-based layout with multiple sections
4. "Profile Settings" card displayed first with icon (UserIcon)
5. Form fields for editing:
   - BMR (number input) with link to BMR Calculator
   - Gender (dropdown: Male, Female, Other)
   - Height (number input, cm)
   - Weight (number input, kg)
6. Save button updates `profiles` table in Supabase
7. Success toast notification on save: "Profile updated successfully!"
8. Validation: All fields required except weight (weight tracked separately on Daily page)
9. Current values pre-filled from user's profile on page load
10. First-time users see welcome banner: "Welcome! Complete your profile to get started."

## Story 7.2: Timezone Configuration

As a **user**,
I want **to set my timezone in Settings**,
so that **all dates and times display correctly for my location**.

**Acceptance Criteria**:

1. "Timezone Settings" card displayed on Settings page with icon (CalendarDaysIcon)
2. Timezone dropdown with at least 20 major timezones:
   - America/New_York
   - America/Los_Angeles
   - America/Chicago
   - America/Denver
   - Europe/London
   - Europe/Paris
   - Asia/Tokyo
   - Asia/Shanghai
   - Australia/Sydney
   - (Additional major cities)
3. Dropdown shows user-friendly labels: "Eastern Time (New York)"
4. Selected timezone saved to `profiles.timezone`
5. Current time preview displayed in selected timezone: "Current time: 2:30 PM EST"
6. Info message: "Days will change at midnight in your selected timezone for accurate daily tracking."
7. Auto-save on selection change (no separate Save button needed)

## Story 7.3: Macro Targets Configuration

As a **user**,
I want **to set my daily macro targets in Settings**,
so that **the Calories page shows my progress toward these goals**.

**Acceptance Criteria**:

1. "Macro Targets" card displayed on Settings page with icon (FireIcon)
2. Form fields for setting targets:
   - Daily Calorie Target (number input)
   - Carbs Target (number input, grams)
   - Protein Target (number input, grams)
   - Fat Target (number input, grams)
3. All fields optional (can set calories only, or full macros)
4. Save button updates `macro_targets` table
5. Auto-save on blur (save when user leaves input field) for convenience
6. Info banner: "Your macro targets will appear on your Calories page to track daily progress."
7. Current targets pre-filled from database
8. Validation: All values must be positive numbers if provided

## Story 7.4: Injection Compounds Management

As a **user**,
I want **to add and remove injection compounds from my list**,
so that **I only see relevant compounds when logging injections**.

**Acceptance Criteria**:

1. "Injection Compounds" card displayed on Settings page with icon (BeakerIcon)
2. Current compounds list displayed as pills/tags with delete buttons (×)
3. "Add Compound" input field with submit button
4. Clicking submit adds new compound to `compounds` table
5. Duplicate compound names prevented (validation + unique constraint)
6. Clicking (×) on compound pill removes compound from database
7. Warning if removing compound that has associated injection data:
   - Modal dialog: "This compound has injection records. Deleting it may affect your history. Continue?"
   - Confirm/Cancel buttons
8. Deletion cascades appropriately (or soft delete to preserve history)
9. Empty state: "No compounds yet. Add your first compound above."
10. Default compounds ("Ipamorellin", "Retatrutide", "Testosterone") seeded for new users

## Story 7.5: Injection Targets Management

As a **user**,
I want **to set weekly dosage targets for each compound**,
so that **I can track my adherence to prescribed injection protocols**.

**Acceptance Criteria**:

1. "Injection Targets" card displayed on Settings page with icon (BeakerIcon, different color)
2. List of current targets displayed with:
   - Compound name
   - Dose amount + unit
   - Frequency per week
   - Calculated weekly target (dose × frequency)
   - Enable/Disable toggle
   - Edit and Delete buttons
3. "Add New Target" button opens form modal:
   - Compound (dropdown from user's compounds)
   - Dose Amount (number input, step 0.1)
   - Unit (dropdown: mg, ml, mcg, IU)
   - Frequency per Week (number input, 1-7)
4. Weekly target preview displayed: "2.5mg × 5/week = 12.5mg weekly"
5. Save button adds target to `injection_targets` table
6. Edit button opens same modal with pre-filled values
7. Delete button removes target (with confirmation)
8. Enable/Disable toggle sets `enabled` field (inactive targets don't show on Injections page but remain in database)
9. Empty state: "No injection targets set. Add targets to track weekly progress."

## Story 7.6: Nirvana Session Types Management

As a **user**,
I want **to manage my custom Nirvana session types**,
so that **I can track different types of mobility and gymnastics practices**.

**Acceptance Criteria**:

1. "Nirvana Session Types" card displayed on Settings page with icon (SparklesIcon)
2. Current session types displayed as list with delete buttons
3. "Add Session Type" input field with submit button
4. Adding session type saves to `nirvana_session_types` table
5. Duplicate session type names prevented
6. Deleting session type removes from database
7. Info message: "These session types will appear as options on your Nirvana tracking page."
8. Default session types seeded for new users (Mobility Flow, Handstand Practice, etc.)
9. Empty state: "No session types configured. Add your first type above."

## Story 7.7: Food Templates Management

As a **user**,
I want **to create and manage food templates for frequently eaten meals**,
so that **I can quickly log common foods on the Calories page**.

**Acceptance Criteria**:

1. "Food Templates" card displayed on Settings page with icon (FireIcon)
2. Current templates displayed in list/table with:
   - Template name
   - Calories
   - Carbs (g)
   - Protein (g)
   - Fat (g)
   - Delete button
3. "Add Template" button opens form modal:
   - Name (text input)
   - Calories (number input, required)
   - Carbs (number input, optional)
   - Protein (number input, optional)
   - Fat (number input, optional)
4. Save button adds template to `food_templates` table
5. Delete button removes template (with confirmation)
6. Templates immediately available in Calories page template dropdown
7. Empty state: "No food templates yet. Create templates for meals you eat regularly."
8. Limit: 50 templates per user (prevents database bloat)

## Story 7.8: Winners Bible Image Management

As a **user**,
I want **to upload, view, and delete Winners Bible motivational images**,
so that **I can curate my personal collection of inspiring images**.

**Acceptance Criteria**:

1. "Winners Bible" card displayed on Settings page with icon (PhotoIcon)
2. Image grid displaying current uploaded images (thumbnails)
3. "Upload Images" button opens file picker:
   - Multiple file selection enabled
   - File type filter: PNG, JPG, JPEG only
   - File size validation: Max 5MB per file
4. Images uploaded to Supabase Storage bucket `winners-bible-images`
5. Image metadata saved to `winners_bible_images` table
6. Upload progress indicator shown during upload
7. Maximum 15 images enforced (upload button disabled at limit)
8. Counter displayed: "Images: 8/15"
9. Delete button (× icon) on each image thumbnail
10. Confirmation dialog before deletion: "Delete this image? This cannot be undone."
11. Deleted images removed from Supabase Storage and database
12. Empty state: "No images uploaded yet. Upload your first motivational image."
13. Info message: "View your Winners Bible on the Winners Bible page as part of your daily routine."

## Story 7.9: Daily Tracker Settings & Feature Toggles

As a **user**,
I want **to customize which features appear on my Daily Tracker**,
so that **I can focus on the metrics most relevant to me**.

**Acceptance Criteria**:

1. "Daily Tracker Settings" card displayed on Settings page with icon (CalendarDaysIcon)
2. Toggle switches for enabling/disabling features:
   - Weight Tracking (default: enabled)
   - Deep Work Sessions (default: enabled)
   - Custom Metrics (default: disabled)
3. If "Custom Metrics" enabled, sub-options appear:
   - Sleep Hours (number metric)
   - Mood Rating (1-10 scale)
   - Energy Level (1-10 scale)
   - Water Intake (number metric, glasses)
4. Each custom metric has its own enable/disable toggle
5. Settings saved to database (new table or JSON column in profiles)
6. Daily Tracker page respects these settings and shows/hides features accordingly
7. Info message: "Control which metrics appear on your Daily Tracker page."

## Story 7.10: Data Export, Import, and Management

As a **user**,
I want **to export all my health data as a backup and import data to restore**,
so that **I can protect against data loss and migrate between accounts if needed**.

**Acceptance Criteria**:

1. "Data Management" card displayed on Settings page with icon (DocumentArrowDownIcon)
2. **Export Data** section:
   - "Export All Data" button
   - Clicking generates JSON file with all user data:
     - Profile
     - Daily entries (MITs, weight, deep work, Winners Bible status)
     - Food entries
     - Exercise entries
     - Injections
     - Nirvana sessions
     - Compounds
     - Injection targets
     - Food templates
     - Nirvana session types
     - Weekly reviews
   - Filename: `life-os-data-{date}.json`
   - Browser downloads file automatically
3. **Import Data** section:
   - File input accepting .json files
   - User selects previously exported JSON file
   - System validates file format
   - Data imported and merged with existing data (no duplicates based on timestamps/IDs)
   - Success message: "Data imported successfully! X records added."
   - Error handling for invalid JSON or schema mismatches
4. **Clear All Data** section:
   - "Clear All Data" button styled in red (destructive action)
   - Clicking shows confirmation modal:
     - Warning: "This will permanently delete ALL your health tracking data including: injections, calories, MITs, profile, etc."
     - "This action cannot be undone!" highlighted
     - "Yes, Clear Everything" (red) and "Cancel" buttons
   - Confirming deletes all user data from all tables (cascading delete via foreign keys)
   - User redirected to profile setup after data cleared
5. Info message: "Export your data regularly as a backup. Import data to restore from a backup file."

---
