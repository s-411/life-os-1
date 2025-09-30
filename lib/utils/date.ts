/**
 * Date utility functions with timezone support
 * Uses date-fns and date-fns-tz for timezone-aware date operations
 */

import { formatInTimeZone, toZonedTime, fromZonedTime } from 'date-fns-tz';
import { startOfDay, endOfDay } from 'date-fns';

/**
 * Get the browser's timezone using the Intl API
 * Falls back to 'UTC' if unavailable
 *
 * @returns The IANA timezone identifier (e.g., 'America/New_York')
 *
 * @example
 * const tz = getBrowserTimezone();
 * console.log(tz); // 'America/Los_Angeles'
 */
export function getBrowserTimezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    return 'UTC';
  }
}

/**
 * Get the current date/time in a specific timezone
 *
 * @param timezone - IANA timezone identifier (e.g., 'America/New_York')
 * @returns Date object representing current time in the specified timezone
 *
 * @example
 * const now = getCurrentDateInTimezone('America/New_York');
 * console.log(now); // Current time in EST/EDT
 */
export function getCurrentDateInTimezone(timezone: string): Date {
  return toZonedTime(new Date(), timezone);
}

/**
 * Convert a UTC date to a specific timezone
 *
 * @param utcDate - Date in UTC
 * @param timezone - Target IANA timezone identifier
 * @returns Date object converted to the specified timezone
 *
 * @example
 * const utcDate = new Date('2025-01-30T12:00:00Z');
 * const nyTime = convertUTCToTimezone(utcDate, 'America/New_York');
 * // Returns Date representing 7:00 AM EST
 */
export function convertUTCToTimezone(utcDate: Date, timezone: string): Date {
  return toZonedTime(utcDate, timezone);
}

/**
 * Format a date in a specific timezone with a custom format string
 *
 * @param date - Date to format
 * @param timezone - IANA timezone identifier
 * @param formatStr - date-fns format string (default: 'MMM d, yyyy h:mm a')
 * @returns Formatted date string
 *
 * @example
 * const date = new Date('2025-01-30T12:00:00Z');
 * const formatted = formatDateInTimezone(date, 'America/New_York', 'EEEE, MMMM d, yyyy h:mm a zzz');
 * console.log(formatted); // 'Thursday, January 30, 2025 7:00 AM EST'
 */
export function formatDateInTimezone(
  date: Date,
  timezone: string,
  formatStr: string = 'MMM d, yyyy h:mm a'
): string {
  return formatInTimeZone(date, timezone, formatStr);
}

/**
 * Get the start of the day (midnight) in a specific timezone
 *
 * @param timezone - IANA timezone identifier
 * @param date - Optional date (defaults to current date)
 * @returns Date object representing midnight in the specified timezone
 *
 * @example
 * const midnight = getDayStartInTimezone('America/New_York');
 * console.log(midnight); // Today at 00:00:00 EST
 */
export function getDayStartInTimezone(timezone: string, date?: Date): Date {
  const targetDate = date ? toZonedTime(date, timezone) : getCurrentDateInTimezone(timezone);
  const dayStart = startOfDay(targetDate);
  // Convert back to UTC for storage/comparison
  return fromZonedTime(dayStart, timezone);
}

/**
 * Get the end of the day (23:59:59.999) in a specific timezone
 *
 * @param timezone - IANA timezone identifier
 * @param date - Optional date (defaults to current date)
 * @returns Date object representing end of day in the specified timezone
 *
 * @example
 * const endOfToday = getDayEndInTimezone('America/New_York');
 * console.log(endOfToday); // Today at 23:59:59.999 EST
 */
export function getDayEndInTimezone(timezone: string, date?: Date): Date {
  const targetDate = date ? toZonedTime(date, timezone) : getCurrentDateInTimezone(timezone);
  const dayEnd = endOfDay(targetDate);
  // Convert back to UTC for storage/comparison
  return fromZonedTime(dayEnd, timezone);
}

/**
 * Check if a date falls within a specific day in a given timezone
 *
 * @param date - Date to check
 * @param timezone - IANA timezone identifier
 * @param targetDate - Optional target date (defaults to today)
 * @returns true if the date falls within the target day in the specified timezone
 *
 * @example
 * const date = new Date('2025-01-30T04:00:00Z'); // 11 PM PST on Jan 29
 * const isToday = isDateInDay(date, 'America/Los_Angeles', new Date('2025-01-29'));
 * console.log(isToday); // true
 */
export function isDateInDay(date: Date, timezone: string, targetDate?: Date): boolean {
  const dayStart = getDayStartInTimezone(timezone, targetDate);
  const dayEnd = getDayEndInTimezone(timezone, targetDate);
  return date >= dayStart && date <= dayEnd;
}

/**
 * Get the current date as a YYYY-MM-DD string in a specific timezone
 *
 * @param timezone - IANA timezone identifier
 * @returns Date string in YYYY-MM-DD format
 *
 * @example
 * const dateStr = getCurrentDateStringInTimezone('America/New_York');
 * console.log(dateStr); // '2025-01-30'
 */
export function getCurrentDateStringInTimezone(timezone: string): string {
  return formatInTimeZone(new Date(), timezone, 'yyyy-MM-dd');
}