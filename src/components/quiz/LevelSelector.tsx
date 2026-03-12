'use client';

import { useUserProfile } from '@/lib/user';
import type { Topic } from '@/lib/data';
import { Loader2, Lock, Sparkles, Star, Trophy } from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import { iconMap } from '@/lib/data';
import { useSettings } from '@/lib/settings/settings-context';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import QuizResult from './QuizResult';

interface LevelSelectorProps {
  topic: Pick<Topic, 'id' | 'name' | 'icon'>;
  onSelectLevel: (level: number) => void;
  quizState: 'selecting' | 'generating' | 'active' | 'completed';
  onRestart: () => void;
  onNextLevel: () => void;
  finalScore: number;
  totalQuestions: number;
  completedLevel: number;
}

export default function LevelSelector({ 
    topic, 
    onSelectLevel,
    quizState,
    onRestart,
    onNextLevel,
    finalScore,
    totalQuestions,
    completedLevel
}: LevelSelectorProps) {
  const { userProfile, isLoading } = useUserProfile();
  const { dict } = useSettings();

  const handleLevelSelect = (level: number) => {
    onSelectLevel(level);
  }

  const topicProgress = userProfile?.topicProgress?.[topic.id];
  const unlockedLevel = topicProgress?.level || 1;

  const Icon = iconMap[topic.icon];
  const topicName = dict.topics.topicNames[topic.id] || topic.name;
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }
  
  if (quizState === 'completed') {
    return (
      <QuizResult 
        score={finalScore}
        totalQuestions={totalQuestions}
        onRestart={onRestart}
        onNextLevel={onNextLevel}
        completedLevel={completedLevel}
      />
    )
  }

  if (quizState === 'generating') {
    return (
        <div className="flex flex-col items-center justify-center text-center p-8 w-full max-w-2xl mx-auto">
            <Loader2 className="h-16 w-16 animate-spin text-primary mb-4" />
            <p className="text-xl text-muted-foreground">{dict.quiz.generating}</p>
        </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card className="shadow-xl rounded-[20px] border-2 mb-8 bg-card/80 backdrop-blur-sm">
        <CardHeader className="text-center">
          <div className="mx-auto bg-gradient-to-br from-primary to-secondary rounded-full p-3 w-fit mb-4">
            <Icon className="h-12 w-12 text-primary-foreground" />
          </div>
          <CardTitle className="font-headline text-4xl">{topicName}</CardTitle>
          <CardDescription>
            Your current level: {unlockedLevel -1}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-4">
            {Array.from({ length: 50 }, (_, i) => i + 1).map((level) => {
              const isLocked = level > unlockedLevel;
              return (
                <Button
                  key={level}
                  onClick={() => handleLevelSelect(level)}
                  disabled={isLocked}
                  className={cn(
                    'h-20 w-20 flex flex-col items-center justify-center rounded-2xl border-b-8 text-2xl font-bold transition-transform transform hover:scale-105 active:translate-y-1',
                    isLocked 
                      ? 'bg-muted/50 border-muted text-muted-foreground cursor-not-allowed' 
                      : 'bg-accent text-accent-foreground border-accent-foreground/30 hover:bg-accent/90'
                  )}
                  aria-label={`Level ${level}`}
                >
                  {isLocked ? (
                    <Lock className="h-8 w-8" />
                  ) : (
                    <>
                      <span className="font-headline">{level}</span>
                      {level < unlockedLevel && <Star className="h-5 w-5 text-yellow-300 fill-yellow-300" />}
                    </>
                  )}
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
