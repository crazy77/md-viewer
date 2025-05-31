import type { Metadata } from 'next'
import './globals.css'
import { Providers } from '@/app/providers'

export const metadata: Metadata = {
  title: {
    default: 'Markdown Viewer | 마크다운 문서 뷰어',
    template: '%s | Markdown Viewer',
  },
  description: '마크다운 파일을 아름다운 웹페이지로 읽어보세요. 간편하고 직관적인 마크다운 문서 뷰어입니다.',
  keywords: [
    'markdown',
    'viewer',
    'documentation',
    '마크다운',
    '뷰어',
    '문서',
    'markdown viewer',
    'document reader',
    'web viewer',
  ],
  authors: [
    {
      name: 'Markdown Viewer Team',
    },
  ],
  creator: 'Markdown Viewer Team',
  metadataBase: new URL('http://localhost:3001'), // 배포 시 실제 도메인으로 변경
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    siteName: 'Markdown Viewer',
    title: 'Markdown Viewer | 마크다운 문서 뷰어',
    description: '마크다운 파일을 아름다운 웹페이지로 읽어보세요.',
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@markdownviewer',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // 나중에 Google Search Console, Naver 등의 인증 태그 추가 가능
    // google: 'verification-code',
    // naver: 'verification-code',
  },
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