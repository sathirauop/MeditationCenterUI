'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/lib/auth-context';

export default function Header() {
  const { user, isAuthenticated } = useAuth();

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
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b">
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
          <ul className="hidden lg:flex items-center gap-8 text-sm font-medium">
            <li><a href="#home" className="hover:text-primary transition-colors">Home</a></li>
            <li className="relative group">
              <a href="#programs" className="hover:text-primary transition-colors cursor-pointer">Programs & Events</a>
              {/* Dropdown */}
              <div className="absolute top-full left-0 mt-2 bg-white shadow-lg border rounded-lg py-2 min-w-[200px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                <a href="#meditation-programs" className="block px-4 py-2 hover:bg-muted text-sm">Meditation Programs</a>
                <a href="#other-events" className="block px-4 py-2 hover:bg-muted text-sm">Other Events</a>
              </div>
            </li>
            <li className="relative group">
              <a href="#media" className="hover:text-primary transition-colors cursor-pointer">Media</a>
              {/* Dropdown */}
              <div className="absolute top-full left-0 mt-2 bg-white shadow-lg border rounded-lg py-2 min-w-[180px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                <a href="#books" className="block px-4 py-2 hover:bg-muted text-sm">Books</a>
                <a href="#recordings" className="block px-4 py-2 hover:bg-muted text-sm">Recordings</a>
                <a href="#blogs" className="block px-4 py-2 hover:bg-muted text-sm">Blogs</a>
              </div>
            </li>
            <li className="relative group">
              <a href="#about" className="hover:text-primary transition-colors cursor-pointer">About</a>
              {/* Dropdown */}
              <div className="absolute top-full left-0 mt-2 bg-white shadow-lg border rounded-lg py-2 min-w-[180px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                <a href="#about-us" className="block px-4 py-2 hover:bg-muted text-sm">About Us</a>
                <a href="#gallery" className="block px-4 py-2 hover:bg-muted text-sm">Gallery</a>
                <a href="#testimonials" className="block px-4 py-2 hover:bg-muted text-sm">Testimonials</a>
              </div>
            </li>
            <li className="relative group">
              <a href="#contact" className="hover:text-primary transition-colors cursor-pointer">Contact Us</a>
              {/* Dropdown */}
              <div className="absolute top-full left-0 mt-2 bg-white shadow-lg border rounded-lg py-2 min-w-[180px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                <a href="#contact-us" className="block px-4 py-2 hover:bg-muted text-sm">Contact Us</a>
                <a href="#faq" className="block px-4 py-2 hover:bg-muted text-sm">FAQ</a>
              </div>
            </li>
          </ul>

          {/* Auth Section - Conditional Rendering */}
          <div className="flex items-center gap-3">
            {isAuthenticated && user ? (
              // Logged in: Show user info
              <Link
                href="/profile"
                className="flex items-center gap-3 hover:opacity-80 transition-opacity"
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
              </Link>
            ) : (
              // Not logged in: Show Login & SignUp buttons
              <>
                <Link href="/login">
                  <Button variant="ghost">Login</Button>
                </Link>
                <Link href="/register">
                  <Button>SignUp</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
