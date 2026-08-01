import { useState } from 'react';
import { Users, Shield, Building, Sliders, Bell, DollarSign, Cpu, Lock, FileText, Database, Plus, Search, Edit2, Trash2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useApp } from '../context/AppContext';
import type { User, PermissionType } from '../types';

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState('users');
  const { users, setUsers } = useApp() as any;
  const { user: currentUser } = useAuth();
  
  // حالة نافذة إضافة/تعديل موظف
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    department: 'الإدارة',
    jobTitle: 'موظف مبيعات',
    role: 'employee',
    status: 'active' as const,
    password: ''
  });

  const tabs = [
    { id: 'general', label: 'عام', icon: Sliders },
    { id: 'company', label: 'الشركة', icon: Building },
    { id: 'users', label: 'الموظفين والصلاحيات', icon: Users },
    { id: 'roles', label: 'الأدوار والصلاحيات', icon: Shield },
    { id: 'pipelines', label: 'مراحل العمل', icon: Sliders },
    { id: 'tags', label: 'العلامات', icon: Sliders },
    { id: 'notifications', label: 'الإشعارات', icon: Bell },
    { id: 'currencies', label: 'العملات', icon: DollarSign },
    { id: 'integrations', label: 'الربط والـ APIs', icon: Cpu },
    { id: 'security', label: 'الأمان', icon: Lock },
    { id: 'audit', label: 'سجلات التدقيق', icon: FileText },
    { id: 'backup', label: 'النسخ الاحتياطي', icon: Database },
  ];

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser: User = {
      uid: Date.now().toString(),
      id: Date.now().toString(),
      displayName: formData.name,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      department: formData.department,
      jobTitle: formData.jobTitle,
      role: formData.role,
      status: formData.status,
      permissions: ['clients.view', 'tasks.view'] as PermissionType[],
      createdAt: new Date().toISOString()
    };

    setUsers((prev: User[]) => [newUser, ...prev]);
    setIsModalOpen(false);
    setFormData({ name: '', email: '', phone: '', department: 'الإدارة', jobTitle: '', role: 'employee', status: 'active', password: '' });
  };

  const filteredUsers = users.filter((u: User) => 
    (u.name || u.displayName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 text-right">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">إعدادات النظام</h1>
      </div>

      <div className="flex gap-4 border-b border-white/10 pb-3 overflow-x-auto">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition ${
                activeTab === tab.id ? 'bg-cyan-500 text-black font-semibold' : 'text-white/70 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      <div className="bg-[#111c2d] border border-white/10 rounded-2xl p-6">
        {activeTab === 'users' ? (
          <div className="space-y-6">
            <div className="flex justify-between items-center flex-wrap gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute right-3 top-3 text-white/40" size={18} />
                <input
                  type="text"
                  placeholder="بحث عن موظف بالاسم أو البريد..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-[#0b1422] border border-white/10 rounded-xl pr-10 pl-4 py-2.5 text-white text-sm focus:outline-none focus:border-cyan-500"
                />
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 bg-cyan-500 text-black px-4 py-2.5 rounded-xl font-semibold text-sm hover:bg-cyan-400 transition"
              >
                <Plus size={18} />
                <span>إضافة موظف</span>
              </button>
            </div>

            {/* جدول الموظفين الاحترافي */}
            <div className="overflow-x-auto">
              <table className="w-full text-right border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-white/60 text-xs">
                    <th className="py-3 px-4">الموظف</th>
                    <th className="py-3 px-4">البريد الإلكتروني</th>
                    <th className="py-3 px-4">الهاتف</th>
                    <th className="py-3 px-4">القسم والمسمى</th>
                    <th className="py-3 px-4">الدور</th>
                    <th className="py-3 px-4">الحالة</th>
                    <th className="py-3 px-4 text-center">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-sm">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-white/40">لا يوجد موظفون مسجلون حالياً</td>
                    </tr>
                  ) : (
                    filteredUsers.map((u: User) => (
                      <tr key={u.uid || u.id} className="hover:bg-white/5 transition">
                        <td className="py-3 px-4 flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
                            {(u.name || u.displayName || 'م').charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-white">{u.name || u.displayName || 'بدون اسم'}</p>
                            <p className="text-xs text-white/40">إنشاء: {u.createdAt ? new Date(u.createdAt).toLocaleDateString('ar-EG') : 'حديث'}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-white/80">{u.email}</td>
                        <td className="py-3 px-4 text-white/80">{u.phone || 'غير متوفر'}</td>
                        <td className="py-3 px-4">
                          <p className="text-white">{u.department || 'عام'}</p>
                          <p className="text-xs text-white/40">{u.jobTitle || 'موظف'}</p>
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400">
                            {u.role}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                            u.status === 'active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                          }`}>
                            {u.status === 'active' ? 'نشط' : 'معطل'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button title="تعديل" className="p-1.5 hover:bg-white/10 rounded-lg text-white/70 hover:text-white">
                              <Edit2 size={16} />
                            </button>
                            <button title="حذف" onClick={() => setUsers((prev: User[]) => prev.filter((item: User) => (item.uid || item.id) !== (u.uid || u.id)))} className="p-1.5 hover:bg-red-500/20 rounded-lg text-red-400">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="py-16 text-center text-white/50">
            <h2 className="text-xl font-semibold mb-2">قسم {tabs.find(t => t.id === activeTab)?.label}</h2>
            <p className="text-sm">هذا القسم جاهز للتخصيص الكامل حسب متطلبات شركتك.</p>
          </div>
        )}
      </div>

      {/* Modal نافذة إضافة موظف */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#111c2d] border border-white/10 rounded-2xl w-full max-w-lg p-6 space-y-6">
            <h2 className="text-xl font-bold text-white">إضافة موظف جديد</h2>
            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-white/70 mb-1">اسم الموظف</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-[#0b1422] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-white/70 mb-1">البريد الإلكتروني</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-[#0b1422] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-white/70 mb-1">كلمة المرور المؤقتة</label>
                  <input
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full bg-[#0b1422] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-white/70 mb-1">القسم</label>
                  <input
                    type="text"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full bg-[#0b1422] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-white/70 mb-1">المسمى الوظيفي</label>
                  <input
                    type="text"
                    value={formData.jobTitle}
                    onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                    className="w-full bg-[#0b1422] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-white/70 mb-1">الدور والصلاحيات</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full bg-[#0b1422] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-cyan-500"
                >
                  <option value="employee">موظف (Employee)</option>
                  <option value="manager">مدير (Manager)</option>
                  <option value="admin">مسؤول (Admin)</option>
                  <option value="super-admin">مشرف عام (Super Admin)</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-sm font-medium text-white/70 hover:bg-white/5 transition"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-cyan-500 text-black rounded-xl text-sm font-semibold hover:bg-cyan-400 transition"
                >
                  إنشاء الموظف
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}