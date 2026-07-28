import { useApp } from '../context/AppContext';
import { formatDate } from '../utils';
import type { Client, Task, User } from '../types';

interface Props {
  client: Client;
  tasks: Task[];
  isAdmin: boolean;
  currentUser: User | null;
}

export function ClientDetailsPage({ client, tasks, isAdmin }: Props) {
  const { navigateBackToClients, navigateToEditClient } = useApp();
  const clientTasks = tasks.filter((t) => t.clientId === client.id);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button onClick={navigateBackToClients} className="text-white/70 hover:text-white flex items-center gap-2">
          ← رجوع للعملاء
        </button>
        {isAdmin && (
          <button onClick={() => navigateToEditClient(client)} className="bg-yellow-400/10 text-yellow-400 px-4 py-2 rounded-xl font-medium hover:bg-yellow-400/20 transition-colors">
            تعديل العميل
          </button>
        )}
      </div>

      <div className="bg-[#111c2d] rounded-2xl p-6 border border-white/5">
        <h1 className="text-white text-2xl font-bold mb-4">{client.name}</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-white/70">
          <InfoRow label="البريد" value={client.email} />
          <InfoRow label="الهاتف" value={client.phone} />
          <InfoRow label="الشركة" value={client.company} />
          <InfoRow label="الحالة" value={client.status} />
          <InfoRow label="تاريخ الإضافة" value={formatDate(client.createdAt)} />
          <InfoRow label="أضيف بواسطة" value={client.createdBy} />
        </div>
        {client.notes && (
          <div className="mt-4 pt-4 border-t border-white/5">
            <p className="text-white/50 text-sm mb-1">ملاحظات</p>
            <p className="text-white">{client.notes}</p>
          </div>
        )}
      </div>

      <div className="bg-[#111c2d] rounded-2xl p-6 border border-white/5">
        <h2 className="text-white font-bold mb-4">مهام العميل ({clientTasks.length})</h2>
        {clientTasks.length === 0 ? (
          <p className="text-white/50 text-center py-8">لا توجد مهام مرتبطة بهذا العميل</p>
        ) : (
          <div className="space-y-3">
            {clientTasks.map((task) => (
              <div key={task.id} className="p-4 bg-white/5 rounded-xl flex items-center justify-between">
                <div>
                  <p className="text-white font-medium">{task.title}</p>
                  <p className="text-white/50 text-sm">{task.status}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  task.status === 'Done' ? 'bg-green-400/10 text-green-400' :
                  task.status === 'In Progress' ? 'bg-blue-400/10 text-blue-400' :
                  'bg-yellow-400/10 text-yellow-400'
                }`}>
                  {task.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value?: string }) {
  return (
    <div>
      <p className="text-white/50 text-sm">{label}</p>
      <p className="text-white font-medium">{value || '-'}</p>
    </div>
  );
}