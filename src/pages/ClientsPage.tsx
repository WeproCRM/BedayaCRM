import { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { deleteDocument } from '../services/firestore';
import { importExportService } from '../services/userService';
import { formatDate } from '../utils';
import { Download, Upload, FileJson, FileSpreadsheet, Search, Filter, X } from 'lucide-react';
import type { Client, User, ClientStage } from '../types';

interface Props {
  clients: Client[];
  isAdmin: boolean;
  currentUser: User | null;
}

const STAGE_LABELS: Record<ClientStage, { label: string; color: string }> = {
  previous: { label: 'سابق', color: 'bg-gray-400/10 text-gray-400' },
  in_progress: { label: 'قيد العمل', color: 'bg-blue-400/10 text-blue-400' },
  negotiation: { label: 'تفاوض', color: 'bg-yellow-400/10 text-yellow-400' },
  new: { label: 'جديد', color: 'bg-green-400/10 text-green-400' },
};

export function ClientsPage({ clients, isAdmin }: Props) {
  const { navigateToClientDetails, navigateToEditClient, navigateToAddClient } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [stageFilter, setStageFilter] = useState<ClientStage | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importType, setImportType] = useState<'json' | 'csv'>('json');
  const [importData, setImportData] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredClients = clients.filter((client) => {
    const matchesSearch =
      client.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.phone?.includes(searchQuery) ||
      client.whatsapp?.includes(searchQuery);
    const matchesStage = stageFilter === 'all' || client.stage === stageFilter;
    const matchesStatus = statusFilter === 'all' || client.status === statusFilter;
    return matchesSearch && matchesStage && matchesStatus;
  });

  const handleDelete = async (id: string) => {
    if (!isAdmin) { alert('ليس لديك صلاحية'); return; }
    if (!window.confirm('هل أنت متأكد من حذف العميل؟')) return;
    setIsDeleting(id);
    try { await deleteDocument('clients', id); } catch { alert('حدث خطأ أثناء الحذف'); } finally { setIsDeleting(null); }
  };

  const handleExportJSON = () => {
    const json = importExportService.exportClientsToJSON(clients);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `clients-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportCSV = () => {
    const csv = importExportService.exportClientsToCSV(clients);
    const blob = new Blob([\`\ufeff${csv}\`], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `clients-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setImportData(event.target?.result as string);
      if (file.name.endsWith('.csv')) setImportType('csv');
      else if (file.name.endsWith('.json')) setImportType('json');
    };
    reader.readAsText(file);
  };

  const handleImport = async () => {
    if (!importData.trim()) return;
    setIsImporting(true);
    try {
      const count = importType === 'json'
        ? await importExportService.importClientsFromJSON(importData, currentUser?.uid || '')
        : await importExportService.importClientsFromCSV(importData, currentUser?.uid || '');
      alert(`تم استيراد ${count} عميل بنجاح`);
      setShowImportModal(false);
      setImportData('');
    } catch (err) {
      alert('حدث خطأ أثناء الاستيراد: ' + (err as Error).message);
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-white text-2xl font-bold">العملاء</h1>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowImportModal(true)} className="bg-white/5 text-white/70 px-4 py-2.5 rounded-xl font-medium hover:bg-white/10 transition-colors flex items-center gap-2">
            <Upload size={16} />
            استيراد
          </button>
          <div className="relative group">
            <button className="bg-white/5 text-white/70 px-4 py-2.5 rounded-xl font-medium hover:bg-white/10 transition-colors flex items-center gap-2">
              <Download size={16} />
              تصدير
            </button>
            <div className="absolute left-0 top-full mt-2 bg-[#111c2d] border border-white/10 rounded-xl p-2 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 min-w-[160px]">
              <button onClick={handleExportJSON} className="w-full text-right px-3 py-2 rounded-lg text-white/70 hover:bg-white/5 hover:text-white text-sm flex items-center gap-2 transition-colors">
                <FileJson size={14} /> JSON
              </button>
              <button onClick={handleExportCSV} className="w-full text-right px-3 py-2 rounded-lg text-white/70 hover:bg-white/5 hover:text-white text-sm flex items-center gap-2 transition-colors">
                <FileSpreadsheet size={14} /> Excel (CSV)
              </button>
            </div>
          </div>
          <button onClick={navigateToAddClient} className="bg-cyan-400 text-black px-5 py-2.5 rounded-xl font-bold hover:bg-cyan-300 transition-colors">
            ➕ إضافة عميل جديد
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute right-3 top-3 text-white/30" size={18} />
          <input
            type="text"
            placeholder="البحث في العملاء..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#111c2d] border border-white/10 rounded-xl pr-10 pl-4 py-3 text-white placeholder-white/40 outline-none focus:border-cyan-400/50"
          />
        </div>
        <select value={stageFilter} onChange={(e) => setStageFilter(e.target.value as ClientStage | 'all')}
          className="bg-[#111c2d] border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-cyan-400/50">
          <option value="all">جميع المراحل</option>
          <option value="new">جديد</option>
          <option value="negotiation">تفاوض</option>
          <option value="in_progress">قيد العمل</option>
          <option value="previous">سابق</option>
        </select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-[#111c2d] border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-cyan-400/50">
          <option value="all">جميع الحالات</option>
          <option value="active">نشط</option>
          <option value="inactive">غير نشط</option>
          <option value="lead">Lead</option>
        </select>
      </div>

      {/* Clients Grid - Notion Style */}
      {filteredClients.length === 0 ? (
        <div className="text-center py-16 bg-[#111c2d] rounded-2xl border border-white/5">
          <p className="text-white/50 text-lg">لا يوجد عملاء مطابقين للبحث</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredClients.map((client) => (
            <div
              key={client.id}
              onClick={() => navigateToClientDetails(client)}
              className="bg-[#111c2d] rounded-2xl p-5 border border-white/5 hover:border-cyan-400/30 hover:bg-[#162032] transition-all cursor-pointer group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-400/10 flex items-center justify-center text-cyan-400 font-bold text-lg">
                  {client.name?.charAt(0).toUpperCase()}
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${STAGE_LABELS[client.stage]?.color || STAGE_LABELS.new.color}`}>
                  {STAGE_LABELS[client.stage]?.label || 'جديد'}
                </span>
              </div>

              <h3 className="text-white font-bold mb-1 truncate">{client.name}</h3>
              <p className="text-white/50 text-sm mb-3 truncate">{client.company || 'بدون شركة'}</p>

              <div className="space-y-2 mb-4">
                {client.email && (
                  <p className="text-white/40 text-xs flex items-center gap-1.5">
                    <span>📧</span> {client.email}
                  </p>
                )}
                {client.phone && (
                  <p className="text-white/40 text-xs flex items-center gap-1.5">
                    <span>📱</span> {client.phone}
                  </p>
                )}
                {client.whatsapp && (
                  <p className="text-white/40 text-xs flex items-center gap-1.5">
                    <span>💬</span> {client.whatsapp}
                  </p>
                )}
                {client.serviceRequired && (
                  <p className="text-white/40 text-xs flex items-center gap-1.5">
                    <span>🎯</span> {client.serviceRequired}
                  </p>
                )}
              </div>

              {client.tags && client.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {client.tags.map((tag, i) => (
                    <span key={i} className="px-2 py-0.5 rounded-md bg-white/5 text-white/50 text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between pt-3 border-t border-white/5">
                <span className="text-white/30 text-xs">{formatDate(client.createdAt)}</span>
                {isAdmin && (
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => { e.stopPropagation(); navigateToEditClient(client); }}
                      className="text-yellow-400 hover:text-yellow-300 text-xs font-medium"
                    >
                      تعديل
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDelete(client.id); }}
                      disabled={isDeleting === client.id}
                      className="text-red-400 hover:text-red-300 text-xs font-medium disabled:opacity-50"
                    >
                      {isDeleting === client.id ? '...' : 'حذف'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#111c2d] border border-white/10 rounded-2xl w-full max-w-lg p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">استيراد العملاء</h2>
              <button onClick={() => setShowImportModal(false)} className="text-white/50 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setImportType('json')}
                className={`flex-1 py-2 rounded-xl text-sm font-medium transition ${importType === 'json' ? 'bg-cyan-400 text-black' : 'bg-white/5 text-white/70 hover:bg-white/10'}`}
              >
                JSON
              </button>
              <button
                onClick={() => setImportType('csv')}
                className={`flex-1 py-2 rounded-xl text-sm font-medium transition ${importType === 'csv' ? 'bg-cyan-400 text-black' : 'bg-white/5 text-white/70 hover:bg-white/10'}`}
              >
                CSV / Excel
              </button>
            </div>

            <div className="border-2 border-dashed border-white/10 rounded-xl p-6 text-center hover:border-cyan-400/30 transition-colors cursor-pointer"
              onClick={() => fileInputRef.current?.click()}>
              <Upload className="mx-auto mb-2 text-white/30" size={32} />
              <p className="text-white/50 text-sm">اضغط لاختيار الملف أو اسحب الملف هنا</p>
              <p className="text-white/30 text-xs mt-1">{importType === 'json' ? '.json' : '.csv, .xlsx'}</p>
              <input ref={fileInputRef} type="file" accept={importType === 'json' ? '.json' : '.csv,.xlsx'} onChange={handleFileUpload} className="hidden" />
            </div>

            {importData && (
              <div className="bg-[#0b1422] rounded-xl p-3 border border-white/5">
                <p className="text-white/50 text-xs mb-1">معاينة البيانات:</p>
                <pre className="text-white/40 text-xs max-h-32 overflow-y-auto">{importData.slice(0, 500)}{importData.length > 500 ? '...' : ''}</pre>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-2">
              <button onClick={() => setShowImportModal(false)} className="px-4 py-2 rounded-xl text-sm font-medium text-white/70 hover:bg-white/5 transition">
                إلغاء
              </button>
              <button
                onClick={handleImport}
                disabled={!importData || isImporting}
                className="px-5 py-2 bg-cyan-400 text-black rounded-xl text-sm font-bold hover:bg-cyan-300 transition disabled:opacity-50"
              >
                {isImporting ? 'جاري الاستيراد...' : 'استيراد'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
