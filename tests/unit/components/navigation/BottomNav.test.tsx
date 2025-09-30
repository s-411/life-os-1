import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { usePathname } from 'next/navigation';
import BottomNav from '@/components/navigation/BottomNav';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}));

describe('BottomNav Component', () => {
  beforeEach(() => {
    (usePathname as jest.Mock).mockReturnValue('/daily');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders primary navigation items in bottom bar', () => {
    render(<BottomNav />);

    expect(screen.getByText('Daily')).toBeInTheDocument();
    expect(screen.getByText('Calories')).toBeInTheDocument();
    expect(screen.getByText('Injections')).toBeInTheDocument();
    expect(screen.getByText('Analytics')).toBeInTheDocument();
  });

  it('renders hamburger menu button', () => {
    render(<BottomNav />);

    const menuButton = screen.getByRole('button', { name: /open menu/i });
    expect(menuButton).toBeInTheDocument();
  });

  it('opens drawer when hamburger menu is clicked', async () => {
    render(<BottomNav />);

    const menuButton = screen.getByRole('button', { name: /open menu/i });
    fireEvent.click(menuButton);

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
  });

  it('displays overflow items in drawer menu', async () => {
    render(<BottomNav />);

    const menuButton = screen.getByRole('button', { name: /open menu/i });
    fireEvent.click(menuButton);

    await waitFor(() => {
      expect(screen.getByText('Nirvana')).toBeInTheDocument();
      expect(screen.getByText('Winners Bible')).toBeInTheDocument();
      expect(screen.getByText('Settings')).toBeInTheDocument();
    });
  });

  it('closes drawer when close button is clicked', async () => {
    render(<BottomNav />);

    const menuButton = screen.getByRole('button', { name: /open menu/i });
    fireEvent.click(menuButton);

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    const closeButton = screen.getByRole('button', { name: /close menu/i });
    fireEvent.click(closeButton);

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  it('closes drawer when a nav item is clicked', async () => {
    render(<BottomNav />);

    const menuButton = screen.getByRole('button', { name: /open menu/i });
    fireEvent.click(menuButton);

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    // Click on Settings link in drawer
    const settingsLinks = screen.getAllByRole('link', { name: /settings/i });
    const drawerSettingsLink = settingsLinks.find(link =>
      link.textContent === 'Settings' && link.closest('[role="dialog"]')
    );

    if (drawerSettingsLink) {
      fireEvent.click(drawerSettingsLink);
    }

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  it('applies active state indicator to current route', () => {
    (usePathname as jest.Mock).mockReturnValue('/daily');
    render(<BottomNav />);

    const dailyLink = screen.getByRole('link', { name: /daily/i });
    expect(dailyLink).toHaveAttribute('aria-current', 'page');
    expect(dailyLink).toHaveClass('text-[#00A1FE]');
  });

  it('has proper ARIA attributes for accessibility', () => {
    render(<BottomNav />);

    const nav = screen.getByRole('navigation', { name: 'Mobile navigation' });
    expect(nav).toBeInTheDocument();

    const menuButton = screen.getByRole('button', { name: /open menu/i });
    expect(menuButton).toHaveAttribute('aria-label', 'Open menu');
  });
});