import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { saveBlobMarkdownFile, updateBlobMarkdownFile, deleteBlobMarkdownFile, getBlobMarkdownFiles } from '@/lib/blob'

export async function POST(request: NextRequest) {
  try {
    const { title, description, code, content, image } = await request.json()

    if (!title || !code || !content) {
      return NextResponse.json(
        { error: '제목, 코드, 내용은 필수입니다.' },
        { status: 400 }
      )
    }

    // Blob에 파일 저장
    const result = await saveBlobMarkdownFile({
      title,
      description,
      code,
      content,
      image
    })

    if (!result.success) {
      return NextResponse.json(
        { error: result.message },
        { status: result.message === '이미 존재하는 코드입니다.' ? 409 : 500 }
      )
    }

    // 홈페이지 캐시 무효화 (새 파일 추가됨)
    revalidatePath('/')
    
    return NextResponse.json(
      { 
        message: result.message,
        fileName: `${code}.md`,
        code,
        url: result.url
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

export async function PUT(request: NextRequest) {
  try {
    const { originalCode, title, description, code, content, image } = await request.json()

    if (!originalCode || !title || !code || !content) {
      return NextResponse.json(
        { error: '원본 코드, 제목, 코드, 내용은 필수입니다.' },
        { status: 400 }
      )
    }

    // Blob에서 파일 수정
    const result = await updateBlobMarkdownFile({
      originalCode,
      title,
      description,
      code,
      content,
      image
    })

    if (!result.success) {
      const statusCode = result.message === '수정할 파일을 찾을 수 없습니다.' ? 404 :
                        result.message === '이미 존재하는 코드입니다.' ? 409 : 500
      return NextResponse.json(
        { error: result.message },
        { status: statusCode }
      )
    }

    // 관련 페이지 캐시 무효화
    revalidatePath('/')  // 홈페이지
    revalidatePath(`/view/${originalCode}`)  // 기존 뷰어 페이지
    if (originalCode !== code) {
      revalidatePath(`/view/${code}`)  // 새로운 뷰어 페이지 (코드 변경 시)
    }
    
    return NextResponse.json(
      { 
        message: result.message,
        fileName: `${code}.md`,
        code,
        url: result.url
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('파일 수정 오류:', error)
    return NextResponse.json(
      { error: '파일 수정 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { code } = await request.json()

    if (!code) {
      return NextResponse.json(
        { error: '코드는 필수입니다.' },
        { status: 400 }
      )
    }

    // Blob에서 파일 삭제
    const result = await deleteBlobMarkdownFile(code)

    if (!result.success) {
      const statusCode = result.message === '파일을 찾을 수 없습니다.' ? 404 : 500
      return NextResponse.json(
        { error: result.message },
        { status: statusCode }
      )
    }

    // 관련 페이지 캐시 무효화 (파일 삭제됨)
    revalidatePath('/')  // 홈페이지
    revalidatePath(`/view/${code}`)  // 뷰어 페이지
    
    return NextResponse.json(
      { 
        message: result.message,
        code
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('파일 삭제 오류:', error)
    return NextResponse.json(
      { error: '파일 삭제 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')

    if (code) {
      // 특정 파일 조회
      const files = await getBlobMarkdownFiles()
      const file = files.find(f => f.code === code)
      
      if (!file) {
        return NextResponse.json(
          { error: '파일을 찾을 수 없습니다.' },
          { status: 404 }
        )
      }

      return NextResponse.json(file, { status: 200 })
    } else {
      // 모든 파일 목록 조회
      const files = await getBlobMarkdownFiles()
      return NextResponse.json(files, { status: 200 })
    }
  } catch (error) {
    console.error('파일 조회 오류:', error)
    return NextResponse.json(
      { error: '파일 조회 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
} 