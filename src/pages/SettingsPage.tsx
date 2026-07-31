// src/pages/SettingsPage.tsx
import React, { useState, useEffect } from 'react';
import { 
  Users, Shield, Settings as SettingsIcon, Globe, Bell, 
  Database, FileText, Lock, Plus, Search, Trash2, Edit, Activity
} from 'lucide-react';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { User, AuditLog } from '../types';
import { useAuth } from '../hooks/useAuth';
import { UserModal } from '../components/UserModal';
import { reassignAndSoftDeleteUser, createEmployee } from '../services/userService';

type TabType = 'users' | 'roles' | 'general' | 'logs' | 'currencies';

export const SettingsPage: React.FC = () => {
  const { userData, isSuperAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('users');
  const [users, setUsers] = useState<User[]>([]);
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Reassignment State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [reassignTargetId, setReassignTargetId] = useState('');

  const fetchUsers = async () => {
    const snap = await getDocs(collection(db, 'users'));
    const list: User[] = [];
    snap.forEach(d => list.push({ ...d.data() as User, uid: d.id }));
    setUsers(list);
  };

  const fetchLogs = async () => {
    const snap = await getDocs(collection(db, 'auditLogs'));
    const list: AuditLog[] = [];
    snap.forEach(d => list.push({ ...d.data() as AuditLog, id: d.id }));
    setLogs(list.sort((a,b) => b.createdAt - a.createdAt));
  };

  useEffect(() => {
    fetchUsers();
    if (activeTab === 'logs') fetchLogs();
  }, [activeTab]);

  const handleSaveUser = async (data: Partial<User>) => {
    if (selectedUser) {
      // Update
      await updateDoc(doc(db, 'users', selectedUser.uid), { ...data });
    } else {
      // Create
      await createEmployee(data as Omit<User, 'uid' | 'createdAt'>, {
        uid: userData?.uid || 'system',
        name: userData?.displayName || 'المشرف',
      });
    }
    fetchUsers();
  };

  const handleDeleteExecute = async (permanent: boolean) => {
    if (!userToDelete || !reassignTargetId) return;
    await reassignAndSoftDeleteUser(userToDelete.uid, reassignTargetId, permanent, {
      uid: userData?.uid || '',
      name: userData?.displayName || 'Super Admin'
    });
    setDeleteModalOpen(false);
    setUserToDelete(null);
    fetchUsers();
  };

  const filteredUsers = users.filter(u => 
    u.displayName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 bg-[#0b1422] min-h-screen text-white space-y-6">
      <div className="flex items-center justify-between border-b border-white/10 pb-5">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <SettingsIcon className="text-cyan-400" />
            إعدادات النظام (Settings)
          </h1>
          <p className="text-sm text-white/50 mt-1">إدارة مستخدمي النظام والصلاحيات وسجلات الأمان</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Navigation Tabs Panel */}
        <div className="bg-[#111c2d] border border-white/10 rounded-xl p-3 space-y-1 h-fit">
          <button
            onClick={() => setActiveTab('users')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition ${activeTab === 'users' ? 'bg-cyan-500/10 text-cyan-400 font-semibold border border-cyan-500/30' : 'text-white/70 hover:bg-white/5'}`}
          >
            <Users size={18} /> الموظفين والفريق (Users)
          </button>
          <button
            onClick={() => setActiveTab('roles')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition ${activeTab === 'roles' ? 'bg-cyan-500/10 text-cyan-400 font-semibold border border-cyan-500/30' : 'text-white/70 hover:bg-white/5'}`}
          >
            <Shield size={18} /> الصلاحيات والأدوار (Roles)
          </button>
          <button
            onClick={() => setActiveTab('logs')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition ${activeTab === 'logs' ? 'bg-cyan-500/10 text-cyan-400 font-semibold border border-cyan-500/30' : 'text-white/70 hover:bg-white/5'}`}
          >
            <Activity size={18} /> سجل المراقبة (Audit Logs)
          </button>
        </div>

        {/* Dynamic Content Display Area */}
        <div className="md:col-span-3 bg-[#111c2d] border border-white/10 rounded-xl p-6">
          {activeTab === 'users' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div className="relative flex-1">
                  <Search className="absolute right-3 top-3 text-white/40" size={18} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="البحث بالاسم أو البريد..."
                    className="w-full bg-[#0b1422] border border-white/10 rounded-xl pr-10 pl-4 py-2 text-sm text-white focus:outline-none focus:border-cyan-400/50"
                  />
                </div>
                <button
                  onClick={() => { setSelectedUser(null); setIsModalOpen(true); }}
                  className="bg-cyan-500 hover:bg-cyan-400 text-black font-semibold px-4 py-2 rounded-xl flex items-center justify-center gap-2 text-sm transition"
                >
                  <Plus size={18} /> إضافة موظف
                </button>
              </div>

              {/* Users Data Table */}
              <div className="overflow-x-auto border border-white/10 rounded-xl">
                <table className="w-full text-right text-sm text-white/80">
                  <thead className="bg-[#0b1422] text-white/40 uppercase text-xs">
                    <tr>
                      <th className="p-3">الموظف</th>
                      <th className="p-3">القسم / الوظيفة</th>
                      <th className="p-3">الدور</th>
                      <th className="p-3">الحالة</th>
                      <th className="p-3">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredUsers.map(u => (
                      <tr key={u.uid} className="hover:bg-white/5">
                        <td className="p-3 flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
                            {u.displayName?.charAt(0) || 'U'}
                          </div>
                          <div>
                            <div className="font-semibold text-white">{u.displayName}</div>
                            <div className="text-xs text-white/40">{u.email}</div>
                          </div>
                        </td>
                        <td className="p-3">
                          <div>{u.department || '-'}</div>
                          <div className="text-xs text-white/40">{u.jobTitle}</div>
                        </td>
                        <td className="p-3">
                          <span className="bg-white/10 text-white text-xs px-2.5 py-1 rounded-md">{u.role}</span>
                        </td>
                        <td className="p-3">
                          <span className={`text-xs px-2.5 py-1 rounded-md ${u.status === 'active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                            {u.status || 'active'}
                          </span>
                        </td>
                        <td className="p-3 flex items-center gap-2">
                          <button
                            onClick={() => { setSelectedUser(u); setIsModalOpen(true); }}
                            className="p-1.5 hover:bg-white/10 rounded-lg text-white/70 hover:text-white"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => { setUserToDelete(u); setDeleteModalOpen(true); }}
                            className="p-1.5 hover:bg-rose-500/20 rounded-lg text-rose-400"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tab: Audit Logs */}
          {activeTab === 'logs' && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white mb-2">سجلات الأمان والمراقبة (Audit Trail)</h3>
              <div className="space-y-3">
                {logs.map(log => (
                  <div key={log.id} className="bg-[#0b1422] p-4 rounded-xl border border-white/5 flex items-start justify-between">
                    <div>
                      <div className="text-sm font-semibold text-cyan-400">{log.action}</div>
                      <div className="text-xs text-white/70 mt-1">{log.details}</div>
                      <div className="text-xs text-white/40 mt-2">بواسطة: {log.userName}</div>
                    </div>
                    <div className="text-xs text-white/40">
                      {log.createdAt?.toDate ? log.createdAt.toDate().toLocaleString('ar') : 'الآن'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Employee Modal */}
      <UserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveUser}
        initialData={selectedUser}
        managers={users.filter(u => u.uid !== selectedUser?.uid)}
      />

      {/* Reassign & Deletion Confirmation Modal */}
      {deleteModalOpen && userToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#111c2d] border border-white/10 rounded-xl p-6 max-w-md w-full space-y-4 text-white">
            <h3 className="text-lg font-bold text-rose-400">حذف / تعطيل الموظف</h3>
            <p className="text-sm text-white/70">
              يتوجب عليك إعادة إسناد جميع العملاء والمهام المسجلة باسم الموظف ({userToDelete.displayName}) إلى موظف آخر قبل إتمام العملية.
            </p>
            <div>
              <label className="block text-xs text-white/60 mb-2">إسناد كافة العمليات إلى الموظف البديل:</label>
              <select
                value={reassignTargetId}
                onChange={e => setReassignTargetId(e.target.value)}
                className="w-full bg-[#0b1422] border border-white/10 rounded-xl p-2.5 text-sm text-white"
              >
                <option value="">اختر موظف بديل...</option>
                {users.filter(u => u.uid !== userToDelete.uid).map(u => (
                  <option key={u.uid} value={u.uid}>{u.displayName}</option>
                ))}
              </select>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                disabled={!reassignTargetId}
                onClick={() => handleDeleteExecute(false)}
                className="flex-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30 py-2 rounded-xl text-sm transition disabled:opacity-50"
              >
                تعطيل الحساب
              </button>
              {isSuperAdmin && (
                <button
                  disabled={!reassignTargetId}
                  onClick={() => handleDeleteExecute(true)}
                  className="flex-1 bg-rose-500 hover:bg-rose-400 text-white font-semibold py-2 rounded-xl text-sm transition disabled:opacity-50"
                >
                  حذف نهائي
                </button>
              )}
            </div>
            <button onClick={() => setDeleteModalOpen(false)} className="w-full py-2 text-xs text-white/50 hover:text-white">إلغاء</button>
          </div>
        </div>
      )}
    </div>
  );
};
