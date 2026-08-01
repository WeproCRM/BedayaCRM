// src/hooks/useAuth.ts
import { useState, useEffect } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { User, Permission } from '../types';

export function useAuth() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser && db) {
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            setUserData({ id: userDoc.id, uid: userDoc.id, ...userDoc.data() } as User);
          }
        } catch (e) {
          console.error("Error fetching user data:", e);
        }
      } else {
        setUserData(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const isSuperAdmin = userData?.role === 'super-admin';
  const isAdmin = userData?.role === 'admin' || isSuperAdmin;
  const isAuthenticated = !!user;
  const isLoading = loading;

  const hasPermission = (permissionId: string): boolean => {
    if (isSuperAdmin) return true;
    if (!userData?.permissions) return false;
    return userData.permissions.some((p: string | Permission) => {
      if (typeof p === 'string') return p === permissionId;
      return p.id === permissionId;
    });
  };

  return { user, userData, loading, isLoading, isAuthenticated, isAdmin, isSuperAdmin, hasPermission };
}