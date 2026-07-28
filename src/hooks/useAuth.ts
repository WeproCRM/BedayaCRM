import { useState, useEffect } from 'react';
import type { User as FirebaseUser } from 'firebase/auth';
import { onAuthChange } from '../services/auth';
import { getUsers } from '../services/firestore';
import { SUPER_ADMINS } from '../constants';
import type { User } from '../types';

interface AuthState {
  user: FirebaseUser | null;
  userData: User | null;
  isLoading: boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
}

export function useAuth(): AuthState {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userData, setUserData] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthChange(async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const users = await getUsers();
          const found = users.find((u) => u.email === currentUser.email);
          const currentUserData: User = found || {
            id: currentUser.uid,
            name: currentUser.email?.split('@')[0] || 'مجهول',
            email: currentUser.email || '',
            role: 'employee',
          };
          if ((SUPER_ADMINS as readonly string[]).includes(currentUser.email || '')) {
            currentUserData.role = 'super-admin';
          }
          setUserData(currentUserData);
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      } else {
        setUserData(null);
      }
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const isAdmin = userData?.role === 'admin' || userData?.role === 'super-admin';
  const isSuperAdmin = userData?.role === 'super-admin';
  return { user, userData, isLoading, isAdmin, isSuperAdmin };
}
