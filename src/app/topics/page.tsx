'use client';

import { topics } from '@/lib/data';
import TopicCard from '@/components/TopicCard';
import { useSettings } from '@/lib/settings/settings-context';

export default function TopicsPage() {
  const { dict } = useSettings();
  return (
    <div className="relative w-full max-w-5xl mx-auto px-4 py-8">
      <h1 className="font-headline text-4xl md:text-5xl font-bold text-center text-primary-foreground mb-12 drop-shadow-md">
        {dict.topics.title}
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {topics.map((topic) => (
          <TopicCard key={topic.id} topic={topic} />
        ))}
      </div>
    </div>
  );
}
