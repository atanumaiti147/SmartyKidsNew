'use client';

import { useUser } from '@/firebase';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

/**
 * A client component that checks authentication and protects routes.
 * - Redirects unauthenticated users from protected pages to '/login'.
 * - Redirects authenticated users from '/login' to '/'.
 * - Shows a loading state during authentication check.
 * - Renders children for authenticated users on protected pages.
 */
export default function RouteGuard({ children }: { children: React.ReactNode }) {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Wait until the authentication check is complete.
    if (isUserLoading) {
      return;
    }

    const isAuthPage = pathname === '/login';

    // If there is no user, and they are not on the login page, redirect them.
    if (!user && !isAuthPage) {
      router.push('/login');
    }
    
    // If there is a user and they are on the login page, redirect them to home.
    if (user && isAuthPage) {
      router.push('/');
    }

  }, [user, isUserLoading, router, pathname]);

  // Show a loading screen while we check for the user.
  if (isUserLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }
  
  // Do not render children on the login page if the user is not yet known, to avoid flashes.
  if (!user && pathname !== '/login') {
    return (
       <div className="flex h-screen w-screen items-center justify-center">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  // Do not render login page if user is logged in
  if(user && pathname === '/login') {
     return (
       <div className="flex h-screen w-screen items-center justify-center">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  return <>{children}</>;
}
