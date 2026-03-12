'use client';

import WelcomeScreen from '@/components/WelcomeScreen';
import { useFirebase } from '@/firebase';

export default function WelcomeManager() {
  const { showWelcome, setShowWelcome, user } = useFirebase();

  return (
    <WelcomeScreen
      isOpen={showWelcome}
      onClose={() => setShowWelcome(false)}
      username={user?.displayName ?? null}
    />
  );
}
