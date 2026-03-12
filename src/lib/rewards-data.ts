
import type { LucideIcon } from 'lucide-react';
import { Badge, Medal, Award, Trophy, Gem, Crown, Palette, Star, Shield } from 'lucide-react';

export type Reward = {
  id: string;
  name: string;
  description: string;
  cost: number;
  imageUrl: string;
};

export const iconMap = {
  Badge,
  Palette,
  Star,
  Award,
  Medal,
  Trophy,
  Gem,
  Crown,
  Shield,
};

export const rewards: Reward[] = [
  {
    id: 'bronze-medal',
    name: 'Bronze Medal',
    description: 'A medal for dedicated learners.',
    cost: 50,
    imageUrl: 'https://i.ibb.co/mF4V1P5B/Bronze-Medal.png',
  },
  {
    id: 'silver-medal',
    name: 'Silver Medal',
    description: 'A shining silver medal of accomplishment.',
    cost: 250,
    imageUrl: 'https://i.ibb.co/dsKspGt8/Nov-6-2025-02-48-44-AM.png',
  },
  {
    id: 'gold-medal',
    name: 'Gold Medal',
    description: 'A brilliant gold medal for top achievers.',
    cost: 350,
    imageUrl: 'https://i.ibb.co/v6zfLsdN/Chat-GPT-Image-Nov-6-2025-02-51-01-AM-removebg-preview.png',
  },
  {
    id: 'platinum-medal',
    name: 'Platinum Medal',
    description: 'For those who go above and beyond.',
    cost: 450,
    imageUrl: 'https://i.ibb.co/JR3V8Cnm/Chat-GPT-Image-Nov-6-2025-02-56-59-AM.png',
  },
  {
    id: 'diamond-medal',
    name: 'Diamond Medal',
    description: 'The mark of a true learning champion.',
    cost: 550,
    imageUrl: 'https://i.ibb.co/v4699DFx/Chat-GPT-Image-Nov-6-2025-02-58-53-AM.png',
  },
  {
    id: 'smartymaster-medal',
    name: 'SmartyMaster',
    description: 'Ultimate mastery! The highest honor.',
    cost: 699,
    imageUrl: 'https://i.ibb.co/pvthDC20/Chat-GPT-Image-Nov-6-2025-03-00-53-AM.png',
  },
  {
    id: 'admin-medal',
    name: 'Admin Medal',
    description: 'A special medal for application administrators.',
    cost: 9999,
    imageUrl: 'https://i.ibb.co/GfKd7gnL/adminmeadal.png',
  },
];
