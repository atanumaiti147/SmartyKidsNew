import Link from 'next/link';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { Topic } from '@/lib/data';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { iconMap } from '@/lib/data';
import { useSettings } from '@/lib/settings/settings-context';

interface TopicCardProps {
  topic: Topic;
}

export default function TopicCard({ topic }: TopicCardProps) {
  const { dict } = useSettings();
  const Icon = iconMap[topic.icon];
  if (!Icon) return null;

  const topicName = dict.topics.topicNames[topic.id] || topic.name;
  const topicDescription = dict.topics.topicDescriptions[topic.id] || topic.description;

  return (
    <Card className="flex flex-col shadow-xl transform hover:-translate-y-2 transition-transform duration-300 rounded-[20px] border-4 border-card-foreground/10 overflow-hidden">
      <CardHeader className="flex-row items-center gap-4 pb-2">
        <div className={cn("p-3 rounded-lg bg-gradient-to-br", topic.color)}>
           <Icon className="h-8 w-8 text-black" strokeWidth={2.5} />
        </div>
        <CardTitle className="font-headline text-2xl">{topicName}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-base text-muted-foreground">{topicDescription}</p>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full text-lg font-bold rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <Link href={`/topics/${topic.id}`}>
            {dict.topics.start}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
