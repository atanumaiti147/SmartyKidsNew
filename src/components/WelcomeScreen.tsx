'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface WelcomeScreenProps {
  isOpen: boolean;
  onClose: () => void;
  username: string | null;
}

export default function WelcomeScreen({ isOpen, onClose, username }: WelcomeScreenProps) {
  const mascotImage = PlaceHolderImages.find((img) => img.id === 'mascot');

  const handleClose = () => {
    onClose();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/90 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        initial={{ scale: 0.5, y: 50, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        transition={{ type: 'spring', damping: 15, stiffness: 100, delay: 0.2 }}
      >
        {mascotImage && (
          <Image
            src={mascotImage.imageUrl}
            alt={mascotImage.description}
            width={200}
            height={200}
            className="animate-gentle-bounce"
            data-ai-hint={mascotImage.imageHint}
            priority
          />
        )}
      </motion.div>
      <motion.h1
        className="font-headline text-5xl md:text-7xl font-bold text-primary-foreground mt-4 mb-2 drop-shadow-lg"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        Welcome, {username || 'SmartyKid'}!
      </motion.h1>
      <motion.p
        className="text-xl md:text-2xl text-muted-foreground mb-8 md:mb-12"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        Your learning adventure begins now!
      </motion.p>
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <Button onClick={handleClose} size="lg" className="text-xl font-bold px-10 py-6">
          Let&apos;s Go!
        </Button>
      </motion.div>
    </motion.div>
  );
}
