import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { updateDocument } from '../services/firestore';
import { LoadingSpinner } from '../components/LoadingSpinner';
import type { Client } from '../types';

interface Props {
  client: Client;
}

export function EditClientPage({ client }: Props) {
  const { navigateBackToClients } = useApp();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<Partial<Client>>({
    name: client.name,
    email: client.email,
    phone: client.phone,
    company: client.company,
    status: client.status,
    notes: client.notes,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim()) {
      alert('اسم العميل مطلوب');
      return;
    }

    setIsSubmitting(true);
    try {
      await updateDocument('clients', client.id, formData);
      navigateBackToClients();
    } catch (error) {
      console.error(error);
      alert('حدث خطأ أثناء تحديث العميل');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-white text-2xl font-bold mb-6">تعديل العميل</h1>
      <form onSubmit={handleSubmit} className="bg-[#111c2d] rounded-2xl p-6 border border-white/5 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField label="الاسم *" name="name" value={formData.name} onChange={handleChange} required />
          <InputField label="البريد الإلكتروني" name="email" type="email" value={formData.email} onChange={handleChange} />
          <InputField label="الهاتف" name="phone" value={formData.phone} onChange={handleChange} />
          <InputField label="الشركة" name="company" value={formData.company} onChange={handleChange} />
        </div>

        <div>
          <label className="block text-white/70 text-sm mb-2">الحالة</label>
          <select name="status" value={formData.status} onChange={handleChange} className="w-full bg-[#0b1422] border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-cyan-400/50">
            <option value="lead">Lead</option>
            <option value="active">نشط</option>
            <option value="inactive">غير نشط</option>
          </select>
        </div>

        <div>
          <label className="block text-white/70 text-sm mb-2">ملاحظات</label>
          <textarea name="notes" value={formData.notes} onChange={handleChange} rows={4} className="w-full bg-[#0b1422] border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-cyan-400/50 resize-none" />
        </div>

        <div className="flex items-center gap-3 pt-4">
          <button type="submit" disabled={isSubmitting} className="flex-1 bg-cyan-400 text-black font-bold py-3 rounded-xl hover:bg-cyan-300 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
            {isSubmitting ? <LoadingSpinner size="sm" /> : 'تحديث العميل'}
          </button>
          <button type="button" onClick={navigateBackToClients} className="px-6 py-3 border border-white/10 text-white rounded-xl hover:bg-white/5 transition-colors">
            إلغاء
          </button>
        </div>
      </form>
    </div>
  );
}

function InputField({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label className="block text-white/70 text-sm mb-2">{label}</label>
      <input {...props} className="w-full bg-[#0b1422] border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-cyan-400/50 transition-colors" />
    </div>
  );
}