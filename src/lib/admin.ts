'use client';

import { useUser as useAuthUser } from '@/firebase';
import { useState, useEffect } from 'react';
import { useUserProfile } from './user';

export function useIsAdmin() {
  const { user, isUserLoading: isAuthLoading } = useAuthUser();
  const { userProfile, isLoading: isProfileLoading } = useUserProfile();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [requiresClaims, setRequiresClaims] = useState(false);

  useEffect(() => {
    async function checkAdminStatus() {
      if (isAuthLoading || isProfileLoading) {
        return;
      }

      if (!user || !userProfile) {
        setIsAdmin(false);
        setIsLoading(false);
        return;
      }
      
      // Temporary check: Use the Firestore document field.
      const isAdminFromDoc = userProfile?.isAdmin === true;
      setIsAdmin(isAdminFromDoc);

      // Still show the banner to encourage moving to claims.
      try {
        const idTokenResult = await user.getIdTokenResult();
        if (idTokenResult.claims.admin !== true) {
            setRequiresClaims(true);
        }
      } catch (e) {
        // If token fails, still show banner as a precaution.
        setRequiresClaims(true);
      } finally {
        setIsLoading(false);
      }
    }

    checkAdminStatus();
  }, [user, isAuthLoading, userProfile, isProfileLoading]);

  return { isAdmin, isLoading, requiresClaims, setRequiresClaims };
}
