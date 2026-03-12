'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Home, LogOut, User as UserIcon } from 'lucide-react';
import Link from 'next/link';
import { useSettings } from '@/lib/settings/settings-context';
import { useAuth, useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Settings from '@/components/Settings';
import ProfileEditor from '@/components/ProfileEditor';
import { useUserProfile } from '@/lib/user';


export default function AccountPage() {
  const { dict } = useSettings();
  const auth = useAuth();
  const { user } = useUser();
  const { userProfile, isLoading: isUserLoading } = useUserProfile();
  const router = useRouter();

  const handleLogout = async () => {
    await auth.signOut();
    router.push('/login');
  };

  if (isUserLoading || !user || !userProfile) {
    return <p>Loading...</p>;
  }

  return (
    <div className="w-full max-w-2xl">
      <Card className="shadow-xl rounded-[20px] border-2">
        <CardHeader className="text-center">
           <div className="mx-auto w-fit mb-4">
              <Avatar className="h-24 w-24 border-4 border-primary">
                <AvatarImage src={`https://api.dicebear.com/8.x/bottts-neutral/svg?seed=${user.uid}`} alt={user.displayName || 'User'} />
                <AvatarFallback>
                  <UserIcon className="h-12 w-12" />
                </AvatarFallback>
              </Avatar>
            </div>
          <CardTitle className="font-headline text-3xl">{dict.account.title}</CardTitle>
          <CardDescription>
            {user.email || 'Anonymous User'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <ProfileEditor />
          <Settings />
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild variant="outline" className="w-full">
              <Link href="/">
                <Home className="mr-2 h-5 w-5" />
                {dict.account.backToHome}
              </Link>
            </Button>
            <Button onClick={handleLogout} variant="destructive" className="w-full">
              <LogOut className="mr-2 h-5 w-5" />
              {dict.account.logoutButton}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
