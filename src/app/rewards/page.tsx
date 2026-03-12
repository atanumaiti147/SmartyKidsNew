
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy, Home, Coins, CheckCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useSettings } from '@/lib/settings/settings-context';
import { useUserProfile } from '@/lib/user';
import { rewards as allRewards, type Reward } from '@/lib/rewards-data';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';

export default function RewardsPage() {
  const { dict } = useSettings();
  const { userProfile, isLoading } = useUserProfile();

  const userPoints = userProfile?.topicProgress ? Object.values(userProfile.topicProgress).reduce((sum, progress) => sum + progress.points, 0) : 0;
  const unlockedRewardIds = userProfile ? new Set(userProfile.medals || []) : new Set();

  const visibleRewards = allRewards.filter(reward => reward.id !== 'admin-medal');
  const unlockedMedals = visibleRewards.filter(reward => unlockedRewardIds.has(reward.id));
  const unlockedRewardsCount = unlockedMedals.length;
  const totalRewards = visibleRewards.length;
  

  return (
    <div className="w-full max-w-4xl">
      <Card className="shadow-xl rounded-[20px] border-2 mb-8">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto bg-yellow-100 rounded-full p-3 w-fit mb-4">
            <Trophy className="h-12 w-12 text-yellow-600" />
          </div>
          <CardTitle className="font-headline text-3xl">{dict.rewards.title}</CardTitle>
          <CardDescription>
            {isLoading ? '...' : `You have unlocked ${unlockedRewardsCount} out of ${totalRewards} rewards.`}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center gap-4">
            <div className="flex items-center justify-center gap-4">
              <Coins className="h-10 w-10 text-yellow-500" />
              <p className="text-4xl font-bold font-headline">{isLoading ? '...' : userPoints}</p>
            </div>
             {unlockedMedals.length > 0 && (
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {unlockedMedals.map(medal => {
                  return (
                    <Badge key={medal.id} variant="secondary" className="flex items-center gap-2 p-2 text-sm">
                       <Image src={medal.imageUrl} alt={medal.name} width={16} height={16} className="shrink-0" />
                       <span className="whitespace-nowrap">{medal.name}</span>
                    </Badge>
                  )
                })}
              </div>
            )}
             {unlockedMedals.length === 0 && !isLoading && (
                <p className="text-muted-foreground text-sm mt-2">You haven't unlocked any medals yet. Keep learning!</p>
            )}
        </CardContent>
      </Card>
      
      {isLoading && <div className="flex justify-center items-center h-40"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>}

      {!isLoading && visibleRewards && <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {visibleRewards.map(reward => {
          const isUnlocked = unlockedRewardIds.has(reward.id);
          
          return (
            <Card key={reward.id} className={cn(
              "shadow-lg rounded-[20px] border-2 flex flex-col transition-opacity duration-500", 
              isUnlocked ? "opacity-100 bg-accent/20 border-accent" : "opacity-40"
            )}>
              <CardHeader className="text-center">
                 <div className={cn("mx-auto rounded-full p-3 w-fit mb-2 text-white flex items-center justify-center h-16 w-16")}>
                    <Image src={reward.imageUrl} alt={reward.name} width={40} height={40} />
                </div>
                <CardTitle className="font-headline text-2xl">{reward.name}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow flex items-center justify-center">
                 <p className="text-sm text-muted-foreground text-center">{reward.description}</p>
              </CardContent>
              {isUnlocked && (
                <CardContent className="flex-grow flex items-center justify-center">
                    <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle className="h-6 w-6" />
                        <p className="text-lg font-bold">Unlocked</p>
                    </div>
                </CardContent>
                )}
            </Card>
          );
        })}
      </div>}

       <div className="text-center mt-8">
          <Button asChild variant="ghost">
            <Link href="/">
              <Home className="mr-2 h-5 w-5" />
              {dict.rewards.backToHome}
            </Link>
          </Button>
        </div>
    </div>
  );
}
