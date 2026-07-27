{\rtf1\ansi\ansicpg1252\cocoartf2870
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\paperw11900\paperh16840\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\pard\tx566\tx1133\tx1700\tx2267\tx2834\tx3401\tx3968\tx4535\tx5102\tx5669\tx6236\tx6803\pardirnatural\partightenfactor0

\f0\fs24 \cf0 import \{ useState, useEffect \} from 'react';\
\
interface WindowSize \{\
  width: number;\
  height: number;\
  isMobile: boolean;\
  isTablet: boolean;\
  isDesktop: boolean;\
\}\
\
export function useWindowSize(): WindowSize \{\
  const [size, setSize] = useState<WindowSize>(\{\
    width: window.innerWidth,\
    height: window.innerHeight,\
    isMobile: window.innerWidth < 768,\
    isTablet: window.innerWidth >= 768 && window.innerWidth < 1024,\
    isDesktop: window.innerWidth >= 1024,\
  \});\
\
  useEffect(() => \{\
    const handleResize = () => \{\
      const width = window.innerWidth;\
      setSize(\{\
        width,\
        height: window.innerHeight,\
        isMobile: width < 768,\
        isTablet: width >= 768 && width < 1024,\
        isDesktop: width >= 1024,\
      \});\
    \};\
    window.addEventListener('resize', handleResize);\
    return () => window.removeEventListener('resize', handleResize);\
  \}, []);\
\
  return size;\
\}}