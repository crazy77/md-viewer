import { notFound } from 'next/navigation'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkBreaks from 'remark-breaks'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/cjs/styles/prism'
import { getMarkdownByCode } from '@/lib/markdown'
import ThemeToggle from '@/components/ThemeToggle'
import { Metadata } from 'next'
import Image from 'next/image'

interface PageProps {
  params: Promise<{ code: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

// 절대 URL 생성 헬퍼 함수
function getAbsoluteUrl(path: string): string {
  // 환경변수에서 사이트 URL 가져오기
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_URL
  
  if (siteUrl) {
    // 프로토콜이 없으면 https 추가
    const baseUrl = siteUrl.startsWith('http') ? siteUrl : `https://${siteUrl}`
    return `${baseUrl}${path}`
  }
  
  // fallback: 상대 경로 그대로 반환 (Next.js가 자동으로 처리)
  return path
}

// 동적 메타데이터 생성
export async function generateMetadata({ params }: { params: Promise<{ code: string }> }): Promise<Metadata> {
  const { code } = await params
  const markdown = await getMarkdownByCode(code)
  
  if (!markdown) {
    return {
      title: '페이지를 찾을 수 없습니다 | Markdown Viewer',
      description: '요청하신 마크다운 문서를 찾을 수 없습니다.',
    }
  }

  const title = `${markdown.title}`
  const description = markdown.description || `${markdown.title}에 대한 마크다운 문서입니다.`
  
  // 이미지가 있으면 소셜 이미지로 사용, 없으면 기본 이미지 사용
  const imageUrl = markdown.image ? getAbsoluteUrl(markdown.image) : getAbsoluteUrl('/images/md-viewer.jpeg')
  
  const ogImage = {
    url: imageUrl,
    width: 1200,
    height: 630,
    alt: markdown.title,
  }
  
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      images: [ogImage],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
    keywords: [
      'markdown',
      'documentation',
      '마크다운',
      '문서',
      markdown.title,
      ...(markdown.code ? [markdown.code] : []),
    ],
  }
}

export default async function ViewPage({ params, searchParams }: PageProps) {
  const { code } = await params
  const searchParamsResolved = await searchParams
  const noHeader = searchParamsResolved['no-header'] === 'true'
  
  const markdown = await getMarkdownByCode(code)

  if (!markdown) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-slate-800">
      {!noHeader && (
        <header className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-lg border-b border-blue-100 dark:border-gray-700 sticky top-0 z-10">
          <div className="max-w-4xl mx-auto mobile-optimized py-3 sm:py-4 md:py-6">
            <div className="flex items-center justify-between">
              <Link
                href="/"
                className="group flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-all duration-300 font-medium"
              >
                <div className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-lg bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center text-white mr-2 sm:mr-3 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </div>
                <span className="group-hover:translate-x-1 transition-transform duration-300 text-sm sm:text-base">
                  목록
                </span>
              </Link>
              <div className="flex items-center gap-2 sm:gap-3">
                <Link
                  href={`/edit/${markdown.code}`}
                  className="px-3 py-1.5 bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300 text-xs sm:text-sm font-medium rounded-lg hover:bg-orange-200 dark:hover:bg-orange-800 transition-all duration-200 flex items-center gap-1"
                >
                  ✏️ <span className="hidden sm:inline">수정</span>
                </Link>
                <div className="flex items-center gap-1 sm:gap-2">
                  <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">코드:</span>
                  <span className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-gradient-to-r from-purple-400 to-purple-600 text-white shadow-sm">
                    {markdown.code}
                  </span>
                </div>
                <ThemeToggle />
              </div>
            </div>
          </div>
        </header>
      )}

      <main className={`max-w-4xl mx-auto  ${noHeader ? 'py-0 px-0' : 'mobile-spacing mobile-optimized'}`}>
        <article className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 dark:border-gray-700/20 overflow-hidden">
          {/* 문서 헤더 - no-header일 때는 더 간소하게 */}
          <div className={`bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white ${
            noHeader ? 'p-3 sm:p-4' : 'p-4 sm:p-6 md:p-8'
          }`}>
            
            <div className="flex justify-between items-center">
              <h1 className={`font-bold ${
                noHeader 
                  ? 'text-lg sm:text-xl md:text-2xl mb-2' 
                  : 'text-2xl sm:text-3xl md:text-4xl mb-2 sm:mb-3 md:mb-4'
              }`}>
                {markdown.title}
              </h1>
              {noHeader && (
                <>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-white/20 text-white">
                      {markdown.code}
                    </span>
                    <ThemeToggle />
                  </div>
                </>
              )}
            </div>
            
            {markdown.description && !noHeader && (
              <p className="text-blue-100 text-sm sm:text-base md:text-lg leading-relaxed mb-4 sm:mb-5 md:mb-6">
                {markdown.description}
              </p>
            )}
            
            {!noHeader && (
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs sm:text-sm text-blue-200 gap-2 sm:gap-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                  <span className="flex items-center gap-1 sm:gap-2">
                    <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span className="truncate">{markdown.filename}</span>
                  </span>
                  <span className="flex items-center gap-1 sm:gap-2">
                    <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {new Date(markdown.lastModified).toLocaleDateString('ko-KR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* 히어로 이미지 - frontmatter에 이미지가 있을 경우 표시 */}
          {markdown.image && (
            <div className="relative">
              <div className="relative w-full h-48 sm:h-64 md:h-80 lg:h-96 overflow-hidden">
                <Image
                  src={markdown.image}
                  alt={markdown.title}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
            </div>
          )}

          {/* 문서 내용 */}
          <div className={`markdown-content ${
            noHeader ? 'p-3 sm:p-4 md:p-6' : 'p-4 sm:p-6 md:p-8'
          }`}>
            <ReactMarkdown
              remarkPlugins={[remarkGfm, remarkBreaks]}
              components={{
                code(props) {
                  const { children, className } = props
                  const match = /language-(\w+)/.exec(className || '')
                  
                  if (match) {
                    return (
                      <SyntaxHighlighter
                        language={match[1]}
                        style={oneDark as any}
                        PreTag="div"
                      >
                        {String(children).replace(/\n$/, '')}
                      </SyntaxHighlighter>
                    )
                  }
                  
                  return (
                    <code className={className}>
                      {children}
                    </code>
                  )
                },
              }}
            >
              {markdown.content}
            </ReactMarkdown>
          </div>
        </article>
        
        {/* no-header 모드 안내 메시지 */}
        {/* {noHeader && (
          <div className="text-center mt-4 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-700">
            <p className="text-xs text-blue-600 dark:text-blue-300">
              📖 헤더 숨김 모드로 표시 중입니다. 
              <Link href={`/view/${code}`} className="underline hover:text-blue-800 dark:hover:text-blue-100 ml-1">
                전체 화면으로 보기
              </Link>
            </p>
          </div>
        )} */}
      </main>
    </div>
  )
} 