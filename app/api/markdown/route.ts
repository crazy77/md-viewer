import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function POST(request: NextRequest) {
  try {
    const { title, description, code, content, image } = await request.json()

    if (!title || !code || !content) {
      return NextResponse.json(
        { error: '제목, 코드, 내용은 필수입니다.' },
        { status: 400 }
      )
    }

    // 파일명 생성 (코드 기반)
    const fileName = `${code}.md`
    const filePath = path.join(process.cwd(), 'content', fileName)

    // 이미 존재하는 파일인지 확인
    if (fs.existsSync(filePath)) {
      return NextResponse.json(
        { error: '이미 존재하는 코드입니다.' },
        { status: 409 }
      )
    }

    // frontmatter와 content 결합
    const frontmatter = `---
title: "${title}"
description: "${description || ''}"
code: "${code}"${image ? `\nimage: "${image}"` : ''}
date: "${new Date().toISOString()}"
---

`

    const fullContent = frontmatter + content

    // content 디렉토리가 없으면 생성
    const contentDir = path.join(process.cwd(), 'content')
    if (!fs.existsSync(contentDir)) {
      fs.mkdirSync(contentDir, { recursive: true })
    }

    // 파일 저장
    fs.writeFileSync(filePath, fullContent, 'utf8')

    return NextResponse.json(
      { 
        message: '마크다운 파일이 성공적으로 생성되었습니다.',
        fileName,
        code
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('파일 생성 오류:', error)
    return NextResponse.json(
      { error: '파일 생성 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
} 