import { NextResponse } from 'next/server'
import { checkBlobStatus } from '@/lib/blob'

export async function GET() {
  try {
    const status = await checkBlobStatus()
    
    return NextResponse.json(status, {
      status: status.success ? 200 : 500
    })
  } catch (error) {
    console.error('Blob 상태 확인 오류:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: 'Blob 상태 확인 중 오류가 발생했습니다.' 
      },
      { status: 500 }
    )
  }
} 