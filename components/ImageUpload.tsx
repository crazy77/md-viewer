'use client'

import { useState, useRef, useCallback } from 'react'
import Image from 'next/image'

interface ImageUploadProps {
  onUpload: (imageUrl: string) => void
  currentImageUrl?: string
  className?: string
}

export default function ImageUpload({ onUpload, currentImageUrl, className = '' }: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState('')
  const [previewUrl, setPreviewUrl] = useState(currentImageUrl || '')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = async (file: File) => {
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

      setPreviewUrl(data.url)
      onUpload(data.url)
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.')
    } finally {
      setIsUploading(false)
    }
  }

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFileUpload(files[0])
    }
  }, [])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFileUpload(files[0])
    }
  }

  const handleRemoveImage = () => {
    setPreviewUrl('')
    onUpload('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* 현재 이미지 미리보기 */}
      {previewUrl && (
        <div className="relative">
          <div className="relative w-full h-40 rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600">
            <Image
              src={previewUrl}
              alt="업로드된 이미지"
              fill
              className="object-cover"
            />
            <button
              type="button"
              onClick={handleRemoveImage}
              className="absolute top-2 right-2 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors duration-200"
              title="이미지 제거"
            >
              ✕
            </button>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">
            {previewUrl}
          </p>
        </div>
      )}

      {/* 파일 업로드 영역 */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 transition-all duration-200 ${
          isDragging
            ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20'
            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
        } ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={isUploading}
        />

        <div className="text-center">
          {isUploading ? (
            <div className="space-y-2">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-sm text-gray-600 dark:text-gray-400">업로드 중...</p>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="text-3xl mb-2">📷</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <p className="font-medium">클릭하거나 파일을 드래그해서 업로드</p>
                <p className="text-xs mt-1">JPEG, PNG, GIF, WebP (최대 5MB)</p>
              </div>
            </div>
          )}
        </div>

        {isDragging && (
          <div className="absolute inset-0 bg-blue-50 dark:bg-blue-900/30 border-2 border-blue-400 rounded-lg flex items-center justify-center">
            <p className="text-blue-600 dark:text-blue-400 font-medium">파일을 놓아주세요</p>
          </div>
        )}
      </div>

      {/* 오류 메시지 */}
      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
        </div>
      )}

      {/* 도움말 */}
      <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
        <p>• 업로드된 이미지는 자동으로 문서 헤더 이미지로 설정됩니다</p>
        <p>• 마크다운 내용에서 ![alt](이미지URL) 형식으로 이미지를 삽입할 수 있습니다</p>
      </div>
    </div>
  )
} 