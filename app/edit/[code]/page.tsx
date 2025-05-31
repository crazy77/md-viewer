'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import ThemeToggle from '@/components/ThemeToggle'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import ImageUpload from '@/components/ImageUpload'
import MarkdownImageHelper from '@/components/MarkdownImageHelper'

interface EditPageProps {
  params: Promise<{ code: string }>
}

export default function EditPage({ params }: EditPageProps) {
  const router = useRouter()
  const [code, setCode] = useState<string>('')
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    code: '',
    content: '',
    image: ''
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')
  const [isPreview, setIsPreview] = useState(false)

  useEffect(() => {
    async function loadMarkdownFile() {
      try {
        const resolvedParams = await params
        setCode(resolvedParams.code)
        
        // API를 통해 파일 조회
        const response = await fetch(`/api/markdown?code=${resolvedParams.code}`)
        const data = await response.json()
        
        if (!response.ok) {
          throw new Error(data.error || '파일을 찾을 수 없습니다.')
        }
        
        setFormData({
          title: data.title,
          description: data.description || '',
          code: data.code,
          content: data.content,
          image: data.image || ''
        })
      } catch (err) {
        setError(err instanceof Error ? err.message : '파일을 불러오는 중 오류가 발생했습니다.')
      } finally {
        setIsLoading(false)
      }
    }

    loadMarkdownFile()
  }, [params])

  // Ctrl+S 키보드 단축키 처리
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault()
        if (!isSaving) {
          handleSubmit(e as any)
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isSaving, formData])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setError('')

    try {
      const response = await fetch('/api/markdown', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          originalCode: code,
          ...formData
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || '파일 수정에 실패했습니다.')
      }

      // 성공 시 수정된 파일로 이동 (서버에서 캐시 무효화됨)
      router.push(`/view/${formData.code}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('정말로 이 파일을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
      return
    }

    setIsSaving(true)
    setError('')

    try {
      const response = await fetch('/api/markdown', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || '파일 삭제에 실패했습니다.')
      }

      // 성공 시 홈으로 이동
      router.push('/')
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-slate-800 flex items-center justify-center">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-700">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">파일을 불러오는 중...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error && !formData.title) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-slate-800 flex items-center justify-center">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-700 max-w-md">
          <div className="text-center">
            <div className="text-4xl mb-4">❌</div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">파일을 찾을 수 없습니다</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
            <Link
              href="/"
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium rounded-lg transition-all duration-200"
            >
              홈으로 돌아가기
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-slate-800">
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg border-b border-blue-100 dark:border-gray-700">
        <div className="max-w-6xl mx-auto mobile-optimized mobile-spacing">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="mobile-title font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
                ✏️ 마크다운 수정
              </h1>
              <p className="text-gray-700 dark:text-gray-300 mt-2 mobile-text leading-relaxed">
                기존 마크다운 문서를 수정해보세요 ✨
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href={`/view/${code}`}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200 text-sm font-medium"
              >
                👁️ 보기
              </Link>
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
                📝 문서 수정
              </h2>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsPreview(!isPreview)}
                  className="px-4 py-2 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors duration-200 text-sm font-medium"
                >
                  {isPreview ? '📝 편집' : '👁️ 미리보기'}
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={isSaving}
                  className="px-4 py-2 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-800 transition-colors duration-200 text-sm font-medium disabled:opacity-50"
                >
                  🗑️ 삭제
                </button>
              </div>
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

                {/* 이미지 업로드 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    헤더 이미지 (선택사항)
                  </label>
                  <ImageUpload
                    onUpload={(imageUrl) => setFormData(prev => ({ ...prev, image: imageUrl }))}
                    currentImageUrl={formData.image}
                  />
                </div>

                {/* 이미지 URL 직접 입력 */}
                <div>
                  <label htmlFor="image" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    또는 이미지 URL 직접 입력
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
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    위에서 이미지를 업로드하거나 여기에 URL을 직접 입력하세요
                  </p>
                </div>

                {/* 내용 */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      마크다운 내용 *
                    </label>
                    <MarkdownImageHelper
                      onInsertImage={(markdownText) => {
                        const textarea = document.getElementById('content') as HTMLTextAreaElement
                        if (textarea) {
                          const start = textarea.selectionStart
                          const end = textarea.selectionEnd
                          const newContent = 
                            formData.content.substring(0, start) + 
                            markdownText + 
                            formData.content.substring(end)
                          
                          setFormData(prev => ({ ...prev, content: newContent }))
                          
                          // 커서 위치 조정
                          setTimeout(() => {
                            textarea.focus()
                            textarea.setSelectionRange(start + markdownText.length, start + markdownText.length)
                          }, 0)
                        }
                      }}
                    />
                  </div>
                  <textarea
                    id="content"
                    name="content"
                    value={formData.content}
                    onChange={handleInputChange}
                    required
                    rows={12}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200 font-mono text-sm"
                    placeholder="마크다운 문법을 사용하여 내용을 작성하세요..."
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
                    disabled={isSaving}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSaving ? '저장 중...' : '💾 변경사항 저장'}
                  </button>
                  <Link
                    href={`/view/${code}`}
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
              ⚠️ 수정 안내
            </h2>
            
            <div className="space-y-6 text-sm">
              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <h3 className="font-semibold text-yellow-900 dark:text-yellow-300 mb-2">🔄 수정 시 주의사항</h3>
                <ul className="text-yellow-800 dark:text-yellow-300 space-y-1">
                  <li>• URL 코드를 변경하면 기존 링크가 무효화됩니다</li>
                  <li>• 변경사항은 즉시 반영됩니다</li>
                  <li>• 미리보기로 결과를 확인하세요</li>
                </ul>
              </div>
              
              <div className="p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg">
                <h3 className="font-semibold text-red-900 dark:text-red-300 mb-2">🗑️ 삭제 시 주의사항</h3>
                <ul className="text-red-800 dark:text-red-300 space-y-1">
                  <li>• 삭제된 파일은 복구할 수 없습니다</li>
                  <li>• 모든 링크가 무효화됩니다</li>
                  <li>• 삭제 전 백업을 권장합니다</li>
                </ul>
              </div>

              <div className="p-4 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg">
                <h3 className="font-semibold text-green-900 dark:text-green-300 mb-2">💡 편집 팁</h3>
                <ul className="text-green-800 dark:text-green-300 space-y-1">
                  <li>• Ctrl+S로 빠르게 저장하세요</li>
                  <li>• 실시간 미리보기를 활용하세요</li>
                  <li>• 큰 변경 전에 백업하세요</li>
                  <li>• 마크다운 문법을 확인하세요</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
} 