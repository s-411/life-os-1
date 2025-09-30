import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { formatDateInTimezone, getCurrentDateInTimezone } from '@/lib/utils/date';

export default async function DailyTrackerPage() {
  const supabase = await createClient();

  // Check authentication
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    redirect('/auth/login');
  }

  // Fetch user profile for timezone
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  // Handle case where profile doesn't exist
  if (profileError || !profile) {
    redirect('/onboarding');
  }

  // Get timezone from profile, fallback to UTC
  const userTimezone = profile.timezone || 'UTC';

  // Calculate current date in user's timezone
  const currentDate = getCurrentDateInTimezone(userTimezone);

  // Format date as "Monday, January 30th, 2025"
  const formattedDate = formatDateInTimezone(
    currentDate,
    userTimezone,
    'EEEE, MMMM do, yyyy'
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-heading mb-2">Daily Tracker</h1>
          <p className="text-xl text-muted-foreground">{formattedDate}</p>
        </div>

        {/* Content Grid - Ready for future sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Future content sections will be added here */}
        </div>
      </div>
    </div>
  );
}
