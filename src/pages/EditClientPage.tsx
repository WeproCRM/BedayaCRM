{\rtf1\ansi\ansicpg1252\cocoartf2870
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\paperw11900\paperh16840\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\pard\tx566\tx1133\tx1700\tx2267\tx2834\tx3401\tx3968\tx4535\tx5102\tx5669\tx6236\tx6803\pardirnatural\partightenfactor0

\f0\fs24 \cf0 import \{ useState \} from 'react';\
import \{ useApp \} from '../context/AppContext';\
import \{ updateDocument \} from '../services/firestore';\
import \{ LoadingSpinner \} from '../components/LoadingSpinner';\
import type \{ Client \} from '../types';\
\
interface Props \{\
  client: Client;\
\}\
\
export function EditClientPage(\{ client \}: Props) \{\
  const \{ navigateBackToClients \} = useApp();\
  const [isSubmitting, setIsSubmitting] = useState(false);\
  const [formData, setFormData] = useState<Partial<Client>>(\{\
    name: client.name,\
    email: client.email,\
    phone: client.phone,\
    company: client.company,\
    status: client.status,\
    notes: client.notes,\
  \});\
\
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => \{\
    setFormData((prev) => (\{ ...prev, [e.target.name]: e.target.value \}));\
  \};\
\
  const handleSubmit = async (e: React.FormEvent) => \{\
    e.preventDefault();\
    if (!formData.name?.trim()) \{\
      alert('\uc0\u1575 \u1587 \u1605  \u1575 \u1604 \u1593 \u1605 \u1610 \u1604  \u1605 \u1591 \u1604 \u1608 \u1576 ');\
      return;\
    \}\
\
    setIsSubmitting(true);\
    try \{\
      await updateDocument('clients', client.id, formData);\
      navigateBackToClients();\
    \} catch (error) \{\
      console.error(error);\
      alert('\uc0\u1581 \u1583 \u1579  \u1582 \u1591 \u1571  \u1571 \u1579 \u1606 \u1575 \u1569  \u1578 \u1581 \u1583 \u1610 \u1579  \u1575 \u1604 \u1593 \u1605 \u1610 \u1604 ');\
    \} finally \{\
      setIsSubmitting(false);\
    \}\
  \};\
\
  return (\
    <div className="max-w-2xl mx-auto">\
      <h1 className="text-white text-2xl font-bold mb-6">\uc0\u1578 \u1593 \u1583 \u1610 \u1604  \u1575 \u1604 \u1593 \u1605 \u1610 \u1604 </h1>\
      <form onSubmit=\{handleSubmit\} className="bg-[#111c2d] rounded-2xl p-6 border border-white/5 space-y-4">\
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">\
          <InputField label="\uc0\u1575 \u1604 \u1575 \u1587 \u1605  *" name="name" value=\{formData.name\} onChange=\{handleChange\} required />\
          <InputField label="\uc0\u1575 \u1604 \u1576 \u1585 \u1610 \u1583  \u1575 \u1604 \u1573 \u1604 \u1603 \u1578 \u1585 \u1608 \u1606 \u1610 " name="email" type="email" value=\{formData.email\} onChange=\{handleChange\} />\
          <InputField label="\uc0\u1575 \u1604 \u1607 \u1575 \u1578 \u1601 " name="phone" value=\{formData.phone\} onChange=\{handleChange\} />\
          <InputField label="\uc0\u1575 \u1604 \u1588 \u1585 \u1603 \u1577 " name="company" value=\{formData.company\} onChange=\{handleChange\} />\
        </div>\
\
        <div>\
          <label className="block text-white/70 text-sm mb-2">\uc0\u1575 \u1604 \u1581 \u1575 \u1604 \u1577 </label>\
          <select name="status" value=\{formData.status\} onChange=\{handleChange\} className="w-full bg-[#0b1422] border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-cyan-400/50">\
            <option value="lead">Lead</option>\
            <option value="active">\uc0\u1606 \u1588 \u1591 </option>\
            <option value="inactive">\uc0\u1594 \u1610 \u1585  \u1606 \u1588 \u1591 </option>\
          </select>\
        </div>\
\
        <div>\
          <label className="block text-white/70 text-sm mb-2">\uc0\u1605 \u1604 \u1575 \u1581 \u1592 \u1575 \u1578 </label>\
          <textarea name="notes" value=\{formData.notes\} onChange=\{handleChange\} rows=\{4\} className="w-full bg-[#0b1422] border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-cyan-400/50 resize-none" />\
        </div>\
\
        <div className="flex items-center gap-3 pt-4">\
          <button type="submit" disabled=\{isSubmitting\} className="flex-1 bg-cyan-400 text-black font-bold py-3 rounded-xl hover:bg-cyan-300 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">\
            \{isSubmitting ? <LoadingSpinner size="sm" /> : '\uc0\u1578 \u1581 \u1583 \u1610 \u1579  \u1575 \u1604 \u1593 \u1605 \u1610 \u1604 '\}\
          </button>\
          <button type="button" onClick=\{navigateBackToClients\} className="px-6 py-3 border border-white/10 text-white rounded-xl hover:bg-white/5 transition-colors">\
            \uc0\u1573 \u1604 \u1594 \u1575 \u1569 \
          </button>\
        </div>\
      </form>\
    </div>\
  );\
\}\
\
function InputField(\{ label, ...props \}: \{ label: string \} & React.InputHTMLAttributes<HTMLInputElement>) \{\
  return (\
    <div>\
      <label className="block text-white/70 text-sm mb-2">\{label\}</label>\
      <input \{...props\} className="w-full bg-[#0b1422] border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-cyan-400/50 transition-colors" />\
    </div>\
  );\
\}}
