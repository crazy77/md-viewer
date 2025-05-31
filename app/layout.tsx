import type { Metadata } from 'next'
import './globals.css'

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
    <html lang="ko">
      <body className="bg-gray-50 text-gray-900">{children}</body>
    </html>
  )
} 