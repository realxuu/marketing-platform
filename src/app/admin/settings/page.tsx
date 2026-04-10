'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Shield, Settings, Users, CreditCard, TrendingUp, DollarSign, FileText, BarChart3, Save, Package, CheckCircle, AlertTriangle } from 'lucide-react'

interface ConfigCategory {
  [key: string]: string
}

interface Config {
  BILLING: ConfigCategory
  MEMBER: ConfigCategory
  GENERAL: ConfigCategory
}

const configLabels: Record<string, { label: string; unit?: string; description?: string }> = {
  trial_days: { label: '免费体验期', unit: '天', description: '新用户开通后的免费体验天数' },
  yearly_price: { label: '年卡价格', unit: '元', description: '年卡会员售价' },
  monthly_price: { label: '月卡价格', unit: '元', description: '月卡会员售价' },
  per_use_price: { label: '次卡单价', unit: '元/次', description: '每次通行扣费金额' },
  monthly_cap: { label: '次卡月封顶', unit: '元', description: '次卡每月最高扣费金额' },
  max_retry_days: { label: '扣费重试天数', unit: '天', description: '扣费失败后重试的最大天数' },
  rescue_limit_yearly: { label: '年卡救援次数', unit: '次', description: '0表示不限次数' },
  rescue_limit_monthly: { label: '月卡救援次数', unit: '次', description: '月卡每月可用救援次数' },
  rescue_limit_per_use: { label: '次卡救援次数', unit: '次', description: '次卡每次通行可用救援次数' },
  rescue_amount_monthly: { label: '月卡救援限额', unit: '元', description: '月卡单次救援最高金额' },
  rescue_amount_per_use: { label: '次卡救援限额', unit: '元', description: '次卡单次救援最高金额' },
  rescue_yearly_cap: { label: '次卡年度累计限额', unit: '元', description: '次卡年度救援累计最高金额' },
}

export default function SettingsPage() {
  const [config, setConfig] = useState<Config | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const loadConfig = () => {
    setLoading(true)
    fetch('/api/config')
      .then(res => res.json())
      .then(data => {
        setConfig(data)
        setLoading(false)
      })
  }

  useEffect(() => {
    loadConfig()
  }, [])

  const handleSave = async () => {
    if (!config) return

    setSaving(true)
    setMessage(null)

    const configs = [
      ...Object.entries(config.BILLING).map(([key, value]) => ({ key, value })),
      ...Object.entries(config.MEMBER).map(([key, value]) => ({ key, value })),
      ...Object.entries(config.GENERAL).map(([key, value]) => ({ key, value })),
    ]

    const res = await fetch('/api/config', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ configs }),
    })

    setSaving(false)

    if (res.ok) {
      setMessage({ type: 'success', text: '配置保存成功' })
    } else {
      setMessage({ type: 'error', text: '配置保存失败' })
    }
  }

  const updateConfig = (category: keyof Config, key: string, value: string) => {
    if (!config) return
    setConfig({
      ...config,
      [category]: {
        ...config[category],
        [key]: value,
      },
    })
  }

  if (loading || !config) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-400">加载中...</div>
      </div>
    )
  }

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
          <Link href="/admin/billing-control" className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white">
            <CreditCard className="w-5 h-5" />
            <span>扣费控制</span>
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
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">系统配置</h1>
          {message && (
            <Badge className={message.type === 'success' ? 'bg-green-500' : 'bg-red-500'}>
              {message.text}
            </Badge>
          )}
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* 扣费配置 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                扣费配置
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {['yearly_price', 'monthly_price', 'per_use_price', 'monthly_cap'].map(key => (
                <div key={key}>
                  <Label className="flex items-center gap-2">
                    {configLabels[key]?.label}
                    {configLabels[key]?.unit && <span className="text-gray-400 text-xs">({configLabels[key]?.unit})</span>}
                  </Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={config.BILLING[key] || ''}
                    onChange={e => updateConfig('BILLING', key, e.target.value)}
                    className="mt-1"
                  />
                  {configLabels[key]?.description && (
                    <p className="text-xs text-gray-400 mt-1">{configLabels[key].description}</p>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* 会员配置 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Users className="w-4 h-4" />
                会员配置
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {['trial_days', 'max_retry_days'].map(key => (
                <div key={key}>
                  <Label className="flex items-center gap-2">
                    {configLabels[key]?.label}
                    {configLabels[key]?.unit && <span className="text-gray-400 text-xs">({configLabels[key]?.unit})</span>}
                  </Label>
                  <Input
                    type="number"
                    value={config.MEMBER[key] || ''}
                    onChange={e => updateConfig('MEMBER', key, e.target.value)}
                    className="mt-1"
                  />
                  {configLabels[key]?.description && (
                    <p className="text-xs text-gray-400 mt-1">{configLabels[key].description}</p>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* 救援权益配置 */}
          <Card className="col-span-2">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Shield className="w-4 h-4" />
                救援权益配置
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                {['rescue_limit_yearly', 'rescue_limit_monthly', 'rescue_limit_per_use', 'rescue_amount_monthly', 'rescue_amount_per_use', 'rescue_yearly_cap'].map(key => (
                  <div key={key}>
                    <Label className="flex items-center gap-2">
                      {configLabels[key]?.label}
                      {configLabels[key]?.unit && <span className="text-gray-400 text-xs">({configLabels[key]?.unit})</span>}
                    </Label>
                    <Input
                      type="number"
                      value={config.MEMBER[key] || ''}
                      onChange={e => updateConfig('MEMBER', key, e.target.value)}
                      className="mt-1"
                    />
                    {configLabels[key]?.description && (
                      <p className="text-xs text-gray-400 mt-1">{configLabels[key].description}</p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 封顶说明 */}
          <Card className="col-span-2">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-yellow-500" />
                封顶控制说明
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-gray-600 space-y-2">
                <p>• <strong>次卡月封顶</strong>：用户使用次卡模式时，每月最高扣费金额达到封顶后，后续通行不再扣费</p>
                <p>• <strong>扣费重试</strong>：扣费失败后，系统将在指定天数内持续重试，超过天数后自动取消服务</p>
                <p>• <strong>救援限额</strong>：单次救援的最高赔付金额，超出部分由用户承担</p>
                <p>• <strong>年度累计限额</strong>：次卡用户年度救援累计达到限额后，后续救援需用户自费</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end mt-6">
          <Button onClick={handleSave} disabled={saving}>
            <Save className="w-4 h-4 mr-2" />
            {saving ? '保存中...' : '保存配置'}
          </Button>
        </div>
      </main>
    </div>
  )
}
