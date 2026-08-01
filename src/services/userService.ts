//@ts-nocheck
import { db } from '../firebase';
import { collection, doc, setDoc, updateDoc, deleteDoc, getDocs, query, where } from 'firebase/firestore';
import { User, AuditLog } from '../types';

export const userService = {
  async createUser(userData: Partial<User>, adminUid: string): Promise<string> {
    const userId = doc(collection(db, 'users')).id;
    const now = new Date().toISOString();
    
    const newUser = {
      uid: userId,
      id: userId,
      displayName: userData.displayName || userData.name || '',
      email: userData.email || '',
      phone: userData.phone || '',
      photoURL: userData.photoURL || '',
      department: userData.department || '',
      jobTitle: userData.jobTitle || '',
      role: userData.role || 'employee',
      permissions: userData.permissions || [],
      status: userData.status || 'active',
      managerId: userData.managerId || '',
      createdAt: now,
      updatedAt: now,
      lastLogin: '',
      ...userData
    };

    await setDoc(doc(db, 'users', userId), newUser);

    await auditService.logAction({
      userId: adminUid,
      action: 'CREATE_USER',
      targetType: 'user',
      targetId: userId,
      newValue: { email: newUser.email, role: newUser.role }
    });

    return userId;
  },

  async updateUser(userId: string, updates: Partial<User>, adminUid: string) {
    const userRef = doc(db, 'users', userId);
    const updatedData = { ...updates, updatedAt: new Date().toISOString() };
    await updateDoc(userRef, updatedData);

    await auditService.logAction({
      userId: adminUid,
      action: 'UPDATE_USER',
      targetType: 'user',
      targetId: userId,
      newValue: updates
    });
  },

  async deleteUserWithReassignment(targetUserId: string, replacementUserId: string, adminUid: string) {
    const clientsQuery = query(collection(db, 'clients'), where('assignedTo', '==', targetUserId));
    const clientsSnap = await getDocs(clientsQuery);
    for (const clientDoc of clientsSnap.docs) {
      await updateDoc(doc(db, 'clients', clientDoc.id), { assignedTo: replacementUserId });
    }

    const tasksQuery = query(collection(db, 'tasks'), where('assignedTo', '==', targetUserId));
    const tasksSnap = await getDocs(tasksQuery);
    for (const taskDoc of tasksSnap.docs) {
      await updateDoc(doc(db, 'tasks', taskDoc.id), { assignedTo: replacementUserId });
    }

    await deleteDoc(doc(db, 'users', targetUserId));

    await auditService.logAction({
      userId: adminUid,
      action: 'DELETE_USER_REASSIGNED',
      targetType: 'user',
      targetId: targetUserId,
      newValue: { replacementUserId }
    });
  }
};

export const auditService = {
  async logAction(log: Omit<AuditLog, 'id' | 'createdAt'>) {
    try {
      const logId = doc(collection(db, 'auditLogs')).id;
      const newLog = {
        id: logId,
        ...log,
        createdAt: new Date().toISOString()
      };
      await setDoc(doc(db, 'auditLogs', logId), newLog);
    } catch (error) {
      console.error('Error logging audit:', error);
    }
  }
};