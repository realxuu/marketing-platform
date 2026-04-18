'use client'

import Link from 'next/link'
import { CheckCircle, Gift, Shield, ChevronRight } from 'lucide-react'

export default function MembershipSuccessPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#ffffff' }}>
      {/* Success Header */}
      <div style={{ background: '#0075de', color: '#ffffff' }}>
        <div style={{ maxWidth: '768px', margin: '0 auto', padding: '48px 16px', textAlign: 'center' }}>
          <div style={{ width: 80, height: 80, background: 'rgba(255,255,255,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <CheckCircle style={{ width: 48, height: 48 }} />
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, margin: '0 0 8px 0', letterSpacing: '-0.6px' }}>开通成功</h1>
          <p style={{ color: 'rgba(255,255,255,0.9)', margin: 0, fontSize: '16px' }}>您已成功开通会员服务</p>
        </div>
      </div>

      <main style={{ maxWidth: '768px', margin: '0 auto', padding: '24px 16px' }}>
        {/* Trial Notice */}
        <div style={{ background: '#fff7ed', border: '1px solid rgba(221, 91, 0, 0.2)', borderRadius: 12, padding: 16, marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <Gift style={{ width: 20, height: 20, color: '#dd5b00' }} />
            <span style={{ fontWeight: 600, color: '#dd5b00' }}>2个月免费体验期</span>
          </div>
          <p style={{ fontSize: '14px', color: '#dd5b00', margin: 0 }}>
            体验期内可随时取消，不产生任何费用。体验期结束后将自动扣费开通正式会员。
          </p>
        </div>

        {/* Rights List */}
        <div style={{ background: '#ffffff', border: '1px solid rgba(0, 0, 0, 0.1)', borderRadius: 12, padding: 16, marginBottom: 24 }}>
          <h3 style={{ fontSize: '16px', fontWeight: 600, margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: 8, color: 'rgba(0,0,0,0.95)' }}>
            <Shield style={{ width: 18, height: 18, color: '#1aae39' }} />
            您的专属权益
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {['粤运道路救援', 'ETC设备只换不修', '高速意外险'].map((name) => (
              <div key={name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(0, 0, 0, 0.05)' }}>
                <span style={{ color: '#615d59' }}>{name}</span>
                <span style={{ color: '#1aae39', fontSize: '14px', fontWeight: 500 }}>已开通</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Link href="/member">
            <button style={{ width: '100%', padding: '12px 16px', background: '#0075de', color: '#fff', border: 'none', borderRadius: 4, fontWeight: 600, fontSize: '15px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              查看我的会员
              <ChevronRight style={{ width: 16, height: 16 }} />
            </button>
          </Link>
          <Link href="/">
            <button style={{ width: '100%', padding: '12px 16px', background: 'transparent', color: 'rgba(0,0,0,0.95)', border: '1px solid rgba(0,0,0,0.1)', borderRadius: 4, fontWeight: 500, fontSize: '15px', cursor: 'pointer' }}>
              返回首页
            </button>
          </Link>
        </div>
      </main>
    </div>
  )
}
