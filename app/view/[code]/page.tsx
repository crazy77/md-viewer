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
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              목록으로 돌아가기
            </Link>
            <div className="text-sm text-gray-500">
              코드: <span className="font-mono">{markdown.code}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <article className="bg-white rounded-lg shadow-sm p-8">
          <header className="mb-8 pb-6 border-b border-gray-200">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {markdown.title}
            </h1>
            {markdown.description && (
              <p className="text-gray-600 text-lg leading-relaxed">
                {markdown.description}
              </p>
            )}
            <div className="flex items-center justify-between text-sm text-gray-500 mt-4">
              <span>파일명: {markdown.filename}</span>
              <span>수정일: {markdown.lastModified}</span>
            </div>
          </header>

          <div className="markdown-content">
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