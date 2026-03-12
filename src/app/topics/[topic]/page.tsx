import { topics } from '@/lib/data';
import { notFound } from 'next/navigation';
import { QuizContainer } from '@/components/quiz/QuizContainer';

interface TopicPageProps {
  params: {
    topic: string;
  };
}

export default function TopicPage({ params }: TopicPageProps) {
  const topic = topics.find((t) => t.id === params.topic);

  if (!topic) {
    notFound();
  }

  // Pass a plain object to the Client Component
  const { id, name, icon } = topic;
  const topicForClient = { id, name, icon };

  return <QuizContainer topic={topicForClient} />;
}

export async function generateStaticParams() {
  return topics.map((topic) => ({
    topic: topic.id,
  }));
}
