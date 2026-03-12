'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function BackButton() {
  const pathname = usePathname();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleBack = () => {
    // A simple heuristic to decide where to go back to.
    if (pathname.startsWith('/topics/')) {
      router.push('/topics');
    } else if (pathname === '/login' || pathname === '/signup') {
      // should not happen based on render logic, but as a safeguard
      router.push('/');
    } else {
      router.back();
    }
  };

  // Pages where the back button should not be shown
  const noBackButtonPaths = ['/', '/login', '/signup', '/admin'];
  
  if (!isClient || noBackButtonPaths.includes(pathname)) {
    return null;
  }

  return (
    <div className="fixed left-4 top-24 z-10">
      <Button onClick={handleBack} variant="ghost" size="icon" className="rounded-full h-12 w-12 sm:h-16 sm:w-16 bg-card/80 backdrop-blur-sm hover:bg-card">
        <ArrowLeft className="h-6 w-6 sm:h-8 sm:w-8" />
        <span className="sr-only">Back</span>
      </Button>
    </div>
  );
}
