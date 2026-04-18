'use client'

import { useState } from 'react'
import { ArrowLeft, CheckCircle } from 'lucide-react'
import Link from 'next/link'

export default function ApplyPage() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    idNumber: '',
    plateNumber: '',
    plateColor: 'BLUE',
    channel: '',
  })
  const [agreed, setAgreed] = useState(false)

  const handleSubmit = async () => {
    if (!agreed || !formData.channel) return
    setStep(3)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#ffffff' }}>
      {/* Header */}
      <header style={{ background: '#ffffff', borderBottom: '1px solid rgba(0, 0, 0, 0.1)', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ maxWidth: '768px', margin: '0 auto', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link href="/">
            <ArrowLeft style={{ width: 20, height: 20, color: '#615d59' }} />
          </Link>
          <h1 style={{ fontSize: '16px', fontWeight: 500, margin: 0, color: 'rgba(0,0,0,0.95)' }}>ETC申办</h1>
        </div>
      </header>

      {/* Steps */}
      <div style={{ background: '#ffffff', borderBottom: '1px solid rgba(0, 0, 0, 0.1)' }}>
        <div style={{ maxWidth: '768px', margin: '0 auto', padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, fontSize: '14px' }}>
          {[1, 2, 3].map((s) => (
            <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 6, color: step >= s ? '#0075de' : '#a39e98' }}>
              <div style={{
                width: 20,
                height: 20,
                borderRadius: '50%',
                fontSize: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: step >= s ? '#0075de' : '#f6f5f4',
                color: step >= s ? '#fff' : '#a39e98',
              }}>
                {step > s ? '✓' : s}
              </div>
              <span>{s === 1 ? '填写信息' : s === 2 ? '选择渠道' : '提交'}</span>
              {s < 3 && <div style={{ width: 24, height: 1, background: '#ebebeb' }} />}
            </div>
          ))}
        </div>
      </div>

      <main style={{ maxWidth: '768px', margin: '0 auto', padding: '24px 16px' }}>
        {step === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ background: '#ffffff', border: '1px solid rgba(0, 0, 0, 0.1)', borderRadius: 12, padding: 16 }}>
              <h2 style={{ fontSize: '16px', fontWeight: 600, margin: '0 0 16px 0', color: 'rgba(0,0,0,0.95)' }}>填写申办信息</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {[
                  { label: '姓名', key: 'name', placeholder: '请输入姓名' },
                  { label: '手机号', key: 'phone', placeholder: '请输入手机号', type: 'tel' },
                  { label: '身份证号', key: 'idNumber', placeholder: '请输入身份证号' },
                  { label: '车牌号', key: 'plateNumber', placeholder: '请输入车牌号，如：粤A12345' },
                ].map((field) => (
                  <div key={field.key}>
                    <label style={{ display: 'block', fontSize: '14px', color: '#615d59', marginBottom: 6 }}>{field.label}</label>
                    <input
                      type={field.type || 'text'}
                      style={{ width: '100%', border: '1px solid #ebebeb', borderRadius: 4, padding: '10px 12px', fontSize: '14px', outline: 'none' }}
                      placeholder={field.placeholder}
                      value={formData[field.key as keyof typeof formData] as string}
                      onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                    />
                  </div>
                ))}
                <div>
                  <label style={{ display: 'block', fontSize: '14px', color: '#615d59', marginBottom: 6 }}>车牌颜色</label>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {[
                      { key: 'BLUE', label: '蓝色' },
                      { key: 'YELLOW', label: '黄色' },
                      { key: 'GREEN', label: '绿色' },
                    ].map((c) => (
                      <button
                        key={c.key}
                        onClick={() => setFormData({ ...formData, plateColor: c.key })}
                        style={{
                          flex: 1,
                          padding: '10px 0',
                          borderRadius: 4,
                          border: formData.plateColor === c.key ? '1px solid #0075de' : '1px solid #ebebeb',
                          background: formData.plateColor === c.key ? '#f2f9ff' : '#ffffff',
                          color: formData.plateColor === c.key ? '#0075de' : '#615d59',
                          fontSize: '14px',
                          cursor: 'pointer',
                        }}
                      >
                        {c.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <button
              onClick={() => setStep(2)}
              disabled={!formData.name || !formData.phone || !formData.plateNumber}
              style={{
                padding: '12px 16px',
                background: '#0075de',
                color: '#fff',
                border: 'none',
                borderRadius: 4,
                fontWeight: 600,
                fontSize: '15px',
                cursor: 'pointer',
                opacity: !formData.name || !formData.phone || !formData.plateNumber ? 0.5 : 1,
              }}
            >
              下一步
            </button>
          </div>
        )}

        {step === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ background: '#ffffff', border: '1px solid rgba(0, 0, 0, 0.1)', borderRadius: 12, padding: 16 }}>
              <h2 style={{ fontSize: '16px', fontWeight: 600, margin: '0 0 8px 0', color: 'rgba(0,0,0,0.95)' }}>选择签约渠道</h2>
              <p style={{ fontSize: '14px', color: '#615d59', margin: '0 0 16px 0' }}>
                选择用于ETC通行费扣款的签约渠道，后续开通会员将使用同一渠道
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  { key: 'ALIPAY', label: '支付宝', desc: '使用支付宝签约扣款' },
                  { key: 'WECHAT', label: '微信支付', desc: '使用微信签约扣款' },
                  { key: 'UNIONPAY', label: '银联云闪付', desc: '使用银联签约扣款' },
                ].map((c) => (
                  <div
                    key={c.key}
                    onClick={() => setFormData({ ...formData, channel: c.key })}
                    style={{
                      padding: 16,
                      borderRadius: 8,
                      border: formData.channel === c.key ? '1px solid #0075de' : '1px solid rgba(0, 0, 0, 0.1)',
                      background: formData.channel === c.key ? '#f2f9ff' : '#ffffff',
                      cursor: 'pointer',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ fontWeight: 500 }}>{c.label}</div>
                        <div style={{ fontSize: '12px', color: '#a39e98' }}>{c.desc}</div>
                      </div>
                      <div style={{
                        width: 20,
                        height: 20,
                        borderRadius: '50%',
                        border: formData.channel === c.key ? '1px solid #0075de' : '1px solid #ebebeb',
                        background: formData.channel === c.key ? '#0075de' : 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        {formData.channel === c.key && <CheckCircle style={{ width: 12, height: 12, color: '#fff' }} />}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, padding: '0 4px' }}>
              <input
                type="checkbox"
                id="agreement"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                style={{ marginTop: 2, width: 16, height: 16 }}
              />
              <label htmlFor="agreement" style={{ fontSize: '13px', color: '#615d59' }}>
                我已阅读并同意《ETC申办服务协议》
              </label>
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={() => setStep(1)} style={{ flex: 1, padding: '12px 16px', background: 'transparent', color: 'rgba(0,0,0,0.95)', border: '1px solid rgba(0,0,0,0.1)', borderRadius: 4, fontWeight: 500, fontSize: '15px', cursor: 'pointer' }}>
                上一步
              </button>
              <button
                onClick={handleSubmit}
                disabled={!formData.channel || !agreed}
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  background: '#0075de',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 4,
                  fontWeight: 600,
                  fontSize: '15px',
                  cursor: 'pointer',
                  opacity: !formData.channel || !agreed ? 0.5 : 1,
                }}
              >
                提交申办
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div style={{ textAlign: 'center', padding: '32px 0' }}>
            <div style={{ width: 64, height: 64, background: '#f0fdf4', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <CheckCircle style={{ width: 32, height: 32, color: '#1aae39' }} />
            </div>
            <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: 8, color: 'rgba(0,0,0,0.95)' }}>申办成功</h2>
            <p style={{ color: '#615d59', fontSize: '14px', marginBottom: 24 }}>
              您的ETC申办已提交，审核通过后将邮寄到您填写的地址
            </p>
            <div style={{ background: '#ffffff', border: '1px solid rgba(0, 0, 0, 0.1)', borderRadius: 12, padding: 16, marginBottom: 24, textAlign: 'left' }}>
              <div style={{ fontSize: '14px', color: '#615d59', display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>申请人</span>
                  <span style={{ color: 'rgba(0,0,0,0.95)' }}>{formData.name}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>车牌号</span>
                  <span style={{ color: 'rgba(0,0,0,0.95)' }}>{formData.plateNumber}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>签约渠道</span>
                  <span style={{ color: 'rgba(0,0,0,0.95)' }}>
                    {formData.channel === 'ALIPAY' && '支付宝'}
                    {formData.channel === 'WECHAT' && '微信'}
                    {formData.channel === 'UNIONPAY' && '银联'}
                  </span>
                </div>
              </div>
            </div>
            <p style={{ fontSize: '13px', color: '#a39e98', marginBottom: 24 }}>
              预计3-5个工作日审核完成，届时会有短信通知
            </p>

            <div style={{ background: '#f2f9ff', border: '1px solid rgba(0, 117, 222, 0.2)', borderRadius: 8, padding: 16, marginBottom: 16 }}>
              <p style={{ fontSize: '14px', color: '#0075de', marginBottom: 12 }}>
                演示模式：模拟用户已收到卡签并激活
              </p>
              <Link
                href={`/activate?userId=demo&plateNumber=${formData.plateNumber}&plateColor=${formData.plateColor}&channel=${formData.channel}&name=${encodeURIComponent(formData.name)}&phone=${formData.phone}`}
              >
                <button style={{ width: '100%', padding: '10px 16px', background: '#0075de', color: '#fff', border: 'none', borderRadius: 4, fontWeight: 600, cursor: 'pointer' }}>模拟激活ETC</button>
              </Link>
            </div>

            <Link href="/">
              <button style={{ width: '100%', padding: '10px 16px', background: 'transparent', color: 'rgba(0,0,0,0.95)', border: '1px solid rgba(0,0,0,0.1)', borderRadius: 4, fontWeight: 500, cursor: 'pointer' }}>返回首页</button>
            </Link>
          </div>
        )}
      </main>
    </div>
  )
}
