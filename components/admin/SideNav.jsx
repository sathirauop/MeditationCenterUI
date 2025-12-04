'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Calendar,
  Users,
  BookOpen,
  Settings,
  ExternalLink,
  Menu,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const navigationItems = [
  {
    name: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
    disabled: false
  },
  {
    name: 'Daily Schedule',
    href: '/admin/schedule',
    icon: Calendar,
    disabled: false
  },
  {
    name: 'Events',
    href: '/admin/events',
    icon: Calendar,
    disabled: false
  },
  {
    name: 'Users',
    href: '/admin/users',
    icon: Users,
    disabled: true
  },
  {
    name: 'Programs',
    href: '/admin/programs',
    icon: BookOpen,
    disabled: true
  },
  {
    name: 'Settings',
    href: '/admin/settings',
    icon: Settings,
    disabled: true
  }
];

export default function SideNav() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="outline"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden bg-teal-600 text-white border-teal-700 hover:bg-teal-700 hover:text-white"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? (
          <X className="h-5 w-5" />
        ) : (
          <Menu className="h-5 w-5" />
        )}
      </Button>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Side Navigation */}
      <aside
        className={cn(
          "fixed top-0 left-0 h-full w-64 bg-white border-r border-teal-200 z-40 transition-transform duration-300 ease-in-out flex flex-col shadow-lg",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Logo/Header */}
        <div className="p-6 border-b border-teal-200 bg-teal-50">
          <div className="flex flex-col items-center">
            <div className="relative w-20 h-20 mb-3">
              <Image
                src="/images/Logo1.jpeg"
                alt="Isipathana Meditation Center"
                fill
                className="object-contain rounded-full"
                priority
              />
            </div>
            <h1 className="text-lg font-bold text-teal-800 text-center">Admin Panel</h1>
            <p className="text-xs text-teal-600 mt-1 text-center">Isipathana International<br />Meditation Center</p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href ||
              (item.href !== '/admin' && pathname.startsWith(item.href));

            return (
              <Link
                key={item.name}
                href={item.disabled ? '#' : item.href}
                onClick={(e) => {
                  if (item.disabled) {
                    e.preventDefault();
                  } else {
                    setIsMobileMenuOpen(false);
                  }
                }}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                  isActive && !item.disabled && "bg-teal-600 text-white shadow-md",
                  !isActive && !item.disabled && "hover:bg-teal-100 text-teal-800 hover:shadow-sm",
                  item.disabled && "opacity-50 cursor-not-allowed text-teal-400"
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{item.name}</span>
                {item.disabled && (
                  <span className="ml-auto text-xs bg-teal-200 text-teal-700 px-2 py-1 rounded">
                    Soon
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* View Public Site Link */}
        <div className="p-4 border-t border-teal-200 bg-teal-50">
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-amber-600 hover:bg-amber-700 transition-all duration-200 text-white shadow-md hover:shadow-lg font-medium"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <ExternalLink className="h-4 w-4" />
            <span>View Public Site</span>
          </Link>
        </div>
      </aside>
    </>
  );
}
