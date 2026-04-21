'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Shield, ChevronRight, ArrowLeft, Loader2 } from 'lucide-react'
import Link from 'next/link'

interface Product {
  id: string
  name: string
  type: string
  price: number
  description: string | null
  rights: { right: { name: string; description: string | null } }[]
}

function MembershipSelectContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null)
  const [agreed, setAgreed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [checking, setChecking] = useState(true)
  const [existingMember, setExistingMember] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const plateNumber = searchParams.get('plateNumber') || ''
  const plateColor = searchParams.get('plateColor') || 'BLUE'
  const channel = searchParams.get('channel') || 'ALIPAY'
  const name = searchParams.get('name') || ''
  const phone = searchParams.get('phone') || ''

  useEffect(() => {
    if (plateNumber) {
      fetch('/api/members')
        .then(res => res.json())
        .then((members: { plateNumber: string | null; status: string }[]) => {
          const hasMember = members.some(m =>
            m.plateNumber === plateNumber && ['TRIAL', 'ACTIVE', 'PENDING_CANCEL'].includes(m.status)
          )
          if (hasMember) {
            setExistingMember(true)
          }
          setChecking(false)
        })
        .catch(() => setChecking(false))
    } else {
      setChecking(false)
    }

    fetch('/api/products')
      .then(res => res.json())
      .then((data: Product[]) => {
        setProducts(data)
        if (data.length > 0) {
          setSelectedProductId(data[0].id)
        }
      })
  }, [plateNumber])

  const getTypeBadge = (type: string) => {
    const styles: Record<string, { bg: string; text: string }> = {
      YEARLY: { bg: '#f2f9ff', text: '#0075de' },
      MONTHLY: { bg: '#f0fdf4', text: '#1aae39' },
      PER_USE: { bg: '#fff7ed', text: '#dd5b00' },
    }
    const labels: Record<string, string> = {
      YEARLY: '年卡',
      MONTHLY: '月卡',
      PER_USE: '次卡',
    }
    return <span style={{ background: styles[type]?.bg, color: styles[type]?.text, padding: '2px 8px', borderRadius: 9999, fontSize: 12, fontWeight: 600 }}>{labels[type]}</span>
  }

  const getPriceText = (product: Product) => {
    if (product.type === 'PER_USE') {
      return `¥${product.price}/次`
    }
    return `¥${product.price}/${product.type === 'YEARLY' ? '年' : '月'}`
  }

  const getChannelLabel = (c: string) => {
    const labels: Record<string, string> = {
      ALIPAY: '支付宝',
      WECHAT: '微信',
      UNIONPAY: '银联',
    }
    return labels[c] || c
  }

  const handlePurchase = async () => {
    if (!selectedProductId || !agreed || !phone) return

    setLoading(true)
    setError(null)
    try {
      const userRes = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone,
          name,
          plateNumber,
          plateColor,
        }),
      })
      const user = await userRes.json()

      const orderRes = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          productId: selectedProductId,
          amount: products.find(p => p.id === selectedProductId)?.price || 0,
          channel,
          agreementAccepted: true,
        }),
      })
      const order = await orderRes.json()

      const activateRes = await fetch('/api/activate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: order.id,
          plateNumber,
          plateColor,
        }),
      })

      if (activateRes.ok) {
        const activateData = await activateRes.json()
        localStorage.setItem('currentUserId', user.id)
        if (activateData.member?.id) {
          localStorage.setItem('currentMemberId', activateData.member.id)
        }
        router.push('/membership/success')
      } else {
        const activateData = await activateRes.json()
        if (activateData.error?.includes('已有生效')) {
          setExistingMember(true)
        } else {
          setError(activateData.error || '激活失败，请重试')
        }
      }
    } catch (err) {
      console.error('Purchase failed:', err)
      setError('网络错误，请重试')
    } finally {
      setLoading(false)
    }
  }

  // 检查必要参数
  const missingParams = []
  if (!phone) missingParams.push('手机号')
  if (!plateNumber) missingParams.push('车牌号')

  if (checking) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#ffffff' }}>
        <Loader2 style={{ width: 32, height: 32, color: '#0075de', animation: 'spin 1s linear infinite' }} />
      </div>
    )
  }

  if (existingMember) {
    return (
      <div style={{ minHeight: '100vh', background: '#ffffff' }}>
        <div style={{ maxWidth: '768px', margin: '0 auto', padding: '64px 16px', textAlign: 'center' }}>
          <div style={{ width: 64, height: 64, background: '#f0fdf4', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <Shield style={{ width: 32, height: 32, color: '#1aae39' }} />
          </div>
          <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>该车辆已有会员</h2>
          <p style={{ color: '#615d59', fontSize: 14, marginBottom: 24 }}>
            车牌 <strong style={{ color: 'rgba(0,0,0,0.95)' }}>{plateNumber}</strong> 已开通会员服务，每辆车只能购买一个会员
          </p>
          <Link href="/member">
            <button style={{ background: '#0075de', color: '#fff', padding: '12px 24px', borderRadius: 4, border: 'none', fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              查看我的会员
              <ChevronRight style={{ width: 16, height: 16 }} />
            </button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#ffffff', paddingBottom: 100 }}>
      {/* 头部 */}
      <header style={{ background: '#ffffff', borderBottom: '1px solid rgba(0, 0, 0, 0.1)', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ maxWidth: '768px', margin: '0 auto', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link href={`/activate?plateNumber=${plateNumber}&plateColor=${plateColor}&channel=${channel}&name=${encodeURIComponent(name)}&phone=${phone}`}>
            <ArrowLeft style={{ width: 20, height: 20, color: '#615d59' }} />
          </Link>
          <h1 style={{ fontSize: '16px', fontWeight: 500, margin: 0, color: 'rgba(0,0,0,0.95)' }}>选择会员套餐</h1>
        </div>
      </header>

      <main style={{ maxWidth: '768px', margin: '0 auto', padding: '16px' }}>
        {/* 错误提示 */}
        {error && (
          <div style={{ background: '#fef2f2', border: '1px solid rgba(220, 38, 38, 0.2)', borderRadius: 8, padding: 12, marginBottom: 16, fontSize: 14, color: '#dc2626' }}>
            {error}
          </div>
        )}

        {/* 签约渠道 */}
        <div style={{ background: '#f2f9ff', border: '1px solid rgba(0, 117, 222, 0.2)', borderRadius: 12, padding: 12, marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 14, color: '#615d59' }}>签约渠道</span>
            <span style={{ fontWeight: 500, color: '#0075de' }}>{getChannelLabel(channel)}</span>
          </div>
          <p style={{ fontSize: 12, color: '#097fe8', marginTop: 4 }}>会员签约将使用ETC申办时选择的渠道</p>
        </div>

        {/* 体验期提示 */}
        <div style={{ background: '#fff7ed', border: '1px solid rgba(221, 91, 0, 0.2)', borderRadius: 8, padding: 12, marginBottom: 16, fontSize: 14, color: '#dd5b00' }}>
          新用户专享：开通即享 <strong>2个月免费体验期</strong>，体验期内可随时取消，不产生费用
        </div>

        {/* 产品列表 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {products.map((product) => (
            <div
              key={product.id}
              onClick={() => setSelectedProductId(product.id)}
              style={{
                background: '#ffffff',
                border: selectedProductId === product.id ? '1px solid #0075de' : '1px solid rgba(0, 0, 0, 0.1)',
                borderRadius: 12,
                padding: 16,
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    border: selectedProductId === product.id ? '1px solid #0075de' : '1px solid #ebebeb',
                    background: selectedProductId === product.id ? '#0075de' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    {selectedProductId === product.id && <div style={{ width: 8, height: 8, background: '#fff', borderRadius: '50%' }} />}
                  </div>
                  <div>
                    <div style={{ fontWeight: 500 }}>{product.name}</div>
                    {product.description && <div style={{ fontSize: 12, color: '#a39e98' }}>{product.description}</div>}
                  </div>
                </div>
                {getTypeBadge(product.type)}
              </div>
              <div style={{ fontSize: 20, fontWeight: 700, color: '#0075de', marginBottom: 8 }}>
                {getPriceText(product)}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {product.rights.slice(0, 3).map((r, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#615d59' }}>
                    <Shield style={{ width: 12, height: 12, color: '#1aae39' }} />
                    <span>{r.right.name}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* 协议 */}
        <div style={{ marginTop: 16, display: 'flex', alignItems: 'flex-start', gap: 8 }}>
          <input
            type="checkbox"
            id="agreement"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            style={{ marginTop: 2, width: 16, height: 16 }}
          />
          <label htmlFor="agreement" style={{ fontSize: 13, color: '#615d59' }}>
            我已阅读并同意《会员服务协议》，知悉体验期结束后将自动扣费开通正式会员
          </label>
        </div>
      </main>

      {/* 底部操作栏 */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: '#ffffff', borderTop: '1px solid rgba(0, 0, 0, 0.1)', padding: 16 }}>
        <div style={{ maxWidth: '768px', margin: '0 auto' }}>
          {missingParams.length > 0 && (
            <div style={{ background: '#fef2f2', border: '1px solid rgba(220, 38, 38, 0.2)', borderRadius: 8, padding: 12, marginBottom: 12, fontSize: 14, color: '#dc2626' }}>
              缺少必要信息：{missingParams.join('、')}，请从申办页面重新进入
            </div>
          )}
          <button
            onClick={handlePurchase}
            disabled={!selectedProductId || !agreed || !phone || loading}
            style={{
              width: '100%',
              padding: '12px 16px',
              background: '#0075de',
              color: '#fff',
              border: 'none',
              borderRadius: 4,
              fontWeight: 600,
              fontSize: 15,
              cursor: 'pointer',
              opacity: !selectedProductId || !agreed || !phone || loading ? 0.5 : 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
            }}
          >
            {loading ? '处理中...' : '立即开通'}
            <ChevronRight style={{ width: 16, height: 16 }} />
          </button>
        </div>
      </div>
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

export default function MembershipSelectPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <MembershipSelectContent />
    </Suspense>
  )
}
