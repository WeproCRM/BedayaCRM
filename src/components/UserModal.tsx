// src/components/UserModal.tsx
import React, { useState, useEffect } from 'react';
import { User, RoleType, Permission } from '../types';
import { ALL_PERMISSIONS, DEFAULT_ROLES } from '../constants/permissions';
import { X, Shield, User as UserIcon, Mail, Phone, Briefcase, Building } from 'lucide-react';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<User>) => Promise<void>;
  initialData?: User | null;
  managers: User[];
}

export const UserModal: React.FC<UserModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  managers
}) => {
  const [formData, setFormData] = useState<Partial<User>>({
    displayName: '',
    email: '',
    phone: '',
    department: '',
    jobTitle: '',
    role: 'employee',
    status: 'active',
    managerId: '',
    permissions: [],
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        displayName: '',
        email: '',
        phone: '',
        department: '',
        jobTitle: '',
        role: 'employee',
        status: 'active',
        managerId: '',
        permissions: DEFAULT_ROLES.find(r => r.id === 'employee')?.permissions || [],
      });
    }
  }, [initialData, isOpen]);

  const handleRoleChange = (role: RoleType) => {
    const selectedRoleDef = DEFAULT_ROLES.find(r => r.id === role);
    setFormData(prev => ({
      ...prev,
      role,
      permissions: selectedRoleDef ? selectedRoleDef.permissions : prev.permissions,
    }));
  };

  const togglePermission = (perm: Permission) => {
    setFormData(prev => {
      const currentPerms = prev.permissions || [];
      const updated = currentPerms.includes(perm)
        ? currentPerms.filter(p => p !== perm)
        : [...currentPerms, perm];
      return { ...prev, permissions: updated };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSave(formData);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-[#111c2d] border border-white/10 rounded-xl w-full max-w-3xl max-h-[90vh] flex flex-col text-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <UserIcon className="text-cyan-400" size={22} />
            {initialData ? 'تعديل بيانات موظف' : 'إضافة موظف جديد'}
          </h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-white/10 text-white/60 hover:text-white">
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-white/60 mb-2">الاسم الكامل *</label>
              <input
                type="text"
                required
                value={formData.displayName || ''}
                onChange={e => setFormData({ ...formData, displayName: e.target.value })}
                className="w-full bg-[#0b1422] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-cyan-400/50"
                placeholder="أحمد محمد"
              />
            </div>

            <div>
              <label className="block text-sm text-white/60 mb-2">البريد الإلكتروني *</label>
              <input
                type="email"
                required
                disabled={!!initialData}
                value={formData.email || ''}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-[#0b1422] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-cyan-400/50 disabled:opacity-50"
                placeholder="employee@company.com"
              />
            </div>

            <div>
              <label className="block text-sm text-white/60 mb-2">رقم الهاتف</label>
              <input
                type="text"
                value={formData.phone || ''}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-[#0b1422] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-cyan-400/50"
                placeholder="+966 50 000 0000"
              />
            </div>

            <div>
              <label className="block text-sm text-white/60 mb-2">القسم</label>
              <input
                type="text"
                value={formData.department || ''}
                onChange={e => setFormData({ ...formData, department: e.target.value })}
                className="w-full bg-[#0b1422] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-cyan-400/50"
                placeholder="المبيعات / الدعم الفني"
              />
            </div>

            <div>
              <label className="block text-sm text-white/60 mb-2">المسمى الوظيفي</label>
              <input
                type="text"
                value={formData.jobTitle || ''}
                onChange={e => setFormData({ ...formData, jobTitle: e.target.value })}
                className="w-full bg-[#0b1422] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-cyan-400/50"
                placeholder="مستشار مبيعات"
              />
            </div>

            <div>
              <label className="block text-sm text-white/60 mb-2">المدير المباشر</label>
              <select
                value={formData.managerId || ''}
                onChange={e => setFormData({ ...formData, managerId: e.target.value })}
                className="w-full bg-[#0b1422] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-cyan-400/50"
              >
                <option value="">بدون مدير مباشر</option>
                {managers.map(m => (
                  <option key={m.uid} value={m.uid}>{m.displayName} ({m.jobTitle || m.role})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-white/60 mb-2">الدور القيادي</label>
              <select
                value={formData.role || 'employee'}
                onChange={e => handleRoleChange(e.target.value as RoleType)}
                className="w-full bg-[#0b1422] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-cyan-400/50"
              >
                <option value="super-admin">Super Admin</option>
                <option value="admin">مدير نظام (Admin)</option>
                <option value="manager">مدير قسم (Manager)</option>
                <option value="sales">مبيعات (Sales)</option>
                <option value="employee">موظف (Employee)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-white/60 mb-2">الحالة</label>
              <select
                value={formData.status || 'active'}
                onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full bg-[#0b1422] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-cyan-400/50"
              >
                <option value="active">نشط (Active)</option>
                <option value="inactive">معطل (Inactive)</option>
                <option value="suspended">موقوف (Suspended)</option>
              </select>
            </div>
          </div>

          {/* Permissions Group */}
          <div className="pt-4 border-t border-white/10">
            <h4 className="text-md font-semibold text-cyan-400 mb-3 flex items-center gap-2">
              <Shield size={18} />
              الصلاحيات المخصصة
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {ALL_PERMISSIONS.map(perm => {
                const checked = formData.permissions?.includes(perm.id);
                return (
                  <label key={perm.id} className="flex items-center gap-2 bg-[#0b1422] p-3 rounded-lg border border-white/5 hover:border-white/10 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => togglePermission(perm.id)}
                      className="accent-cyan-400 rounded"
                    />
                    <span className="text-xs text-white/80">{perm.label}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-white/70 transition"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-semibold transition disabled:opacity-50"
            >
              {loading ? 'جاري الحفظ...' : initialData ? 'تحديث البيانات' : 'حفظ ونشر الموظف'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
