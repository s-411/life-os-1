export interface Profile {
  id: string; // Corresponds to the UUID from Supabase
  first_name: string | null;
  avatar_url: string | null;
  email: string | null;
  bmr: number | null;
  gender: string | null;
  height: number | null;
  weight: number | null;
  timezone: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface ProfileUpdate {
  id?: string;
  first_name?: string | null;
  avatar_url?: string | null;
  bmr?: number | null;
  gender?: 'male' | 'female' | 'other' | null;
  height?: number | null;
  weight?: number | null;
  timezone?: string | null;
}