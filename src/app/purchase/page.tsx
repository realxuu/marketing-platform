'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Check, CreditCard, Loader2 } from 'lucide-react'

interface Product {
  id: string
  name: string
  type: string
  price: number
  description: string | null
  rights: { right: { name: string } }[]
}

function PurchaseContent() {
  const searchParams = useSearchParams()
  const productId = searchParams.get('productId')
  const [product, setProduct] = useState<Product | null>(null)
  const [payMethod, setPayMethod] = useState<'WECHAT' | 'ALIPAY'>('WECHAT')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (productId) {
      fetch('/api/products')
        .then(res => res.json())
        .then((products: Product[]) => {
          const p = products.find(p => p.id === productId)
          setProduct(p || null)
        })
    }
  }, [productId])

  const handlePay = async () => {
    if (!product) return
    setLoading(true)

    // 获取第一个用户作为演示用户
    const usersRes = await fetch('/api/users')
    const users = await usersRes.json()
    const demoUserId = users[0]?.id

    if (!demoUserId) {
      alert('没有可用的演示用户')
      setLoading(false)
      return
    }

    // 创建订单
    const orderRes = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: demoUserId,
        productId: product.id,
        amount: product.price,
        payMethod,
      }),
    })
    const order = await orderRes.json()

    // 模拟支付
    await new Promise(resolve => setTimeout(resolve, 1500))

    // 更新订单状态
    await fetch('/api/orders', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: order.id,
        status: 'PAID',
      }),
    })

    setLoading(false)
    setSuccess(true)
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-8 pb-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-xl font-semibold mb-2">支付成功</h2>
            <p className="text-gray-500 mb-6">恭喜您成为{product?.name}！</p>
            <p className="text-sm text-gray-400 mb-4">您已获得2个月免费体验期</p>
            <Button onClick={() => window.location.href = '/member'} className="w-full">
              查看我的会员
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* 头部 */}
      <div className="bg-white border-b px-4 py-4">
        <h1 className="text-lg font-semibold text-center">确认订单</h1>
      </div>

      <div className="p-4 max-w-md mx-auto">
        {/* 产品信息 */}
        <Card className="mb-4">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">会员套餐</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div>
                <div className="font-medium">{product.name}</div>
                <div className="text-sm text-gray-500">{product.description}</div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-blue-600">¥{product.price}</div>
                {product.type !== 'PER_USE' && (
                  <div className="text-xs text-gray-400">
                    含2个月免费体验期
                  </div>
                )}
              </div>
            </div>
            <div className="mt-3 pt-3 border-t">
              <div className="text-sm text-gray-500 mb-2">包含权益：</div>
              {product.rights.map((r, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-green-500" />
                  <span>{r.right.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 支付方式 */}
        <Card className="mb-4">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">支付方式</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div
              onClick={() => setPayMethod('WECHAT')}
              className={`flex items-center justify-between p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                payMethod === 'WECHAT' ? 'border-green-500 bg-green-50' : 'border-gray-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-500 rounded flex items-center justify-center text-white text-xs font-bold">
                  微
                </div>
                <span>微信支付</span>
              </div>
              {payMethod === 'WECHAT' && (
                <Check className="w-5 h-5 text-green-500" />
              )}
            </div>
            <div
              onClick={() => setPayMethod('ALIPAY')}
              className={`flex items-center justify-between p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                payMethod === 'ALIPAY' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center text-white text-xs font-bold">
                  支
                </div>
                <span>支付宝</span>
              </div>
              {payMethod === 'ALIPAY' && (
                <Check className="w-5 h-5 text-blue-500" />
              )}
            </div>
          </CardContent>
        </Card>

        {/* 说明 */}
        <div className="text-xs text-gray-400 mb-4">
          <p>• 新用户享2个月免费体验期</p>
          <p>• 体验期内可随时取消，不产生费用</p>
          <p>• 体验期满未取消将自动扣费</p>
        </div>

        {/* 底部按钮 */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
          <div className="max-w-md mx-auto flex items-center justify-between">
            <div>
              <span className="text-gray-500">应付金额：</span>
              <span className="text-xl font-bold text-red-500">¥{product.price}</span>
            </div>
            <Button onClick={handlePay} disabled={loading} className="px-8">
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  支付中...
                </>
              ) : (
                '立即支付'
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function PurchasePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    }>
      <PurchaseContent />
    </Suspense>
  )
}
