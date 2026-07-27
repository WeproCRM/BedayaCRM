{\rtf1\ansi\ansicpg1252\cocoartf2870
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\paperw11900\paperh16840\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\pard\tx566\tx1133\tx1700\tx2267\tx2834\tx3401\tx3968\tx4535\tx5102\tx5669\tx6236\tx6803\pardirnatural\partightenfactor0

\f0\fs24 \cf0 import \{ initializeApp \} from 'firebase/app';\
import \{ getAuth \} from 'firebase/auth';\
import \{ getFirestore \} from 'firebase/firestore';\
\
const firebaseConfig = \{\
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,\
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,\
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,\
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,\
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,\
  appId: import.meta.env.VITE_FIREBASE_APP_ID,\
\};\
\
const app = initializeApp(firebaseConfig);\
export const auth = getAuth(app);\
export const db = getFirestore(app);}