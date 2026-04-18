'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Crown, Shield, Car, CreditCard, Gift, ChevronRight, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function HomePage() {
  return (
    <div className="min-h-screen pb-16 bg-gray-50">
      {/* 头部横幅 */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-md mx-auto px-4 py-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <Car className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold">粤通卡服务</h1>
              <p className="text-blue-100 text-sm">ETC申办 · 会员服务</p>
            </div>
          </div>
        </div>
      </div>

      {/* 内容区域 */}
      <div className="max-w-md mx-auto px-4 py-6 space-y-4">
        {/* ETC申办入口 */}
        <div className="bg-white rounded-xl border overflow-hidden">
          <div className="p-4 border-b bg-gray-50">
            <h2 className="font-medium flex items-center gap-2">
              <Car className="w-5 h-5 text-blue-600" />
              ETC在线申办
            </h2>
          </div>
          <div className="p-4">
            <div className="space-y-2 mb-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                <span>免费办理，包邮到家</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                <span>支持支付宝/微信/银联签约</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                <span>快速审核，3-5个工作日寄出</span>
              </div>
            </div>
            <Link href="/apply">
              <Button className="w-full">
                立即申办
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
        </div>

        {/* 会员服务 */}
        <div className="bg-white rounded-xl border overflow-hidden">
          <div className="p-4 border-b bg-gray-50 flex items-center justify-between">
            <h2 className="font-medium flex items-center gap-2">
              <Crown className="w-5 h-5 text-orange-500" />
              会员服务
            </h2>
            <Link href="/membership/select" className="text-sm text-blue-600">
              查看套餐
            </Link>
          </div>
          <div className="p-4">
            {/* 体验期提示 */}
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-4 flex items-start gap-2">
              <Gift className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
              <div className="text-xs">
                <span className="text-orange-700 font-medium">新用户专享2个月免费体验期</span>
              </div>
            </div>

            {/* 套餐预览 */}
            <div className="grid grid-cols-3 gap-2">
              <div className="border rounded-lg p-2 text-center bg-blue-50 border-blue-200">
                <div className="text-xs text-gray-500">年卡</div>
                <div className="text-blue-600 font-bold text-sm">¥138</div>
              </div>
              <div className="border rounded-lg p-2 text-center">
                <div className="text-xs text-gray-500">月卡</div>
                <div className="text-green-600 font-bold text-sm">¥16.8</div>
              </div>
              <div className="border rounded-lg p-2 text-center">
                <div className="text-xs text-gray-500">次卡</div>
                <div className="text-orange-600 font-bold text-sm">¥1/次</div>
              </div>
            </div>
          </div>
        </div>

        {/* 权益说明 */}
        <div className="bg-white rounded-xl border p-4">
          <h3 className="font-medium mb-3 text-sm">会员权益</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-green-500" />
              <span className="text-xs text-gray-600">粤运道路救援</span>
            </div>
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-blue-500" />
              <span className="text-xs text-gray-600">设备只换不修</span>
            </div>
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-purple-500" />
              <span className="text-xs text-gray-600">高速意外险</span>
            </div>
            <div className="flex items-center gap-2">
              <Gift className="w-4 h-4 text-orange-500" />
              <span className="text-xs text-gray-600">更多权益</span>
            </div>
          </div>
        </div>
      </div>

      {/* 底部导航 */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t">
        <div className="max-w-md mx-auto flex">
          <Link href="/" className="flex-1 flex flex-col items-center py-3 text-blue-600">
            <Car className="w-5 h-5" />
            <span className="text-xs mt-1">ETC申办</span>
          </Link>
          <Link href="/rights" className="flex-1 flex flex-col items-center py-3 text-gray-400">
            <Shield className="w-5 h-5" />
            <span className="text-xs mt-1">权益</span>
          </Link>
          <Link href="/member" className="flex-1 flex flex-col items-center py-3 text-gray-400">
            <Crown className="w-5 h-5" />
            <span className="text-xs mt-1">我的</span>
          </Link>
        </div>
      </nav>
    </div>
  )
}
