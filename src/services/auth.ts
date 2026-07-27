{\rtf1\ansi\ansicpg1252\cocoartf2870
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\paperw11900\paperh16840\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\pard\tx566\tx1133\tx1700\tx2267\tx2834\tx3401\tx3968\tx4535\tx5102\tx5669\tx6236\tx6803\pardirnatural\partightenfactor0

\f0\fs24 \cf0 import \{\
  signInWithEmailAndPassword,\
  onAuthStateChanged,\
  signOut,\
  type User as FirebaseUser,\
\} from 'firebase/auth';\
import \{ auth \} from '../firebase';\
\
export function login(email: string, password: string) \{\
  return signInWithEmailAndPassword(auth, email, password);\
\}\
\
export function logout() \{\
  return signOut(auth);\
\}\
\
export function onAuthChange(callback: (user: FirebaseUser | null) => void) \{\
  return onAuthStateChanged(auth, callback);\
\}}