'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface DeleteButtonProps {
  code: string
  title: string
  onDeleted?: () => void
}

export default function DeleteButton({ code, title, onDeleted }: DeleteButtonProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!confirm(`정말로 "${title}" 문서를 삭제하시겠습니까?\n\n이 작업은 되돌릴 수 없습니다.`)) {
      return
    }

    setIsDeleting(true)

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

      // 성공적으로 삭제되면 페이지 새로고침
      if (onDeleted) {
        onDeleted()
      } else {
        router.refresh()
      }
    } catch (error) {
      alert(error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="px-3 py-2 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 text-xs sm:text-sm font-medium rounded-lg hover:bg-red-200 dark:hover:bg-red-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      title="삭제하기"
    >
      {isDeleting ? '🔄' : '🗑️'}
    </button>
  )
} 