'use client';

import { useDoc, useFirestore, useUser as useAuthUser, useMemoFirebase } from '@/firebase';
import { doc, writeBatch, getDoc, Firestore, serverTimestamp, collection, arrayUnion } from 'firebase/firestore';

export type TopicProgress = {
  level: number;
  points: number;
};

export type User = {
  id: string;
  username: string;
  email: string;
  createdAt: string;
  // level and points are now per-topic
  topicProgress: Record<string, TopicProgress>; 
  medals: string[];
  previousMedals?: string[]; // To store medals before becoming an admin
  isAdmin?: boolean;
};

export type UserWithMedals = User & {
  medals: string[];
};

// Defines the level at which each medal is awarded (based on *any* topic level)
const medalLevelUnlocks: Record<string, number> = {
    'silver-medal': 5,
    'gold-medal': 10,
    'platinum-medal': 20,
    'diamond-medal': 30,
    'smartymaster-medal': 50
};


export function useUserProfile() {
  const { user } = useAuthUser();
  const firestore = useFirestore();

  const userDocRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user]);

  const { data, isLoading, error } = useDoc<User>(userDocRef);
  
  return { userProfile: data, isLoading, error };
}

export async function updateUserStats(
    userId: string, 
    firestore: Firestore, 
    topicId: string, 
    score: number,
    levelAttempted: number,
    totalQuestions: number
) {
    if (!userId || !firestore) return;

    const userRef = doc(firestore, 'users', userId);
    const batch = writeBatch(firestore);

    try {
        const userDoc = await getDoc(userRef);
        if (!userDoc.exists()) {
            console.error("User document not found!");
            return;
        }
        const userData = userDoc.data() as User;
        const topicProgress = userData.topicProgress?.[topicId] || { level: 1, points: 0 };
        
        const pointsEarned = score; // 1 point per correct answer
        const newPoints = (topicProgress.points || 0) + pointsEarned;
        
        batch.update(userRef, {
            [`topicProgress.${topicId}.points`]: newPoints,
        });

        // Only update level if the completed level was the user's current highest level for that topic
        // and they got a perfect score.
        if (levelAttempted === topicProgress.level && score === totalQuestions) {
            const newLevel = topicProgress.level + 1; // Unlock next level
            
            batch.update(userRef, {
                [`topicProgress.${topicId}.level`]: newLevel
            });

            // Check for new global medal unlocks based on the new level achieved in this topic
             const userRewardsCollection = collection(firestore, 'users', userId, 'rewards');
             const unlockedRewardIds = new Set(userData.medals || []);

             for (const [medalId, requiredLevel] of Object.entries(medalLevelUnlocks)) {
                 if (newLevel >= requiredLevel && !unlockedRewardIds.has(medalId)) {
                     const newRewardRef = doc(userRewardsCollection, medalId);
                     batch.set(newRewardRef, {
                         id: medalId,
                         rewardId: medalId,
                         userId: userId,
                         acquisitionDate: new Date().toISOString(),
                         isUsed: false,
                     });
                     batch.update(userRef, {
                         medals: arrayUnion(medalId)
                     });
                 }
             }
        }

        await batch.commit();

    } catch (error) {
        console.error("Error updating user stats for topic: ", error);
    }
}

    
