import { useApp } from '../context/AppContext';
import { formatDate } from '../utils';
import { ArrowRight, Edit2, MessageSquare, Phone, Mail, Building2, Briefcase, Tag, ExternalLink } from 'lucide-react';
import type { Client, Task, User } from '../types';

interface Props {
  client: Client;
  tasks: Task[];
  isAdmin: boolean;
}

const STAGE_LABELS: Record<string, { label: string; color: string; bg: string }> = {
  new: { label: 'جديد', color: 'text-green-400', bg: 'bg-green-400/10' },
  negotiation: { label: 'تفاوض', color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
  in_progress: { label: 'قيد العمل', color: 'text-blue-400', bg: 'bg-blue-400/10' },
  previous: { label: 'سابق', color: 'text-gray-400', bg: 'bg-gray-400/10' },
};

export function ClientDetailsPage({ client, tasks, isAdmin }: Props) {
  const { navigateBackToClients, navigateToEditClient, setPage } = useApp();
  const clientTasks = tasks.filter((t) => t.clientId === client.id);

  const stageInfo = STAGE_LABELS[client.stage || 'new'] || STAGE_LABELS.new;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <button onClick={navigateBackToClients} className="text-white/70 hover:text-white flex items-center gap-2 transition-colors">
          <ArrowRight size={18} />
          رجوع للعملاء
        </button>
        {isAdmin && (
          <button onClick={() => navigateToEditClient(client)}
            className="bg-yellow-400/10 text-yellow-400 px-4 py-2 rounded-xl font-medium hover:bg-yellow-400/20 transition-colors flex items-center gap-2">
            <Edit2 size={16} />
            تعديل العميل
          </button>
        )}
      </div>

      {/* Main Info Card */}
      <div className="bg-[#111c2d] rounded-2xl p-6 border border-white/5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-cyan-400/10 flex items-center justify-center text-cyan-400 font-bold text-2xl">
              {client.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-white text-2xl font-bold">{client.name}</h1>
              <p className="text-white/50">{client.company || 'بدون شركة'}</p>
            </div>
          </div>
          <span className={`px-4 py-1.5 rounded-full text-sm font-medium ${stageInfo.bg} ${stageInfo.color}`}>
            {stageInfo.label}
          </span>
        </div>

        {/* Contact Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          <InfoCard icon={<Mail size={16} />} label="البريد الإلكتروني" value={client.email} />
          <InfoCard icon={<Phone size={16} />} label="الهاتف" value={client.phone} />
          <InfoCard icon={<MessageSquare size={16} />} label="واتس أب" value={client.whatsapp} />
          <InfoCard icon={<Building2 size={16} />} label="الشركة" value={client.company} />
          <InfoCard icon={<Briefcase size={16} />} label="المسمى الوظيفي" value={client.jobTitle} />
          <InfoCard icon={<Tag size={16} />} label="الخدمة المطلوبة" value={client.serviceRequired} />
        </div>

        {/* Social Media */}
        {client.socialMedia && Object.values(client.socialMedia).some(v => v) && (
          <div className="mt-6 pt-6 border-t border-white/5">
            <h3 className="text-white/70 text-sm font-medium mb-3">حسابات التواصل الاجتماعي</h3>
            <div className="flex flex-wrap gap-3">
              {client.socialMedia.facebook && <SocialLink icon="📘" label="فيسبوك" url={client.socialMedia.facebook} />}
              {client.socialMedia.instagram && <SocialLink icon="📷" label="إنستغرام" url={client.socialMedia.instagram} />}
              {client.socialMedia.twitter && <SocialLink icon="🐦" label="تويتر" url={client.socialMedia.twitter} />}
              {client.socialMedia.linkedin && <SocialLink icon="💼" label="لينكد إن" url={client.socialMedia.linkedin} />}
              {client.socialMedia.tiktok && <SocialLink icon="🎵" label="تيك توك" url={client.socialMedia.tiktok} />}
              {client.socialMedia.telegram && <SocialLink icon="✈️" label="تيليجرام" url={client.socialMedia.telegram} />}
            </div>
          </div>
        )}

        {/* Tags */}
        {client.tags && client.tags.length > 0 && (
          <div className="mt-6 pt-6 border-t border-white/5">
            <h3 className="text-white/70 text-sm font-medium mb-3">العلامات</h3>
            <div className="flex flex-wrap gap-2">
              {client.tags.map((tag, i) => (
                <span key={i} className="px-3 py-1 rounded-lg bg-cyan-400/10 text-cyan-400 text-sm">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Notes */}
        {client.notes && (
          <div className="mt-6 pt-6 border-t border-white/5">
            <h3 className="text-white/70 text-sm font-medium mb-2">ملاحظات</h3>
            <p className="text-white/80 whitespace-pre-wrap">{client.notes}</p>
          </div>
        )}

        {/* Meta */}
        <div className="mt-6 pt-6 border-t border-white/5 flex flex-wrap gap-4 text-white/30 text-xs">
          <span>تاريخ الإضافة: {formatDate(client.createdAt)}</span>
          {client.assignedToName && <span>المسؤول: {client.assignedToName}</span>}
          {client.createdBy && <span>أضيف بواسطة: {client.createdBy}</span>}
        </div>
      </div>

      {/* Tasks Section */}
      <div className="bg-[#111c2d] rounded-2xl p-6 border border-white/5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white font-bold">مهام العميل ({clientTasks.length})</h2>
          <button onClick={() => setPage('add-task')}
            className="text-cyan-400 hover:text-cyan-300 text-sm font-medium">
            + إضافة مهمة
          </button>
        </div>

        {clientTasks.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-white/40">لا توجد مهام مرتبطة بهذا العميل</p>
          </div>
        ) : (
          <div className="space-y-3">
            {clientTasks.map((task) => (
              <div key={task.id} className="p-4 bg-white/5 rounded-xl flex items-center justify-between hover:bg-white/[0.07] transition-colors">
                <div>
                  <p className="text-white font-medium">{task.title}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-white/40 text-xs">{task.assignedToName || 'غير مكلف'}</span>
                    {task.dueDate && <span className="text-white/30 text-xs">📅 {formatDate(task.dueDate)}</span>}
                  </div>
                </div>
                <TaskStatusBadge status={task.status} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function InfoCard({ icon, label, value }: { icon: React.ReactNode; label: string; value?: string }) {
  if (!value) return null;
  return (
    <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
      <span className="text-white/40">{icon}</span>
      <div>
        <p className="text-white/40 text-xs">{label}</p>
        <p className="text-white text-sm font-medium">{value}</p>
      </div>
    </div>
  );
}

function SocialLink({ icon, label, url }: { icon: string; label: string; url: string }) {
  return (
    <a href={url.startsWith('http') ? url : `https://${url}`} target="_blank" rel="noopener noreferrer"
      className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl hover:bg-white/10 transition-colors text-white/70 hover:text-white text-sm">
      <span>{icon}</span>
      <span>{label}</span>
      <ExternalLink size={12} className="text-white/30" />
    </a>
  );
}

function TaskStatusBadge({ status }: { status?: string }) {
  const styles: Record<string, string> = {
    done: 'bg-green-400/10 text-green-400',
    review: 'bg-purple-400/10 text-purple-400',
    in_progress: 'bg-blue-400/10 text-blue-400',
    todo: 'bg-yellow-400/10 text-yellow-400',
  };
  const labels: Record<string, string> = {
    done: 'مكتمل',
    review: 'مراجعة',
    in_progress: 'قيد التنفيذ',
    todo: 'للقيام به',
  };
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status || 'todo']}`}>
      {labels[status || 'todo']}
    </span>
  );
}
