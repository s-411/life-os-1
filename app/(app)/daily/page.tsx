import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { formatDateInTimezone, getCurrentDateStringInTimezone } from '@/lib/utils/date';
import MITList from '@/components/daily/MITList';

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

  // Get current date as YYYY-MM-DD string in user's timezone
  const currentDate = getCurrentDateStringInTimezone(userTimezone);

  // Format date as "Monday, January 30th, 2025" for display
  const formattedDate = formatDateInTimezone(
    new Date(),
    userTimezone,
    'EEEE, MMMM do, yyyy'
  );

  // Fetch MITs for current date
  const { data: mits, error: mitsError } = await supabase
    .from('mits')
    .select('*')
    .eq('user_id', user.id)
    .eq('date', currentDate)
    .order('created_at', { ascending: true });

  // Handle error or null case
  const initialMITs = mitsError ? [] : (mits || []);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-heading mb-2">Daily Tracker</h1>
          <p className="text-xl text-muted-foreground">{formattedDate}</p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* MITs Section */}
          <div className="md:col-span-2 lg:col-span-3">
            <MITList
              initialMITs={initialMITs}
              currentDate={currentDate}
              userId={user.id}
            />
          </div>

          {/* Future content sections will be added here */}
        </div>
      </div>
    </div>
  );
}
