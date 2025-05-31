import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        {/* 404 아이콘 */}
        <div className="relative mb-8">
          <div className="text-8xl mb-4">🔍</div>
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-red-400 to-red-600 rounded-full flex items-center justify-center text-white text-xs font-bold animate-bounce">
            !
          </div>
        </div>
        
        {/* 메인 콘텐츠 */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-white/20">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-red-500 to-pink-600 bg-clip-text text-transparent mb-4">
            404
          </h1>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            페이지를 찾을 수 없습니다
          </h2>
          <p className="text-gray-600 mb-8 leading-relaxed">
            요청하신 마크다운 파일이 존재하지 않거나<br />
            잘못된 코드입니다. 🤔
          </p>
          
          {/* 버튼 */}
          <Link
            href="/"
            className="group inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 font-medium"
          >
            <div className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform duration-300">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
            <span className="group-hover:translate-x-1 transition-transform duration-300">
              홈으로 돌아가기
            </span>
          </Link>
          
          {/* 추가 도움말 */}
          <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100">
            <p className="text-sm text-gray-600">
              💡 <strong>도움말:</strong> 올바른 문서 코드를 확인하시거나<br />
              홈페이지에서 원하는 문서를 선택해보세요.
            </p>
          </div>
        </div>
        
        {/* 장식 요소 */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-xl"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-gradient-to-r from-pink-400/20 to-red-400/20 rounded-full blur-xl"></div>
      </div>
    </div>
  )
} 