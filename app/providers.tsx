'use client'

import { Provider } from 'jotai'
import { useEffect, useState } from 'react'

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    // 초기 테마 설정 (localStorage에서 읽어오기)
    try {
      const savedTheme = localStorage.getItem('isDarkMode')
      const isDark = savedTheme === 'true'
      
      console.log('초기 테마 로딩:', { savedTheme, isDark })
      
      if (isDark) {
        document.documentElement.classList.add('dark')
        document.body.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
        document.body.classList.remove('dark')
      }
    } catch (error) {
      console.warn('테마 설정 로딩 중 오류:', error)
      // 기본값은 라이트 모드
      document.documentElement.classList.remove('dark')
      document.body.classList.remove('dark')
    }
  }, [])

  // 하이드레이션 이슈 방지를 위해 mounted 상태 확인
  if (!mounted) {
    return (
      <Provider>
        <div style={{ visibility: 'hidden' }}>{children}</div>
      </Provider>
    )
  }

  return (
    <Provider>
      {children}
    </Provider>
  )
} 