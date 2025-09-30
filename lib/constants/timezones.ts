/**
 * Common timezones for user selection
 * Sorted alphabetically by region for better UX
 */

export interface Timezone {
  value: string;
  label: string;
}

export const TIMEZONES: Timezone[] = [
  // Africa
  { value: 'Africa/Cairo', label: 'Cairo (Africa/Cairo)' },
  { value: 'Africa/Johannesburg', label: 'Johannesburg (Africa/Johannesburg)' },

  // Americas
  { value: 'America/Chicago', label: 'Central Time - Chicago (America/Chicago)' },
  { value: 'America/Denver', label: 'Mountain Time - Denver (America/Denver)' },
  { value: 'America/Los_Angeles', label: 'Pacific Time - Los Angeles (America/Los_Angeles)' },
  { value: 'America/Mexico_City', label: 'Mexico City (America/Mexico_City)' },
  { value: 'America/New_York', label: 'Eastern Time - New York (America/New_York)' },
  { value: 'America/Sao_Paulo', label: 'São Paulo (America/Sao_Paulo)' },
  { value: 'America/Toronto', label: 'Toronto (America/Toronto)' },

  // Asia
  { value: 'Asia/Dubai', label: 'Dubai (Asia/Dubai)' },
  { value: 'Asia/Hong_Kong', label: 'Hong Kong (Asia/Hong_Kong)' },
  { value: 'Asia/Kolkata', label: 'India - Kolkata (Asia/Kolkata)' },
  { value: 'Asia/Seoul', label: 'Seoul (Asia/Seoul)' },
  { value: 'Asia/Shanghai', label: 'Shanghai (Asia/Shanghai)' },
  { value: 'Asia/Singapore', label: 'Singapore (Asia/Singapore)' },
  { value: 'Asia/Tokyo', label: 'Tokyo (Asia/Tokyo)' },

  // Europe
  { value: 'Europe/Amsterdam', label: 'Amsterdam (Europe/Amsterdam)' },
  { value: 'Europe/Berlin', label: 'Berlin (Europe/Berlin)' },
  { value: 'Europe/London', label: 'London (Europe/London)' },
  { value: 'Europe/Madrid', label: 'Madrid (Europe/Madrid)' },
  { value: 'Europe/Paris', label: 'Paris (Europe/Paris)' },
  { value: 'Europe/Rome', label: 'Rome (Europe/Rome)' },

  // Oceania
  { value: 'Australia/Sydney', label: 'Sydney (Australia/Sydney)' },
  { value: 'Pacific/Auckland', label: 'Auckland (Pacific/Auckland)' },

  // UTC
  { value: 'UTC', label: 'UTC (Coordinated Universal Time)' },
];