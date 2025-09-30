'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';
import {
  HomeIcon,
  ScaleIcon,
  BeakerIcon,
  SparklesIcon,
  BookOpenIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';
import {
  HomeIcon as HomeIconSolid,
  ScaleIcon as ScaleIconSolid,
  BeakerIcon as BeakerIconSolid,
  SparklesIcon as SparklesIconSolid,
  BookOpenIcon as BookOpenIconSolid,
  ChartBarIcon as ChartBarIconSolid,
} from '@heroicons/react/24/solid';

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  iconActive: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

const navigationItems: NavItem[] = [
  { label: 'Daily', href: '/daily', icon: HomeIcon, iconActive: HomeIconSolid },
  { label: 'Calories', href: '/calories', icon: ScaleIcon, iconActive: ScaleIconSolid },
  { label: 'Injections', href: '/injections', icon: BeakerIcon, iconActive: BeakerIconSolid },
  { label: 'Nirvana', href: '/nirvana', icon: SparklesIcon, iconActive: SparklesIconSolid },
  { label: 'Winners Bible', href: '/winners-bible', icon: BookOpenIcon, iconActive: BookOpenIconSolid },
  { label: 'Analytics', href: '/analytics', icon: ChartBarIcon, iconActive: ChartBarIconSolid },
];

export default function Header() {
  const pathname = usePathname();
  const { logout } = useAuth();

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(href + '/');
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <header className="sticky top-0 bg-[#1a1a1a] border-b border-[#2a2a2a] z-40">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/daily" className="text-2xl font-bold text-[#00A1FE] focus:outline-none focus:ring-2 focus:ring-[#00A1FE] focus:ring-offset-2 focus:ring-offset-[#1a1a1a] rounded">
            Life OS
          </Link>
        </div>

        {/* Center Navigation Links */}
        <nav className="flex-1 flex justify-center" aria-label="Main navigation">
          <ul className="flex items-center gap-1">
            {navigationItems.map((item) => {
              const active = isActive(item.href);
              const Icon = active ? item.iconActive : item.icon;

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`
                      flex items-center gap-2 px-3 py-2 rounded-lg
                      transition-colors duration-200
                      focus:outline-none focus:ring-2 focus:ring-[#00A1FE] focus:ring-offset-2 focus:ring-offset-[#1a1a1a]
                      ${
                        active
                          ? 'text-[#00A1FE]'
                          : 'text-[#e5e5e5] hover:text-[#00A1FE] hover:bg-[#2a2a2a]'
                      }
                    `}
                    aria-current={active ? 'page' : undefined}
                  >
                    <Icon className="w-5 h-5" aria-hidden="true" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Right Side - Icon Buttons */}
        <div className="flex items-center gap-2">
          <Link
            href="/settings"
            className="p-2 rounded-lg text-[#e5e5e5] hover:bg-[#2a2a2a] focus:outline-none focus:ring-2 focus:ring-[#00A1FE] transition-colors"
            aria-label="Settings"
          >
            <Cog6ToothIcon className="w-6 h-6" aria-hidden="true" />
          </Link>
          <button
            onClick={handleLogout}
            className="p-2 rounded-lg text-[#e5e5e5] hover:bg-[#2a2a2a] hover:text-red-400 focus:outline-none focus:ring-2 focus:ring-[#00A1FE] transition-colors"
            aria-label="Logout"
          >
            <ArrowRightOnRectangleIcon className="w-6 h-6" aria-hidden="true" />
          </button>
        </div>
      </div>
    </header>
  );
}