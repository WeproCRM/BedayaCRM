{\rtf1\ansi\ansicpg1252\cocoartf2870
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\paperw11900\paperh16840\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\pard\tx566\tx1133\tx1700\tx2267\tx2834\tx3401\tx3968\tx4535\tx5102\tx5669\tx6236\tx6803\pardirnatural\partightenfactor0

\f0\fs24 \cf0 import \{ useState \} from 'react';\
import \{ useApp \} from '../context/AppContext';\
import \{ deleteDocument \} from '../services/firestore';\
import \{ formatDate \} from '../utils';\
import type \{ Client, User \} from '../types';\
\
interface Props \{\
  clients: Client[];\
  isAdmin: boolean;\
  currentUser: User | null;\
\}\
\
export function ClientsPage(\{ clients, isAdmin \}: Props) \{\
  const \{ navigateToClientDetails, navigateToEditClient, navigateToAddClient \} = useApp();\
  const [searchQuery, setSearchQuery] = useState('');\
  const [statusFilter, setStatusFilter] = useState<string>('all');\
  const [isDeleting, setIsDeleting] = useState<string | null>(null);\
\
  const filteredClients = clients.filter((client) => \{\
    const matchesSearch =\
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||\
      client.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||\
      client.company?.toLowerCase().includes(searchQuery.toLowerCase());\
    const matchesStatus = statusFilter === 'all' || client.status === statusFilter;\
    return matchesSearch && matchesStatus;\
  \});\
\
  const handleDelete = async (id: string) => \{\
    if (!isAdmin) \{ alert('\uc0\u1604 \u1610 \u1587  \u1604 \u1583 \u1610 \u1603  \u1589 \u1604 \u1575 \u1581 \u1610 \u1577 '); return; \}\
    if (!window.confirm('\uc0\u1607 \u1604  \u1571 \u1606 \u1578  \u1605 \u1578 \u1571 \u1603 \u1583  \u1605 \u1606  \u1581 \u1584 \u1601  \u1575 \u1604 \u1593 \u1605 \u1610 \u1604 \u1567 ')) return;\
    setIsDeleting(id);\
    try \{ await deleteDocument('clients', id); \} catch \{ alert('\uc0\u1581 \u1583 \u1579  \u1582 \u1591 \u1571  \u1571 \u1579 \u1606 \u1575 \u1569  \u1575 \u1604 \u1581 \u1584 \u1601 '); \} finally \{ setIsDeleting(null); \}\
  \};\
\
  return (\
    <div className="space-y-6">\
      <div className="flex flex-wrap items-center justify-between gap-4">\
        <h1 className="text-white text-2xl font-bold">\uc0\u1575 \u1604 \u1593 \u1605 \u1604 \u1575 \u1569 </h1>\
        <button onClick=\{navigateToAddClient\} className="bg-cyan-400 text-black px-5 py-2.5 rounded-xl font-bold hover:bg-cyan-300 transition-colors">\
          \uc0\u10133  \u1573 \u1590 \u1575 \u1601 \u1577  \u1593 \u1605 \u1610 \u1604  \u1580 \u1583 \u1610 \u1583 \
        </button>\
      </div>\
\
      <div className="flex flex-wrap gap-3">\
        <input type="text" placeholder="\uc0\u55357 \u56589  \u1575 \u1604 \u1576 \u1581 \u1579  \u1601 \u1610  \u1575 \u1604 \u1593 \u1605 \u1604 \u1575 \u1569 ..." value=\{searchQuery\} onChange=\{(e) => setSearchQuery(e.target.value)\}\
          className="flex-1 min-w-[200px] bg-[#111c2d] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/40 outline-none focus:border-cyan-400/50" />\
        <select value=\{statusFilter\} onChange=\{(e) => setStatusFilter(e.target.value)\}\
          className="bg-[#111c2d] border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-cyan-400/50">\
          <option value="all">\uc0\u1580 \u1605 \u1610 \u1593  \u1575 \u1604 \u1581 \u1575 \u1604 \u1575 \u1578 </option>\
          <option value="active">\uc0\u1606 \u1588 \u1591 </option>\
          <option value="inactive">\uc0\u1594 \u1610 \u1585  \u1606 \u1588 \u1591 </option>\
          <option value="lead">Lead</option>\
        </select>\
      </div>\
\
      <div className="bg-[#111c2d] rounded-2xl border border-white/5 overflow-hidden">\
        \{filteredClients.length === 0 ? (\
          <div className="text-center py-16"><p className="text-white/50 text-lg">\uc0\u1604 \u1575  \u1610 \u1608 \u1580 \u1583  \u1593 \u1605 \u1604 \u1575 \u1569  \u1605 \u1591 \u1575 \u1576 \u1602 \u1610 \u1606  \u1604 \u1604 \u1576 \u1581 \u1579 </p></div>\
        ) : (\
          <div className="overflow-x-auto">\
            <table className="w-full">\
              <thead>\
                <tr className="border-b border-white/5">\
                  <th className="text-right text-white/50 font-medium px-6 py-4">\uc0\u1575 \u1604 \u1593 \u1605 \u1610 \u1604 </th>\
                  <th className="text-right text-white/50 font-medium px-6 py-4">\uc0\u1575 \u1604 \u1588 \u1585 \u1603 \u1577 </th>\
                  <th className="text-right text-white/50 font-medium px-6 py-4">\uc0\u1575 \u1604 \u1581 \u1575 \u1604 \u1577 </th>\
                  <th className="text-right text-white/50 font-medium px-6 py-4">\uc0\u1578 \u1575 \u1585 \u1610 \u1582  \u1575 \u1604 \u1573 \u1590 \u1575 \u1601 \u1577 </th>\
                  <th className="text-right text-white/50 font-medium px-6 py-4">\uc0\u1575 \u1604 \u1573 \u1580 \u1585 \u1575 \u1569 \u1575 \u1578 </th>\
                </tr>\
              </thead>\
              <tbody>\
                \{filteredClients.map((client) => (\
                  <tr key=\{client.id\} className="border-b border-white/5 hover:bg-white/5 transition-colors">\
                    <td className="px-6 py-4">\
                      <div>\
                        <p className="text-white font-medium">\{client.name\}</p>\
                        <p className="text-white/50 text-sm">\{client.email\}</p>\
                      </div>\
                    </td>\
                    <td className="px-6 py-4 text-white/70">\{client.company || '-'\}</td>\
                    <td className="px-6 py-4"><StatusBadge status=\{client.status\} /></td>\
                    <td className="px-6 py-4 text-white/50 text-sm">\{formatDate(client.createdAt)\}</td>\
                    <td className="px-6 py-4">\
                      <div className="flex items-center gap-2">\
                        <button onClick=\{() => navigateToClientDetails(client)\} className="text-cyan-400 hover:text-cyan-300 text-sm font-medium">\uc0\u1593 \u1585 \u1590 </button>\
                        \{isAdmin && (\
                          <>\
                            <span className="text-white/20">|</span>\
                            <button onClick=\{() => navigateToEditClient(client)\} className="text-yellow-400 hover:text-yellow-300 text-sm font-medium">\uc0\u1578 \u1593 \u1583 \u1610 \u1604 </button>\
                            <span className="text-white/20">|</span>\
                            <button onClick=\{() => handleDelete(client.id)\} disabled=\{isDeleting === client.id\} className="text-red-400 hover:text-red-300 text-sm font-medium disabled:opacity-50">\
                              \{isDeleting === client.id ? '...' : '\uc0\u1581 \u1584 \u1601 '\}\
                            </button>\
                          </>\
                        )\}\
                      </div>\
                    </td>\
                  </tr>\
                ))\}\
              </tbody>\
            </table>\
          </div>\
        )\}\
      </div>\
    </div>\
  );\
\}\
\
function StatusBadge(\{ status \}: \{ status?: string \}) \{\
  const styles: Record<string, string> = \{\
    active: 'bg-green-400/10 text-green-400',\
    inactive: 'bg-red-400/10 text-red-400',\
    lead: 'bg-yellow-400/10 text-yellow-400',\
  \};\
  const labels: Record<string, string> = \{ active: '\uc0\u1606 \u1588 \u1591 ', inactive: '\u1594 \u1610 \u1585  \u1606 \u1588 \u1591 ', lead: 'Lead' \};\
  return (\
    <span className=\{`px-3 py-1 rounded-full text-xs font-medium $\{styles[status || 'lead']\}`\}>\
      \{labels[status || 'lead']\}\
    </span>\
  );\
\}}
