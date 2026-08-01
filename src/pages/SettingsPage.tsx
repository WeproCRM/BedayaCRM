import { useState } from 'react';
import { Shield } from 'lucide-react';
import { RoleDefinition } from '../types';
import { DEFAULT_ROLES } from '../constants/permissions';

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'roles' | 'system'>('roles');

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">إعدادات النظام</h1>
          <p className="text-sm text-gray-500">إدارة الأدوار والإعدادات العامة</p>
        </div>
      </div>

      <div className="flex gap-4 border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab('roles')}
          className={`pb-3 px-4 font-medium text-sm flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'roles'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <Shield size={18} />
          الأدوار والصلاحيات
        </button>
      </div>

      {activeTab === 'roles' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold mb-4">الأدوار المتاحة</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {DEFAULT_ROLES.map((role: RoleDefinition) => (
              <div key={role.id} className="p-4 border rounded-lg hover:border-blue-200 transition-colors">
                <h3 className="font-semibold text-gray-800">{role.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{role.description || 'لا يوجد وصف'}</p>
                <div className="mt-3 flex items-center gap-2 text-xs text-blue-600">
                  <span>عدد الصلاحيات: {role.permissions.length}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}