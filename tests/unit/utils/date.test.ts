import {
  getBrowserTimezone,
  getCurrentDateInTimezone,
  convertUTCToTimezone,
  formatDateInTimezone,
  getDayStartInTimezone,
  getDayEndInTimezone,
  isDateInDay,
} from '@/lib/utils/date';

describe('Date Utility Functions', () => {
  describe('getBrowserTimezone', () => {
    it('should return a valid IANA timezone string', () => {
      const timezone = getBrowserTimezone();
      expect(timezone).toBeTruthy();
      expect(typeof timezone).toBe('string');
      // Should contain forward slash for IANA format (e.g., 'America/New_York')
      expect(timezone === 'UTC' || timezone.includes('/')).toBe(true);
    });

    it('should return UTC as fallback if Intl API unavailable', () => {
      const originalIntl = global.Intl;
      // @ts-expect-error - intentionally breaking Intl for test
      delete global.Intl;

      const timezone = getBrowserTimezone();
      expect(timezone).toBe('UTC');

      global.Intl = originalIntl;
    });
  });

  describe('getCurrentDateInTimezone', () => {
    it('should return a Date object', () => {
      const date = getCurrentDateInTimezone('America/New_York');
      expect(date).toBeInstanceOf(Date);
    });

    it('should return different times for different timezones', () => {
      const nyTime = getCurrentDateInTimezone('America/New_York');
      const tokyoTime = getCurrentDateInTimezone('Asia/Tokyo');

      // Times should be different (usually different hours)
      expect(nyTime.getTime()).not.toBe(tokyoTime.getTime());
    });

    it('should handle UTC timezone', () => {
      const utcTime = getCurrentDateInTimezone('UTC');
      expect(utcTime).toBeInstanceOf(Date);
    });
  });

  describe('convertUTCToTimezone', () => {
    it('should convert UTC date to target timezone', () => {
      const utcDate = new Date('2025-01-30T12:00:00Z'); // Noon UTC
      const nyDate = convertUTCToTimezone(utcDate, 'America/New_York');

      expect(nyDate).toBeInstanceOf(Date);
      // New York is UTC-5, so noon UTC should be 7 AM EST
      expect(nyDate.getHours()).toBe(7);
    });

    it('should handle different timezones correctly', () => {
      const utcDate = new Date('2025-01-30T00:00:00Z'); // Midnight UTC
      const tokyoDate = convertUTCToTimezone(utcDate, 'Asia/Tokyo');

      // Tokyo is UTC+9
      expect(tokyoDate.getHours()).toBe(9);
    });
  });

  describe('formatDateInTimezone', () => {
    it('should format date in specified timezone with default format', () => {
      const date = new Date('2025-01-30T12:00:00Z');
      const formatted = formatDateInTimezone(date, 'America/New_York');

      expect(formatted).toContain('Jan');
      expect(formatted).toContain('30');
      expect(formatted).toContain('2025');
    });

    it('should format date with custom format string', () => {
      const date = new Date('2025-01-30T12:00:00Z');
      const formatted = formatDateInTimezone(date, 'America/New_York', 'yyyy-MM-dd');

      expect(formatted).toBe('2025-01-30');
    });

    it('should format time with timezone abbreviation', () => {
      const date = new Date('2025-01-30T12:00:00Z');
      const formatted = formatDateInTimezone(
        date,
        'America/New_York',
        'yyyy-MM-dd HH:mm:ss zzz'
      );

      expect(formatted).toContain('2025-01-30');
      expect(formatted).toContain('07:00:00');
      expect(formatted).toContain('EST');
    });

    it('should handle different timezones with same date', () => {
      const date = new Date('2025-01-30T12:00:00Z');
      const nyFormatted = formatDateInTimezone(date, 'America/New_York', 'HH:mm');
      const tokyoFormatted = formatDateInTimezone(date, 'Asia/Tokyo', 'HH:mm');

      expect(nyFormatted).toBe('07:00');
      expect(tokyoFormatted).toBe('21:00');
    });
  });

  describe('getDayStartInTimezone', () => {
    it('should return midnight in specified timezone', () => {
      const dayStart = getDayStartInTimezone('America/New_York');

      expect(dayStart).toBeInstanceOf(Date);
      // When converted to NY time, should be midnight
      const nyTime = convertUTCToTimezone(dayStart, 'America/New_York');
      expect(nyTime.getHours()).toBe(0);
      expect(nyTime.getMinutes()).toBe(0);
      expect(nyTime.getSeconds()).toBe(0);
    });

    it('should handle specific date parameter', () => {
      const targetDate = new Date('2025-01-30T15:30:00Z');
      const dayStart = getDayStartInTimezone('America/New_York', targetDate);

      const nyTime = convertUTCToTimezone(dayStart, 'America/New_York');
      expect(nyTime.getHours()).toBe(0);
      expect(nyTime.getDate()).toBe(30);
    });

    it('should return different UTC times for different timezones', () => {
      const nyStart = getDayStartInTimezone('America/New_York');
      const tokyoStart = getDayStartInTimezone('Asia/Tokyo');

      // The UTC times should be different (14 hour difference)
      expect(nyStart.getTime()).not.toBe(tokyoStart.getTime());
    });
  });

  describe('getDayEndInTimezone', () => {
    it('should return end of day in specified timezone', () => {
      const dayEnd = getDayEndInTimezone('America/New_York');

      expect(dayEnd).toBeInstanceOf(Date);
      const nyTime = convertUTCToTimezone(dayEnd, 'America/New_York');
      expect(nyTime.getHours()).toBe(23);
      expect(nyTime.getMinutes()).toBe(59);
      expect(nyTime.getSeconds()).toBe(59);
    });

    it('should handle specific date parameter', () => {
      const targetDate = new Date('2025-01-30T10:00:00Z');
      const dayEnd = getDayEndInTimezone('America/New_York', targetDate);

      const nyTime = convertUTCToTimezone(dayEnd, 'America/New_York');
      expect(nyTime.getHours()).toBe(23);
      expect(nyTime.getDate()).toBe(30);
    });
  });

  describe('isDateInDay', () => {
    it('should return true for date within the day in timezone', () => {
      const date = new Date('2025-01-30T15:00:00Z'); // 10 AM EST
      const targetDate = new Date('2025-01-30T12:00:00Z'); // Same day
      const result = isDateInDay(date, 'America/New_York', targetDate);

      expect(result).toBe(true);
    });

    it('should return false for date outside the day in timezone', () => {
      const date = new Date('2025-01-31T06:00:00Z'); // Next day in UTC
      const targetDate = new Date('2025-01-30T12:00:00Z');
      const result = isDateInDay(date, 'America/New_York', targetDate);

      // In NY time, this should be on a different day
      expect(result).toBe(false);
    });

    it('should handle dates near midnight boundary', () => {
      // 11:30 PM PST on Jan 29 = 7:30 AM UTC on Jan 30
      const date = new Date('2025-01-30T07:30:00Z');
      const targetDate = new Date('2025-01-29T12:00:00Z');
      const result = isDateInDay(date, 'America/Los_Angeles', targetDate);

      expect(result).toBe(true);
    });

    it('should use current date when targetDate not provided', () => {
      const now = new Date();
      const result = isDateInDay(now, 'America/New_York');

      expect(result).toBe(true);
    });
  });

  describe('Edge Cases and DST', () => {
    it('should handle year boundary correctly', () => {
      const newYearsEve = new Date('2024-12-31T23:00:00Z');
      const formatted = formatDateInTimezone(newYearsEve, 'America/New_York', 'yyyy-MM-dd');

      expect(formatted).toBe('2024-12-31');
    });

    it('should handle leap year dates', () => {
      const leapDay = new Date('2024-02-29T12:00:00Z');
      const formatted = formatDateInTimezone(leapDay, 'UTC', 'yyyy-MM-dd');

      expect(formatted).toBe('2024-02-29');
    });

    it('should handle extreme timezones', () => {
      const date = new Date('2025-01-30T12:00:00Z');

      // UTC+14 (earliest timezone)
      const formatted1 = formatDateInTimezone(date, 'Pacific/Kiritimati', 'yyyy-MM-dd HH:mm');
      expect(formatted1).toContain('2025-01-31'); // Next day

      // UTC-11 (one of the latest timezones)
      const formatted2 = formatDateInTimezone(date, 'Pacific/Pago_Pago', 'yyyy-MM-dd HH:mm');
      expect(formatted2).toContain('2025-01-30'); // Same or previous day
    });
  });
});