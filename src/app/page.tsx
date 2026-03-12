'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Star, Settings, Trophy, Medal } from 'lucide-react';
import { useSettings } from '@/lib/settings/settings-context';

export default function Home() {
  const mascotImage = PlaceHolderImages.find((img) => img.id === 'mascot');
  const { dict } = useSettings();

  return (
    <div className="flex flex-col items-center justify-center text-center p-4 sm:p-8 w-full max-w-4xl mx-auto">
      <div className="relative w-48 h-48 md:w-64 md:h-64 mb-4">
        {mascotImage && (
          <Image
            src={mascotImage.imageUrl}
            alt={mascotImage.description}
            width={256}
            height={256}
            className="animate-gentle-bounce"
            data-ai-hint={mascotImage.imageHint}
            priority
          />
        )}
      </div>

      <h1 className="font-headline text-5xl md:text-7xl font-bold text-primary-foreground mb-2 drop-shadow-lg">
        {dict.home.title}
      </h1>
      <p className="text-xl md:text-2xl text-muted-foreground mb-8 md:mb-12">
        {dict.home.subtitle}
      </p>

      <div className="w-full max-w-md flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-4">
            <Button
              asChild
              className="h-20 text-lg md:text-xl font-bold shadow-lg transform hover:scale-105 transition-transform duration-300 rounded-[20px] bg-accent text-accent-foreground hover:bg-accent/90"
              size="lg"
            >
              <Link href="/topics">
                <Star className="mr-2 h-6 w-6" />
                {dict.home.learningButton}
              </Link>
            </Button>
            <Button
              asChild
              className="h-20 text-lg md:text-xl font-bold shadow-lg transform hover:scale-105 transition-transform duration-300 rounded-[20px]"
              size="lg"
            >
              <Link href="/rewards">
                <Medal className="mr-2 h-6 w-6" />
                {dict.home.rewardsButton}
              </Link>
            </Button>
            <Button
              asChild
              className="h-20 text-lg md:text-xl font-bold shadow-lg transform hover:scale-105 transition-transform duration-300 rounded-[20px]"
              size="lg"
            >
              <Link href="/account">
                <Settings className="mr-2 h-6 w-6" />
                {dict.home.settingsButton}
              </Link>
            </Button>
             <Button
              asChild
              className="h-20 text-lg md:text-xl font-bold shadow-lg transform hover:scale-105 transition-transform duration-300 rounded-[20px]"
              size="lg"
              variant="secondary"
            >
              <Link href="/leaderboard">
                <Trophy className="mr-2 h-6 w-6" />
                {dict.home.leaderboardButton}
              </Link>
            </Button>
        </div>
      </div>
    </div>
  );
}
