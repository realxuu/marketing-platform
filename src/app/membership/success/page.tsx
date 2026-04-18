'use client'

import Link from 'next/link'
import { CheckCircle, Gift, Shield, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function MembershipSuccessPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 成功提示 */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
        <div className="max-w-md mx-auto px-4 py-12 text-center">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-12 h-12" />
          </div>
          <h1 className="text-2xl font-bold mb-2">开通成功</h1>
          <p className="text-blue-100">您已成功开通会员服务</p>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6">
        {/* 体验期提示 */}
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Gift className="w-5 h-5 text-orange-500" />
            <span className="font-medium text-orange-700">2个月免费体验期</span>
          </div>
          <p className="text-sm text-orange-600">
            体验期内可随时取消，不产生任何费用。体验期结束后将自动扣费开通正式会员。
          </p>
        </div>

        {/* 权益列表 */}
        <div className="bg-white rounded-xl border p-4 mb-6">
          <h3 className="font-medium mb-3 flex items-center gap-2">
            <Shield className="w-4 h-4 text-green-500" />
            您的专属权益
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b">
              <span className="text-gray-600">粤运道路救援</span>
              <span className="text-green-600 text-sm">已开通</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b">
              <span className="text-gray-600">ETC设备只换不修</span>
              <span className="text-green-600 text-sm">已开通</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-gray-600">高速意外险</span>
              <span className="text-green-600 text-sm">已开通</span>
            </div>
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="space-y-3">
          <Link href="/member" className="block">
            <Button className="w-full h-11">
              查看我的会员
              <ChevronRight className="w-4 h-4" />
            </Button>
          </Link>
          <Link href="/" className="block">
            <Button variant="outline" className="w-full h-11">
              返回首页
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
