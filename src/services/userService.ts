import { 
  collection, doc, setDoc, 
  getDocs, query, where, writeBatch, serverTimestamp 
} from 'firebase/firestore';
import { db } from '../firebase';
import { User, AuditLog } from '../types';

export async function logAuditAction(
  log: Omit<AuditLog, 'id' | 'createdAt'>
) {
  try {
    const logRef = doc(collection(db!, 'auditLogs'));
    await setDoc(logRef, {
      ...log,
      id: logRef.id,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Audit log failure:', error);
  }
}

export async function createEmployee(
  employeeData: Omit<User, 'uid' | 'createdAt'>, 
  creator: { uid: string; name: string }
) {
  const userRef = doc(collection(db!, 'users'));
  const uid = userRef.id;

  const newUser: User = {
    ...employeeData,
    uid,
    id: uid,
    name: employeeData.displayName || '',
    createdAt: new Date().toISOString(),
    status: employeeData.status || 'active',
  };

  await setDoc(userRef, newUser);

  await logAuditAction({
    userId: creator.uid,
    userName: creator.name,
    action: 'CREATE_USER',
    targetType: 'user',
    targetId: uid,
    details: `تم إنشاء الموظف: ${newUser.displayName || newUser.name} (${newUser.email})`,
    newValue: newUser as any,
  });

  return newUser;
}

export async function reassignAndSoftDeleteUser(
  targetUserId: string,
  newAssigneeId: string,
  permanentDelete: boolean,
  actor: { uid: string; name: string }
) {
  if (!db) {
    throw new Error('Firestore instance is not initialized');
  }

  const batch = writeBatch(db!);

  // 1. إعادة تعيين العملاء المرتبطين
  const clientsQ = query(collection(db!, 'clients'), where('createdBy', '==', targetUserId));
  const clientsSnap = await getDocs(clientsQ);
  clientsSnap.forEach((clientDoc) => {
    batch.update(clientDoc.ref, { createdBy: newAssigneeId, updatedAt: serverTimestamp() });
  });

  // 2. إعادة تعيين المهام
  const tasksQ = query(collection(db!, 'tasks'), where('assignedTo', '==', targetUserId));
  const tasksSnap = await getDocs(tasksQ);
  tasksSnap.forEach((taskDoc) => {
    batch.update(taskDoc.ref, { assignedTo: newAssigneeId, updatedAt: serverTimestamp() });
  });

  // 3. التنفيذ
  if (permanentDelete) {
    batch.delete(doc(db!, 'users', targetUserId));
  } else {
    batch.update(doc(db!, 'users', targetUserId), { status: 'inactive', updatedAt: serverTimestamp() });
  }

  await batch.commit();

  await logAuditAction({
    userId: actor.uid,
    userName: actor.name,
    action: permanentDelete ? 'PERMANENT_DELETE_USER' : 'DEACTIVATE_USER',
    targetType: 'user',
    targetId: targetUserId,
    details: `تم نقل بيانات الموظف إلى ${newAssigneeId} و${permanentDelete ? 'حذفه نهائياً' : 'تعطيله'}`,
  });
}
