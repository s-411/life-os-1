import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';
import Header from '@/components/navigation/Header';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}));

// Mock Auth context
jest.mock('@/lib/context/AuthContext', () => ({
  useAuth: jest.fn(),
}));

describe('Header Component', () => {
  const mockLogout = jest.fn();

  beforeEach(() => {
    (usePathname as jest.Mock).mockReturnValue('/daily');
    (useAuth as jest.Mock).mockReturnValue({
      logout: mockLogout,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders all navigation items', () => {
    render(<Header />);

    expect(screen.getByText('Daily')).toBeInTheDocument();
    expect(screen.getByText('Calories')).toBeInTheDocument();
    expect(screen.getByText('Injections')).toBeInTheDocument();
    expect(screen.getByText('Nirvana')).toBeInTheDocument();
    expect(screen.getByText('Winners Bible')).toBeInTheDocument();
    expect(screen.getByText('Analytics')).toBeInTheDocument();
  });

  it('renders the Life OS logo', () => {
    render(<Header />);
    expect(screen.getByText('Life OS')).toBeInTheDocument();
  });

  it('renders settings and logout buttons', () => {
    render(<Header />);

    const settingsButton = screen.getByRole('link', { name: /settings/i });
    expect(settingsButton).toBeInTheDocument();

    const logoutButton = screen.getByRole('button', { name: /logout/i });
    expect(logoutButton).toBeInTheDocument();
  });

  it('calls logout function when logout button is clicked', async () => {
    render(<Header />);

    const logoutButton = screen.getByRole('button', { name: /logout/i });
    fireEvent.click(logoutButton);

    await waitFor(() => {
      expect(mockLogout).toHaveBeenCalledTimes(1);
    });
  });

  it('applies active state to current route', () => {
    (usePathname as jest.Mock).mockReturnValue('/analytics');
    render(<Header />);

    const analyticsLink = screen.getByRole('link', { name: /analytics/i });
    expect(analyticsLink).toHaveAttribute('aria-current', 'page');
    expect(analyticsLink).toHaveClass('text-[#00A1FE]');
  });

  it('has proper ARIA attributes', () => {
    render(<Header />);

    const nav = screen.getByRole('navigation', { name: 'Main navigation' });
    expect(nav).toBeInTheDocument();

    const settingsButton = screen.getByRole('link', { name: /settings/i });
    expect(settingsButton).toHaveAttribute('aria-label', 'Settings');

    const logoutButton = screen.getByRole('button', { name: /logout/i });
    expect(logoutButton).toHaveAttribute('aria-label', 'Logout');
  });

  it('handles logout error gracefully', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    mockLogout.mockRejectedValueOnce(new Error('Logout failed'));

    render(<Header />);

    const logoutButton = screen.getByRole('button', { name: /logout/i });
    fireEvent.click(logoutButton);

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith('Logout failed:', expect.any(Error));
    });

    consoleErrorSpy.mockRestore();
  });
});