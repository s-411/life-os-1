import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import MITList from '@/components/daily/MITList';
import { MIT } from '@/types';

// Mock Supabase client
jest.mock('@supabase/auth-helpers-nextjs', () => ({
  createClientComponentClient: jest.fn(),
}));

describe('MITList Component', () => {
  const mockUserId = 'test-user-id';
  const mockCurrentDate = '2025-10-01';

  let mockSupabase: ReturnType<typeof createClientComponentClient>;
  let mockChannel: {
    on: jest.Mock;
    subscribe: jest.Mock;
  };

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();

    // Setup channel mock
    mockChannel = {
      on: jest.fn().mockReturnThis(),
      subscribe: jest.fn(),
    };

    // Setup Supabase mock
    mockSupabase = {
      from: jest.fn(() => ({
        insert: jest.fn(() => ({
          select: jest.fn(() => ({
            single: jest.fn(() => Promise.resolve({ data: null, error: null })),
          })),
        })),
        update: jest.fn(() => ({
          eq: jest.fn(() => Promise.resolve({ data: null, error: null })),
        })),
        delete: jest.fn(() => ({
          eq: jest.fn(() => Promise.resolve({ error: null })),
        })),
      })),
      channel: jest.fn(() => mockChannel),
      removeChannel: jest.fn(),
    };

    (createClientComponentClient as jest.Mock).mockReturnValue(mockSupabase);
  });

  describe('Rendering', () => {
    it('renders empty state message when no MITs', () => {
      render(
        <MITList
          initialMITs={[]}
          currentDate={mockCurrentDate}
          userId={mockUserId}
        />
      );

      expect(
        screen.getByText('Add your first MIT to focus on what matters most today.')
      ).toBeInTheDocument();
    });

    it('displays initial MITs passed as props', () => {
      const mockMITs: MIT[] = [
        {
          id: '1',
          user_id: mockUserId,
          date: mockCurrentDate,
          title: 'Complete project proposal',
          completed: false,
          completed_at: null,
          created_at: '2025-10-01T08:00:00Z',
          updated_at: '2025-10-01T08:00:00Z',
        },
        {
          id: '2',
          user_id: mockUserId,
          date: mockCurrentDate,
          title: 'Review PRD',
          completed: true,
          completed_at: '2025-10-01T09:00:00Z',
          created_at: '2025-10-01T09:00:00Z',
          updated_at: '2025-10-01T09:00:00Z',
        },
      ];

      render(
        <MITList
          initialMITs={mockMITs}
          currentDate={mockCurrentDate}
          userId={mockUserId}
        />
      );

      expect(screen.getByText('Complete project proposal')).toBeInTheDocument();
      expect(screen.getByText('Review PRD')).toBeInTheDocument();
    });

    it('shows "Add MIT" form with correct placeholder', () => {
      render(
        <MITList
          initialMITs={[]}
          currentDate={mockCurrentDate}
          userId={mockUserId}
        />
      );

      const input = screen.getByPlaceholderText("What's most important today?");
      expect(input).toBeInTheDocument();
    });
  });

  describe('Adding MITs', () => {
    it('adds new MIT when form submitted', async () => {
      const mockNewMIT: MIT = {
        id: '3',
        user_id: mockUserId,
        date: mockCurrentDate,
        title: 'New MIT',
        completed: false,
        completed_at: null,
        created_at: '2025-10-01T10:00:00Z',
        updated_at: '2025-10-01T10:00:00Z',
      };

      mockSupabase.from = jest.fn(() => ({
        insert: jest.fn(() => ({
          select: jest.fn(() => ({
            single: jest.fn(() => Promise.resolve({ data: mockNewMIT, error: null })),
          })),
        })),
      }));

      render(
        <MITList
          initialMITs={[]}
          currentDate={mockCurrentDate}
          userId={mockUserId}
        />
      );

      const input = screen.getByPlaceholderText("What's most important today?");
      const addButton = screen.getByText('Add MIT');

      fireEvent.change(input, { target: { value: 'New MIT' } });
      fireEvent.click(addButton);

      await waitFor(() => {
        expect(mockSupabase.from).toHaveBeenCalledWith('mits');
      });

      await waitFor(() => {
        expect(screen.getByText('New MIT')).toBeInTheDocument();
      });
    });

    it('disables Add button when 3 MITs exist', () => {
      const mockMITs: MIT[] = [
        {
          id: '1',
          user_id: mockUserId,
          date: mockCurrentDate,
          title: 'MIT 1',
          completed: false,
          completed_at: null,
          created_at: '2025-10-01T08:00:00Z',
          updated_at: '2025-10-01T08:00:00Z',
        },
        {
          id: '2',
          user_id: mockUserId,
          date: mockCurrentDate,
          title: 'MIT 2',
          completed: false,
          completed_at: null,
          created_at: '2025-10-01T09:00:00Z',
          updated_at: '2025-10-01T09:00:00Z',
        },
        {
          id: '3',
          user_id: mockUserId,
          date: mockCurrentDate,
          title: 'MIT 3',
          completed: false,
          completed_at: null,
          created_at: '2025-10-01T10:00:00Z',
          updated_at: '2025-10-01T10:00:00Z',
        },
      ];

      render(
        <MITList
          initialMITs={mockMITs}
          currentDate={mockCurrentDate}
          userId={mockUserId}
        />
      );

      const addButton = screen.getByText('Add MIT');
      expect(addButton).toBeDisabled();
      expect(
        screen.getByText("You've reached the maximum of 3 MITs for today.")
      ).toBeInTheDocument();
    });

    it('clears input field after successful add', async () => {
      const mockNewMIT: MIT = {
        id: '1',
        user_id: mockUserId,
        date: mockCurrentDate,
        title: 'Test MIT',
        completed: false,
        completed_at: null,
        created_at: '2025-10-01T08:00:00Z',
        updated_at: '2025-10-01T08:00:00Z',
      };

      mockSupabase.from = jest.fn(() => ({
        insert: jest.fn(() => ({
          select: jest.fn(() => ({
            single: jest.fn(() => Promise.resolve({ data: mockNewMIT, error: null })),
          })),
        })),
      }));

      render(
        <MITList
          initialMITs={[]}
          currentDate={mockCurrentDate}
          userId={mockUserId}
        />
      );

      const input = screen.getByPlaceholderText("What's most important today?") as HTMLInputElement;
      const addButton = screen.getByText('Add MIT');

      fireEvent.change(input, { target: { value: 'Test MIT' } });
      fireEvent.click(addButton);

      await waitFor(() => {
        expect(input.value).toBe('');
      });
    });
  });

  describe('Toggling Completion', () => {
    it('toggles MIT completion status on checkbox click', async () => {
      const mockMIT: MIT = {
        id: '1',
        user_id: mockUserId,
        date: mockCurrentDate,
        title: 'Test MIT',
        completed: false,
        completed_at: null,
        created_at: '2025-10-01T08:00:00Z',
        updated_at: '2025-10-01T08:00:00Z',
      };

      render(
        <MITList
          initialMITs={[mockMIT]}
          currentDate={mockCurrentDate}
          userId={mockUserId}
        />
      );

      const checkbox = screen.getByRole('checkbox') as HTMLInputElement;
      expect(checkbox.checked).toBe(false);

      fireEvent.click(checkbox);

      // Check optimistic update
      expect(checkbox.checked).toBe(true);

      await waitFor(() => {
        expect(mockSupabase.from).toHaveBeenCalledWith('mits');
      });
    });

    it('shows strikethrough styling for completed MITs', () => {
      const mockMIT: MIT = {
        id: '1',
        user_id: mockUserId,
        date: mockCurrentDate,
        title: 'Completed MIT',
        completed: true,
        completed_at: '2025-10-01T09:00:00Z',
        created_at: '2025-10-01T08:00:00Z',
        updated_at: '2025-10-01T09:00:00Z',
      };

      render(
        <MITList
          initialMITs={[mockMIT]}
          currentDate={mockCurrentDate}
          userId={mockUserId}
        />
      );

      const mitText = screen.getByText('Completed MIT');
      expect(mitText).toHaveClass('line-through');
      expect(mitText).toHaveClass('opacity-60');
      expect(mitText).toHaveClass('text-gray-500');
    });
  });

  describe('Deleting MITs', () => {
    it('deletes MIT when delete button clicked', async () => {
      const mockMIT: MIT = {
        id: '1',
        user_id: mockUserId,
        date: mockCurrentDate,
        title: 'Delete Me',
        completed: false,
        completed_at: null,
        created_at: '2025-10-01T08:00:00Z',
        updated_at: '2025-10-01T08:00:00Z',
      };

      render(
        <MITList
          initialMITs={[mockMIT]}
          currentDate={mockCurrentDate}
          userId={mockUserId}
        />
      );

      const deleteButton = screen.getByLabelText('Delete MIT');
      fireEvent.click(deleteButton);

      // Check optimistic update
      await waitFor(() => {
        expect(screen.queryByText('Delete Me')).not.toBeInTheDocument();
      });

      expect(mockSupabase.from).toHaveBeenCalledWith('mits');
    });
  });

  describe('Real-time Subscription', () => {
    it('sets up real-time subscription on mount', () => {
      render(
        <MITList
          initialMITs={[]}
          currentDate={mockCurrentDate}
          userId={mockUserId}
        />
      );

      expect(mockSupabase.channel).toHaveBeenCalledWith('mits-changes');
      expect(mockChannel.on).toHaveBeenCalled();
      expect(mockChannel.subscribe).toHaveBeenCalled();
    });

    it('cleans up subscription on unmount', () => {
      const { unmount } = render(
        <MITList
          initialMITs={[]}
          currentDate={mockCurrentDate}
          userId={mockUserId}
        />
      );

      unmount();

      expect(mockSupabase.removeChannel).toHaveBeenCalled();
    });
  });
});
