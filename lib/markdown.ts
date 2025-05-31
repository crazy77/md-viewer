import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

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

const contentDirectory = path.join(process.cwd(), 'content')

// 마크다운 파일 목록 가져오기
export async function getMarkdownFiles(): Promise<Omit<MarkdownFile, 'content'>[]> {
  try {
    // content 폴더가 없으면 생성
    if (!fs.existsSync(contentDirectory)) {
      fs.mkdirSync(contentDirectory, { recursive: true })
      return []
    }

    const filenames = fs.readdirSync(contentDirectory)
    const markdownFiles = filenames.filter(name => name.endsWith('.md'))

    const files = await Promise.all(
      markdownFiles.map(async (filename) => {
        const fullPath = path.join(contentDirectory, filename)
        const fileContents = fs.readFileSync(fullPath, 'utf8')
        const { data, content } = matter(fileContents)
        const stats = fs.statSync(fullPath)

        return {
          code: data.code || filename.replace('.md', ''),
          title: data.title || filename.replace('.md', ''),
          description: data.description,
          image: data.image,
          filename,
          lastModified: stats.mtime.toLocaleDateString('ko-KR'),
          slug: filename.replace('.md', ''),
        }
      })
    )

    return files.sort((a, b) => a.title.localeCompare(b.title))
  } catch (error) {
    console.error('마크다운 파일을 읽는 중 오류가 발생했습니다:', error)
    return []
  }
}

// 특정 코드로 마크다운 파일 가져오기
export async function getMarkdownByCode(code: string): Promise<MarkdownFile | null> {
  try {
    if (!fs.existsSync(contentDirectory)) {
      return null
    }

    const filenames = fs.readdirSync(contentDirectory)
    
    for (const filename of filenames) {
      if (!filename.endsWith('.md')) continue
      
      const fullPath = path.join(contentDirectory, filename)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const { data, content } = matter(fileContents)
      const stats = fs.statSync(fullPath)

      const fileCode = data.code || filename.replace('.md', '')
      
      if (fileCode === code) {
        return {
          code: fileCode,
          title: data.title || filename.replace('.md', ''),
          description: data.description,
          image: data.image,
          filename,
          lastModified: stats.mtime.toLocaleDateString('ko-KR'),
          content,
          slug: filename.replace('.md', ''),
        }
      }
    }

    return null
  } catch (error) {
    console.error('마크다운 파일을 읽는 중 오류가 발생했습니다:', error)
    return null
  }
}

// 슬러그로 마크다운 파일 가져오기
export async function getMarkdownBySlug(slug: string): Promise<MarkdownFile | null> {
  try {
    const fullPath = path.join(contentDirectory, `${slug}.md`)
    
    if (!fs.existsSync(fullPath)) {
      return null
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const { data, content } = matter(fileContents)
    const stats = fs.statSync(fullPath)

    return {
      code: data.code || slug,
      title: data.title || slug,
      description: data.description,
      image: data.image,
      filename: `${slug}.md`,
      lastModified: stats.mtime.toLocaleDateString('ko-KR'),
      content,
      slug,
    }
  } catch (error) {
    console.error('마크다운 파일을 읽는 중 오류가 발생했습니다:', error)
    return null
  }
} 