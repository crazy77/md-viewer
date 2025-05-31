import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

// 다크모드 상태를 localStorage에 저장 (기본값: false = 라이트모드)
export const isDarkModeAtom = atomWithStorage('isDarkMode', false, undefined, {
  getOnInit: true
})

// 시스템 테마 감지 (사용하지 않지만 나중을 위해 보존)
export const systemThemeAtom = atom(
  () => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    return false
  }
)

// 현재 적용될 테마 (사용자 설정)
export const currentThemeAtom = atom(
  (get) => get(isDarkModeAtom)
) 