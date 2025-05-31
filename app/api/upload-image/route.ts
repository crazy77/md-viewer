import { NextRequest, NextResponse } from 'next/server'
import { put } from '@vercel/blob'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('image') as File
    
    if (!file) {
      return NextResponse.json(
        { error: '이미지 파일이 필요합니다.' },
        { status: 400 }
      )
    }

    // 파일 유효성 검사
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: '지원하지 않는 이미지 형식입니다. (JPEG, PNG, GIF, WebP만 지원)' },
        { status: 400 }
      )
    }

    // 파일 크기 제한 (5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: '파일 크기가 너무 큽니다. (최대 5MB)' },
        { status: 400 }
      )
    }

    // 고유한 파일명 생성
    const timestamp = Date.now()
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
    const filename = `images/${timestamp}_${sanitizedName}`

    // Blob에 이미지 업로드
    const blob = await put(filename, file, {
      access: 'public',
      token: process.env.BLOB_READ_WRITE_TOKEN,
    })

    return NextResponse.json({
      success: true,
      message: '이미지가 성공적으로 업로드되었습니다.',
      url: blob.url,
      filename: blob.pathname
    }, { status: 201 })

  } catch (error) {
    console.error('이미지 업로드 오류:', error)
    return NextResponse.json(
      { error: '이미지 업로드 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
} 