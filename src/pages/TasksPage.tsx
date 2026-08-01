import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { updateDocument, deleteDocument } from '../services/firestore';
import { Plus, Calendar, User, CheckCircle2, Circle, Clock, AlertCircle, Trash2 } from 'lucide-react';
import type { Task, Client, User, TaskStatus, TaskPriority } from '../types';

interface Props {
  tasks: Task[];
  clients: Client[];
  users: User[];
  currentUser: User | null;
  isAdmin: boolean;
}

const COLUMNS: { id: TaskStatus; title: string; color: string; borderColor: string }[] = [
  { id: 'todo', title: 'للقيام به', color: 'bg-yellow-400/10 text-yellow-400', borderColor: 'border-yellow-400/20' },
  { id: 'in_progress', title: 'قيد التنفيذ', color: 'bg-blue-400/10 text-blue-400', borderColor: 'border-blue-400/20' },
  { id: 'review', title: 'مراجعة', color: 'bg-purple-400/10 text-purple-400', borderColor: 'border-purple-400/20' },
  { id: 'done', title: 'مكتمل', color: 'bg-green-400/10 text-green-400', borderColor: 'border-green-400/20' },
];

const PRIORITY_CONFIG: Record<TaskPriority, { icon: React.ReactNode; color: string; label: string }> = {
  urgent: { icon: <AlertCircle size={12} />, color: 'text-red-400 bg-red-400/10', label: 'عاجل' },
  high: { icon: <AlertCircle size={12} />, color: 'text-orange-400 bg-orange-400/10', label: 'عالي' },
  medium: { icon: <Clock size={12} />, color: 'text-yellow-400 bg-yellow-400/10', label: 'متوسط' },
  low: { icon: <Circle size={12} />, color: 'text-gray-400 bg-gray-400/10', label: 'منخفض' },
};

export function TasksPage({ tasks, clients, users, isAdmin }: Props) {
  const { navigateToAddTask, navigateToTaskDetails } = useApp();
  const [draggingTask, setDraggingTask] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<TaskStatus | null>(null);

  const handleDragStart = (taskId: string) => setDraggingTask(taskId);

  const handleDragOver = (e: React.DragEvent, status: TaskStatus) => {
    e.preventDefault();
    setDragOverColumn(status);
  };

  const handleDrop = async (e: React.DragEvent, status: TaskStatus) => {
    e.preventDefault();
    if (!draggingTask) return;
    const task = tasks.find(t => t.id === draggingTask);
    if (task && task.status !== status) {
      await updateDocument('tasks', task.id, { status });
    }
    setDraggingTask(null);
    setDragOverColumn(null);
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAdmin) return alert('ليس لديك صلاحية');
    if (!confirm('هل أنت متأكد من حذف المهمة؟')) return;
    await deleteDocument('tasks', id);
  };

  const getClientName = (clientId?: string) => {
    if (!clientId) return null;
    return clients.find(c => c.id === clientId)?.name;
  };

  const getUserName = (userId?: string) => {
    if (!userId) return null;
    return users.find(u => (u.id || u.uid) === userId)?.name || users.find(u => (u.id || u.uid) === userId)?.displayName;
  };

  const subTaskProgress = (task: Task) => {
    if (!task.subTasks || task.subTasks.length === 0) return null;
    const completed = task.subTasks.filter(st => st.completed).length;
    return { completed, total: task.subTasks.length, percent: Math.round((completed / task.subTasks.length) * 100) };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-white text-2xl font-bold">المهام</h1>
        <button onClick={navigateToAddTask}
          className="bg-cyan-400 text-black px-5 py-2.5 rounded-xl font-bold hover:bg-cyan-300 transition-colors flex items-center gap-2">
          <Plus size={18} />
          مهمة جديدة
        </button>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {COLUMNS.map((column) => (
          <div
            key={column.id}
            className={`bg-[#111c2d] rounded-2xl border-2 transition-colors ${
              dragOverColumn === column.id ? column.borderColor : 'border-white/5'
            }`}
            onDragOver={(e) => handleDragOver(e, column.id)}
            onDrop={(e) => handleDrop(e, column.id)}
            onDragLeave={() => setDragOverColumn(null)}
          >
            {/* Column Header */}
            <div className="p-4 border-b border-white/5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${column.color.replace('text-', 'bg-').split(' ')[0]}`}></span>
                  <h3 className="text-white font-bold text-sm">{column.title}</h3>
                </div>
                <span className="bg-white/5 text-white/50 text-xs px-2 py-0.5 rounded-full font-medium">
                  {tasks.filter(t => t.status === column.id).length}
                </span>
              </div>
            </div>

            {/* Tasks */}
            <div className="p-3 space-y-3 min-h-[200px]">
              {tasks
                .filter((t) => t.status === column.id)
                .map((task) => {
                  const progress = subTaskProgress(task);
                  const clientName = getClientName(task.clientId);
                  const assigneeName = getUserName(task.assignedTo);
                  const priority = (task.priority as TaskPriority) || 'medium';
                  const priorityConfig = PRIORITY_CONFIG[priority];

                  return (
                    <div
                      key={task.id}
                      draggable
                      onDragStart={() => handleDragStart(task.id)}
                      onClick={() => navigateToTaskDetails(task)}
                      className={`bg-[#0b1422] rounded-xl p-4 border border-white/5 hover:border-cyan-400/20 hover:bg-[#0d1a2d] transition-all cursor-pointer group ${
                        draggingTask === task.id ? 'opacity-50' : ''
                      }`}
                    >
                      {/* Priority & Delete */}
                      <div className="flex items-center justify-between mb-2">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium ${priorityConfig.color}`}>
                          {priorityConfig.icon}
                          {priorityConfig.label}
                        </span>
                        {isAdmin && (
                          <button
                            onClick={(e) => handleDelete(task.id, e)}
                            className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 transition-opacity p-1"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>

                      {/* Title */}
                      <h4 className="text-white font-medium text-sm mb-2 line-clamp-2">{task.title}</h4>

                      {/* Description preview */}
                      {task.description && (
                        <p className="text-white/40 text-xs mb-3 line-clamp-2">{task.description}</p>
                      )}

                      {/* Subtasks progress */}
                      {progress && (
                        <div className="mb-3">
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="text-white/40">{progress.completed}/{progress.total}</span>
                            <span className="text-white/30">{progress.percent}%</span>
                          </div>
                          <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full bg-cyan-400 rounded-full transition-all" style={{ width: `${progress.percent}%` }} />
                          </div>
                        </div>
                      )}

                      {/* Meta */}
                      <div className="flex items-center gap-3 flex-wrap">
                        {assigneeName && (
                          <span className="text-white/40 text-xs flex items-center gap-1">
                            <User size={12} />
                            {assigneeName}
                          </span>
                        )}
                        {clientName && (
                          <span className="text-white/40 text-xs flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400/50"></span>
                            {clientName}
                          </span>
                        )}
                        {task.dueDate && (
                          <span className={`text-xs flex items-center gap-1 ${new Date(task.dueDate) < new Date() ? 'text-red-400' : 'text-white/40'}`}>
                            <Calendar size={12} />
                            {new Date(task.dueDate).toLocaleDateString('ar-SA')}
                          </span>
                        )}
                      </div>

                      {/* Tags */}
                      {task.tags && task.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {task.tags.map((tag, i) => (
                            <span key={i} className="px-1.5 py-0.5 rounded bg-white/5 text-white/40 text-[10px]">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
