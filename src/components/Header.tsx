'use client';

import Link from 'next/link';
import { LogIn, User, Award, LogOut, Sparkles, Shield, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useUser, useAuth } from '@/firebase';
import { usePathname, useRouter } from 'next/navigation';
import { useSettings } from '@/lib/settings/settings-context';
import { useIsAdmin } from '@/lib/admin';

export default function Header() {
  const { user, isUserLoading } = useUser();
  const { isAdmin, isLoading: isAdminLoading } = useIsAdmin();
  const auth = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const { dict } = useSettings();

  const handleLogout = async () => {
    await auth.signOut();
    router.push('/');
  };
  
  return (
    <header className="w-full p-4 flex justify-between items-center bg-transparent">
      <Link href="/" className="flex items-center gap-2">
        <Sparkles className="h-8 w-8 text-primary-foreground" />
        <span className="font-headline text-2xl font-bold text-primary-foreground">{dict.header.title}</span>
      </Link>
      
      <div className="flex items-center gap-2">
        {isUserLoading ? (
          <div className="h-10 w-10" /> // Placeholder for spacing
        ) : user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar>
                  <AvatarImage src={`https://api.dicebear.com/8.x/bottts-neutral/svg?seed=${user.uid}`} alt={user.displayName || 'User'} />
                  <AvatarFallback>
                    <User />
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user.displayName || 'Welcome'}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
               {isAdmin && (
                <DropdownMenuItem onClick={() => router.push('/admin')}>
                  <Shield className="mr-2 h-4 w-4" />
                  <span>Admin</span>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={() => router.push('/account')}>
                <User className="mr-2 h-4 w-4" />
                <span>{dict.header.account}</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push('/rewards')}>
                <Award className="mr-2 h-4 w-4" />
                <span>{dict.header.rewards}</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push('/about')}>
                <Info className="mr-2 h-4 w-4" />
                <span>About</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>{dict.header.logout}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button asChild>
            <Link href="/login">
              <LogIn className="mr-2 h-4 w-4" />
              {dict.header.login}
            </Link>
          </Button>
        )}
      </div>
    </header>
  );
}
