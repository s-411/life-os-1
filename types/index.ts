export interface Profile {
  id: string; // Corresponds to the UUID from Supabase
  first_name: string | null;
  avatar_url: string | null;
  email: string | null;
}