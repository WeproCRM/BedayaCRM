import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { deleteDocument } from '../services/firestore';
import { formatDate } from '../utils';
import type { Client, User } from '../types';

interface Props {
  clients: Client[];
  isAdmin: boolean;
  currentUser: User | null;
}

export function ClientsPage({ clients, isAdmin }: Props) {
  const { navigateToClientDetails, navigateToEditClient, navigateToAddClient } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const filteredClients = clients.filter((client) => {
    const matchesSearch =
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.company?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || client.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleDelete = async (id: string) => {
    if (!isAdmin) { alert('ليس لديك صلاحية'); return; }
    if (!window.confirm('هل أنت متأكد من حذف العميل؟')) return;
    setIsDeleting(id);
    try { await deleteDocument('clients', id); } catch { alert('حدث خطأ أثناء الحذف'); } finally { setIsDeleting(null); }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-white text-2xl font-bold">العملاء</h1>
        <button onClick={navigateToAddClient} className="bg-cyan-400 text-black px-5 py-2.5 rounded-xl font-bold hover:bg-cyan-300 transition-colors">
          ➕ إضافة عميل جديد
        </button>
      </div>

      <div className="flex flex-wrap gap-3">
        <input type="text" placeholder="🔍 البحث في العملاء..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 min-w-[200px] bg-[#111c2d] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/40 outline-none focus:border-cyan-400/50" />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-[#111c2d] border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-cyan-400/50">
          <option value="all">جميع الحالات</option>
          <option value="active">نشط</option>
          <option value="inactive">غير نشط</option>
          <option value="lead">Lead</option>
        </select>
      </div>

      <div className="bg-[#111c2d] rounded-2xl border border-white/5 overflow-hidden">
        {filteredClients.length === 0 ? (
          <div className="text-center py-16"><p className="text-white/50 text-lg">لا يوجد عملاء مطابقين للبحث</p></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-right text-white/50 font-medium px-6 py-4">العميل</th>
                  <th className="text-right text-white/50 font-medium px-6 py-4">الشركة</th>
                  <th className="text-right text-white/50 font-medium px-6 py-4">الحالة</th>
                  <th className="text-right text-white/50 font-medium px-6 py-4">تاريخ الإضافة</th>
                  <th className="text-right text-white/50 font-medium px-6 py-4">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {filteredClients.map((client) => (
                  <tr key={client.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-white font-medium">{client.name}</p>
                        <p className="text-white/50 text-sm">{client.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-white/70">{client.company || '-'}</td>
                    <td className="px-6 py-4"><StatusBadge status={client.status} /></td>
                    <td className="px-6 py-4 text-white/50 text-sm">{formatDate(client.createdAt)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => navigateToClientDetails(client)} className="text-cyan-400 hover:text-cyan-300 text-sm font-medium">عرض</button>
                        {isAdmin && (
                          <>
                            <span className="text-white/20">|</span>
                            <button onClick={() => navigateToEditClient(client)} className="text-yellow-400 hover:text-yellow-300 text-sm font-medium">تعديل</button>
                            <span className="text-white/20">|</span>
                            <button onClick={() => handleDelete(client.id)} disabled={isDeleting === client.id} className="text-red-400 hover:text-red-300 text-sm font-medium disabled:opacity-50">
                              {isDeleting === client.id ? '...' : 'حذف'}
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status?: string }) {
  const styles: Record<string, string> = {
    active: 'bg-green-400/10 text-green-400',
    inactive: 'bg-red-400/10 text-red-400',
    lead: 'bg-yellow-400/10 text-yellow-400',
  };
  const labels: Record<string, string> = { active: 'نشط', inactive: 'غير نشط', lead: 'Lead' };
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status || 'lead']}`}>
      {labels[status || 'lead']}
    </span>
  );
}