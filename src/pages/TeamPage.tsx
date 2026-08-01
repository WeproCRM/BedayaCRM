import { useState } from 'react';
import { addDocument, deleteDocument } from '../services/firestore';
import { registerUser } from '../services/auth';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Plus, Search, Trash2, Mail, Phone, Shield, UserCircle, X } from 'lucide-react';
import type { User } from '../types';

interface Props {
  users: User[];
  currentUser: User | null;
  isAdmin: boolean;
}

export function TeamPage({ users, currentUser, isAdmin }: Props) {
  const [isAdding, setIsAdding] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    department: '',
    jobTitle: '',
    role: 'employee' as 'employee' | 'manager' | 'admin',
  });

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) return alert('غير مصرح');

    setIsSubmitting(true);
    try {
      await registerUser(
        formData.email,
        formData.password,
        formData.name,
        formData.role,
        {
          phone: formData.phone,
          department: formData.department,
          jobTitle: formData.jobTitle,
        }
      );

      setFormData({
        name: '', email: '', password: '', phone: '',
        department: '', jobTitle: '', role: 'employee',
      });
      setIsAdding(false);
    } catch (error: any) {
      console.error("Error adding user:", error);
      alert('حدث خطأ: ' + (error.message || 'فشل إنشاء المستخدم'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!isAdmin) return alert('غير مصرح');
    if (!confirm('هل أنت متأكد من حذف هذا العضو؟')) return;
    try {
      await deleteDocument('users', id);
    } catch (error) {
      console.error("Error deleting user:", error);
      alert('حدث خطأ أثناء الحذف.');
    }
  };

  const filteredUsers = users.filter((u) =>
    (u.name || u.displayName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (u.department || '').includes(searchTerm)
  );

  const roleLabels: Record<string, { label: string; color: string; bg: string }> = {
    'super-admin': { label: 'مدير عام', color: 'text-purple-400', bg: 'bg-purple-400/10' },
    'admin': { label: 'مدير', color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
    'manager': { label: 'مشرف', color: 'text-blue-400', bg: 'bg-blue-400/10' },
    'employee': { label: 'موظف', color: 'text-cyan-400', bg: 'bg-cyan-400/10' },
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="text-white text-2xl font-bold">الفريق</h1>
        {isAdmin && (
          <button onClick={() => setIsAdding(!isAdding)}
            className="bg-cyan-400 text-black px-5 py-2.5 rounded-xl font-bold hover:bg-cyan-300 transition-colors flex items-center gap-2">
            {isAdding ? <><X size={18} /> إلغاء</> : <><Plus size={18} /> إضافة عضو</>}
          </button>
        )}
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute right-3 top-3 text-white/30" size={18} />
        <input
          type="text"
          placeholder="بحث بالاسم أو البريد أو القسم..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-[#111c2d] border border-white/10 rounded-xl pr-10 pl-4 py-3 text-white placeholder-white/40 outline-none focus:border-cyan-400/50"
        />
      </div>

      {/* Add User Form */}
      {isAdding && (
        <form onSubmit={handleAdd} className="bg-[#111c2d] rounded-2xl p-6 border border-white/5 space-y-4">
          <h3 className="text-white font-bold mb-4">إضافة موظف جديد</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-white/70 text-sm mb-2">الاسم الكامل *</label>
              <input
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
                className="w-full bg-[#0b1422] border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-cyan-400/50"
              />
            </div>
            <div>
              <label className="block text-white/70 text-sm mb-2">البريد الإلكتروني *</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                required
                className="w-full bg-[#0b1422] border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-cyan-400/50"
              />
            </div>
            <div>
              <label className="block text-white/70 text-sm mb-2">كلمة المرور *</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                required
                minLength={6}
                placeholder="6 أحرف على الأقل"
                className="w-full bg-[#0b1422] border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-cyan-400/50"
              />
            </div>
            <div>
              <label className="block text-white/70 text-sm mb-2">رقم الهاتف</label>
              <input
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                className="w-full bg-[#0b1422] border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-cyan-400/50"
              />
            </div>
            <div>
              <label className="block text-white/70 text-sm mb-2">القسم</label>
              <input
                value={formData.department}
                onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                placeholder="مثال: المبيعات"
                className="w-full bg-[#0b1422] border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-cyan-400/50"
              />
            </div>
            <div>
              <label className="block text-white/70 text-sm mb-2">المسمى الوظيفي</label>
              <input
                value={formData.jobTitle}
                onChange={(e) => setFormData(prev => ({ ...prev, jobTitle: e.target.value }))}
                placeholder="مثال: مدير مبيعات"
                className="w-full bg-[#0b1422] border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-cyan-400/50"
              />
            </div>
            <div>
              <label className="block text-white/70 text-sm mb-2">الدور الوظيفي</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value as any }))}
                className="w-full bg-[#0b1422] border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-cyan-400/50"
              >
                <option value="employee">موظف</option>
                <option value="manager">مشرف</option>
                <option value="admin">مدير</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={() => setIsAdding(false)}
              className="px-6 py-3 border border-white/10 text-white rounded-xl hover:bg-white/5 transition-colors">
              إلغاء
            </button>
            <button type="submit" disabled={isSubmitting}
              className="px-6 py-3 bg-cyan-400 text-black font-bold rounded-xl hover:bg-cyan-300 transition-colors disabled:opacity-50 flex items-center gap-2">
              {isSubmitting ? <LoadingSpinner size="sm" /> : 'إنشاء الحساب'}
            </button>
          </div>
        </form>
      )}

      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredUsers.map((u) => {
          const userId = u.id || u.uid;
          const currentId = currentUser?.id || currentUser?.uid;
          const userName = u.displayName || u.name || 'مستخدم مجهول';
          const roleInfo = roleLabels[u.role || 'employee'] || roleLabels.employee;

          return (
            <div key={userId} className="bg-[#111c2d] rounded-2xl p-5 border border-white/5 hover:border-white/10 transition-colors">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-cyan-400/10 flex items-center justify-center text-cyan-400 font-bold text-lg">
                    {userName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-sm">{userName}</h3>
                    <p className="text-white/40 text-xs">{u.email}</p>
                  </div>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${roleInfo.bg} ${roleInfo.color}`}>
                  {roleInfo.label}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                {u.department && (
                  <p className="text-white/40 text-xs flex items-center gap-2">
                    <Shield size={12} />
                    {u.department}
                  </p>
                )}
                {u.jobTitle && (
                  <p className="text-white/40 text-xs flex items-center gap-2">
                    <UserCircle size={12} />
                    {u.jobTitle}
                  </p>
                )}
                {u.phone && (
                  <p className="text-white/40 text-xs flex items-center gap-2">
                    <Phone size={12} />
                    {u.phone}
                  </p>
                )}
              </div>

              {isAdmin && userId !== currentId && (
                <button
                  onClick={() => handleDelete(userId as string)}
                  className="w-full py-2 border border-red-400/20 text-red-400 rounded-xl text-sm hover:bg-red-400/10 transition-colors flex items-center justify-center gap-2"
                >
                  <Trash2 size={14} />
                  حذف
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
