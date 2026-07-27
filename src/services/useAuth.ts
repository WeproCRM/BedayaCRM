{\rtf1\ansi\ansicpg1252\cocoartf2870
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\paperw11900\paperh16840\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\pard\tx566\tx1133\tx1700\tx2267\tx2834\tx3401\tx3968\tx4535\tx5102\tx5669\tx6236\tx6803\pardirnatural\partightenfactor0

\f0\fs24 \cf0 import \{ useState, useEffect \} from 'react';\
import type \{ User as FirebaseUser \} from 'firebase/auth';\
import \{ onAuthChange \} from '../services/auth';\
import \{ getUsers \} from '../services/firestore';\
import \{ SUPER_ADMINS \} from '../constants';\
import type \{ User \} from '../types';\
\
interface AuthState \{\
  user: FirebaseUser | null;\
  userData: User | null;\
  isLoading: boolean;\
  isAdmin: boolean;\
  isSuperAdmin: boolean;\
\}\
\
export function useAuth(): AuthState \{\
  const [user, setUser] = useState<FirebaseUser | null>(null);\
  const [userData, setUserData] = useState<User | null>(null);\
  const [isLoading, setIsLoading] = useState(true);\
\
  useEffect(() => \{\
    const unsubscribe = onAuthChange(async (currentUser) => \{\
      setUser(currentUser);\
      if (currentUser) \{\
        try \{\
          const users = await getUsers();\
          const found = users.find((u) => u.email === currentUser.email);\
          const currentUserData: User = found || \{\
            id: currentUser.uid,\
            name: currentUser.email?.split('@')[0] || '\uc0\u1605 \u1580 \u1607 \u1608 \u1604 ',\
            email: currentUser.email || '',\
            role: 'employee',\
          \};\
          if (SUPER_ADMINS.includes(currentUser.email || '')) \{\
            currentUserData.role = 'super-admin';\
          \}\
          setUserData(currentUserData);\
        \} catch (error) \{\
          console.error('Error fetching user data:', error);\
        \}\
      \} else \{\
        setUserData(null);\
      \}\
      setIsLoading(false);\
    \});\
    return () => unsubscribe();\
  \}, []);\
\
  const isAdmin = userData?.role === 'admin' || userData?.role === 'super-admin';\
  const isSuperAdmin = userData?.role === 'super-admin';\
  return \{ user, userData, isLoading, isAdmin, isSuperAdmin \};\
\}}