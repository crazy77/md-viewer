import Link from 'next/link'
import { getMarkdownFiles } from '@/lib/markdown'

export default async function HomePage() {
  const markdownFiles = await getMarkdownFiles()

  return (
    <div className="min-h-screen">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">
            📚 Markdown Viewer
          </h1>
          <p className="text-gray-600 mt-2">
            마크다운 파일을 선택해서 웹에서 읽어보세요
          </p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {markdownFiles.map((file) => (
            <Link
              key={file.code}
              href={`/view/${file.code}`}
              className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200 hover:border-blue-300"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {file.title}
                  </h3>
                  {file.description && (
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {file.description}
                    </p>
                  )}
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>코드: {file.code}</span>
                    <span>{file.lastModified}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {markdownFiles.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">
              📄 아직 마크다운 파일이 없습니다
            </div>
            <p className="text-gray-400 mt-2">
              <code>content</code> 폴더에 마크다운 파일을 추가해보세요
            </p>
          </div>
        )}
      </main>
    </div>
  )
} 