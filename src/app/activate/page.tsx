'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Gift, Crown, Shield, ChevronRight, Loader2 } from 'lucide-react'
import Link from 'next/link'

function ActivateContent() {
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(true)

  const plateNumber = searchParams.get('plateNumber') || ''
  const plateColor = searchParams.get('plateColor') || 'BLUE'
  const channel = searchParams.get('channel') || 'ALIPAY'
  const name = searchParams.get('name') || ''
  const phone = searchParams.get('phone') || ''

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#ffffff' }}>
        <Loader2 style={{ width: 32, height: 32, color: '#0075de', animation: 'spin 1s linear infinite' }} />
      </div>
    )
  }

  const plateColorMap: Record<string, string> = { BLUE: '#0075de', YELLOW: '#f59e0b', GREEN: '#22c55e' }

  return (
    <div style={{ minHeight: '100vh', background: '#ffffff' }}>
      <main style={{ maxWidth: '768px', margin: '0 auto', padding: '24px 16px' }}>
        {/* Plate Info */}
        <div style={{ background: '#ffffff', border: '1px solid rgba(0, 0, 0, 0.1)', borderRadius: 12, padding: '12px 16px', marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: '14px', color: '#615d59' }}>
            车牌 <strong style={{ color: 'rgba(0,0,0,0.95)' }}>{plateNumber}</strong>
          </div>
          <div style={{ fontSize: '13px', color: '#1aae39', display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#1aae39' }} />
            已激活
          </div>
        </div>

        {/* Membership Recommendation */}
        <div style={{ background: '#ffffff', border: '1px solid rgba(0, 0, 0, 0.1)', borderRadius: 12, overflow: 'hidden' }}>
          <div style={{ background: '#0075de', color: '#ffffff', padding: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <Crown style={{ width: 20, height: 20 }} />
              <span style={{ fontWeight: 600, letterSpacing: '-0.25px' }}>开通会员享专属权益</span>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '14px', margin: 0 }}>高速救援、设备更换、出行保障</p>
          </div>
          <div style={{ padding: 16 }}>
            {/* Trial Notice */}
            <div style={{ background: '#fff7ed', borderRadius: 8, padding: 12, marginBottom: 16, display: 'flex', alignItems: 'flex-start', gap: 8 }}>
              <Gift style={{ width: 20, height: 20, color: '#dd5b00', flexShrink: 0, marginTop: 2 }} />
              <div style={{ fontSize: '14px' }}>
                <span style={{ color: '#dd5b00', fontWeight: 600 }}>新用户专享2个月免费体验期</span>
                <p style={{ color: '#dd5b00', fontSize: '13px', margin: '4px 0 0 0' }}>体验期内可随时取消，不产生费用</p>
              </div>
            </div>

            {/* Rights List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>
              {[
                { name: '粤运道路救援', desc: '高速故障免费救援' },
                { name: 'ETC设备只换不修', desc: '设备故障免费更换' },
                { name: '高速意外险', desc: '出行安全保障' },
              ].map((item) => (
                <div key={item.name} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <Shield style={{ width: 20, height: 20, color: '#1aae39' }} />
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 500 }}>{item.name}</div>
                    <div style={{ fontSize: '12px', color: '#a39e98' }}>{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <Link
              href={`/membership/select?plateNumber=${plateNumber}&plateColor=${plateColor}&channel=${channel}&name=${encodeURIComponent(name)}&phone=${phone}`}
            >
              <button style={{ width: '100%', padding: '12px 16px', background: '#0075de', color: '#fff', border: 'none', borderRadius: 4, fontWeight: 600, fontSize: '15px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                选择会员套餐
                <ChevronRight style={{ width: 16, height: 16 }} />
              </button>
            </Link>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <Link href="/" style={{ fontSize: '14px', color: '#a39e98' }}>
            暂不开通
          </Link>
        </div>
      </main>
    </div>
  )
}

function LoadingFallback() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#ffffff' }}>
      <Loader2 style={{ width: 32, height: 32, color: '#0075de', animation: 'spin 1s linear infinite' }} />
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
