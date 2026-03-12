'use client';

import { useState } from 'react';
import type { Question } from '@/lib/quiz-questions';
import { quizQuestions } from '@/lib/quiz-questions';
import Quiz from '@/components/quiz/Quiz';
import type { Topic } from '@/lib/data';
import LevelSelector from './LevelSelector';
import { useSettings } from '@/lib/settings/settings-context';
import { Loader2 } from 'lucide-react';

type ClientTopic = Pick<Topic, 'id' | 'name' | 'icon'>;

interface QuizContainerProps {
  topic: ClientTopic;
}

// Helper function to get a random subset of questions
function getQuestionsForLevel(topicId: string, level: number, count: number): Question[] {
  // Find the highest available level for the topic that is less than or equal to the requested level
  const availableLevels = Object.keys(quizQuestions[topicId] || {}).map(Number).sort((a, b) => b - a);
  const bestLevel = availableLevels.find(l => l <= level) || 1;
  
  const levelQuestions = quizQuestions[topicId]?.[bestLevel] || [];

  if (levelQuestions.length === 0) {
    // Ultimate fallback: if no questions for the best-fit level or level 1, return empty.
    console.error(`No questions found for topic ${topicId} at any suitable level <= ${level}.`);
    return [];
  }

  // If the level has fewer questions than needed, return all of them
  if (levelQuestions.length <= count) {
    return levelQuestions;
  }

  // Otherwise, shuffle and take a random subset
  const shuffled = [...levelQuestions].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}


export function QuizContainer({ topic }: QuizContainerProps) {
  const [quizState, setQuizState] = useState<'selecting' | 'generating' | 'active' | 'completed'>('selecting');
  const [questions, setQuestions] = useState<Question[] | null>(null);
  const [finalScore, setFinalScore] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(0);
  const { dict } = useSettings();

  const startQuiz = async (level: number) => {
    setCurrentLevel(level);
    setQuizState('generating');

    // Simulate a brief loading period to feel like something is happening
    setTimeout(() => {
      try {
        const generatedQuestions = getQuestionsForLevel(topic.id, level, 10);
        
        if (generatedQuestions.length === 0) {
           // This case should be handled gracefully in UI, maybe an alert
           alert(`Sorry, no questions are available for ${topic.name} at level ${level} yet. Please try another level.`);
           setQuizState('selecting');
           return;
        }

        setQuestions(generatedQuestions);
        setQuizState('active');
      } catch (error) {
        console.error("Failed to load quiz questions:", error);
        // TODO: Add user-facing error message
        setQuizState('selecting');
      }
    }, 500); // 0.5 second delay
  };

  const handleQuizComplete = (score: number) => {
    setFinalScore(score);
    setQuizState('completed');
  };
  
  const handleRestart = () => {
    setFinalScore(0);
    setQuestions(null);
    setQuizState('selecting');
  };
  
  const handleNextLevel = () => {
    const nextLevel = currentLevel + 1;
    if (nextLevel <= 50) { // Assuming 50 is the max level
      startQuiz(nextLevel);
    } else {
      // If they finished the last level, go back to selector
      handleRestart();
    }
  };

  const fullTopic = { ...topic, description: '', color: ''};

  if (quizState === 'active' && questions) {
    return <Quiz topic={fullTopic} questions={questions} onComplete={handleQuizComplete} levelAttempted={currentLevel} />;
  }

  // Show a specific loading UI for the 'generating' state
  if (quizState === 'generating') {
    return (
        <div className="flex flex-col items-center justify-center text-center p-8 w-full max-w-2xl mx-auto">
            <Loader2 className="h-16 w-16 animate-spin text-primary mb-4" />
            <p className="text-xl text-muted-foreground">{dict.quiz.generating}</p>
        </div>
    );
  }

  return (
    <LevelSelector 
      topic={topic}
      onSelectLevel={startQuiz}
      quizState={quizState}
      onRestart={handleRestart}
      onNextLevel={handleNextLevel}
      finalScore={finalScore}
      totalQuestions={questions?.length || 10}
      completedLevel={currentLevel}
    />
  )
}
