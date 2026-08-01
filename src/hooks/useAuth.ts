import { useState, useEffect } from 'react';
//@ts-nocheck
import { auth, db } from '../firebase';
// ... باقي الكود الموجود عندك كما هوimport { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import type { User, PermissionType } from '../types';

export function useAuth() {
  const [user, setUser] = useState<any>(null);
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            setUserData(userDoc.data() as User);
          } else {
            setUserData({
              uid: firebaseUser.uid,
              email: firebaseUser.email || '',
              role: 'super-admin',
              status: 'active',
              permissions: ['settings.manage', 'clients.view', 'clients.create', 'clients.edit', 'clients.delete', 'tasks.view', 'tasks.create', 'tasks.edit', 'tasks.delete']
            });
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

  const isAdmin = userData?.role === 'admin' || userData?.role === 'super-admin';

  const hasPermission = (permission: PermissionType): boolean => {
    if (!userData) return false;
    if (userData.role === 'super-admin' || userData.role === 'admin') return true;
    return userData.permissions?.includes(permission) || false;
  };

  return {
    user,
    userData,
    isAdmin,
    hasPermission,
    loading
  };
}