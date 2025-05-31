import Link from 'next/link'
import { getMarkdownFiles } from '@/lib/markdown'
import ThemeToggle from '@/components/ThemeToggle'
import { Metadata } from 'next'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'Markdown Viewer | 마크다운 문서 뷰어',
  description: '마크다운 파일을 아름다운 웹페이지로 읽어보세요. 간편하고 직관적인 마크다운 문서 뷰어입니다.',
  openGraph: {
    title: 'Markdown Viewer | 마크다운 문서 뷰어',
    description: '마크다운 파일을 아름다운 웹페이지로 읽어보세요. 간편하고 직관적인 마크다운 문서 뷰어입니다.',
    type: 'website',
    images: [
      {
        url: '/images/md-viewer.png',
        width: 1200,
        height: 630,
        alt: 'Markdown Viewer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Markdown Viewer | 마크다운 문서 뷰어',
    description: '마크다운 파일을 아름다운 웹페이지로 읽어보세요.',
  },
  keywords: [
    'markdown',
    'viewer',
    'documentation',
    '마크다운',
    '뷰어',
    '문서',
    'markdown viewer',
    'document reader',
  ],
}

export default async function HomePage() {
  const markdownFiles = await getMarkdownFiles()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-slate-800">
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg border-b border-blue-100 dark:border-gray-700">
        <div className="max-w-6xl mx-auto mobile-optimized mobile-spacing">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="mobile-title font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
                📚 Markdown Viewer
              </h1>
              <p className="text-gray-700 dark:text-gray-300 mt-2 mobile-text leading-relaxed">
                마크다운 파일을 선택해서 아름다운 웹페이지로 읽어보세요 ✨
              </p>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto mobile-optimized mobile-spacing">
        <div className="mobile-card-grid">
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
              <div
                key={file.code}
                className="group block relative overflow-hidden"
              >
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600 transform hover:-translate-y-2 hover:scale-105">
                  {/* 상단 그라데이션 헤더 */}
                  <div className={`h-2 bg-gradient-to-r ${gradient}`}></div>
                  
                  <div className="p-4 sm:p-5 md:p-6">
                    {/* 아이콘과 제목 */}
                    <div className="flex items-start gap-2 sm:gap-3 mb-3 sm:mb-4">
                      {file.image?
                      <div className={`rounded-lg w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 shadow-lg relative`}>
                      <Image
                      src={file.image}
                      alt={file.title}
                      width={32}
                      height={32}
                      className={`w-full h-full object-cover rounded-lg`}
                      />
                      </div>
                      :
                      <div className={`w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-lg bg-gradient-to-r ${gradient} flex items-center justify-center text-white font-bold text-sm sm:text-base md:text-lg shadow-lg relative`}>
                        📄
                      </div>}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                          {file.title}
                        </h3>
                      </div>
                    </div>
                    
                    {/* 설명 */}
                    {file.description && (
                      <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-3 leading-relaxed">
                        {file.description}
                      </p>
                    )}
                    
                    {/* 메타 정보 */}
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <div className="flex items-center">
                        <span className={`inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${gradient} text-white shadow-sm`}>
                          {file.code}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 px-2 py-1 rounded-md shrink-0">
                        {new Date(file.lastModified).toLocaleDateString('ko-KR')}
                      </span>
                    </div>
                    
                    {/* 보기 옵션 버튼들 */}
                    <div className="flex gap-2">
                      <Link
                        href={`/view/${file.code}`}
                        className={`flex-1 px-3 py-2 bg-gradient-to-r ${gradient} text-white text-xs sm:text-sm font-medium rounded-lg hover:opacity-90 transition-all duration-200 text-center`}
                      >
                        📖 전체 보기
                      </Link>
                      <Link
                        href={`/view/${file.code}?no-header=true`}
                        className="px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs sm:text-sm font-medium rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200"
                        title="헤더 없이 보기"
                      >
                        🎯
                      </Link>
                    </div>
                  </div>
                  
                  {/* 호버 효과를 위한 오버레이 */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-50/0 to-purple-50/0 group-hover:from-blue-50/20 group-hover:to-purple-50/20 dark:group-hover:from-blue-900/20 dark:group-hover:to-purple-900/20 transition-all duration-300 rounded-2xl pointer-events-none"></div>
                </div>
              </div>
            )
          })}
        </div>

        {markdownFiles.length === 0 && (
          <div className="text-center py-8 sm:py-12 md:py-16">
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 sm:p-8 md:p-12 max-w-md mx-auto border border-gray-100 dark:border-gray-700">
              <div className="text-4xl sm:text-5xl md:text-6xl mb-4 sm:mb-6">📄</div>
              <div className="text-gray-700 dark:text-gray-300 text-lg sm:text-xl font-semibold mb-3">
                아직 마크다운 파일이 없습니다
              </div>
              <p className="text-gray-500 dark:text-gray-400 mb-4 sm:mb-6 text-sm sm:text-base">
                <code className="bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/50 dark:to-purple-900/50 px-2 sm:px-3 py-1 rounded-lg font-mono text-xs sm:text-sm">content</code> 폴더에 마크다운 파일을 추가해보세요
              </p>
              <div className="text-xs sm:text-sm text-gray-400 dark:text-gray-500">
                ✨ 파일을 추가하면 자동으로 여기에 나타납니다
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
} 