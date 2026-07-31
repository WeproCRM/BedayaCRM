import { useState, useEffect } from 'react';
import { onAuthChange, getUserData } from '../services/auth';
import type { User as FirebaseUser } from 'firebase/auth';

interface UserData {
  uid: string;
  email: string;
  displayName: string;
  role: 'admin' | 'manager' | 'sales';
  photoURL?: string;
}

export function useAuth() {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

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

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return {
    user: firebaseUser,
    userData,
    isAuthenticated: !!firebaseUser,
    isAdmin: userData?.role === 'admin',
    isManager: userData?.role === 'manager',
    loading,
  };
}
