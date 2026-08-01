import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { addDocument } from '../services/firestore';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Plus, X, Check } from 'lucide-react';
import type { Task, TaskStatus, TaskPriority, SubTask, Client, User } from '../types';

interface Props {
  clients: Client[];
  users: User[];
  currentUser: User | null;
}

export function AddTaskPage({ clients, users, currentUser }: Props) {
  const { navigateBackToTasks } = useApp();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subTaskInput, setSubTaskInput] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [formData, setFormData] = useState<Partial<Task>>({
    title: '',
    description: '',
    status: 'todo',
    priority: 'medium',
    assignedTo: '',
    clientId: '',
    dueDate: '',
    tags: [],
    subTasks: [],
  });

  const addSubTask = () => {
    if (!subTaskInput.trim()) return;
    const newSubTask: SubTask = {
      id: Date.now().toString(),
      title: subTaskInput.trim(),
      completed: false,
      createdAt: new Date().toISOString(),
    };
    setFormData(prev => ({ ...prev, subTasks: [...(prev.subTasks || []), newSubTask] }));
    setSubTaskInput('');
  };

  const removeSubTask = (id: string) => {
    setFormData(prev => ({ ...prev, subTasks: prev.subTasks?.filter(st => st.id !== id) || [] }));
  };

  const toggleSubTask = (id: string) => {
    setFormData(prev => ({
      ...prev,
      subTasks: prev.subTasks?.map(st => st.id === id ? { ...st, completed: !st.completed } : st) || [],
    }));
  };

  const addTag = () => {
    if (!tagInput.trim()) return;
    setFormData(prev => ({ ...prev, tags: [...(prev.tags || []), tagInput.trim()] }));
    setTagInput('');
  };

  const removeTag = (index: number) => {
    setFormData(prev => ({ ...prev, tags: prev.tags?.filter((_, i) => i !== index) || [] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title?.trim()) {
      alert('عنوان المهمة مطلوب');
      return;
    }

    const assignedUser = users.find(u => (u.id || u.uid) === formData.assignedTo);
    const client = clients.find(c => c.id === formData.clientId);

    setIsSubmitting(true);
    try {
      await addDocument('tasks', {
        ...formData,
        assignedToName: assignedUser?.name || assignedUser?.displayName,
        clientName: client?.name,
        createdBy: currentUser?.name || currentUser?.displayName || 'مجهول',
      });
      navigateBackToTasks();
    } catch (error) {
      console.error(error);
      alert('حدث خطأ أثناء حفظ المهمة');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-white text-2xl font-bold mb-6">إضافة مهمة جديدة</h1>

      <form onSubmit={handleSubmit} className="bg-[#111c2d] rounded-2xl p-6 border border-white/5 space-y-6">
        {/* Title */}
        <div>
          <label className="block text-white/70 text-sm mb-2">عنوان المهمة *</label>
          <input
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            placeholder="مثال: تصميم هوية بصرية"
            className="w-full bg-[#0b1422] border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-cyan-400/50"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-white/70 text-sm mb-2">الوصف</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            rows={3}
            placeholder="تفاصيل المهمة..."
            className="w-full bg-[#0b1422] border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-cyan-400/50 resize-none"
          />
        </div>

        {/* Assignment & Client */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-white/70 text-sm mb-2">تكليف إلى</label>
            <select
              value={formData.assignedTo}
              onChange={(e) => setFormData(prev => ({ ...prev, assignedTo: e.target.value }))}
              className="w-full bg-[#0b1422] border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-cyan-400/50"
            >
              <option value="">اختر موظف...</option>
              {users.map((u) => (
                <option key={u.id || u.uid} value={u.id || u.uid}>
                  {u.name || u.displayName || u.email}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-white/70 text-sm mb-2">العميل المرتبط (اختياري)</label>
            <select
              value={formData.clientId}
              onChange={(e) => setFormData(prev => ({ ...prev, clientId: e.target.value }))}
              className="w-full bg-[#0b1422] border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-cyan-400/50"
            >
              <option value="">بدون عميل</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Status, Priority, Due Date */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-white/70 text-sm mb-2">الحالة</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as TaskStatus }))}
              className="w-full bg-[#0b1422] border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-cyan-400/50"
            >
              <option value="todo">للقيام به</option>
              <option value="in_progress">قيد التنفيذ</option>
              <option value="review">مراجعة</option>
              <option value="done">مكتمل</option>
            </select>
          </div>
          <div>
            <label className="block text-white/70 text-sm mb-2">الأولوية</label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as TaskPriority }))}
              className="w-full bg-[#0b1422] border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-cyan-400/50"
            >
              <option value="low">منخفضة</option>
              <option value="medium">متوسطة</option>
              <option value="high">عالية</option>
              <option value="urgent">عاجلة</option>
            </select>
          </div>
          <div>
            <label className="block text-white/70 text-sm mb-2">تاريخ الاستحقاق</label>
            <input
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
              className="w-full bg-[#0b1422] border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-cyan-400/50"
            />
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-white/70 text-sm mb-2">العلامات (Tags)</label>
          <div className="flex gap-2 mb-2">
            <input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              placeholder="أضف علامة..."
              className="flex-1 bg-[#0b1422] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-cyan-400/50"
            />
            <button type="button" onClick={addTag} className="bg-cyan-400/10 text-cyan-400 px-4 rounded-xl hover:bg-cyan-400/20 transition-colors">
              <Plus size={16} />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.tags?.map((tag, i) => (
              <span key={i} className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-cyan-400/10 text-cyan-400 text-xs">
                {tag}
                <button type="button" onClick={() => removeTag(i)} className="hover:text-cyan-300"><X size={10} /></button>
              </span>
            ))}
          </div>
        </div>

        {/* SubTasks / Checklist */}
        <div>
          <label className="block text-white/70 text-sm mb-3">قائمة المهام الفرعية (Checklist)</label>
          <div className="space-y-2 mb-3">
            {formData.subTasks?.map((st) => (
              <div key={st.id} className="flex items-center gap-3 p-3 bg-[#0b1422] rounded-xl border border-white/5">
                <button
                  type="button"
                  onClick={() => toggleSubTask(st.id)}
                  className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors ${st.completed ? 'bg-cyan-400 text-black' : 'border border-white/20 hover:border-cyan-400/50'}`}
                >
                  {st.completed && <Check size={12} />}
                </button>
                <span className={`flex-1 text-sm ${st.completed ? 'text-white/40 line-through' : 'text-white'}`}>
                  {st.title}
                </span>
                <button type="button" onClick={() => removeSubTask(st.id)} className="text-red-400 hover:text-red-300">
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              value={subTaskInput}
              onChange={(e) => setSubTaskInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSubTask())}
              placeholder="مهمة فرعية جديدة..."
              className="flex-1 bg-[#0b1422] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-cyan-400/50"
            />
            <button type="button" onClick={addSubTask} className="bg-cyan-400/10 text-cyan-400 px-4 rounded-xl hover:bg-cyan-400/20 transition-colors">
              <Plus size={16} />
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-4 border-t border-white/5">
          <button type="submit" disabled={isSubmitting}
            className="flex-1 bg-cyan-400 text-black font-bold py-3 rounded-xl hover:bg-cyan-300 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
            {isSubmitting ? <LoadingSpinner size="sm" /> : 'حفظ المهمة'}
          </button>
          <button type="button" onClick={navigateBackToTasks}
            className="px-6 py-3 border border-white/10 text-white rounded-xl hover:bg-white/5 transition-colors">
            إلغاء
          </button>
        </div>
      </form>
    </div>
  );
}
