'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Award, RotateCcw, SkipForward, BookOpen } from 'lucide-react';
import Confetti from './Confetti';
import { useSettings } from '@/lib/settings/settings-context';
import Link from 'next/link';

type QuizResultProps = {
  score: number;
  totalQuestions: number;
  onRestart: () => void;
  onNextLevel: () => void;
  completedLevel: number;
};

export default function QuizResult({ score, totalQuestions, onRestart, onNextLevel, completedLevel }: QuizResultProps) {
  const { dict } = useSettings();
  
  const handleRestartClick = () => {
    onRestart();
  }

  const handleNextLevelClick = () => {
    onNextLevel();
  }

  const handleTopicsClick = () => {
  }

  const isPerfectScore = score === totalQuestions;
  const pointsEarned = score; // 1 point per correct answer
  const canGoToNextLevel = isPerfectScore && completedLevel < 50;

  return (
    <>
      {isPerfectScore && <Confetti />}
      <div className="flex flex-col items-center justify-center text-center p-4 sm:p-8 w-full max-w-2xl mx-auto">
        <Card className="shadow-2xl rounded-[20px] border-4 border-card-foreground/10 w-full">
          <CardHeader>
            <div className="mx-auto bg-primary rounded-full p-4 w-fit mb-4 shadow-lg">
              <Award className="h-12 w-12 sm:h-16 sm:w-16 text-primary-foreground" />
            </div>
            <CardTitle className="font-headline text-4xl sm:text-5xl font-bold">
              {isPerfectScore ? dict.quiz.greatJob : dict.quiz.keepTrying}
            </CardTitle>
            <CardDescription className="text-lg sm:text-xl text-muted-foreground pt-2">
              {isPerfectScore ? "You've unlocked the next level!" : "Get a perfect score to unlock the next level. Try again!"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-xl sm:text-2xl font-bold">{dict.quiz.yourScore}</p>
            <p className="font-headline text-6xl sm:text-7xl font-extrabold text-primary-foreground drop-shadow-lg">
              {score} / {totalQuestions}
            </p>
             {pointsEarned > 0 && <p className="text-xl sm:text-2xl font-bold text-accent-foreground">
              +{pointsEarned} Points!
            </p>}
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row gap-4">
            <Button onClick={handleRestartClick} size="lg" variant="outline" className="w-full text-lg font-bold">
              <RotateCcw className="mr-2 h-5 w-5" />
              {dict.quiz.playAgain}
            </Button>
             <Button asChild size="lg" variant="outline" className="w-full text-lg font-bold" onClick={handleTopicsClick}>
              <Link href="/topics">
                <BookOpen className="mr-2 h-5 w-5" />
                Go to Topics
              </Link>
            </Button>
            {canGoToNextLevel && (
              <Button onClick={handleNextLevelClick} size="lg" className="w-full text-lg font-bold">
                Next Level
                <SkipForward className="ml-2 h-5 w-5" />
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
