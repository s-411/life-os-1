import { render } from '@testing-library/react';
import { redirect } from 'next/navigation';
import DailyTrackerPage from '@/app/(app)/daily/page';
import { createClient } from '@/lib/supabase/server';
import * as dateUtils from '@/lib/utils/date';

// Mock dependencies
jest.mock('next/navigation', () => ({
  redirect: jest.fn(),
}));

jest.mock('@/lib/supabase/server', () => ({
  createClient: jest.fn(),
}));

jest.mock('@/lib/utils/date', () => ({
  getCurrentDateInTimezone: jest.fn(),
  formatDateInTimezone: jest.fn(),
}));

describe('DailyTrackerPage', () => {
  const mockUser = { id: 'test-user-id', email: 'test@example.com' };
  const mockProfile = {
    id: 'test-user-id',
    bmr: 1800,
    gender: 'male' as const,
    height: 180,
    weight: 80,
    age: 30,
    timezone: 'America/New_York',
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Authentication', () => {
    it('should redirect unauthenticated users to login', async () => {
      const mockSupabase = {
        auth: {
          getUser: jest.fn().mockResolvedValue({
            data: { user: null },
            error: new Error('Not authenticated'),
          }),
        },
        from: jest.fn(),
      };

      (createClient as jest.Mock).mockResolvedValue(mockSupabase);
      (redirect as jest.Mock).mockImplementation(() => {
        throw new Error('NEXT_REDIRECT');
      });

      await expect(DailyTrackerPage()).rejects.toThrow('NEXT_REDIRECT');
      expect(redirect).toHaveBeenCalledWith('/auth/login');
    });

    it('should redirect users without profile to onboarding', async () => {
      const mockSupabase = {
        auth: {
          getUser: jest.fn().mockResolvedValue({
            data: { user: mockUser },
            error: null,
          }),
        },
        from: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              single: jest.fn().mockResolvedValue({
                data: null,
                error: new Error('Profile not found'),
              }),
            }),
          }),
        }),
      };

      (createClient as jest.Mock).mockResolvedValue(mockSupabase);
      (redirect as jest.Mock).mockImplementation(() => {
        throw new Error('NEXT_REDIRECT');
      });

      await expect(DailyTrackerPage()).rejects.toThrow('NEXT_REDIRECT');
      expect(redirect).toHaveBeenCalledWith('/onboarding');
    });
  });

  describe('Date Display', () => {
    it('should display date in user configured timezone', async () => {
      const mockDate = new Date('2025-01-30T12:00:00Z');
      const formattedDate = 'Thursday, January 30th, 2025';

      const mockSupabase = {
        auth: {
          getUser: jest.fn().mockResolvedValue({
            data: { user: mockUser },
            error: null,
          }),
        },
        from: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              single: jest.fn().mockResolvedValue({
                data: mockProfile,
                error: null,
              }),
            }),
          }),
        }),
      };

      (createClient as jest.Mock).mockResolvedValue(mockSupabase);
      (dateUtils.getCurrentDateInTimezone as jest.Mock).mockReturnValue(mockDate);
      (dateUtils.formatDateInTimezone as jest.Mock).mockReturnValue(formattedDate);

      const result = await DailyTrackerPage();
      const { container } = render(result);

      expect(dateUtils.getCurrentDateInTimezone).toHaveBeenCalledWith('America/New_York');
      expect(dateUtils.formatDateInTimezone).toHaveBeenCalledWith(
        mockDate,
        'America/New_York',
        'EEEE, MMMM do, yyyy'
      );
      expect(container.textContent).toContain(formattedDate);
    });

    it('should use UTC as fallback when timezone not set', async () => {
      const mockDate = new Date('2025-01-30T12:00:00Z');
      const formattedDate = 'Thursday, January 30th, 2025';
      const profileWithoutTimezone = { ...mockProfile, timezone: null };

      const mockSupabase = {
        auth: {
          getUser: jest.fn().mockResolvedValue({
            data: { user: mockUser },
            error: null,
          }),
        },
        from: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              single: jest.fn().mockResolvedValue({
                data: profileWithoutTimezone,
                error: null,
              }),
            }),
          }),
        }),
      };

      (createClient as jest.Mock).mockResolvedValue(mockSupabase);
      (dateUtils.getCurrentDateInTimezone as jest.Mock).mockReturnValue(mockDate);
      (dateUtils.formatDateInTimezone as jest.Mock).mockReturnValue(formattedDate);

      await DailyTrackerPage();

      expect(dateUtils.getCurrentDateInTimezone).toHaveBeenCalledWith('UTC');
    });
  });

  describe('Page Rendering', () => {
    beforeEach(() => {
      const mockDate = new Date('2025-01-30T12:00:00Z');
      const formattedDate = 'Thursday, January 30th, 2025';

      const mockSupabase = {
        auth: {
          getUser: jest.fn().mockResolvedValue({
            data: { user: mockUser },
            error: null,
          }),
        },
        from: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              single: jest.fn().mockResolvedValue({
                data: mockProfile,
                error: null,
              }),
            }),
          }),
        }),
      };

      (createClient as jest.Mock).mockResolvedValue(mockSupabase);
      (dateUtils.getCurrentDateInTimezone as jest.Mock).mockReturnValue(mockDate);
      (dateUtils.formatDateInTimezone as jest.Mock).mockReturnValue(formattedDate);
    });

    it('should render page title "Daily Tracker"', async () => {
      const result = await DailyTrackerPage();
      const { container } = render(result);

      expect(container.textContent).toContain('Daily Tracker');
    });

    it('should render with correct date format specification', async () => {
      const result = await DailyTrackerPage();
      render(result);

      expect(dateUtils.formatDateInTimezone).toHaveBeenCalledWith(
        expect.any(Date),
        'America/New_York',
        'EEEE, MMMM do, yyyy'
      );
    });

    it('should have responsive grid layout', async () => {
      const result = await DailyTrackerPage();
      const { container } = render(result);

      const gridElement = container.querySelector('.grid');
      expect(gridElement).toHaveClass('grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-3');
    });

    it('should have proper container spacing', async () => {
      const result = await DailyTrackerPage();
      const { container } = render(result);

      const containerElement = container.querySelector('.container');
      expect(containerElement).toHaveClass('mx-auto', 'px-4', 'py-8');
    });
  });
});
