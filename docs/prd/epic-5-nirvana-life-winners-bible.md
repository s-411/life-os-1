# Epic 5: Nirvana Life & Winners Bible

**Epic Goal**: Develop the Nirvana mobility/gymnastics tracking system and Winners Bible motivational image viewer. Users can track their physical training sessions, manage custom session types, and engage with a daily motivational routine using their own images.

## Story 5.1: Nirvana Session Tracking System

As a **user**,
I want **to log completion of Nirvana Life training sessions with different session types**,
so that **I can track my consistency with mobility and gymnastics practice**.

**Acceptance Criteria**:

1. Supabase database table `nirvana_sessions` created with schema:
   - `id` (UUID, primary key)
   - `user_id` (UUID, foreign key to auth.users, not null)
   - `date` (DATE, not null)
   - `session_type` (TEXT, not null)
   - `completed` (BOOLEAN, default true)
   - `completed_at` (TIMESTAMP, not null)
   - `created_at` (TIMESTAMP)
2. RLS policy: Users can CRUD only their own sessions (user_id = auth.uid())
3. Index on (user_id, date) for fast queries
4. Nirvana page created at `/app/nirvana/page.tsx`
5. Page title "Nirvana Life" with current date
6. "Today's Session" card displays:
   - Session type dropdown (populated from user's configured session types)
   - "Mark Session Complete" button
7. Clicking button logs session to Supabase with current timestamp
8. Success message displayed: "Nirvana session completed! 🎉"
9. Session history section displays past 7 days of sessions with:
   - Date | Session Type | Completed checkmark
10. Empty state: "No sessions logged yet. Complete your first Nirvana session today!"

## Story 5.2: Nirvana Session Types Configuration

As a **user**,
I want **to configure custom session types for Nirvana tracking**,
so that **I can track different types of mobility or gymnastics practices**.

**Acceptance Criteria**:

1. Supabase database table `nirvana_session_types` created with schema:
   - `id` (UUID, primary key)
   - `user_id` (UUID, foreign key to auth.users, not null)
   - `name` (TEXT, not null)
   - `created_at` (TIMESTAMP)
2. RLS policy: Users can CRUD only their own session types (user_id = auth.uid())
3. Unique constraint: (user_id, name) prevents duplicate session type names
4. Default session types seeded for new users:
   - "Mobility Flow"
   - "Handstand Practice"
   - "Flexibility Training"
   - "Strength Conditioning"
5. Session type management UI in Settings page (Epic 7)
6. Session types populate dropdown on Nirvana page for session logging
7. Users can add/remove session types freely

## Story 5.3: Winners Bible Image Management

As a **user**,
I want **to upload up to 15 motivational images to my Winners Bible**,
so that **I have a personalized collection of images that inspire me daily**.

**Acceptance Criteria**:

1. Supabase Storage bucket `winners-bible-images` created with RLS policies:
   - Users can upload to their own user_id folder only
   - Users can view only their own images
   - Max file size: 5MB per image
2. Supabase database table `winners_bible_images` created with schema:
   - `id` (UUID, primary key)
   - `user_id` (UUID, foreign key to auth.users, not null)
   - `storage_path` (TEXT, not null) // Path in Supabase Storage
   - `file_name` (TEXT, not null)
   - `file_size` (INTEGER, not null)
   - `mime_type` (TEXT, not null)
   - `order` (INTEGER, default 0) // Display order
   - `created_at` (TIMESTAMP)
3. RLS policy: Users can CRUD only their own image records (user_id = auth.uid())
4. Image upload UI in Settings page (Epic 7) with:
   - "Upload Images" button (accepts multiple files)
   - File type validation: PNG, JPG, JPEG only
   - File size validation: Max 5MB per file
   - Image grid showing uploaded images (thumbnail view)
   - Delete button on each image
   - Maximum 15 images enforced (upload button disabled at limit)
5. Images uploaded to Supabase Storage with path: `{user_id}/{image_id}.{ext}`
6. Metadata saved to `winners_bible_images` table
7. Upload progress indicator shown
8. Success/error messages for uploads

## Story 5.4: Winners Bible Full-Screen Viewer

As a **user**,
I want **to view my Winners Bible images in a full-screen slideshow with navigation**,
so that **I can engage with my motivational images as part of my daily routine**.

**Acceptance Criteria**:

1. Winners Bible page created at `/app/winners-bible/page.tsx`
2. Full-screen image viewer displaying current image:
   - Image fills viewport (max-width/max-height: 100%, object-fit: contain)
   - Dark background (black or dark)
3. Navigation controls:
   - Left arrow button (previous image)
   - Right arrow button (next image)
   - Keyboard navigation: Arrow keys to navigate, Escape to exit (if modal)
4. Image indicator dots at bottom center:
   - One dot per image
   - Active dot highlighted (primary color color)
   - Clicking dot jumps to that image
5. "Image X of Y" counter displayed
6. If only 1 image, navigation arrows hidden
7. Smooth transitions between images (fade or slide animation)
8. Empty state: "No images in your Winners Bible. Upload images in Settings."
9. Images load from Supabase Storage with signed URLs for security

## Story 5.5: Winners Bible Morning & Night Viewing Tracker

As a **user**,
I want **to mark when I've viewed my Winners Bible in the morning and evening**,
so that **I can track my consistency with this motivational routine**.

**Acceptance Criteria**:

1. Column `winners_bible_morning` (BOOLEAN) and `winners_bible_night` (BOOLEAN) already exist in `daily_entries` table (from Story 2.3)
2. Winners Bible page displays two buttons below the image viewer:
   - "Mark Morning Viewed" (SunIcon, yellow color)
   - "Mark Night Viewed" (MoonIcon, blue color)
3. Clicking button updates corresponding column in `daily_entries` for current date
4. Button disabled and shows checkmark when already marked for the day
5. Button states:
   - Not viewed: Solid color, enabled
   - Viewed: Green background, checkmark icon, disabled
6. Header displays viewing status:
   - "Morning ✓" (green if complete, gray if not)
   - "Night ✓" (green if complete, gray if not)
7. Viewing status displayed on Daily Tracker quick-action card
8. Viewing status tracked for analytics (covered in Epic 6)

---
