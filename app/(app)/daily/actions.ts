'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import type { MIT } from '@/types';

export async function addMIT(currentDate: string, title: string): Promise<{ data?: MIT; error?: string }> {
  const supabase = await createClient();

  // Get authenticated user
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: 'Not authenticated' };
  }

  // Insert MIT
  const { data, error } = await supabase
    .from('mits')
    .insert([{
      title: title.trim(),
      date: currentDate,
      user_id: user.id,
    }])
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/daily');
  return { data };
}

export async function toggleMIT(mitId: string, completed: boolean): Promise<{ data?: MIT; error?: string }> {
  const supabase = await createClient();

  // Get authenticated user
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: 'Not authenticated' };
  }

  // Update MIT
  const { data, error } = await supabase
    .from('mits')
    .update({
      completed,
      completed_at: completed ? new Date().toISOString() : null,
    })
    .eq('id', mitId)
    .eq('user_id', user.id)
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/daily');
  return { data };
}

export async function deleteMIT(mitId: string): Promise<{ error: string | null }> {
  const supabase = await createClient();

  // Get authenticated user
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: 'Not authenticated' };
  }

  // Delete MIT
  const { error } = await supabase
    .from('mits')
    .delete()
    .eq('id', mitId)
    .eq('user_id', user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/daily');
  return { error: null };
}
