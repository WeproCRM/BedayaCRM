import { useApp } from '../context/AppContext';
import type { Client, ExchangeRates } from '../types';

interface Props {
  clients: Client[];
  exchangeRates: ExchangeRates;
}

export function DashboardPage({ clients }: Props) {
  const { navigateToAddClient } = useApp();

  const stats = {
    totalClients: clients.length,
    activeClients: clients.filter((c) => c.status === 'active').length,
    newThisMonth: clients.filter((c) => {
      const created = new Date(c.createdAt);
      const now = new Date();
      return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
    }).length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-white text-2xl font-bold">لوحة التحكم</h1>
        <button onClick={navigateToAddClient} className="bg-cyan-400 text-black px-5 py-2.5 rounded-xl font-bold hover:bg-cyan-300 transition-colors">
          ➕ إضافة عميل
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="إجمالي العملاء" value={stats.totalClients} icon="👥" color="cyan" />
        <StatCard title="العملاء النشطين" value={stats.activeClients} icon="✅" color="green" />
        <StatCard title="جديد هذا الشهر" value={stats.newThisMonth} icon="🆕" color="purple" />
      </div>

      <div className="bg-[#111c2d] rounded-2xl p-6 border border-white/5">
        <h2 className="text-white font-bold mb-4">آخر العملاء</h2>
        {clients.length === 0 ? (
          <p className="text-white/50 text-center py-8">لا يوجد عملاء بعد</p>
        ) : (
          <div className="space-y-3">
            {clients.slice(0, 5).map((client) => (
              <div key={client.id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
                <div>
                  <p className="text-white font-medium">{client.name}</p>
                  <p className="text-white/50 text-sm">{client.company || 'بدون شركة'}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  client.status === 'active' ? 'bg-green-400/10 text-green-400' :
                  client.status === 'inactive' ? 'bg-red-400/10 text-red-400' :
                  'bg-yellow-400/10 text-yellow-400'
                }`}>
                  {client.status === 'active' ? 'نشط' : client.status === 'inactive' ? 'غير نشط' : 'lead'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color }: { title: string; value: number; icon: string; color: string }) {
  const colors: Record<string, string> = {
    cyan: 'bg-cyan-400/10 text-cyan-400 border-cyan-400/20',
    green: 'bg-green-400/10 text-green-400 border-green-400/20',
    purple: 'bg-purple-400/10 text-purple-400 border-purple-400/20',
  };

  return (
    <div className={`p-6 rounded-2xl border ${colors[color]}`}>
      <div className="text-3xl mb-2">{icon}</div>
      <p className="text-3xl font-bold">{value}</p>
      <p className="text-sm opacity-70">{title}</p>
    </div>
  );
}