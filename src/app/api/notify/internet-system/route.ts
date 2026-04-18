import { NextResponse } from 'next/server'

// 通知互联网系统（解约请求等）
export async function POST(request: Request) {
  try {
    const data = await request.json()
    const { memberId, action, userId, reason } = data

    // 实际生产环境应调用互联网系统API
    // const response = await fetch(process.env.INTERNET_SYSTEM_API_URL, { ... })

    return NextResponse.json({
      success: true,
      message: `已通知互联网系统：${action}`,
      data: { memberId, action, userId, reason },
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to notify internet system' }, { status: 500 })
  }
}
