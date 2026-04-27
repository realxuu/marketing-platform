'use client'

import Link from 'next/link'
import { Crown, Shield, Car, CreditCard, Gift, ChevronRight, FileText, Wrench, Search, Zap } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#F7F8FA' }}>
      <header
        className="sticky top-0 z-50"
        style={{
          background: '#FFFFFF',
          borderBottom: '1px solid #E8EDE1',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        }}
      >
        <div className="max-w-3xl mx-auto px-3 flex items-center justify-between" style={{ height: '44px' }}>
          <div className="flex items-center gap-2">
            <div
              className="flex items-center justify-center"
              style={{
                width: 28,
                height: 28,
                borderRadius: 6,
                background: 'linear-gradient(135deg, #009944, #36B16C)',
              }}
            >
              <Car className="w-4 h-4" style={{ color: '#FFFFFF' }} />
            </div>
            <span
              style={{
                fontSize: 17,
                fontWeight: 500,
                color: '#000000',
                letterSpacing: '-0.41px',
                fontFamily: '"PingFang SC", "Helvetica Neue", sans-serif',
              }}
            >
              粤通卡服务
            </span>
          </div>
          <Link href="/apply">
            <span
              className="inline-flex items-center gap-1"
              style={{
                fontSize: 13,
                fontWeight: 500,
                color: '#FFFFFF',
                background: 'linear-gradient(135deg, #009944, #36B16C)',
                borderRadius: 7,
                padding: '5px 12px',
                cursor: 'pointer',
              }}
            >
              立即申办
            </span>
          </Link>
        </div>
      </header>

      <main
        className="flex-1 overflow-y-auto"
        style={{ paddingBottom: 68 }}
      >
        <div className="px-3 pt-3 space-y-2">
          <div
            style={{
              background: 'linear-gradient(135deg, #f0fbf4 0%, #e8f8ef 40%, #d1f0df 100%)',
              borderRadius: 8,
              padding: '20px 16px',
              marginBottom: 8,
            }}
          >
            <h1
              style={{
                fontSize: 22,
                fontWeight: 600,
                color: '#333333',
                letterSpacing: '-0.5px',
                lineHeight: 1.3,
                fontFamily: '"PingFang SC", "Helvetica Neue", sans-serif',
                marginBottom: 6,
              }}
            >
              ETC在线申办
            </h1>
            <p
              style={{
                fontSize: 14,
                fontWeight: 400,
                color: '#666666',
                lineHeight: 1.5,
                marginBottom: 16,
                fontFamily: '"PingFang SC", "Helvetica Neue", sans-serif',
              }}
            >
              免费办理，包邮到家 · 支持多渠道签约 · 快速审核寄出
            </p>
            <Link href="/apply">
              <span
                className="inline-flex items-center gap-1"
                style={{
                  fontSize: 16,
                  fontWeight: 400,
                  color: '#FFFFFF',
                  background: 'linear-gradient(135deg, #009944, #36B16C)',
                  borderRadius: 7,
                  padding: '10px 20px 10px 16px',
                  cursor: 'pointer',
                  transition: 'all 200ms ease',
                }}
              >
                立即申办
                <ChevronRight className="w-4 h-4" />
              </span>
            </Link>
          </div>

          <section
            style={{
              background: '#FFFFFF',
              borderRadius: 8,
              border: '1px solid #E8EDE1',
              boxShadow: '0px 1px 2px rgba(0,0,0,0.05), 0px 0px 0px 1px rgba(0,0,0,0.05)',
              overflow: 'hidden',
            }}
          >
            <div
              className="px-4 py-3 flex items-center gap-2"
              style={{ borderBottom: '1px solid #E5E7EB' }}
            >
              <Crown
                className="w-5 h-5"
                style={{ color: '#009D5C' }}
              />
              <h2
                style={{
                  fontSize: 16,
                  fontWeight: 600,
                  color: '#333333',
                  fontFamily: '"PingFang SC", "Helvetica Neue", sans-serif',
                }}
              >
                会员服务
              </h2>
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: '#005C28',
                  background: '#D1F0DF',
                  borderRadius: 7,
                  padding: '2px 8px',
                  marginLeft: 4,
                }}
              >
                热门
              </span>
            </div>
            <div className="p-4">
              <div
                className="flex items-start gap-2 mb-3"
                style={{
                  background: '#E8F8EF',
                  borderRadius: 7,
                  padding: '10px 12px',
                }}
              >
                <Gift
                  className="w-4 h-4 flex-shrink-0 mt-0.5"
                  style={{ color: '#009944' }}
                />
                <p
                  style={{
                    fontSize: 14,
                    fontWeight: 500,
                    color: '#005C28',
                    lineHeight: 1.4,
                    fontFamily: '"PingFang SC", "Helvetica Neue", sans-serif',
                  }}
                >
                  新用户专享61天免费体验期，ETC激活后即可开通
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: '年卡', price: '¥138', unit: '/年', desc: '一次性付费' },
                  { label: '月卡', price: '¥16.8', unit: '/月', desc: '首月起扣' },
                  { label: '次卡', price: '¥1', unit: '/次', desc: '按次计费' },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="text-center"
                    style={{
                      background: '#F9FAFB',
                      borderRadius: 8,
                      padding: '12px 8px',
                      border: '1px solid #E8EDE1',
                    }}
                  >
                    <p
                      style={{
                        fontSize: 13,
                        fontWeight: 500,
                        color: '#646566',
                        marginBottom: 4,
                        fontFamily: '"PingFang SC", "Helvetica Neue", sans-serif',
                      }}
                    >
                      {item.label}
                    </p>
                    <p
                      style={{
                        fontSize: 20,
                        fontWeight: 600,
                        color: '#009944',
                        letterSpacing: '-0.25px',
                        lineHeight: 1.2,
                        fontFamily: '"PingFang SC", "Helvetica Neue", sans-serif',
                      }}
                    >
                      {item.price}
                    </p>
                    <p
                      style={{
                        fontSize: 11,
                        fontWeight: 400,
                        color: '#969699',
                        marginTop: 2,
                        fontFamily: '"PingFang SC", "Helvetica Neue", sans-serif',
                      }}
                    >
                      {item.unit}
                    </p>
                  </div>
                ))}
              </div>

              <div
                className="mt-3 pt-3"
                style={{ borderTop: '1px solid #E5E7EB' }}
              >
                <Link
                  href="/membership/select?phone=13800138001&name=%E8%B5%B5%E5%85%AD&plateNumber=%E7%B2%A4D88888&plateColor=BLUE&channel=ALIPAY"
                  className="flex items-center justify-center gap-1"
                  style={{
                    fontSize: 14,
                    fontWeight: 500,
                    color: '#36B16C',
                    background: '#E8F8EF',
                    borderRadius: 7,
                    padding: '8px 16px',
                    border: '1px solid #D1F0DF',
                    transition: 'all 200ms ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 4,
                    width: '100%',
                  }}
                >
                  <Gift className="w-4 h-4" />
                  演示模式：体验购买流程
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </section>

          <section
            style={{
              background: '#FFFFFF',
              borderRadius: 8,
              border: '1px solid #E8EDE1',
              boxShadow: '0px 1px 2px rgba(0,0,0,0.05), 0px 0px 0px 1px rgba(0,0,0,0.05)',
              overflow: 'hidden',
            }}
          >
            <div
              className="px-4 py-3 flex items-center gap-2"
              style={{ borderBottom: '1px solid #E5E7EB' }}
            >
              <Shield
                className="w-5 h-5"
                style={{ color: '#009D5C' }}
              />
              <h2
                style={{
                  fontSize: 16,
                  fontWeight: 600,
                  color: '#333333',
                  fontFamily: '"PingFang SC", "Helvetica Neue", sans-serif',
                }}
              >
                会员权益
              </h2>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-4 gap-3">
                {[
                  { icon: Wrench, label: '道路救援', color: '#009D5C', bg: '#E8F8EF' },
                  { icon: Shield, label: '只换不修', color: '#009D5C', bg: '#E8F8EF' },
                  { icon: FileText, label: '高速意外险', color: '#009D5C', bg: '#E8F8EF' },
                  { icon: Zap, label: '更多权益', color: '#009D5C', bg: '#E8F8EF' },
                ].map(({ icon: Icon, label, color, bg }) => (
                  <div key={label} className="flex flex-col items-center gap-2">
                    <div
                      className="flex items-center justify-center"
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 8,
                        background: bg,
                      }}
                    >
                      <Icon className="w-5 h-5" style={{ color }} />
                    </div>
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 400,
                        color: '#646566',
                        fontFamily: '"PingFang SC", "Helvetica Neue", sans-serif',
                      }}
                    >
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section
            style={{
              background: '#FFFFFF',
              borderRadius: 8,
              border: '1px solid #E8EDE1',
              boxShadow: '0px 1px 2px rgba(0,0,0,0.05), 0px 0px 0px 1px rgba(0,0,0,0.05)',
              overflow: 'hidden',
            }}
          >
            <div
              className="px-4 py-3 flex items-center gap-2"
              style={{ borderBottom: '1px solid #E5E7EB' }}
            >
              <CreditCard
                className="w-5 h-5"
                style={{ color: '#009D5C' }}
              />
              <h2
                style={{
                  fontSize: 16,
                  fontWeight: 600,
                  color: '#333333',
                  fontFamily: '"PingFang SC", "Helvetica Neue", sans-serif',
                }}
              >
                常见问题
              </h2>
            </div>
            <div className="p-4 space-y-3">
              {[
                { q: 'ETC申办需要哪些资料？', a: '需提供车主身份证、行驶证，支持线上上传。' },
                { q: '会员免费期如何计算？', a: '自会员签约成功起61天内为免费体验期。' },
                { q: '如何取消会员？', a: '进入"我的"页面，选择会员管理即可操作取消。' },
              ].map(({ q, a }) => (
                <div key={q}>
                  <p
                    style={{
                      fontSize: 14,
                      fontWeight: 500,
                      color: '#333333',
                      marginBottom: 2,
                      fontFamily: '"PingFang SC", "Helvetica Neue", sans-serif',
                    }}
                  >
                    {q}
                  </p>
                  <p
                    style={{
                      fontSize: 13,
                      fontWeight: 400,
                      color: '#969699',
                      lineHeight: 1.5,
                      fontFamily: '"PingFang SC", "Helvetica Neue", sans-serif',
                    }}
                  >
                    {a}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      <nav
        className="fixed bottom-0 left-0 right-0 z-50"
        style={{
          background: '#FFFFFF',
          borderTop: '1px solid #E8EDE1',
          height: 68,
        }}
      >
        <div className="max-w-3xl mx-auto flex h-full">
          {[
            { href: '/', icon: Car, label: '首页', active: true },
            { href: '/rights', icon: Shield, label: '权益', active: false },
            { href: '/member', icon: Crown, label: '我的', active: false },
          ].map(({ href, icon: Icon, label, active }) => (
            <Link
              key={href}
              href={href}
              className="flex-1 flex flex-col items-center justify-center"
              style={{ color: active ? '#009944' : '#969699' }}
            >
              <Icon className="w-5 h-5" />
              <span
                style={{
                  fontSize: 12,
                  fontWeight: active ? 500 : 400,
                  marginTop: 2,
                  fontFamily: '"PingFang SC", "Helvetica Neue", sans-serif',
                }}
              >
                {label}
              </span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  )
}
