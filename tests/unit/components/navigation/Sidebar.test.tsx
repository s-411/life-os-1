import { render, screen } from '@testing-library/react';
import { usePathname } from 'next/navigation';
import Sidebar from '@/components/navigation/Sidebar';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}));

describe('Sidebar Component', () => {
  beforeEach(() => {
    (usePathname as jest.Mock).mockReturnValue('/daily');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders all navigation items', () => {
    render(<Sidebar />);

    expect(screen.getByText('Daily')).toBeInTheDocument();
    expect(screen.getByText('Calories')).toBeInTheDocument();
    expect(screen.getByText('Injections')).toBeInTheDocument();
    expect(screen.getByText('Nirvana')).toBeInTheDocument();
    expect(screen.getByText('Winners Bible')).toBeInTheDocument();
    expect(screen.getByText('Analytics')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  it('renders the Life OS logo', () => {
    render(<Sidebar />);
    expect(screen.getByText('Life OS')).toBeInTheDocument();
  });

  it('applies active state to current route', () => {
    (usePathname as jest.Mock).mockReturnValue('/daily');
    render(<Sidebar />);

    const dailyLink = screen.getByRole('link', { name: /daily/i });
    expect(dailyLink).toHaveAttribute('aria-current', 'page');
    expect(dailyLink).toHaveClass('bg-[#00A1FE]');
  });

  it('detects active state for nested routes', () => {
    (usePathname as jest.Mock).mockReturnValue('/settings/profile');
    render(<Sidebar />);

    const settingsLink = screen.getByRole('link', { name: /settings/i });
    expect(settingsLink).toHaveAttribute('aria-current', 'page');
  });

  it('renders correct hrefs for all navigation items', () => {
    render(<Sidebar />);

    expect(screen.getByRole('link', { name: /daily/i })).toHaveAttribute('href', '/daily');
    expect(screen.getByRole('link', { name: /calories/i })).toHaveAttribute('href', '/calories');
    expect(screen.getByRole('link', { name: /injections/i })).toHaveAttribute('href', '/injections');
    expect(screen.getByRole('link', { name: /nirvana/i })).toHaveAttribute('href', '/nirvana');
    expect(screen.getByRole('link', { name: /winners bible/i })).toHaveAttribute('href', '/winners-bible');
    expect(screen.getByRole('link', { name: /analytics/i })).toHaveAttribute('href', '/analytics');
    expect(screen.getByRole('link', { name: /settings/i })).toHaveAttribute('href', '/settings');
  });

  it('has proper ARIA attributes', () => {
    render(<Sidebar />);

    const nav = screen.getByRole('navigation', { name: 'Main navigation' });
    expect(nav).toBeInTheDocument();
  });
});