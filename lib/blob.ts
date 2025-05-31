import { put, list, del } from '@vercel/blob'
import matter from 'gray-matter'

export interface MarkdownFile {
  title: string
  description?: string
  code: string
  image?: string
  date?: string
  lastModified: string
  content: string
  url: string
  pathname: string
}

/**
 * Blob에서 모든 마크다운 파일 목록을 가져옵니다
 */
export async function getBlobMarkdownFiles(): Promise<MarkdownFile[]> {
  try {
    // md/ 폴더의 모든 파일 조회
    const { blobs } = await list({
      prefix: 'md/',
      token: process.env.BLOB_READ_WRITE_TOKEN,
    })

    const markdownFiles: MarkdownFile[] = []

    // 각 파일의 내용을 가져와서 파싱
    for (const blob of blobs) {
      try {
        const response = await fetch(blob.url)
        const content = await response.text()
        
        const { data: frontmatter, content: markdownContent } = matter(content)
        
        markdownFiles.push({
          title: frontmatter.title || 'Untitled',
          description: frontmatter.description || '',
          code: frontmatter.code || blob.pathname.replace('md/', '').replace('.md', ''),
          image: frontmatter.image,
          date: frontmatter.date,
          lastModified: blob.uploadedAt.toISOString(),
          content: markdownContent,
          url: blob.url,
          pathname: blob.pathname,
        })
      } catch (error) {
        console.error(`파일 파싱 오류 (${blob.pathname}):`, error)
        continue
      }
    }

    // 최신순으로 정렬
    return markdownFiles.sort((a, b) => 
      new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime()
    )
  } catch (error) {
    console.error('Blob에서 마크다운 파일 조회 오류:', error)
    return []
  }
}

/**
 * 특정 코드로 마크다운 파일을 가져옵니다
 */
export async function getBlobMarkdownByCode(code: string): Promise<MarkdownFile | null> {
  try {
    const files = await getBlobMarkdownFiles()
    return files.find(file => file.code === code) || null
  } catch (error) {
    console.error(`마크다운 파일 조회 오류 (${code}):`, error)
    return null
  }
}

/**
 * Blob에 새로운 마크다운 파일을 저장합니다
 */
export async function saveBlobMarkdownFile(data: {
  title: string
  description?: string
  code: string
  content: string
  image?: string
}): Promise<{ success: boolean; message: string; url?: string }> {
  try {
    const { title, description, code, content, image } = data

    // frontmatter 생성
    const frontmatter = `---
title: "${title}"
description: "${description || ''}"
code: "${code}"${image ? `\nimage: "${image}"` : ''}
date: "${new Date().toISOString()}"
---

`

    const fullContent = frontmatter + content
    const filename = `md/${code}.md`

    // 기존 파일 확인
    const existingFiles = await getBlobMarkdownFiles()
    const existingFile = existingFiles.find(file => file.code === code)
    
    if (existingFile) {
      return {
        success: false,
        message: '이미 존재하는 코드입니다.'
      }
    }

    // Blob에 파일 업로드
    const blob = await put(filename, fullContent, {
      access: 'public',
      token: process.env.BLOB_READ_WRITE_TOKEN,
    })

    return {
      success: true,
      message: '마크다운 파일이 성공적으로 생성되었습니다.',
      url: blob.url
    }
  } catch (error) {
    console.error('Blob 파일 저장 오류:', error)
    return {
      success: false,
      message: '파일 생성 중 오류가 발생했습니다.'
    }
  }
}

/**
 * Blob에서 마크다운 파일을 수정합니다
 */
export async function updateBlobMarkdownFile(data: {
  originalCode: string
  title: string
  description?: string
  code: string
  content: string
  image?: string
}): Promise<{ success: boolean; message: string; url?: string }> {
  try {
    const { originalCode, title, description, code, content, image } = data

    // 기존 파일 찾기
    const files = await getBlobMarkdownFiles()
    const existingFile = files.find(file => file.code === originalCode)
    
    if (!existingFile) {
      return {
        success: false,
        message: '수정할 파일을 찾을 수 없습니다.'
      }
    }

    // 코드가 변경되었고, 새 코드가 이미 존재하는지 확인
    if (originalCode !== code) {
      const codeExists = files.find(file => file.code === code && file.code !== originalCode)
      if (codeExists) {
        return {
          success: false,
          message: '이미 존재하는 코드입니다.'
        }
      }
    }

    // frontmatter 생성
    const frontmatter = `---
title: "${title}"
description: "${description || ''}"
code: "${code}"${image ? `\nimage: "${image}"` : ''}
date: "${new Date().toISOString()}"
---

`

    const fullContent = frontmatter + content
    const filename = `md/${code}.md`

    // 기존 파일 항상 삭제 (안전한 업데이트를 위해)
    await del(existingFile.url, {
      token: process.env.BLOB_READ_WRITE_TOKEN,
    })

    // 새 파일 업로드
    const blob = await put(filename, fullContent, {
      access: 'public',
      token: process.env.BLOB_READ_WRITE_TOKEN,
    })

    return {
      success: true,
      message: '마크다운 파일이 성공적으로 수정되었습니다.',
      url: blob.url
    }
  } catch (error) {
    console.error('Blob 파일 수정 오류:', error)
    return {
      success: false,
      message: '파일 수정 중 오류가 발생했습니다.'
    }
  }
}

/**
 * Blob에서 마크다운 파일을 삭제합니다
 */
export async function deleteBlobMarkdownFile(code: string): Promise<{ success: boolean; message: string }> {
  try {
    const files = await getBlobMarkdownFiles()
    const file = files.find(f => f.code === code)
    
    if (!file) {
      return {
        success: false,
        message: '파일을 찾을 수 없습니다.'
      }
    }

    await del(file.url, {
      token: process.env.BLOB_READ_WRITE_TOKEN,
    })

    return {
      success: true,
      message: '파일이 성공적으로 삭제되었습니다.'
    }
  } catch (error) {
    console.error('Blob 파일 삭제 오류:', error)
    return {
      success: false,
      message: '파일 삭제 중 오류가 발생했습니다.'
    }
  }
}

/**
 * Blob 스토리지 상태를 확인합니다
 */
export async function checkBlobStatus(): Promise<{ success: boolean; message: string; fileCount?: number }> {
  try {
    const { blobs } = await list({
      prefix: 'md/',
      token: process.env.BLOB_READ_WRITE_TOKEN,
    })

    return {
      success: true,
      message: 'Blob 스토리지가 정상적으로 연결되었습니다.',
      fileCount: blobs.length
    }
  } catch (error) {
    console.error('Blob 상태 확인 오류:', error)
    return {
      success: false,
      message: 'Blob 스토리지 연결에 실패했습니다.'
    }
  }
}

/**
 * Blob에서 모든 이미지 파일 목록을 가져옵니다
 */
export async function getBlobImages(): Promise<Array<{ url: string; filename: string; uploadedAt: string }>> {
  try {
    const { blobs } = await list({
      prefix: 'images/',
      token: process.env.BLOB_READ_WRITE_TOKEN,
    })

    return blobs.map(blob => ({
      url: blob.url,
      filename: blob.pathname.replace('images/', ''),
      uploadedAt: blob.uploadedAt.toISOString()
    }))
  } catch (error) {
    console.error('Blob 이미지 조회 오류:', error)
    return []
  }
}

/**
 * Blob에서 이미지 파일을 삭제합니다
 */
export async function deleteBlobImage(imageUrl: string): Promise<{ success: boolean; message: string }> {
  try {
    await del(imageUrl, {
      token: process.env.BLOB_READ_WRITE_TOKEN,
    })

    return {
      success: true,
      message: '이미지가 성공적으로 삭제되었습니다.'
    }
  } catch (error) {
    console.error('Blob 이미지 삭제 오류:', error)
    return {
      success: false,
      message: '이미지 삭제 중 오류가 발생했습니다.'
    }
  }
} 