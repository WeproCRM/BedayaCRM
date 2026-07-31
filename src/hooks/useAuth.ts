import { useState, useEffect } from 'react';
import { onAuthChange, getUserData } from '../services/auth';
import type { User as FirebaseUser } from 'firebase/auth';
import type { UserData } from '../types';

export function useAuth() {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthChange(async (user) => {
      setFirebaseUser(user);

      if (user) {
        try {
          const data = await getUserData(user.uid);
          setUserData(data as UserData | null);
        } catch (err) {
          console.error('Failed to fetch user data:', err);
          setUserData(null);
        }
      } else {
        setUserData(null);
      }

      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return {
    user: firebaseUser,
    userData,
    isAuthenticated: !!firebaseUser,
    isAdmin: userData?.role === 'admin' || userData?.role === 'super-admin',
    isManager: userData?.role === 'manager',
    isLoading,
  };
}
