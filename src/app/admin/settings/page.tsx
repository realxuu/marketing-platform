'use client'

import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Shield, Settings, Users, CreditCard, TrendingUp, DollarSign, FileText, BarChart3, Save, Package, CheckCircle } from 'lucide-react'

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <aside className="fixed left-0 top-0 bottom-0 w-64 bg-slate-900 text-white p-4">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
            <BarChart3 className="w-5 h-5" />
          </div>
          <span className="font-bold">营销平台管理</span>
        </div>
        <nav className="space-y-1">
          <Link href="/admin" className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white">
            <TrendingUp className="w-5 h-5" />
            <span>仪表盘</span>
          </Link>
          <Link href="/admin/products" className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white">
            <Package className="w-5 h-5" />
            <span>产品管理</span>
          </Link>
          <Link href="/admin/rights" className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white">
            <Shield className="w-5 h-5" />
            <span>权益管理</span>
          </Link>
          <Link href="/admin/usages" className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white">
            <CheckCircle className="w-5 h-5" />
            <span>权益核销</span>
          </Link>
          <Link href="/admin/orders" className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white">
            <FileText className="w-5 h-5" />
            <span>订单管理</span>
          </Link>
          <Link href="/admin/members" className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white">
            <Users className="w-5 h-5" />
            <span>会员管理</span>
          </Link>
          <Link href="/admin/settlement" className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white">
            <DollarSign className="w-5 h-5" />
            <span>结算对账</span>
          </Link>
          <Link href="/admin/settings" className="flex items-center gap-3 px-3 py-2 rounded-lg bg-slate-800 text-white">
            <Settings className="w-5 h-5" />
            <span>系统配置</span>
          </Link>
        </nav>
      </aside>

      <main className="ml-64 p-6">
        <h1 className="text-2xl font-bold mb-6">系统配置</h1>

        <div className="grid grid-cols-2 gap-6">
          {/* 会员产品配置 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">会员产品配置</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>年卡价格（元）</Label>
                  <Input type="number" defaultValue="138" />
                </div>
                <div>
                  <Label>年卡有效期（天）</Label>
                  <Input type="number" defaultValue="365" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>月卡价格（元）</Label>
                  <Input type="number" defaultValue="16.8" />
                </div>
                <div>
                  <Label>月卡有效期（天）</Label>
                  <Input type="number" defaultValue="30" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>次卡价格（元/次）</Label>
                  <Input type="number" defaultValue="1" />
                </div>
                <div>
                  <Label>次卡月封顶（元）</Label>
                  <Input type="number" defaultValue="20" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 体验期配置 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">体验期配置</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>新用户体验期（天）</Label>
                <Input type="number" defaultValue="61" />
              </div>
              <div>
                <Label>到期前提醒天数</Label>
                <Input type="number" defaultValue="7" />
              </div>
              <div>
                <Label>扣款失败自动取消天数</Label>
                <Input type="number" defaultValue="3" />
              </div>
            </CardContent>
          </Card>

          {/* 扣费配置 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">扣费配置</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>微信支付费率（%）</Label>
                <Input type="number" defaultValue="0.6" step="0.1" />
              </div>
              <div>
                <Label>支付宝费率（%）</Label>
                <Input type="number" defaultValue="0.6" step="0.1" />
              </div>
              <div>
                <Label>云闪付费率（%）</Label>
                <Input type="number" defaultValue="0" step="0.1" />
              </div>
            </CardContent>
          </Card>

          {/* 权益成本配置 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">权益成本配置</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>粤运拯救成本（元/户/年）</Label>
                <Input type="number" defaultValue="29.9" />
              </div>
              <div>
                <Label>设备更换成本（元/次）</Label>
                <Input type="number" defaultValue="40" />
              </div>
              <div>
                <Label>往返邮寄费（元/次）</Label>
                <Input type="number" defaultValue="16" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end mt-6">
          <Button>
            <Save className="w-4 h-4 mr-2" />
            保存配置
          </Button>
        </div>
      </main>
    </div>
  )
}
