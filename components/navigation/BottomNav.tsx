'use client';

import { useState, Fragment } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Dialog, Transition } from '@headlessui/react';
import {
  HomeIcon,
  ScaleIcon,
  BeakerIcon,
  ChartBarIcon,
  Bars3Icon,
  XMarkIcon,
  SparklesIcon,
  BookOpenIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline';
import {
  HomeIcon as HomeIconSolid,
  ScaleIcon as ScaleIconSolid,
  BeakerIcon as BeakerIconSolid,
  ChartBarIcon as ChartBarIconSolid,
  SparklesIcon as SparklesIconSolid,
  BookOpenIcon as BookOpenIconSolid,
  Cog6ToothIcon as Cog6ToothIconSolid,
} from '@heroicons/react/24/solid';

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  iconActive: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

// Primary navigation items (shown in bottom bar)
const primaryNavItems: NavItem[] = [
  { label: 'Daily', href: '/daily', icon: HomeIcon, iconActive: HomeIconSolid },
  { label: 'Calories', href: '/calories', icon: ScaleIcon, iconActive: ScaleIconSolid },
  { label: 'Injections', href: '/injections', icon: BeakerIcon, iconActive: BeakerIconSolid },
  { label: 'Analytics', href: '/analytics', icon: ChartBarIcon, iconActive: ChartBarIconSolid },
];

// Overflow items (shown in drawer)
const overflowNavItems: NavItem[] = [
  { label: 'Nirvana', href: '/nirvana', icon: SparklesIcon, iconActive: SparklesIconSolid },
  { label: 'Winners Bible', href: '/winners-bible', icon: BookOpenIcon, iconActive: BookOpenIconSolid },
  { label: 'Settings', href: '/settings', icon: Cog6ToothIcon, iconActive: Cog6ToothIconSolid },
];

export default function BottomNav() {
  const pathname = usePathname();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(href + '/');
  };

  const handleNavClick = () => {
    setIsDrawerOpen(false);
  };

  return (
    <>
      {/* Bottom Navigation Bar */}
      <nav
        className="fixed bottom-0 left-0 right-0 bg-[#1a1a1a] border-t border-[#2a2a2a] z-50"
        aria-label="Mobile navigation"
      >
        <ul className="flex items-center justify-around h-16">
          {primaryNavItems.map((item) => {
            const active = isActive(item.href);
            const Icon = active ? item.iconActive : item.icon;

            return (
              <li key={item.href} className="flex-1">
                <Link
                  href={item.href}
                  className={`
                    flex flex-col items-center justify-center h-full gap-1
                    transition-colors duration-200
                    focus:outline-none focus:ring-2 focus:ring-[#00A1FE] focus:ring-inset
                    ${active ? 'text-[#00A1FE]' : 'text-[#e5e5e5]'}
                  `}
                  aria-current={active ? 'page' : undefined}
                >
                  <Icon className="w-6 h-6" aria-hidden="true" />
                  <span className="text-xs font-medium">{item.label}</span>
                  {active && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#00A1FE]" aria-hidden="true" />
                  )}
                </Link>
              </li>
            );
          })}

          {/* Hamburger Menu Button */}
          <li className="flex-1">
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="flex flex-col items-center justify-center h-full w-full gap-1 text-[#e5e5e5] focus:outline-none focus:ring-2 focus:ring-[#00A1FE] focus:ring-inset transition-colors hover:text-[#00A1FE]"
              aria-label="Open menu"
            >
              <Bars3Icon className="w-6 h-6" aria-hidden="true" />
              <span className="text-xs font-medium">Menu</span>
            </button>
          </li>
        </ul>
      </nav>

      {/* Mobile Drawer Menu */}
      <Transition show={isDrawerOpen} as={Fragment}>
        <Dialog onClose={() => setIsDrawerOpen(false)} className="relative z-50">
          {/* Backdrop */}
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
          </Transition.Child>

          {/* Drawer Panel */}
          <Transition.Child
            as={Fragment}
            enter="transform transition ease-in-out duration-300"
            enterFrom="translate-y-full"
            enterTo="translate-y-0"
            leave="transform transition ease-in-out duration-200"
            leaveFrom="translate-y-0"
            leaveTo="translate-y-full"
          >
            <Dialog.Panel className="fixed bottom-0 left-0 right-0 bg-[#1a1a1a] rounded-t-2xl shadow-xl max-h-[80vh] overflow-y-auto">
              {/* Drawer Header */}
              <div className="flex items-center justify-between p-4 border-b border-[#2a2a2a]">
                <Dialog.Title className="text-lg font-semibold text-[#e5e5e5]">
                  Menu
                </Dialog.Title>
                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="p-2 rounded-lg text-[#e5e5e5] hover:bg-[#2a2a2a] focus:outline-none focus:ring-2 focus:ring-[#00A1FE]"
                  aria-label="Close menu"
                >
                  <XMarkIcon className="w-6 h-6" aria-hidden="true" />
                </button>
              </div>

              {/* Drawer Navigation */}
              <nav className="p-4">
                <ul className="space-y-2">
                  {overflowNavItems.map((item) => {
                    const active = isActive(item.href);
                    const Icon = active ? item.iconActive : item.icon;

                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          onClick={handleNavClick}
                          className={`
                            flex items-center gap-3 px-4 py-3 rounded-lg min-h-[44px]
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
            </Dialog.Panel>
          </Transition.Child>
        </Dialog>
      </Transition>
    </>
  );
}