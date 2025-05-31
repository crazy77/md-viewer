import type { Metadata } from 'next'
import './globals.css'
import { Providers } from '@/app/providers'

export const metadata: Metadata = {
  title: 'Markdown Viewer',
  description: '마크다운 파일을 웹에서 보는 플랫폼',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
} 