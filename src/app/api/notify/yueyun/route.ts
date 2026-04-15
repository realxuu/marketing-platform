import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const { memberId, action, plateNumber, plateColor, idNumber } = data

    console.log('Notify Yueyun:', {
      memberId,
      action,
      plateNumber,
      plateColor,
      idNumber,
      timestamp: new Date().toISOString(),
    })

    return NextResponse.json({
      success: true,
      message: `已通知粤运：${action}`,
      data: { memberId, action }
    })
  } catch (error) {
    console.error('POST /api/notify/yueyun error:', error)
    return NextResponse.json({ error: 'Failed to notify yueyun' }, { status: 500 })
  }
}
