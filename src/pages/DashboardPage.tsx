{\rtf1\ansi\ansicpg1252\cocoartf2870
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\paperw11900\paperh16840\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\pard\tx566\tx1133\tx1700\tx2267\tx2834\tx3401\tx3968\tx4535\tx5102\tx5669\tx6236\tx6803\pardirnatural\partightenfactor0

\f0\fs24 \cf0 import \{ useApp \} from '../context/AppContext';\
import type \{ Client, ExchangeRates \} from '../types';\
\
interface Props \{\
  clients: Client[];\
  exchangeRates: ExchangeRates;\
\}\
\
export function DashboardPage(\{ clients \}: Props) \{\
  const \{ navigateToAddClient \} = useApp();\
\
  const stats = \{\
    totalClients: clients.length,\
    activeClients: clients.filter((c) => c.status === 'active').length,\
    newThisMonth: clients.filter((c) => \{\
      const created = new Date(c.createdAt);\
      const now = new Date();\
      return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();\
    \}).length,\
  \};\
\
  return (\
    <div className="space-y-6">\
      <div className="flex items-center justify-between">\
        <h1 className="text-white text-2xl font-bold">\uc0\u1604 \u1608 \u1581 \u1577  \u1575 \u1604 \u1578 \u1581 \u1603 \u1605 </h1>\
        <button onClick=\{navigateToAddClient\} className="bg-cyan-400 text-black px-5 py-2.5 rounded-xl font-bold hover:bg-cyan-300 transition-colors">\
          \uc0\u10133  \u1573 \u1590 \u1575 \u1601 \u1577  \u1593 \u1605 \u1610 \u1604 \
        </button>\
      </div>\
\
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">\
        <StatCard title="\uc0\u1573 \u1580 \u1605 \u1575 \u1604 \u1610  \u1575 \u1604 \u1593 \u1605 \u1604 \u1575 \u1569 " value=\{stats.totalClients\} icon="\u55357 \u56421 " color="cyan" />\
        <StatCard title="\uc0\u1575 \u1604 \u1593 \u1605 \u1604 \u1575 \u1569  \u1575 \u1604 \u1606 \u1588 \u1591 \u1610 \u1606 " value=\{stats.activeClients\} icon="\u9989 " color="green" />\
        <StatCard title="\uc0\u1580 \u1583 \u1610 \u1583  \u1607 \u1584 \u1575  \u1575 \u1604 \u1588 \u1607 \u1585 " value=\{stats.newThisMonth\} icon="\u55356 \u56725 " color="purple" />\
      </div>\
\
      <div className="bg-[#111c2d] rounded-2xl p-6 border border-white/5">\
        <h2 className="text-white font-bold mb-4">\uc0\u1570 \u1582 \u1585  \u1575 \u1604 \u1593 \u1605 \u1604 \u1575 \u1569 </h2>\
        \{clients.length === 0 ? (\
          <p className="text-white/50 text-center py-8">\uc0\u1604 \u1575  \u1610 \u1608 \u1580 \u1583  \u1593 \u1605 \u1604 \u1575 \u1569  \u1576 \u1593 \u1583 </p>\
        ) : (\
          <div className="space-y-3">\
            \{clients.slice(0, 5).map((client) => (\
              <div key=\{client.id\} className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">\
                <div>\
                  <p className="text-white font-medium">\{client.name\}</p>\
                  <p className="text-white/50 text-sm">\{client.company || '\uc0\u1576 \u1583 \u1608 \u1606  \u1588 \u1585 \u1603 \u1577 '\}</p>\
                </div>\
                <span className=\{`px-3 py-1 rounded-full text-xs font-medium $\{\
                  client.status === 'active' ? 'bg-green-400/10 text-green-400' :\
                  client.status === 'inactive' ? 'bg-red-400/10 text-red-400' :\
                  'bg-yellow-400/10 text-yellow-400'\
                \}`\}>\
                  \{client.status === 'active' ? '\uc0\u1606 \u1588 \u1591 ' : client.status === 'inactive' ? '\u1594 \u1610 \u1585  \u1606 \u1588 \u1591 ' : 'lead'\}\
                </span>\
              </div>\
            ))\}\
          </div>\
        )\}\
      </div>\
    </div>\
  );\
\}\
\
function StatCard(\{ title, value, icon, color \}: \{ title: string; value: number; icon: string; color: string \}) \{\
  const colors: Record<string, string> = \{\
    cyan: 'bg-cyan-400/10 text-cyan-400 border-cyan-400/20',\
    green: 'bg-green-400/10 text-green-400 border-green-400/20',\
    purple: 'bg-purple-400/10 text-purple-400 border-purple-400/20',\
  \};\
\
  return (\
    <div className=\{`p-6 rounded-2xl border $\{colors[color]\}`\}>\
      <div className="text-3xl mb-2">\{icon\}</div>\
      <p className="text-3xl font-bold">\{value\}</p>\
      <p className="text-sm opacity-70">\{title\}</p>\
    </div>\
  );\
\}}
