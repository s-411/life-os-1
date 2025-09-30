/**
 * Custom hook for timezone-aware date operations
 * Automatically fetches user's timezone from their profile
 */

import { useProfile } from './useProfile';
import {
  getBrowserTimezone,
  getCurrentDateInTimezone,
  formatDateInTimezone,
  convertUTCToTimezone,
  getDayStartInTimezone,
  getDayEndInTimezone,
  isDateInDay,
} from '@/lib/utils/date';

export interface UseTimezoneReturn {
  /**
   * User's configured timezone (or browser timezone as fallback)
   */
  timezone: string;

  /**
   * Whether the timezone is still loading from user profile
   */
  loading: boolean;

  /**
   * Get current date/time in user's timezone
   */
  getCurrentDate: () => Date;

  /**
   * Format a date in user's timezone
   */
  formatDate: (date: Date, formatStr?: string) => string;

  /**
   * Convert UTC date to user's timezone
   */
  convertFromUTC: (utcDate: Date) => Date;

  /**
   * Get start of day (midnight) in user's timezone
   */
  getDayStart: (date?: Date) => Date;

  /**
   * Get end of day (23:59:59) in user's timezone
   */
  getDayEnd: (date?: Date) => Date;

  /**
   * Check if a date falls within a specific day in user's timezone
   */
  isInDay: (date: Date, targetDate?: Date) => boolean;
}

/**
 * Hook to access user's timezone and timezone-aware date utilities
 *
 * @returns Timezone string and bound utility functions
 *
 * @example
 * const { timezone, formatDate, getCurrentDate } = useTimezone();
 * const now = getCurrentDate();
 * const formatted = formatDate(now, 'MMM d, yyyy h:mm a');
 */
export function useTimezone(): UseTimezoneReturn {
  const { profile, loading } = useProfile();

  // Use profile timezone or fallback to browser timezone
  const timezone = profile?.timezone || getBrowserTimezone();

  return {
    timezone,
    loading,
    getCurrentDate: () => getCurrentDateInTimezone(timezone),
    formatDate: (date: Date, formatStr?: string) =>
      formatDateInTimezone(date, timezone, formatStr),
    convertFromUTC: (utcDate: Date) => convertUTCToTimezone(utcDate, timezone),
    getDayStart: (date?: Date) => getDayStartInTimezone(timezone, date),
    getDayEnd: (date?: Date) => getDayEndInTimezone(timezone, date),
    isInDay: (date: Date, targetDate?: Date) => isDateInDay(date, timezone, targetDate),
  };
}