// Blob 기반 마크다운 관리로 마이그레이션됨
// 이 파일은 하위 호환성을 위해 유지되며, Blob 함수들을 래핑합니다

import { getBlobMarkdownFiles, getBlobMarkdownByCode } from './blob'

export interface MarkdownFile {
  code: string
  title: string
  description?: string
  image?: string
  filename: string
  lastModified: string
  content: string
  slug: string
}

// 마크다운 파일 목록 가져오기 (Blob 버전)
export async function getMarkdownFiles(): Promise<Omit<MarkdownFile, 'content'>[]> {
  try {
    const blobFiles = await getBlobMarkdownFiles()
    
    // Blob MarkdownFile을 기존 형식으로 변환
    return blobFiles.map(file => ({
      code: file.code,
      title: file.title,
      description: file.description,
      image: file.image,
      filename: file.pathname.replace('md/', ''), // md/ 접두사 제거
      lastModified: new Date(file.lastModified).toLocaleDateString('ko-KR'),
      slug: file.code, // code를 slug로 사용
    })).sort((a, b) => a.title.localeCompare(b.title))
  } catch (error) {
    console.error('마크다운 파일을 읽는 중 오류가 발생했습니다:', error)
    return []
  }
}

// 특정 코드로 마크다운 파일 가져오기 (Blob 버전)
export async function getMarkdownByCode(code: string): Promise<MarkdownFile | null> {
  try {
    const blobFile = await getBlobMarkdownByCode(code)
    
    if (!blobFile) {
      return null
    }
    
    // Blob MarkdownFile을 기존 형식으로 변환
    return {
      code: blobFile.code,
      title: blobFile.title,
      description: blobFile.description,
      image: blobFile.image,
      filename: blobFile.pathname.replace('md/', ''),
      lastModified: new Date(blobFile.lastModified).toLocaleDateString('ko-KR'),
      content: blobFile.content,
      slug: blobFile.code,
    }
  } catch (error) {
    console.error('마크다운 파일을 읽는 중 오류가 발생했습니다:', error)
    return null
  }
}

// 슬러그로 마크다운 파일 가져오기 (Blob 버전)
export async function getMarkdownBySlug(slug: string): Promise<MarkdownFile | null> {
  // slug는 일반적으로 code와 동일하므로 getMarkdownByCode를 사용
  return await getMarkdownByCode(slug)
} 