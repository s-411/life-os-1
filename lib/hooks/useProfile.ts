'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Profile, ProfileUpdate } from '@/types'

export interface UseProfileResult {
  profile: Profile | null
  loading: boolean
  error: Error | null
  updateProfile: (updates: ProfileUpdate) => Promise<void>
  refetch: () => Promise<void>
}

/**
 * Custom hook to fetch and manage user profile data
 * @param userId - The user ID to fetch profile for (optional, defaults to current user)
 * @returns Profile data, loading state, error state, and mutation functions
 */
export function useProfile(userId?: string): UseProfileResult {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const supabase = createClient()

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      // Get current user if userId not provided
      let targetUserId = userId
      if (!targetUserId) {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          throw new Error('No authenticated user found')
        }
        targetUserId = user.id
      }

      // Fetch profile data
      const { data, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', targetUserId)
        .single()

      if (fetchError) {
        // If profile doesn't exist (404), return null without error
        if (fetchError.code === 'PGRST116') {
          setProfile(null)
          return
        }
        throw fetchError
      }

      setProfile(data)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch profile'))
    } finally {
      setLoading(false)
    }
  }, [userId, supabase])

  const updateProfile = useCallback(async (updates: ProfileUpdate) => {
    try {
      setError(null)

      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        throw new Error('No authenticated user found')
      }

      // Update profile
      const { data, error: updateError } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single()

      if (updateError) {
        throw updateError
      }

      setProfile(data)
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to update profile')
      setError(error)
      throw error
    }
  }, [supabase])

  const refetch = useCallback(async () => {
    await fetchProfile()
  }, [fetchProfile])

  useEffect(() => {
    fetchProfile()
  }, [fetchProfile])

  return {
    profile,
    loading,
    error,
    updateProfile,
    refetch,
  }
}