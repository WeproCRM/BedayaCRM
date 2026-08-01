import { db } from '../firebase';
import { collection, doc, setDoc, updateDoc, deleteDoc, getDocs, query, where, writeBatch } from 'firebase/firestore';
import type { User, Client, Task, AuditLog } from '../types';

export const userService = {
  async createUser(userData: Partial<User>, adminUid: string): Promise<string> {
    const userId = doc(collection(db, 'users')).id;
    const now = new Date().toISOString();

    const newUser = {
      uid: userId,
      id: userId,
      displayName: userData.displayName || userData.name || '',
      name: userData.name || userData.displayName || '',
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
      newValue: { email: newUser.email, role: newUser.role, name: newUser.name }
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
  },

  async deleteUser(userId: string, adminUid: string) {
    await deleteDoc(doc(db, 'users', userId));

    await auditService.logAction({
      userId: adminUid,
      action: 'DELETE_USER',
      targetType: 'user',
      targetId: userId,
      newValue: { userId }
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
  },

  async getAuditLogs(): Promise<(AuditLog & { id: string })[]> {
    const snapshot = await getDocs(query(collection(db, 'auditLogs'), orderBy('createdAt', 'desc')));
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as AuditLog & { id: string }));
  }
};

import { orderBy } from 'firebase/firestore';

// ============ Import/Export Services ============

export const importExportService = {
  /**
   * Export clients to JSON
   */
  exportClientsToJSON(clients: Client[]): string {
    return JSON.stringify(clients, null, 2);
  },

  /**
   * Export clients to CSV
   */
  exportClientsToCSV(clients: Client[]): string {
    const headers = ['id', 'name', 'email', 'phone', 'whatsapp', 'company', 'jobTitle', 'serviceRequired', 'stage', 'status', 'assignedTo', 'assignedToName', 'notes', 'tags', 'createdAt', 'updatedAt'];
    const rows = clients.map(c => [
      c.id,
      c.name || '',
      c.email || '',
      c.phone || '',
      c.whatsapp || '',
      c.company || '',
      c.jobTitle || '',
      c.serviceRequired || '',
      c.stage || '',
      c.status || '',
      c.assignedTo || '',
      c.assignedToName || '',
      c.notes || '',
      (c.tags || []).join(';'),
      c.createdAt || '',
      c.updatedAt || '',
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(','))].join('\n');
    return csvContent;
  },

  /**
   * Import clients from JSON
   */
  async importClientsFromJSON(jsonString: string, adminUid: string): Promise<number> {
    const clients: Partial<Client>[] = JSON.parse(jsonString);
    const batch = writeBatch(db);
    const colRef = collection(db, 'clients');
    let count = 0;

    for (const client of clients) {
      if (!client.name) continue;
      const docRef = doc(colRef);
      batch.set(docRef, {
        ...client,
        id: docRef.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      count++;
    }

    await batch.commit();

    await auditService.logAction({
      userId: adminUid,
      action: 'IMPORT_CLIENTS_JSON',
      targetType: 'clients',
      newValue: { count }
    });

    return count;
  },

  /**
   * Import clients from CSV
   */
  async importClientsFromCSV(csvString: string, adminUid: string): Promise<number> {
    const lines = csvString.trim().split('\n');
    if (lines.length < 2) return 0;

    const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
    const batch = writeBatch(db);
    const colRef = collection(db, 'clients');
    let count = 0;

    for (let i = 1; i < lines.length; i++) {
      const values = parseCSVLine(lines[i]);
      if (values.length < 2) continue;

      const client: Record<string, any> = {};
      headers.forEach((header, idx) => {
        if (values[idx] !== undefined) {
          const val = values[idx].trim().replace(/^"|"$/g, '');
          if (header === 'tags') {
            client[header] = val ? val.split(';').map(t => t.trim()) : [];
          } else {
            client[header] = val;
          }
        }
      });

      if (!client.name) continue;
      const docRef = doc(colRef);
      batch.set(docRef, {
        ...client,
        id: docRef.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      count++;
    }

    await batch.commit();

    await auditService.logAction({
      userId: adminUid,
      action: 'IMPORT_CLIENTS_CSV',
      targetType: 'clients',
      newValue: { count }
    });

    return count;
  },

  /**
   * Export tasks to JSON
   */
  exportTasksToJSON(tasks: Task[]): string {
    return JSON.stringify(tasks, null, 2);
  },

  /**
   * Export tasks to CSV
   */
  exportTasksToCSV(tasks: Task[]): string {
    const headers = ['id', 'title', 'description', 'status', 'priority', 'assignedTo', 'assignedToName', 'clientId', 'clientName', 'dueDate', 'tags', 'createdAt', 'updatedAt'];
    const rows = tasks.map(t => [
      t.id,
      t.title || '',
      t.description || '',
      t.status || '',
      t.priority || '',
      t.assignedTo || '',
      t.assignedToName || '',
      t.clientId || '',
      t.clientName || '',
      t.dueDate || '',
      (t.tags || []).join(';'),
      t.createdAt || '',
      t.updatedAt || '',
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(','))].join('\n');
    return csvContent;
  },
};

// Helper to parse CSV line properly
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (const char of line) {
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
}
