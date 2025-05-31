import { notFound } from 'next/navigation'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/cjs/styles/prism'
import { getMarkdownByCode } from '@/lib/markdown'

interface PageProps {
  params: Promise<{ code: string }>
}

export default async function ViewPage({ params }: PageProps) {
  const { code } = await params
  const markdown = await getMarkdownByCode(code)

  if (!markdown) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <header className="bg-white/90 backdrop-blur-sm shadow-lg border-b border-blue-100 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="group flex items-center text-blue-600 hover:text-blue-800 transition-all duration-300 font-medium"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center text-white mr-3 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </div>
              <span className="group-hover:translate-x-1 transition-transform duration-300">
                목록으로 돌아가기
              </span>
            </Link>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">코드:</span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-purple-400 to-purple-600 text-white shadow-sm">
                {markdown.code}
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12">
        <article className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
          {/* 문서 헤더 */}
          <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-8 text-white">
            <h1 className="text-4xl font-bold mb-4">
              {markdown.title}
            </h1>
            {markdown.description && (
              <p className="text-blue-100 text-lg leading-relaxed mb-6">
                {markdown.description}
              </p>
            )}
            <div className="flex items-center justify-between text-sm text-blue-200">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  {markdown.filename}
                </span>
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
          </div>

          {/* 문서 내용 */}
          <div className="p-8 markdown-content">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
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
      </main>
    </div>
  )
} 