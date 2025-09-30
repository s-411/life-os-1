'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  HomeIcon,
  ScaleIcon,
  BeakerIcon,
  SparklesIcon,
  BookOpenIcon,
  ChartBarIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline';
import {
  HomeIcon as HomeIconSolid,
  ScaleIcon as ScaleIconSolid,
  BeakerIcon as BeakerIconSolid,
  SparklesIcon as SparklesIconSolid,
  BookOpenIcon as BookOpenIconSolid,
  ChartBarIcon as ChartBarIconSolid,
  Cog6ToothIcon as Cog6ToothIconSolid,
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
  { label: 'Settings', href: '/settings', icon: Cog6ToothIcon, iconActive: Cog6ToothIconSolid },
];

export default function Sidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(href + '/');
  };

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-[#1a1a1a] text-[#e5e5e5] flex flex-col">
      {/* Logo/Brand */}
      <div className="p-6 border-b border-[#2a2a2a]">
        <h1 className="text-2xl font-bold text-[#00A1FE]">Life OS</h1>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 py-4" aria-label="Main navigation">
        <ul className="space-y-1 px-3">
          {navigationItems.map((item) => {
            const active = isActive(item.href);
            const Icon = active ? item.iconActive : item.icon;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-lg
                    transition-colors duration-200
                    focus:outline-none focus:ring-2 focus:ring-[#00A1FE] focus:ring-offset-2 focus:ring-offset-[#1a1a1a]
                    ${
                      active
                        ? 'bg-[#00A1FE] text-white'
                        : 'text-[#e5e5e5] hover:bg-[#2a2a2a]'
                    }
                  `}
                  aria-current={active ? 'page' : undefined}
                >
                  <Icon className="w-6 h-6 flex-shrink-0" aria-hidden="true" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}