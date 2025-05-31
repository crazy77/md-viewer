import Link from 'next/link'
import { getMarkdownFiles } from '@/lib/markdown'

export default async function HomePage() {
  const markdownFiles = await getMarkdownFiles()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <header className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-blue-100">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
            📚 Markdown Viewer
          </h1>
          <p className="text-gray-700 mt-3 text-lg">
            마크다운 파일을 선택해서 아름다운 웹페이지로 읽어보세요 ✨
          </p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {markdownFiles.map((file, index) => {
            // 각 카드마다 다른 그라데이션 색상
            const gradients = [
              'from-blue-400 to-blue-600',
              'from-purple-400 to-purple-600', 
              'from-green-400 to-green-600',
              'from-orange-400 to-orange-600',
              'from-pink-400 to-pink-600',
              'from-indigo-400 to-indigo-600'
            ]
            const gradient = gradients[index % gradients.length]
            
            return (
              <Link
                key={file.code}
                href={`/view/${file.code}`}
                className="group block relative overflow-hidden"
              >
                <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-gray-200 transform hover:-translate-y-2 hover:scale-105">
                  {/* 상단 그라데이션 헤더 */}
                  <div className={`h-2 bg-gradient-to-r ${gradient}`}></div>
                  
                  <div className="p-6">
                    {/* 아이콘과 제목 */}
                    <div className="flex items-start gap-3 mb-4">
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${gradient} flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
                        📄
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                          {file.title}
                        </h3>
                      </div>
                    </div>
                    
                    {/* 설명 */}
                    {file.description && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
                        {file.description}
                      </p>
                    )}
                    
                    {/* 메타 정보 */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${gradient} text-white shadow-sm`}>
                          {file.code}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-md">
                        {new Date(file.lastModified).toLocaleDateString('ko-KR')}
                      </span>
                    </div>
                  </div>
                  
                  {/* 호버 효과를 위한 오버레이 */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-50/0 to-purple-50/0 group-hover:from-blue-50/20 group-hover:to-purple-50/20 transition-all duration-300 rounded-2xl pointer-events-none"></div>
                </div>
              </Link>
            )
          })}
        </div>

        {markdownFiles.length === 0 && (
          <div className="text-center py-16">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-12 max-w-md mx-auto border border-gray-100">
              <div className="text-6xl mb-6">📄</div>
              <div className="text-gray-700 text-xl font-semibold mb-3">
                아직 마크다운 파일이 없습니다
              </div>
              <p className="text-gray-500 mb-6">
                <code className="bg-gradient-to-r from-blue-100 to-purple-100 px-3 py-1 rounded-lg font-mono text-sm">content</code> 폴더에 마크다운 파일을 추가해보세요
              </p>
              <div className="text-sm text-gray-400">
                ✨ 파일을 추가하면 자동으로 여기에 나타납니다
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
} 