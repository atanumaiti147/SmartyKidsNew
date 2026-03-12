'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import type { Topic } from '@/lib/data';
import { QuestionCard } from './QuestionCard';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { ArrowRight, Lightbulb, Loader2, Timer } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { generateTipFromWrongAnswer } from '@/ai/flows/generate-tip-from-wrong-answer';
import { useSettings } from '@/lib/settings/settings-context';
import { updateUserStats } from '@/lib/user';
import { useUser, useFirestore } from '@/firebase';
import type { Question } from '@/lib/quiz-questions';

type QuizProps = {
  topic: Topic;
  questions: Question[];
  onComplete: (score: number) => void;
  levelAttempted: number;
};

const TIME_LIMIT = 15;

export default function Quiz({ topic, questions, onComplete, levelAttempted }: QuizProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [answerStatus, setAnswerStatus] = useState<'correct' | 'incorrect' | null>(null);
  const [incorrectAttempts, setIncorrectAttempts] = useState<Record<number, number>>({});
  const [showTipDialog, setShowTipDialog] = useState(false);
  const [tip, setTip] = useState<{ text: string | null, isLoading: boolean }>({ text: null, isLoading: false });
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
  
  const currentQuestion = questions[currentQuestionIndex];

  const { dict } = useSettings();
  const { user } = useUser();
  const firestore = useFirestore();

  const handleAnswer = useCallback(async (answer: string) => {
    if (answerStatus) return;

    setSelectedAnswer(answer);
    
    if (answer === currentQuestion.correctAnswer) {
      setAnswerStatus('correct');
      setScore(s => s + 1);
    } else {
      setAnswerStatus('incorrect');
      const newAttempts = (incorrectAttempts[currentQuestionIndex] || 0) + 1;
      setIncorrectAttempts(prev => ({...prev, [currentQuestionIndex]: newAttempts}));

      if (newAttempts >= 2 && answer !== '') {
        setTip({ text: null, isLoading: true });
        setShowTipDialog(true);
        try {
          const result = await generateTipFromWrongAnswer({
            question: currentQuestion.questionText,
            answer: currentQuestion.correctAnswer,
            studentAnswer: answer,
            topic: dict.topics.topicNames[topic.id] || topic.name,
          });
          setTip({ text: result.tip, isLoading: false });
        } catch (error) {
          console.error("Failed to generate tip:", error);
          const tipErrorText = dict.quiz.tipError.replace('{answer}', currentQuestion.correctAnswer);
          setTip({ text: tipErrorText, isLoading: false });
        }
      }
    }
  }, [answerStatus, currentQuestion, dict.topics.topicNames, topic.id, topic.name, incorrectAttempts, currentQuestionIndex]);
  
  useEffect(() => {
    if (answerStatus) {
      return; 
    }

    if (timeLeft === 0) {
      handleAnswer('');
      return;
    }

    const timerId = setInterval(() => {
      setTimeLeft(prevTime => prevTime - 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [timeLeft, answerStatus, handleAnswer]);


  const handleQuizFinish = useCallback(() => {
    if(user && firestore && score === questions.length) {
      updateUserStats(user.uid, firestore, topic.id, score, levelAttempted, questions.length);
    }
    onComplete(score);
  }, [user, firestore, topic.id, score, levelAttempted, questions.length, onComplete]);

  const handleNext = useCallback(() => {
    const isLastQuestion = currentQuestionIndex >= questions.length - 1;

    if (isLastQuestion) {
      handleQuizFinish();
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setAnswerStatus(null);
      setTimeLeft(TIME_LIMIT);
    }
  }, [currentQuestionIndex, questions.length, handleQuizFinish]);
  
  useEffect(() => {
    if (answerStatus === 'incorrect' && !showTipDialog) {
      const timer = setTimeout(() => {
        handleNext();
      }, 1500); 
      return () => clearTimeout(timer);
    }
  }, [answerStatus, showTipDialog, handleNext]);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      const message = "If you refresh or go back, you won't get any points for this level. Are you sure you want to leave?";
      event.preventDefault();
      event.returnValue = message;
      return message;
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  const progress = ((currentQuestionIndex) / questions.length) * 100;
  const questionText = dict.quiz.questionOf
    .replace('{current}', String(currentQuestionIndex + 1))
    .replace('{total}', String(questions.length));
  
  const scoreText = dict.quiz.score.replace('{score}', String(score));

  return (
    <div className="w-full max-w-3xl mx-auto p-4 md:p-8">
      <div className="mb-6 space-y-4">
        <div className="flex justify-between items-center text-lg font-bold text-primary-foreground">
          <span className="drop-shadow-sm">{questionText}</span>
           <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Timer className="h-6 w-6" />
              <span className="text-2xl font-headline w-8 text-center">{timeLeft}</span>
            </div>
            <span className="drop-shadow-sm">{scoreText}</span>
          </div>
        </div>
        <Progress value={progress} className="h-4 rounded-full bg-secondary border-2 border-primary-foreground/20" indicatorClassName="bg-accent" />
      </div>
      
      <QuestionCard
        key={currentQuestionIndex}
        question={currentQuestion}
        onAnswer={handleAnswer}
        selectedAnswer={selectedAnswer}
        answerStatus={answerStatus}
      />
      
      <div className="mt-8 flex justify-end">
        {answerStatus === 'correct' && (
          <Button
            onClick={handleNext}
            size="lg"
            className="text-lg font-bold animate-bounce"
          >
            {currentQuestionIndex < questions.length - 1 ? dict.quiz.next : dict.quiz.finish}
            <ArrowRight className="ml-2 h-6 w-6" />
          </Button>
        )}
      </div>

      <Dialog open={showTipDialog} onOpenChange={setShowTipDialog}>
        <DialogContent className="sm:max-w-md rounded-[20px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 font-headline text-2xl">
              <Lightbulb className="h-8 w-8 text-yellow-400" />
              {dict.quiz.tipTitle}
            </DialogTitle>
            <DialogDescription>
              {dict.quiz.tipDescription}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 text-base md:text-lg">
            {tip.isLoading ? (
              <div className="flex items-center justify-center min-h-[100px]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <p className="bg-muted p-4 rounded-lg">{tip.text}</p>
            )}
          </div>
          <DialogFooter>
            <Button type="button" className="w-full" onClick={() => { setShowTipDialog(false); handleNext(); }}>{dict.quiz.gotIt}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
