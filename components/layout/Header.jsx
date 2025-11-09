'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { User, Settings, LogOut } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

export default function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);

  // Track scroll position
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Generate user initials from first and last name
  const getUserInitials = () => {
    console.log(user)
    if (!user) return '';
    const firstInitial = user.name?.charAt(0)?.toUpperCase() || '';
    return `${firstInitial}`;

  };

  const getFirstName = () => {
    // 1. Handle null/undefined user or user.name
    if (!user || !user.name) {
      return '';
    }

    const name = user.name.trim();

    // 2. Find the index of the first space
    const firstSpaceIndex = name.indexOf(' ');

    // 3. If a space is found, return the substring up to that point.
    //    If no space is found, assume the entire name is the "first name"
    //    and return the whole name string.
    const firstName = firstSpaceIndex !== -1
      ? name.substring(0, firstSpaceIndex)
      : name;

    // 4. Per your request: Return the first name followed by a single whitespace character.
    //    This assumes you want the output to be 'FirstName '
    return `${firstName} `;
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-sm border-b shadow-sm'
          : 'bg-transparent'
      }`}
    >
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="relative w-12 h-12 rounded-full overflow-hidden">
              <Image
                src="/images/Logo1.jpeg"
                alt="Isipathana Logo"
                fill
                style={{objectFit: 'cover'}}
              />
            </div>
          </Link>

          {/* Navigation */}
          <ul className={`hidden lg:flex items-center gap-8 text-sm font-medium transition-colors ${
            isScrolled ? 'text-foreground' : 'text-white'
          }`}>
            <li>
              <a href="#home" className={`transition-colors ${
                isScrolled ? 'hover:text-primary' : 'hover:text-white/80'
              }`}>
                Home
              </a>
            </li>
            <li className="relative group">
              <a href="#programs" className={`cursor-pointer transition-colors ${
                isScrolled ? 'hover:text-primary' : 'hover:text-white/80'
              }`}>
                Programs & Events
              </a>
              {/* Dropdown */}
              <div className="absolute top-full left-0 mt-2 bg-white shadow-lg border rounded-lg py-2 min-w-[200px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                <a href="#meditation-programs" className="block px-4 py-2 hover:bg-muted text-sm text-foreground">Meditation Programs</a>
                <a href="#other-events" className="block px-4 py-2 hover:bg-muted text-sm text-foreground">Other Events</a>
              </div>
            </li>
            <li className="relative group">
              <a href="#media" className={`cursor-pointer transition-colors ${
                isScrolled ? 'hover:text-primary' : 'hover:text-white/80'
              }`}>
                Media
              </a>
              {/* Dropdown */}
              <div className="absolute top-full left-0 mt-2 bg-white shadow-lg border rounded-lg py-2 min-w-[180px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                <a href="#books" className="block px-4 py-2 hover:bg-muted text-sm text-foreground">Books</a>
                <a href="#recordings" className="block px-4 py-2 hover:bg-muted text-sm text-foreground">Recordings</a>
                <a href="#blogs" className="block px-4 py-2 hover:bg-muted text-sm text-foreground">Blogs</a>
              </div>
            </li>
            <li className="relative group">
              <a href="#about" className={`cursor-pointer transition-colors ${
                isScrolled ? 'hover:text-primary' : 'hover:text-white/80'
              }`}>
                About
              </a>
              {/* Dropdown */}
              <div className="absolute top-full left-0 mt-2 bg-white shadow-lg border rounded-lg py-2 min-w-[180px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                <a href="#about-us" className="block px-4 py-2 hover:bg-muted text-sm text-foreground">About Us</a>
                <a href="#gallery" className="block px-4 py-2 hover:bg-muted text-sm text-foreground">Gallery</a>
                <a href="#testimonials" className="block px-4 py-2 hover:bg-muted text-sm text-foreground">Testimonials</a>
              </div>
            </li>
            <li className="relative group">
              <a href="#contact" className={`cursor-pointer transition-colors ${
                isScrolled ? 'hover:text-primary' : 'hover:text-white/80'
              }`}>
                Contact Us
              </a>
              {/* Dropdown */}
              <div className="absolute top-full left-0 mt-2 bg-white shadow-lg border rounded-lg py-2 min-w-[180px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                <a href="#contact-us" className="block px-4 py-2 hover:bg-muted text-sm text-foreground">Contact Us</a>
                <a href="#faq" className="block px-4 py-2 hover:bg-muted text-sm text-foreground">FAQ</a>
              </div>
            </li>
          </ul>

          {/* Auth Section - Conditional Rendering */}
          <div className="flex items-center gap-3">
            {isAuthenticated && user ? (
              // Logged in: Show user dropdown menu
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className={`flex items-center gap-3 hover:opacity-80 transition-all cursor-pointer outline-none ${
                      isScrolled ? 'text-foreground' : 'text-white'
                    }`}
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.profilePicture} alt={user.firstName} />
                      <AvatarFallback className="bg-primary text-white">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium text-sm hidden md:inline">
                      {getFirstName()}
                    </span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="cursor-pointer flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings" className="cursor-pointer flex items-center">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={async () => {
                      await logout();
                      router.push('/');
                    }}
                    className="cursor-pointer text-red-600 focus:text-red-600"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              // Not logged in: Show Login & SignUp buttons
              <>
                <Link href="/login">
                  <Button
                    variant="ghost"
                    className={isScrolled ? '' : 'text-white hover:text-white/80 hover:bg-white/10'}
                  >
                    Login
                  </Button>
                </Link>
                <Link href="/register">
                  <Button className={isScrolled ? '' : 'bg-white text-primary hover:bg-white/90'}>
                    SignUp
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
