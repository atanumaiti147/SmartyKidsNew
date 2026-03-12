import type { LucideIcon } from 'lucide-react';
import { SpellCheck, Hash, Palette, Rabbit, Shapes as ShapesIcon } from 'lucide-react';

export type Topic = {
  id: string;
  name: string;
  description: string;
  icon: keyof typeof iconMap; // Use string key instead of component
  color: string;
};

// Map of icon names to components for easy lookup
export const iconMap = {
  SpellCheck,
  Hash,
  Palette,
  Rabbit,
  ShapesIcon,
};

export const topics: Topic[] = [
  {
    id: 'alphabets',
    name: 'Alphabets',
    description: 'Learn the ABCs and recognize letters.',
    icon: 'SpellCheck',
    color: 'from-pink-500 to-pink-700',
  },
  {
    id: 'numbers',
    name: 'Numbers',
    description: 'Count and identify numbers from 1 to 20.',
    icon: 'Hash',
    color: 'from-blue-500 to-blue-700',
  },
  {
    id: 'colors',
    name: 'Colors',
    description: 'Discover the wonderful world of colors.',
    icon: 'Palette',
    color: 'from-yellow-500 to-yellow-700',
  },
  {
    id: 'animals',
    name: 'Animals',
    description: 'Meet different animals and learn their names.',
    icon: 'Rabbit',
    color: 'from-green-500 to-green-700',
  },
  {
    id: 'shapes',
    name: 'Shapes',
    description: 'Identify circles, squares, triangles, and more.',
    icon: 'ShapesIcon',
    color: 'from-purple-500 to-purple-700',
  },
];
