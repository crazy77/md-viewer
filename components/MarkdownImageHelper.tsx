'use client'

import { useState } from 'react'

interface MarkdownImageHelperProps {
  onInsertImage: (markdownText: string) => void
  className?: string
}

export default function MarkdownImageHelper({ onInsertImage, className = '' }: MarkdownImageHelperProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState('')

  const handleImageUpload = async (file: File) => {
    if (!file) return

    // 파일 유효성 검사
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    if (!validTypes.includes(file.type)) {
      setError('지원하지 않는 이미지 형식입니다. (JPEG, PNG, GIF, WebP만 지원)')
      return
    }

    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      setError('파일 크기가 너무 큽니다. (최대 5MB)')
      return
    }

    setIsUploading(true)
    setError('')

    try {
      const formData = new FormData()
      formData.append('image', file)

      const response = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || '이미지 업로드에 실패했습니다.')
      }

      // 마크다운 이미지 문법 생성
      const altText = file.name.replace(/\.[^/.]+$/, '') // 확장자 제거
      const markdownImage = `![${altText}](${data.url})`
      
      onInsertImage(markdownImage)
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.')
    } finally {
      setIsUploading(false)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleImageUpload(files[0])
    }
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center gap-2">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          id="markdown-image-upload"
          disabled={isUploading}
        />
        <label
          htmlFor="markdown-image-upload"
          className={`px-3 py-2 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-xs font-medium rounded-lg hover:bg-green-200 dark:hover:bg-green-800 transition-colors duration-200 cursor-pointer flex items-center gap-1 ${
            isUploading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isUploading ? '⏳' : '🖼️'} 
          <span className="hidden sm:inline">
            {isUploading ? '업로드 중...' : '이미지 삽입'}
          </span>
        </label>
        
        <div className="text-xs text-gray-500 dark:text-gray-400">
          업로드 후 마크다운에 자동 삽입됩니다
        </div>
      </div>

      {error && (
        <div className="p-2 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded text-xs text-red-700 dark:text-red-300">
          {error}
        </div>
      )}
    </div>
  )
} 