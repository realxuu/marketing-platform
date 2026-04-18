'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Shield, ChevronRight, ArrowLeft } from 'lucide-react'
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
    // 检查该车牌是否已有会员
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
    const styles: Record<string, string> = {
      YEARLY: 'bg-blue-500',
      MONTHLY: 'bg-green-500',
      PER_USE: 'bg-orange-500',
    }
    const labels: Record<string, string> = {
      YEARLY: '年卡',
      MONTHLY: '月卡',
      PER_USE: '次卡',
    }
    return <Badge className={`${styles[type]} text-white`}>{labels[type]}</Badge>
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
      // 1. 创建或获取用户
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

      // 2. 创建订单
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

      // 3. 激活会员（会员签约）
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
        // 保存当前用户 ID（模拟登录态）
        localStorage.setItem('currentUserId', user.id)
        router.push('/membership/success')
      } else {
        const activateData = await activateRes.json()
        // 如果是"已有会员"错误，刷新页面显示提示
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

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">检查中...</p>
      </div>
    )
  }

  if (existingMember) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-md mx-auto px-4 py-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-lg font-semibold mb-2">该车辆已有会员</h2>
          <p className="text-gray-500 text-sm mb-6">
            车牌 <strong>{plateNumber}</strong> 已开通会员服务，每辆车只能购买一个会员
          </p>
          <Link href="/member">
            <Button className="w-full h-11">
              查看我的会员
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-28 bg-gray-50">
      {/* 头部 */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center gap-3">
          <Link href={`/activate?plateNumber=${plateNumber}&plateColor=${plateColor}&channel=${channel}&name=${encodeURIComponent(name)}&phone=${phone}`}>
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <h1 className="font-medium">选择会员套餐</h1>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-4">
        {/* 错误提示 */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* 签约渠道（来自ETC申办） */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">签约渠道</span>
            <span className="font-medium text-blue-700">{getChannelLabel(channel)}</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">会员签约将使用ETC申办时选择的渠道</p>
        </div>

        {/* 体验期提示 */}
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-4 text-sm text-orange-700">
          新用户专享：开通即享 <strong>2个月免费体验期</strong>，体验期内可随时取消，不产生费用
        </div>

        {/* 产品列表 */}
        <div className="space-y-3">
          {products.map((product) => (
            <Card
              key={product.id}
              className={`cursor-pointer transition-all ${selectedProductId === product.id ? 'ring-2 ring-blue-500' : ''}`}
              onClick={() => setSelectedProductId(product.id)}
            >
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedProductId === product.id ? 'border-blue-500 bg-blue-500' : 'border-gray-300'}`}>
                      {selectedProductId === product.id && (
                        <div className="w-2 h-2 bg-white rounded-full" />
                      )}
                    </div>
                    <div>
                      <CardTitle className="text-base">{product.name}</CardTitle>
                      <CardDescription className="text-xs">{product.description}</CardDescription>
                    </div>
                  </div>
                  {getTypeBadge(product.type)}
                </div>
              </CardHeader>
              <CardContent className="pb-3">
                <div className="text-xl font-bold text-blue-600 mb-2">
                  {getPriceText(product)}
                </div>
                <div className="space-y-1">
                  {product.rights.slice(0, 3).map((r, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-gray-500">
                      <Shield className="w-3 h-3 text-green-500" />
                      <span>{r.right.name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* 协议 */}
        <div className="mt-4 flex items-start gap-2">
          <input
            type="checkbox"
            id="agreement"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-0.5 w-4 h-4 text-blue-600 rounded border-gray-300"
          />
          <label htmlFor="agreement" className="text-xs text-gray-500 leading-relaxed">
            我已阅读并同意《会员服务协议》，知悉体验期结束后将自动扣费开通正式会员
          </label>
        </div>
      </div>

      {/* 底部操作栏 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
        <div className="max-w-md mx-auto">
          <Button
            onClick={handlePurchase}
            disabled={!selectedProductId || !agreed || loading}
            className="w-full h-11"
          >
            {loading ? '处理中...' : '立即开通'}
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  )
}

function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <p className="text-gray-500">加载中...</p>
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
