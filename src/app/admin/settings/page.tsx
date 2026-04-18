'use client'

import { useEffect, useState } from 'react'
import { Sidebar } from '@/components/admin/Sidebar'
import { DollarSign, Users, Shield, AlertTriangle, Save } from 'lucide-react'

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

  useEffect(() => {
    setLoading(true)
    fetch('/api/config')
      .then(res => res.json())
      .then(data => {
        setConfig(data)
        setLoading(false)
      })
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
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f6f5f4' }}>
        <p style={{ color: '#615d59' }}>加载中...</p>
      </div>
    )
  }

  const renderInput = (category: keyof Config, key: string) => (
    <div>
      <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 500, color: 'rgba(0,0,0,0.95)', marginBottom: 6 }}>
        {configLabels[key]?.label}
        {configLabels[key]?.unit && <span style={{ color: '#a39e98', fontSize: 12 }}>({configLabels[key]?.unit})</span>}
      </label>
      <input
        type="number"
        step="0.1"
        value={config[category][key] || ''}
        onChange={e => updateConfig(category, key, e.target.value)}
        style={{ width: '100%', border: '1px solid rgba(0, 0, 0, 0.1)', borderRadius: 6, padding: '8px 12px', fontSize: 14, outline: 'none' }}
      />
      {configLabels[key]?.description && (
        <p style={{ fontSize: 12, color: '#a39e98', marginTop: 4 }}>{configLabels[key].description}</p>
      )}
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: '#f6f5f4' }}>
      <Sidebar activePath="/admin/settings" />

      <main style={{ marginLeft: 220, padding: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: 'rgba(0,0,0,0.95)' }}>系统配置</h1>
          {message && (
            <span style={{ background: message.type === 'success' ? '#f0fdf4' : '#fef2f2', color: message.type === 'success' ? '#1aae39' : '#dc2626', padding: '6px 12px', borderRadius: 6, fontSize: 13, fontWeight: 500 }}>
              {message.text}
            </span>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24 }}>
          {/* Billing Config */}
          <div style={{ background: '#fff', border: '1px solid rgba(0, 0, 0, 0.1)', borderRadius: 12 }}>
            <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(0, 0, 0, 0.1)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <DollarSign style={{ width: 16, height: 16, color: '#0075de' }} />
              <h2 style={{ fontSize: 14, fontWeight: 600, margin: 0 }}>扣费配置</h2>
            </div>
            <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>
              {['yearly_price', 'monthly_price', 'per_use_price', 'monthly_cap'].map(key => (
                <div key={key}>{renderInput('BILLING', key)}</div>
              ))}
            </div>
          </div>

          {/* Member Config */}
          <div style={{ background: '#fff', border: '1px solid rgba(0, 0, 0, 0.1)', borderRadius: 12 }}>
            <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(0, 0, 0, 0.1)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Users style={{ width: 16, height: 16, color: '#0075de' }} />
              <h2 style={{ fontSize: 14, fontWeight: 600, margin: 0 }}>会员配置</h2>
            </div>
            <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>
              {['trial_days', 'max_retry_days'].map(key => (
                <div key={key}>{renderInput('MEMBER', key)}</div>
              ))}
            </div>
          </div>

          {/* Rescue Config */}
          <div style={{ background: '#fff', border: '1px solid rgba(0, 0, 0, 0.1)', borderRadius: 12, gridColumn: 'span 2' }}>
            <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(0, 0, 0, 0.1)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Shield style={{ width: 16, height: 16, color: '#0075de' }} />
              <h2 style={{ fontSize: 14, fontWeight: 600, margin: 0 }}>救援权益配置</h2>
            </div>
            <div style={{ padding: 16, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
              {['rescue_limit_yearly', 'rescue_limit_monthly', 'rescue_limit_per_use', 'rescue_amount_monthly', 'rescue_amount_per_use', 'rescue_yearly_cap'].map(key => (
                <div key={key}>{renderInput('MEMBER', key)}</div>
              ))}
            </div>
          </div>

          {/* Cap Info */}
          <div style={{ background: '#fff', border: '1px solid rgba(0, 0, 0, 0.1)', borderRadius: 12, gridColumn: 'span 2' }}>
            <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(0, 0, 0, 0.1)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <AlertTriangle style={{ width: 16, height: 16, color: '#dd5b00' }} />
              <h2 style={{ fontSize: 14, fontWeight: 600, margin: 0 }}>封顶控制说明</h2>
            </div>
            <div style={{ padding: 16, fontSize: 14, color: '#615d59' }}>
              <p style={{ marginBottom: 8 }}>• <strong>次卡月封顶</strong>：用户使用次卡模式时，每月最高扣费金额达到封顶后，后续通行不再扣费</p>
              <p style={{ marginBottom: 8 }}>• <strong>扣费重试</strong>：扣费失败后，系统将在指定天数内持续重试，超过天数后自动取消服务</p>
              <p style={{ marginBottom: 8 }}>• <strong>救援限额</strong>：单次救援的最高赔付金额，超出部分由用户承担</p>
              <p>• <strong>年度累计限额</strong>：次卡用户年度救援累计达到限额后，后续救援需用户自费</p>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 24 }}>
          <button
            onClick={handleSave}
            disabled={saving}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 20px',
              background: '#0075de',
              color: '#fff',
              border: 'none',
              borderRadius: 6,
              fontSize: 14,
              fontWeight: 600,
              cursor: saving ? 'not-allowed' : 'pointer',
              opacity: saving ? 0.7 : 1,
            }}
          >
            <Save style={{ width: 16, height: 16 }} />
            {saving ? '保存中...' : '保存配置'}
          </button>
        </div>
      </main>
    </div>
  )
}
