import { Tables } from './database.types'

/**
 * User Profile type representing health and personal data
 */
export type Profile = Tables<'profiles'>

/**
 * Profile data for insertion (excludes auto-generated fields)
 */
export type ProfileInsert = {
  id: string
  bmr: number
  gender: 'male' | 'female' | 'other'
  height: number
  weight: number
  timezone?: string
  first_name?: string
  avatar_url?: string
}

/**
 * Profile data for updates (all fields optional except id)
 */
export type ProfileUpdate = {
  id?: string
  bmr?: number
  gender?: 'male' | 'female' | 'other'
  height?: number
  weight?: number
  timezone?: string
  first_name?: string
  avatar_url?: string
}

export * from './database.types'