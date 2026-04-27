'use client'

import Link from 'next/link'
import { Crown, Shield, Car, CreditCard, Gift, ChevronRight, FileText } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Header */}
      <header className="bg-white" style={{ borderBottom: '1px solid rgba(0, 0, 0, 0.1)' }}>
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded flex items-center justify-center"
              style={{ backgroundColor: '#f6f5f4' }}
            >
              <Car className="w-5 h-5" style={{ color: 'rgba(0, 0, 0, 0.95)' }} />
            </div>
            <div>
              <h1
                className="text-xl font-semibold"
                style={{ color: 'rgba(0, 0, 0, 0.95)', letterSpacing: '-0.32px' }}
              >
                粤通卡服务
              </h1>
              <p className="text-sm" style={{ color: '#615d59' }}>
                ETC申办 · 会员服务
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        {/* ETC Section */}
        <section
          className="bg-white rounded-xl overflow-hidden"
          style={{
            border: '1px solid rgba(0, 0, 0, 0.1)',
            boxShadow: 'rgba(0, 0, 0, 0.04) 0px 4px 18px, rgba(0, 0, 0, 0.027) 0px 2.025px 7.85px'
          }}
        >
          <div
            className="px-4 py-3 flex items-center gap-2"
            style={{ borderBottom: '1px solid rgba(0, 0, 0, 0.1)' }}
          >
            <Car className="w-5 h-5" style={{ color: 'rgba(0, 0, 0, 0.95)' }} />
            <h2
              className="font-semibold"
              style={{ color: 'rgba(0, 0, 0, 0.95)', letterSpacing: '-0.25px' }}
            >
              ETC在线申办
            </h2>
          </div>
          <div className="p-4">
            <ul className="space-y-2 mb-4">
              {['免费办理，包邮到家', '支持支付宝/微信/银联签约', '快速审核，3-5个工作日寄出'].map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm" style={{ color: '#615d59' }}>
                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#0075de' }} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <Link href="/apply">
              <button
                className="w-full py-2 px-4 rounded font-semibold text-sm flex items-center justify-center gap-1 transition-all"
                style={{
                  backgroundColor: '#0075de',
                  color: '#ffffff',
                }}
              >
                立即申办
                <ChevronRight className="w-4 h-4" />
              </button>
            </Link>
          </div>
        </section>

        {/* Membership Section */}
        <section
          className="bg-white rounded-xl overflow-hidden"
          style={{
            border: '1px solid rgba(0, 0, 0, 0.1)',
            boxShadow: 'rgba(0, 0, 0, 0.04) 0px 4px 18px, rgba(0, 0, 0, 0.027) 0px 2.025px 7.85px'
          }}
        >
          <div
            className="px-4 py-3 flex items-center justify-between"
            style={{ borderBottom: '1px solid rgba(0, 0, 0, 0.1)' }}
          >
            <div className="flex items-center gap-2">
              <Crown className="w-5 h-5" style={{ color: 'rgba(0, 0, 0, 0.95)' }} />
              <h2
                className="font-semibold"
                style={{ color: 'rgba(0, 0, 0, 0.95)', letterSpacing: '-0.25px' }}
              >
                会员服务
              </h2>
            </div>
          </div>
          <div className="p-4">
            {/* Trial Banner */}
            <div
              className="rounded-lg p-3 mb-4 flex items-start gap-2"
              style={{ backgroundColor: '#f2f9ff' }}
            >
              <Gift className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#0075de' }} />
              <p className="text-sm font-medium" style={{ color: '#097fe8' }}>
                新用户专享2个月免费体验期
              </p>
            </div>

            {/* Pricing Cards */}
            <div className="grid grid-cols-3 gap-2">
              <div
                className="rounded-lg p-3 text-center"
                style={{ backgroundColor: '#f6f5f4' }}
              >
                <p className="text-xs mb-1" style={{ color: '#615d59' }}>年卡</p>
                <p
                  className="font-bold"
                  style={{ color: '#0075de', letterSpacing: '-0.25px' }}
                >
                  ¥138
                </p>
              </div>
              <div
                className="rounded-lg p-3 text-center"
                style={{ backgroundColor: '#f6f5f4' }}
              >
                <p className="text-xs mb-1" style={{ color: '#615d59' }}>月卡</p>
                <p
                  className="font-bold"
                  style={{ color: '#0075de', letterSpacing: '-0.25px' }}
                >
                  ¥16.8
                </p>
              </div>
              <div
                className="rounded-lg p-3 text-center"
                style={{ backgroundColor: '#f6f5f4' }}
              >
                <p className="text-xs mb-1" style={{ color: '#615d59' }}>次卡</p>
                <p
                  className="font-bold"
                  style={{ color: '#0075de', letterSpacing: '-0.25px' }}
                >
                  ¥1/次
                </p>
              </div>
            </div>

            {/* Demo Entry */}
            <div
              className="mt-4 pt-4"
              style={{ borderTop: '1px solid rgba(0, 0, 0, 0.1)' }}
            >
              <Link href="/membership/select?phone=13800138001&name=%E8%B5%B5%E5%85%AD&plateNumber=%E7%B2%A4D88888&plateColor=BLUE&channel=ALIPAY">
                <button
                  className="w-full py-2 px-4 rounded font-medium text-sm flex items-center justify-center gap-1 transition-all"
                  style={{
                    backgroundColor: '#f2f9ff',
                    color: '#097fe8',
                    border: '1px solid rgba(0, 117, 222, 0.2)',
                  }}
                >
                  <Gift className="w-4 h-4" />
                  演示模式：体验购买流程
                  <ChevronRight className="w-4 h-4" />
                </button>
              </Link>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section
          className="bg-white rounded-xl p-4"
          style={{
            border: '1px solid rgba(0, 0, 0, 0.1)',
            boxShadow: 'rgba(0, 0, 0, 0.04) 0px 4px 18px, rgba(0, 0, 0, 0.027) 0px 2.025px 7.85px'
          }}
        >
          <h3
            className="font-semibold mb-4"
            style={{ color: 'rgba(0, 0, 0, 0.95)', letterSpacing: '-0.25px' }}
          >
            会员权益
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: Shield, label: '粤运道路救援', color: '#2a9d99' },
              { icon: CreditCard, label: '设备只换不修', color: '#0075de' },
              { icon: FileText, label: '高速意外险', color: '#391c57' },
              { icon: Gift, label: '更多权益', color: '#ff64c8' },
            ].map(({ icon: Icon, label, color }) => (
              <div key={label} className="flex items-center gap-2">
                <Icon className="w-4 h-4" style={{ color }} />
                <span className="text-sm" style={{ color: '#615d59' }}>{label}</span>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Bottom Navigation */}
      <nav
        className="fixed bottom-0 left-0 right-0 bg-white z-50"
        style={{ borderTop: '1px solid rgba(0, 0, 0, 0.1)' }}
      >
        <div className="max-w-3xl mx-auto flex">
          {[
            { href: '/', icon: Car, label: 'ETC申办', active: true },
            { href: '/rights', icon: Shield, label: '权益', active: false },
            { href: '/member', icon: Crown, label: '我的', active: false },
          ].map(({ href, icon: Icon, label, active }) => (
            <Link
              key={href}
              href={href}
              className="flex-1 flex flex-col items-center py-3"
              style={{ color: active ? 'rgba(0, 0, 0, 0.95)' : '#a39e98' }}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs mt-1 font-medium">{label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  )
}
