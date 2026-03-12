'use client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy, Home, Loader2, Star } from 'lucide-react';
import Link from 'next/link';
import { useSettings } from '@/lib/settings/settings-context';
import { useFirestore } from '@/firebase';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import type { User, UserWithMedals } from '@/lib/user';
import { rewards as allRewards } from '@/lib/rewards-data';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const medalOrder = [
    'smartymaster-medal',
    'diamond-medal',
    'platinum-medal',
    'gold-medal',
    'silver-medal',
    'bronze-medal'
];

const medalRankMap: Record<string, number> = medalOrder.reduce((acc, medalId, index) => {
    acc[medalId] = index;
    return acc;
}, {} as Record<string, number>);

export default function LeaderboardPage() {
  const { dict } = useSettings();
  const firestore = useFirestore();
  const [sortedUsers, setSortedUsers] = useState<(User & { totalPoints: number, maxLevel: number })[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchAndProcessLeaderboard() {
      if (!firestore) return;
      setIsLoading(true);

      const usersQuery = query(collection(firestore, 'users'));
      const usersSnapshot = await getDocs(usersQuery);
      const usersData: User[] = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));

      const processedUsers = usersData.map(user => {
        let totalPoints = 0;
        let maxLevel = 1;
        if (user.topicProgress) {
          for (const topicId in user.topicProgress) {
            totalPoints += user.topicProgress[topicId].points || 0;
            maxLevel = Math.max(maxLevel, user.topicProgress[topicId].level || 1);
          }
        }
        return { ...user, totalPoints, maxLevel };
      });
      
      const getHighestMedalRank = (userMedals: string[]): number => {
          if (!userMedals || userMedals.length === 0) return medalOrder.length;
          let highestRank = medalOrder.length;
          for(const medalId of userMedals){
              if(medalRankMap[medalId] !== undefined){
                  highestRank = Math.min(highestRank, medalRankMap[medalId]);
              }
          }
          return highestRank;
      };

      processedUsers.sort((a, b) => {
        const aRank = getHighestMedalRank(a.medals);
        const bRank = getHighestMedalRank(b.medals);

        if (aRank !== bRank) {
          return aRank - bRank;
        }
        
        return b.totalPoints - a.totalPoints;
      });

      setSortedUsers(processedUsers);
      setIsLoading(false);
    }
    
    fetchAndProcessLeaderboard();
  }, [firestore]);


  const getRankContent = (rank: number) => {
    return <span className="font-bold w-8 text-center">{rank + 1}</span>;
  };
  
  const getRankColor = (rank: number) => {
     if (rank === 0) return "border-purple-500 bg-purple-50";
     if (rank === 1) return "border-sky-400 bg-sky-50";
     if (rank === 2) return "border-cyan-400 bg-cyan-50";
     if (rank === 3) return "border-yellow-400 bg-yellow-50";
     if (rank === 4) return "border-gray-400 bg-gray-50";
     if (rank === 5) return "border-amber-600 bg-amber-50";
     return "border-border";
  }

  const getUserBadges = (user: User) => {
      if(!user.medals || user.medals.length === 0) return null;
      
      const sortedMedals = user.medals
        .map(medalId => {
            const rank = medalRankMap[medalId];
            return {
                id: medalId,
                rank: rank === undefined ? medalOrder.length : rank
            };
        })
        .sort((a, b) => a.rank - b.rank)
        .slice(0, 5); // Show up to 5 best medals

       return (
        <TooltipProvider>
            <div className="flex items-center gap-1">
                {sortedMedals.map(({id}) => {
                    const medalInfo = allRewards.find(r => r.id === id);
                    if(!medalInfo || !medalInfo.imageUrl) return null;

                    return (
                         <Tooltip key={id}>
                            <TooltipTrigger>
                                <Image src={medalInfo.imageUrl} alt={medalInfo.name} width={20} height={20} className="h-5 w-5" />
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>{medalInfo.name}</p>
                            </TooltipContent>
                        </Tooltip>
                    )
                })}
            </div>
        </TooltipProvider>
       )
  }

  return (
    <div className="w-full max-w-lg">
      <Card className="shadow-xl rounded-[20px] border-2">
        <CardHeader className="text-center">
          <div className="mx-auto bg-yellow-100 rounded-full p-3 w-fit mb-4">
            <Trophy className="h-12 w-12 text-yellow-600" />
          </div>
          <CardTitle className="font-headline text-3xl">{dict.leaderboard.title}</CardTitle>
          <CardDescription>
            {dict.leaderboard.description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading && (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
          )}
          {!isLoading && sortedUsers && (
            <div className="space-y-4">
              {sortedUsers.map((user, index) => (
                <div key={user.id} className={cn("flex items-center gap-4 p-3 rounded-lg border-2", getRankColor(index))}>
                    <div className="flex items-center justify-center w-8 h-8">
                       {getRankContent(index)}
                    </div>
                    <Avatar>
                      <AvatarImage src={`https://api.dicebear.com/8.x/bottts-neutral/svg?seed=${user.id}`} alt={user.username} />
                      <AvatarFallback>{user.username.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-grow">
                      <p className="font-bold text-lg">{user.username}</p>
                       <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-400" />
                            <span>Top Level {user.maxLevel-1}</span>
                        </div>
                        {getUserBadges(user)}
                       </div>
                    </div>
                    <p className="font-headline text-2xl text-primary-foreground">{user.totalPoints}</p>
                </div>
              ))}
            </div>
          )}
          <div className="text-center mt-6">
            <Button asChild variant="ghost">
                <Link href="/">
                <Home className="mr-2 h-5 w-5" />
                {dict.leaderboard.backToHome}
                </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
