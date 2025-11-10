'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import SideNav from '@/components/admin/SideNav';

export default function AdminLayout({ children }) {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  // Fix hydration error - only render after mount
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Protect all admin routes - only allow ADMIN users
  useEffect(() => {
    if (isMounted && !loading && (!isAuthenticated || user?.role !== 'ADMIN')) {
      router.push('/');
    }
  }, [isAuthenticated, user, loading, router, isMounted]);

  // Don't render anything until mounted (prevents hydration mismatch)
  if (!isMounted || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== 'ADMIN') {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-teal-50/30">
      <SideNav />

      {/* Main Content Area - offset by sidebar width */}
      <main className="lg:ml-64 min-h-screen">
        {children}
      </main>
    </div>
  );
}
