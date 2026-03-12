'use client';

import React, { useState, useEffect, useCallback, memo } from 'react';

const confettiColors = [
  '#FFD7D7',
  '#FFF4C3',
  '#C2F0C2',
  '#AEE6FF',
  '#e5d7ff',
  '#ffead7'
];
const totalConfetti = 150;

interface ConfettiPieceProps {
  onAnimationEnd: () => void;
  initialStyle: React.CSSProperties;
  animate: boolean;
}

const ConfettiPiece = memo(({ onAnimationEnd, initialStyle, animate }: ConfettiPieceProps) => {
  const [style, setStyle] = useState<React.CSSProperties>(initialStyle);

  useEffect(() => {
    if (animate) {
      const { transitionDelay } = initialStyle;
      const durationString = (initialStyle.transition as string)?.split(' ')[1] || '4s';
      const duration = parseFloat(durationString) * 1000;
      const delay = parseFloat((transitionDelay as string) || '0s') * 1000;

      const timer = setTimeout(() => {
        setStyle(prev => {
          const randomXEnd = parseFloat(prev.left as string) - (Math.random() * 80 - 40);
          const randomRotateEnd = parseFloat((prev.transform as string).match(/rotate\(([^deg]+)deg\)/)?.[1] || '0') + (Math.random() * 180 - 90);
          
          return {
            ...prev,
            top: `${window.innerHeight + 100}px`,
            left: `${randomXEnd}vw`,
            transform: `rotate(${randomRotateEnd}deg) scale(0)`,
            opacity: 0,
          };
        });
      }, 100);

      const animationEndTimer = setTimeout(onAnimationEnd, duration + delay + 200);

      return () => {
        clearTimeout(timer);
        clearTimeout(animationEndTimer);
      };
    }
  }, [animate, initialStyle, onAnimationEnd]);

  return <div style={style} />;
});

ConfettiPiece.displayName = 'ConfettiPiece';

export default function Confetti() {
  const [pieces, setPieces] = useState<number[]>([]);
  const [styles, setStyles] = useState<React.CSSProperties[]>([]);
  const [animate, setAnimate] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      const newPieces = Array.from({ length: totalConfetti }, (_, i) => i);
      setPieces(newPieces);

      const newStyles = newPieces.map(() => {
        const randomColor = confettiColors[Math.floor(Math.random() * confettiColors.length)];
        const randomXStart = Math.random() * 100;
        const randomRotateStart = Math.random() * 360;
        const randomScale = Math.random() * 0.7 + 0.5;
        const randomDuration = Math.random() * 3 + 4;
        const randomDelay = Math.random() * 2;

        return {
          position: 'fixed' as const,
          left: `${randomXStart}vw`,
          top: '-20px',
          width: '12px',
          height: '12px',
          backgroundColor: randomColor,
          borderRadius: '50%',
          opacity: 1,
          transform: `rotate(${randomRotateStart}deg) scale(${randomScale})`,
          transition: `transform ${randomDuration}s cubic-bezier(0.1, 0.5, 0.5, 1), top ${randomDuration}s cubic-bezier(0.2, 0.5, 0.5, 1), left ${randomDuration}s linear, opacity ${randomDuration}s ease-in-out`,
          transitionDelay: `${randomDelay}s`,
          zIndex: 1000,
        };
      });
      setStyles(newStyles);
      
      const animationTimer = setTimeout(() => setAnimate(true), 100);
      return () => clearTimeout(animationTimer);
    }
  }, [isClient]);

  const handleAnimationEnd = useCallback(() => {
    setPieces(prev => prev.slice(1));
  }, []);

  if (!isClient) {
    return null;
  }

  return (
    <div aria-hidden="true">
      {pieces.map(id => (
        styles[id] && <ConfettiPiece key={id} onAnimationEnd={handleAnimationEnd} initialStyle={styles[id]} animate={animate} />
      ))}
    </div>
  );
}
