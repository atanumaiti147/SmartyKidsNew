import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import Header from '@/components/Header';
import { SettingsProvider } from '@/lib/settings/settings-context';
import { FirebaseClientProvider, useFirebase } from '@/firebase';
import RouteGuard from '@/components/RouteGuard';
import BackButton from '@/components/BackButton';
import WelcomeManager from '@/components/WelcomeManager';

export const metadata: Metadata = {
  title: 'SmartyKids – Fun Learning for Nursery',
  description: 'A playful, gamified learning web app for children ages 3-6.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🎓</text></svg>" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@400;500;600;700;800&family=Source+Code+Pro:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={cn('font-body antialiased h-full flex flex-col', 'bg-gradient-to-br from-background to-secondary/50')}>
        <SettingsProvider>
          <FirebaseClientProvider>
              <RouteGuard>
                <WelcomeManager />
                <Header />
                <BackButton />
                <main className="flex-1 flex flex-col items-center justify-center p-4">
                  {children}
                </main>
                <Toaster />
              </RouteGuard>
          </FirebaseClientProvider>
        </SettingsProvider>
      </body>
    </html>
  );
}
