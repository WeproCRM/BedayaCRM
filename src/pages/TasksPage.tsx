{\rtf1\ansi\ansicpg1252\cocoartf2870
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\paperw11900\paperh16840\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\pard\tx566\tx1133\tx1700\tx2267\tx2834\tx3401\tx3968\tx4535\tx5102\tx5669\tx6236\tx6803\pardirnatural\partightenfactor0

\f0\fs24 \cf0 import \{ useState \} from 'react';\
import \{ addDocument, updateDocument, deleteDocument \} from '../services/firestore';\
import \{ LoadingSpinner \} from '../components/LoadingSpinner';\
import type \{ Task, Client, User \} from '../types';\
\
interface Props \{\
  tasks: Task[];\
  clients: Client[];\
  users: User[];\
  currentUser: User | null;\
  isAdmin: boolean;\
\}\
\
export function TasksPage(\{ tasks, clients, currentUser, isAdmin \}: Props) \{\
  const [isAdding, setIsAdding] = useState(false);\
  const [newTaskTitle, setNewTaskTitle] = useState('');\
  const [selectedClient, setSelectedClient] = useState('');\
  const [isSubmitting, setIsSubmitting] = useState(false);\
\
  const handleAddTask = async (e: React.FormEvent) => \{\
    e.preventDefault();\
    if (!newTaskTitle.trim()) return;\
\
    setIsSubmitting(true);\
    try \{\
      await addDocument('tasks', \{\
        title: newTaskTitle,\
        clientId: selectedClient || undefined,\
        status: 'To Do',\
        createdBy: currentUser?.name || '\uc0\u1605 \u1580 \u1607 \u1608 \u1604 ',\
        createdByEmail: currentUser?.email || '',\
      \});\
      setNewTaskTitle('');\
      setSelectedClient('');\
      setIsAdding(false);\
    \} finally \{\
      setIsSubmitting(false);\
    \}\
  \};\
\
  const handleStatusChange = async (task: Task, newStatus: Task['status']) => \{\
    await updateDocument('tasks', task.id, \{ status: newStatus \});\
  \};\
\
  const handleDelete = async (id: string) => \{\
    if (!isAdmin) return alert('\uc0\u1604 \u1610 \u1587  \u1604 \u1583 \u1610 \u1603  \u1589 \u1604 \u1575 \u1581 \u1610 \u1577 ');\
    if (!confirm('\uc0\u1607 \u1604  \u1571 \u1606 \u1578  \u1605 \u1578 \u1571 \u1603 \u1583 \u1567 ')) return;\
    await deleteDocument('tasks', id);\
  \};\
\
  const columns: Task['status'][] = ['To Do', 'In Progress', 'Review', 'Done'];\
\
  return (\
    <div className="space-y-6">\
      <div className="flex items-center justify-between">\
        <h1 className="text-white text-2xl font-bold">\uc0\u1575 \u1604 \u1605 \u1607 \u1575 \u1605 </h1>\
        <button onClick=\{() => setIsAdding(!isAdding)\} className="bg-cyan-400 text-black px-5 py-2.5 rounded-xl font-bold hover:bg-cyan-300 transition-colors">\
          \{isAdding ? '\uc0\u1573 \u1604 \u1594 \u1575 \u1569 ' : '\u10133  \u1605 \u1607 \u1605 \u1577  \u1580 \u1583 \u1610 \u1583 \u1577 '\}\
        </button>\
      </div>\
\
      \{isAdding && (\
        <form onSubmit=\{handleAddTask\} className="bg-[#111c2d] rounded-2xl p-6 border border-white/5 flex flex-wrap gap-4">\
          <input value=\{newTaskTitle\} onChange=\{(e) => setNewTaskTitle(e.target.value)\} placeholder="\uc0\u1593 \u1606 \u1608 \u1575 \u1606  \u1575 \u1604 \u1605 \u1607 \u1605 \u1577 " className="flex-1 min-w-[200px] bg-[#0b1422] border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-cyan-400/50" required />\
          <select value=\{selectedClient\} onChange=\{(e) => setSelectedClient(e.target.value)\} className="bg-[#0b1422] border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-cyan-400/50">\
            <option value="">\uc0\u1576 \u1583 \u1608 \u1606  \u1593 \u1605 \u1610 \u1604 </option>\
            \{clients.map((c) => <option key=\{c.id\} value=\{c.id\}>\{c.name\}</option>)\}\
          </select>\
          <button type="submit" disabled=\{isSubmitting\} className="bg-cyan-400 text-black font-bold px-6 py-3 rounded-xl hover:bg-cyan-300 disabled:opacity-50">\
            \{isSubmitting ? <LoadingSpinner size="sm" /> : '\uc0\u1573 \u1590 \u1575 \u1601 \u1577 '\}\
          </button>\
        </form>\
      )\}\
\
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">\
        \{columns.map((status) => (\
          <div key=\{status\} className="bg-[#111c2d] rounded-2xl p-4 border border-white/5">\
            <h3 className="text-white font-bold mb-4 pb-2 border-b border-white/5">\{status\}</h3>\
            <div className="space-y-3">\
              \{tasks.filter((t) => t.status === status).map((task) => (\
                <div key=\{task.id\} className="bg-white/5 rounded-xl p-3 hover:bg-white/10 transition-colors">\
                  <p className="text-white text-sm font-medium mb-2">\{task.title\}</p>\
                  <div className="flex flex-wrap gap-2">\
                    \{columns.map((s) => (\
                      <button key=\{s\} onClick=\{() => handleStatusChange(task, s)\} className=\{`text-xs px-2 py-1 rounded-lg transition-colors $\{task.status === s ? 'bg-cyan-400 text-black' : 'bg-white/5 text-white/50 hover:bg-white/10'\}`\}>\
                        \{s\}\
                      </button>\
                    ))\}\
                    \{isAdmin && (\
                      <button onClick=\{() => handleDelete(task.id)\} className="text-xs px-2 py-1 rounded-lg bg-red-400/10 text-red-400 hover:bg-red-400/20">\uc0\u1581 \u1584 \u1601 </button>\
                    )\}\
                  </div>\
                </div>\
              ))\}\
            </div>\
          </div>\
        ))\}\
      </div>\
    </div>\
  );\
\}}
