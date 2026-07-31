// src/pages/TeamPage.tsx
import { useState } from 'react';
import { addDocument, deleteDocument } from '../services/firestore';
import { LoadingSpinner } from '../components/LoadingSpinner';
import type { User } from '../types';

interface Props {
  users: User[];
  currentUser: User | null;
  isAdmin: boolean;
}

export function TeamPage({ users, currentUser, isAdmin }: Props) {
  const [isAdding, setIsAdding] = useState(false);
  const [newUser, setNewUser] = useState<{ name: string; email: string; role: 'employee' | 'admin' }>({ name: '', email: '', role: 'employee' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) return alert('غير مصرح');

    setIsSubmitting(true);
    try {
      // إرسال الاسم ضمن displayName و name لضمان التوافق مع باقي النظام
      await addDocument('users', {
        ...newUser,
        displayName: newUser.name,
      });
      setNewUser({ name: '', email: '', role: 'employee' });
      setIsAdding(false);
    } catch (error) {
      console.error("Error adding user:", error);
      alert('حدث خطأ أثناء إضافة المستخدم.');
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-white text-2xl font-bold">الفريق</h1>
        {isAdmin && (
          <button onClick={() => setIsAdding(!isAdding)} className="bg-cyan-400 text-black px-5 py-2.5 rounded-xl font-bold hover:bg-cyan-300 transition-colors">
            {isAdding ? 'إلغاء' : 'إضافة عضو'}
          </button>
        )}
      </div>

      {isAdding && (
        <form onSubmit={handleAdd} className="bg-[#111c2d] rounded-2xl p-6 border border-white/5 flex flex-wrap gap-4">
          <input 
            value={newUser.name} 
            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} 
            placeholder="الاسم" 
            className="flex-1 min-w-[150px] bg-[#0b1422] border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-cyan-400/50" 
            required 
          />
          <input 
            value={newUser.email} 
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} 
            placeholder="البريد" 
            type="email" 
            className="flex-1 min-w-[150px] bg-[#0b1422] border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-cyan-400/50" 
            required 
          />
          <select 
            value={newUser.role} 
            onChange={(e) => setNewUser({ ...newUser, role: e.target.value as 'employee' | 'admin' })} 
            className="bg-[#0b1422] border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-cyan-400/50"
          >
            <option value="employee">موظف</option>
            <option value="admin">مدير</option>
          </select>
          <button type="submit" disabled={isSubmitting} className="bg-cyan-400 text-black font-bold px-6 py-3 rounded-xl hover:bg-cyan-300 disabled:opacity-50 flex items-center justify-center min-w-[100px]">
            {isSubmitting ? <LoadingSpinner size="sm" /> : 'حفظ'}
          </button>
        </form>
      )}

      <div className="bg-[#111c2d] rounded-2xl border border-white/5 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/5">
              <th className="text-right text-white/50 font-medium px-6 py-4">العضو</th>
              <th className="text-right text-white/50 font-medium px-6 py-4">الدور</th>
              {isAdmin && <th className="text-right text-white/50 font-medium px-6 py-4">إجراءات</th>}
            </tr>
          </thead>
          <tbody>
            {users.map((u) => {
              // توحيد الحقول لتجنب الأخطاء إذا كانت القيمة مسجلة كـ uid بدلاً من id أو displayName بدلاً من name
              const userId = u.id || u.uid;
              const currentId = currentUser?.id || currentUser?.uid;
              const userName = u.displayName || u.name || 'مستخدم مجهول';
              const userInitial = userName.charAt(0).toUpperCase();

              return (
                <tr key={userId} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-cyan-400/20 flex items-center justify-center text-cyan-400 font-bold">
                        {userInitial}
                      </div>
                      <div>
                        <p className="text-white font-medium">{userName}</p>
                        <p className="text-white/50 text-sm">{u.email || 'لا يوجد بريد'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      u.role === 'super-admin' ? 'bg-purple-400/10 text-purple-400' :
                      u.role === 'admin' ? 'bg-yellow-400/10 text-yellow-400' :
                      'bg-blue-400/10 text-blue-400'
                    }`}>
                      {u.role === 'super-admin' ? 'مدير عام' : u.role === 'admin' ? 'مدير' : 'موظف'}
                    </span>
                  </td>
                  {isAdmin && (
                    <td className="px-6 py-4">
                      {userId !== currentId && userId && (
                        <button onClick={() => handleDelete(userId as string)} className="text-red-400 hover:text-red-300 text-sm">حذف</button>
                      )}
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
