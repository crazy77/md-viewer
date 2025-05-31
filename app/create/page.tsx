'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import ThemeToggle from '@/components/ThemeToggle'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'


export default function CreatePage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    code: '',
    content: '',
    image: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [isPreview, setIsPreview] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // 제목이 변경되면 자동으로 코드 생성 (옵션)
    if (name === 'title' && !formData.code) {
      const generatedCode = value
        .toLowerCase()
        .replace(/[^a-z0-9가-힣\s]/g, '')
        .replace(/\s+/g, '-')
        .slice(0, 20)
      
      setFormData(prev => ({
        ...prev,
        code: generatedCode
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/markdown', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || '파일 생성에 실패했습니다.')
      }

      // 성공 시 생성된 파일로 이동
      router.push(`/view/${formData.code}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-slate-800">
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg border-b border-blue-100 dark:border-gray-700">
        <div className="max-w-6xl mx-auto mobile-optimized mobile-spacing">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="mobile-title font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
                ✍️ 새 마크다운 만들기
              </h1>
              <p className="text-gray-700 dark:text-gray-300 mt-2 mobile-text leading-relaxed">
                새로운 마크다운 문서를 작성해보세요 ✨
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200 text-sm font-medium"
              >
                🏠 홈으로
              </Link>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto mobile-optimized mobile-spacing">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* 입력 폼 */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 lg:p-8 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                📝 문서 작성
              </h2>
              <button
                type="button"
                onClick={() => setIsPreview(!isPreview)}
                className="px-4 py-2 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors duration-200 text-sm font-medium"
              >
                {isPreview ? '📝 편집' : '👁️ 미리보기'}
              </button>
            </div>

            {!isPreview ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* 제목 */}
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    제목 *
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200"
                    placeholder="문서의 제목을 입력하세요"
                  />
                </div>

                {/* 설명 */}
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    설명
                  </label>
                  <input
                    type="text"
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200"
                    placeholder="문서에 대한 간단한 설명을 입력하세요"
                  />
                </div>

                {/* 코드 */}
                <div>
                  <label htmlFor="code" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    URL 코드 *
                  </label>
                  <input
                    type="text"
                    id="code"
                    name="code"
                    value={formData.code}
                    onChange={handleInputChange}
                    required
                    pattern="[a-z0-9가-힣\-]+"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200"
                    placeholder="URL에 사용될 고유 코드 (예: hello-world)"
                  />
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    영문 소문자, 숫자, 한글, 하이픈만 사용 가능합니다. (예: /view/{formData.code || 'your-code'})
                  </p>
                </div>

                {/* 이미지 URL */}
                <div>
                  <label htmlFor="image" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    이미지 URL (선택사항)
                  </label>
                  <input
                    type="url"
                    id="image"
                    name="image"
                    value={formData.image}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                {/* 내용 */}
                <div>
                  <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    마크다운 내용 *
                  </label>
                  <textarea
                    id="content"
                    name="content"
                    value={formData.content}
                    onChange={handleInputChange}
                    required
                    rows={12}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200 font-mono text-sm"
                    placeholder="마크다운 문법을 사용하여 내용을 작성하세요...

예시:
# 제목 1
## 제목 2

**굵은 글씨** *기울임* `코드`

- 목록 항목 1
- 목록 항목 2

```javascript
console.log('Hello World!');
```"
                  />
                </div>

                {/* 오류 메시지 */}
                {error && (
                  <div className="p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg">
                    <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
                  </div>
                )}

                {/* 제출 버튼 */}
                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? '생성 중...' : '✨ 마크다운 파일 생성'}
                  </button>
                  <Link
                    href="/"
                    className="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200 text-center"
                  >
                    취소
                  </Link>
                </div>
              </form>
            ) : (
              /* 미리보기 */
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">
                    {formData.title || '제목 없음'}
                  </h3>
                  {formData.description && (
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                      {formData.description}
                    </p>
                  )}
                  <div className="flex gap-2 text-xs">
                    <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded">
                      {formData.code || 'no-code'}
                    </span>
                  </div>
                </div>
                
                <div className="prose prose-gray dark:prose-invert max-w-none markdown-content">
                  {formData.content ? (
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {formData.content}
                    </ReactMarkdown>
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400 italic">
                      내용을 입력하면 여기에 미리보기가 표시됩니다.
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* 도움말 */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 lg:p-8 border border-gray-100 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
              📚 마크다운 가이드
            </h2>
            
            <div className="space-y-6 text-sm">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">헤딩</h3>
                <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg font-mono">
                  # 제목 1<br/>
                  ## 제목 2<br/>
                  ### 제목 3
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">텍스트 스타일</h3>
                <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg font-mono">
                  **굵은 글씨**<br/>
                  *기울임*<br/>
                  `인라인 코드`<br/>
                  ~~취소선~~
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">목록</h3>
                <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg font-mono">
                  - 순서 없는 목록<br/>
                  - 항목 2<br/>
                  <br/>
                  1. 순서 있는 목록<br/>
                  2. 항목 2
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">링크 & 이미지</h3>
                <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg font-mono">
                  [링크 텍스트](URL)<br/>
                  ![이미지 설명](이미지_URL)
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">코드 블록</h3>
                <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg font-mono">
                  ```javascript<br/>
                  console.log('Hello!');<br/>
                  ```
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">인용문</h3>
                <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg font-mono">
                  &gt; 인용문입니다.<br/>
                  &gt; 여러 줄도 가능합니다.
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">표</h3>
                <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg font-mono text-xs">
                  | 제목1 | 제목2 |<br/>
                  |------|------|<br/>
                  | 내용1 | 내용2 |
                </div>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg">
              <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">💡 팁</h3>
              <ul className="text-blue-800 dark:text-blue-300 text-xs space-y-1">
                <li>• 실시간 미리보기를 활용하세요</li>
                <li>• URL 코드는 고유해야 합니다</li>
                <li>• 이미지는 웹에서 접근 가능한 URL을 사용하세요</li>
                <li>• GitHub Flavored Markdown을 지원합니다</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
} 