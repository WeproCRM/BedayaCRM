import React, { useState, useEffect } from 'react';
import { X, User as UserIcon, Shield } from 'lucide-react';
import { User, RoleType } from '../types';
import { PERMISSIONS, DEFAULT_ROLES } from '../constants/permissions';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (user: Partial<User>) => Promise<void>;
  user?: User | null;
}

export function UserModal({ isOpen, onClose, onSave, user }: UserModalProps) {
  const [formData, setFormData] = useState<Partial<User>>({
    name: '',
    email: '',
    role: 'employee',
    department: '',
    jobTitle: '',
    status: 'active',
    permissions: []
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || user.displayName || '',
        email: user.email || '',
        role: user.role || 'employee',
        department: user.department || '',
        jobTitle: user.jobTitle || '',
        status: user.status || 'active',
        permissions: user.permissions || []
      });
    } else {
      setFormData({
        name: '',
        email: '',
        role: 'employee',
        department: '',
        jobTitle: '',
        status: 'active',
        permissions: []
      });
    }
  }, [user, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Error saving user:', error);
    } finally {
      setLoading(false);
    }
  };

  const togglePermission = (permId: string) => {
    const currentPerms = (formData.permissions || []) as string[];
    const exists = currentPerms.some((p: any) => (typeof p === 'string' ? p === permId : p.id === permId));

    if (exists) {
      setFormData({
        ...formData,
        permissions: currentPerms.filter((p: any) => (typeof p === 'string' ? p !== permId : p.id !== permId))
      });
    } else {
      setFormData({
        ...formData,
        permissions: [...currentPerms, permId]
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">{user ? 'تعديل مستخدم' : 'إضافة مستخدم جديد'}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">الاسم</label>
            <input
              type="text"
              required
              value={formData.name || ''}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full border rounded-lg p-2.5"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">البريد الإلكتروني</label>
            <input
              type="email"
              required
              disabled={!!user}
              value={formData.email || ''}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full border rounded-lg p-2.5 disabled:bg-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">الدور</label>
            <select
              value={formData.role || 'employee'}
              onChange={(e) => {
                const role = e.target.value as RoleType;
                const roleDef = DEFAULT_ROLES.find(r => r.id === role);
                setFormData({
                  ...formData,
                  role,
                  permissions: roleDef ? (roleDef.permissions as string[]) : []
                });
              }}
              className="w-full border rounded-lg p-2.5"
            >
              <option value="employee">موظف</option>
              <option value="admin">مدير</option>
              <option value="super-admin">مدير عام</option>
            </select>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'جاري الحفظ...' : 'حفظ'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}