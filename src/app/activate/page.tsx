'use client'

import { Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Gift, Crown, Shield, ChevronRight, Loader2 } from 'lucide-react'
import Link from 'next/link'

function ActivateContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  const plateNumber = searchParams.get('plateNumber') || ''
  const plateColor = searchParams.get('plateColor') || 'BLUE'
  const channel = searchParams.get('channel') || 'ALIPAY'
  const name = searchParams.get('name') || ''
  const phone = searchParams.get('phone') || ''

  useEffect(() => {
    // 短暂加载后直接展示会员页面
    const timer = setTimeout(() => {
      setLoading(false)
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto px-4 py-6">
        {/* 顶部信息条 */}
        <div className="bg-white rounded-lg border p-3 mb-4 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            车牌 <span className="font-medium text-gray-900">{plateNumber}</span>
          </div>
          <div className="text-xs text-green-600 flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
            已激活
          </div>
        </div>

        {/* 会员推荐 */}
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-4">
            <div className="flex items-center gap-2 mb-1">
              <Crown className="w-5 h-5" />
              <span className="font-medium">开通会员享专属权益</span>
            </div>
            <p className="text-blue-100 text-sm">高速救援、设备更换、出行保障</p>
          </div>
          <div className="p-4">
            {/* 体验期提示 */}
            <div className="bg-orange-50 rounded-lg p-3 mb-4 flex items-start gap-2">
              <Gift className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <span className="text-orange-700 font-medium">新用户专享2个月免费体验期</span>
                <p className="text-orange-600 text-xs mt-0.5">体验期内可随时取消，不产生费用</p>
              </div>
            </div>

            {/* 权益列表 */}
            <div className="space-y-3 mb-4">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-green-500" />
                <div>
                  <div className="text-sm font-medium">粤运道路救援</div>
                  <div className="text-xs text-gray-400">高速故障免费救援</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-green-500" />
                <div>
                  <div className="text-sm font-medium">ETC设备只换不修</div>
                  <div className="text-xs text-gray-400">设备故障免费更换</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-green-500" />
                <div>
                  <div className="text-sm font-medium">高速意外险</div>
                  <div className="text-xs text-gray-400">出行安全保障</div>
                </div>
              </div>
            </div>

            <Link
              href={`/membership/select?plateNumber=${plateNumber}&plateColor=${plateColor}&channel=${channel}&name=${encodeURIComponent(name)}&phone=${phone}`}
              className="block"
            >
              <button className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium flex items-center justify-center gap-1 hover:bg-blue-700 transition-colors">
                选择会员套餐
                <ChevronRight className="w-4 h-4" />
              </button>
            </Link>
          </div>
        </div>

        <div className="text-center mt-4">
          <Link href="/" className="text-sm text-gray-400 hover:text-gray-600">
            暂不开通
          </Link>
        </div>
      </div>
    </div>
  )
}

function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
    </div>
  )
}

export default function ActivatePage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ActivateContent />
    </Suspense>
  )
}
