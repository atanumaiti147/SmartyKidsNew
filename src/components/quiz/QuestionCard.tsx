'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Question } from '@/lib/quiz-questions';
import { Check, X } from 'lucide-react';

type QuestionCardProps = {
  question: Question;
  onAnswer: (answer: string) => void;
  selectedAnswer: string | null;
  answerStatus: 'correct' | 'incorrect' | null;
};

export function QuestionCard({ question, onAnswer, selectedAnswer, answerStatus }: QuestionCardProps) {
  const handleAnswerClick = (option: string) => {
    onAnswer(option);
  };

  return (
    <Card className="shadow-2xl rounded-[20px] border-4 border-card-foreground/10 overflow-hidden bg-card/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="font-headline text-2xl sm:text-3xl md:text-4xl text-center text-card-foreground min-h-[100px] flex items-center justify-center p-2 relative">
          {question.questionText}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {question.answerOptions.map((option, index) => {
            const isSelected = selectedAnswer === option;
            const isCorrect = question.correctAnswer === option;

            let icon = null;
            if (answerStatus && isSelected && !isCorrect) icon = <X className="h-6 w-6" />;
            if (answerStatus && isCorrect) icon = <Check className="h-6 w-6" />;

            return (
              <Button
                key={index}
                onClick={() => handleAnswerClick(option)}
                disabled={!!answerStatus}
                size="lg"
                className={cn(
                  "h-auto py-4 text-lg sm:text-xl font-bold whitespace-normal transition-all duration-300 transform hover:scale-105 rounded-[15px] border-b-8 flex justify-between items-center",
                  answerStatus === null && 'bg-card text-card-foreground border-border hover:bg-accent/20 active:translate-y-1',
                  answerStatus !== null && {
                    'opacity-50 !scale-100 cursor-not-allowed': !isCorrect && !isSelected,
                    'bg-destructive text-destructive-foreground border-destructive-foreground/20 animate-shake': isSelected && !isCorrect,
                    'bg-accent text-accent-foreground border-accent-foreground/20': isCorrect,
                  }
                )}
              >
                <span>{option}</span>
                {icon}
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
