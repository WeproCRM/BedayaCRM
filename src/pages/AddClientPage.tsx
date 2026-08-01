import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { addDocument } from '../services/firestore';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Plus, X } from 'lucide-react';
import type { Client, ClientStage } from '../types';

const STAGES: { value: ClientStage; label: string }[] = [
  { value: 'new', label: 'جديد' },
  { value: 'negotiation', label: 'تفاوض' },
  { value: 'in_progress', label: 'قيد العمل' },
  { value: 'previous', label: 'سابق' },
];

export function AddClientPage() {
  const { navigateBackToClients } = useApp();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [formData, setFormData] = useState<Partial<Client>>({
    name: '',
    email: '',
    phone: '',
    whatsapp: '',
    company: '',
    jobTitle: '',
    serviceRequired: '',
    stage: 'new',
    status: 'active',
    notes: '',
    tags: [],
    socialMedia: {},
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSocialChange = (platform: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      socialMedia: { ...prev.socialMedia, [platform]: value },
    }));
  };

  const addTag = () => {
    if (!tagInput.trim()) return;
    setFormData((prev) => ({
      ...prev,
      tags: [...(prev.tags || []), tagInput.trim()],
    }));
    setTagInput('');
  };

  const removeTag = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags?.filter((_, i) => i !== index) || [],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim()) {
      alert('اسم العميل مطلوب');
      return;
    }

    setIsSubmitting(true);
    try {
      await addDocument('clients', formData);
      navigateBackToClients();
    } catch (error) {
      console.error(error);
      alert('حدث خطأ أثناء حفظ العميل');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-white text-2xl font-bold mb-6">إضافة عميل جديد</h1>

      <form onSubmit={handleSubmit} className="bg-[#111c2d] rounded-2xl p-6 border border-white/5 space-y-6">
        {/* Basic Info */}
        <div>
          <h3 className="text-white/70 text-sm font-medium mb-3 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
            المعلومات الأساسية
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField label="الاسم *" name="name" value={formData.name} onChange={handleChange} required />
            <InputField label="البريد الإلكتروني" name="email" type="email" value={formData.email} onChange={handleChange} />
            <InputField label="رقم الهاتف" name="phone" value={formData.phone} onChange={handleChange} />
            <InputField label="واتس أب" name="whatsapp" value={formData.whatsapp} onChange={handleChange} />
            <InputField label="الشركة" name="company" value={formData.company} onChange={handleChange} />
            <InputField label="المسمى الوظيفي" name="jobTitle" value={formData.jobTitle} onChange={handleChange} />
          </div>
        </div>

        {/* Service & Stage */}
        <div>
          <h3 className="text-white/70 text-sm font-medium mb-3 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
            الخدمة والمرحلة
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField label="الخدمة المطلوبة" name="serviceRequired" value={formData.serviceRequired} onChange={handleChange} />
            <div>
              <label className="block text-white/70 text-sm mb-2">مرحلة العلاقة</label>
              <select name="stage" value={formData.stage} onChange={handleChange}
                className="w-full bg-[#0b1422] border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-cyan-400/50">
                {STAGES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-white/70 text-sm mb-2">الحالة</label>
              <select name="status" value={formData.status} onChange={handleChange}
                className="w-full bg-[#0b1422] border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-cyan-400/50">
                <option value="active">نشط</option>
                <option value="inactive">غير نشط</option>
                <option value="lead">Lead</option>
              </select>
            </div>
          </div>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="text-white/70 text-sm font-medium mb-3 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
            حسابات التواصل الاجتماعي
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SocialInput label="فيسبوك" icon="📘" value={formData.socialMedia?.facebook || ''} onChange={(v) => handleSocialChange('facebook', v)} />
            <SocialInput label="إنستغرام" icon="📷" value={formData.socialMedia?.instagram || ''} onChange={(v) => handleSocialChange('instagram', v)} />
            <SocialInput label="تويتر / X" icon="🐦" value={formData.socialMedia?.twitter || ''} onChange={(v) => handleSocialChange('twitter', v)} />
            <SocialInput label="لينكد إن" icon="💼" value={formData.socialMedia?.linkedin || ''} onChange={(v) => handleSocialChange('linkedin', v)} />
            <SocialInput label="تيك توك" icon="🎵" value={formData.socialMedia?.tiktok || ''} onChange={(v) => handleSocialChange('tiktok', v)} />
            <SocialInput label="تيليجرام" icon="✈️" value={formData.socialMedia?.telegram || ''} onChange={(v) => handleSocialChange('telegram', v)} />
          </div>
        </div>

        {/* Tags */}
        <div>
          <h3 className="text-white/70 text-sm font-medium mb-3 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span>
            العلامات (Tags)
          </h3>
          <div className="flex gap-2 mb-3">
            <input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              placeholder="أضف علامة..."
              className="flex-1 bg-[#0b1422] border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-white/40 outline-none focus:border-cyan-400/50"
            />
            <button type="button" onClick={addTag} className="bg-cyan-400/10 text-cyan-400 px-4 rounded-xl hover:bg-cyan-400/20 transition-colors">
              <Plus size={18} />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.tags?.map((tag, i) => (
              <span key={i} className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-cyan-400/10 text-cyan-400 text-sm">
                {tag}
                <button type="button" onClick={() => removeTag(i)} className="hover:text-cyan-300">
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div>
          <h3 className="text-white/70 text-sm font-medium mb-3 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-yellow-400"></span>
            ملاحظات
          </h3>
          <textarea name="notes" value={formData.notes} onChange={handleChange} rows={4}
            className="w-full bg-[#0b1422] border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-cyan-400/50 resize-none" />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-4 border-t border-white/5">
          <button type="submit" disabled={isSubmitting}
            className="flex-1 bg-cyan-400 text-black font-bold py-3 rounded-xl hover:bg-cyan-300 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
            {isSubmitting ? <LoadingSpinner size="sm" /> : 'حفظ العميل'}
          </button>
          <button type="button" onClick={navigateBackToClients}
            className="px-6 py-3 border border-white/10 text-white rounded-xl hover:bg-white/5 transition-colors">
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
      <input {...props}
        className="w-full bg-[#0b1422] border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-cyan-400/50 transition-colors placeholder-white/30" />
    </div>
  );
}

function SocialInput({ label, icon, value, onChange }: { label: string; icon: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-lg w-6">{icon}</span>
      <div className="flex-1">
        <label className="block text-white/50 text-xs mb-1">{label}</label>
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="رابط الحساب"
          className="w-full bg-[#0b1422] border border-white/10 rounded-xl px-3 py-2 text-white text-sm outline-none focus:border-cyan-400/50 placeholder-white/20"
        />
      </div>
    </div>
  );
}
