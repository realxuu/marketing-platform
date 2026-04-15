'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Check, CreditCard, Loader2, Shield } from 'lucide-react'

interface Product {
  id: string
  name: string
  type: string
  price: number
  description: string | null
  rights: { right: { name: string; detailHtml: string | null } }[]
}

function PurchaseContent() {
  const searchParams = useSearchParams()
  const productId = searchParams.get('productId')
  const [product, setProduct] = useState<Product | null>(null)
  const [channel, setChannel] = useState<string>('ALIPAY')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [showAgreement, setShowAgreement] = useState(false)
  const [agreementAccepted, setAgreementAccepted] = useState(false)
  const [showRightDetail, setShowRightDetail] = useState<string | null>(null)

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
    if (!agreementAccepted) {
      setShowAgreement(true)
      return
    }
    setLoading(true)

    const usersRes = await fetch('/api/users')
    const users = await usersRes.json()
    const demoUserId = users[0]?.id

    if (!demoUserId) {
      alert('没有可用的演示用户')
      setLoading(false)
      return
    }

    const orderRes = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: demoUserId,
        productId: product.id,
        amount: product.price,
        payMethod: channel,
        channel,
        agreementAccepted: true,
      }),
    })
    const order = await orderRes.json()

    await new Promise(resolve => setTimeout(resolve, 1500))

    await fetch('/api/orders', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: order.id,
        status: 'PENDING_ACTIVATION',
        agreementAccepted: true,
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
            <h2 className="text-xl font-semibold mb-2">订单已提交</h2>
            <p className="text-gray-500 mb-2">您已成功购买{product?.name}</p>
            <p className="text-sm text-amber-600 mb-4">请激活ETC设备后自动开通会员权益</p>
            <p className="text-xs text-gray-400 mb-4">激活后将获得2个月免费体验期</p>
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
      <div className="bg-white border-b px-4 py-4">
        <h1 className="text-lg font-semibold text-center">确认订单</h1>
      </div>

      <div className="p-4 max-w-md mx-auto">
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
                  <div className="text-xs text-gray-400">含2个月免费体验期</div>
                )}
              </div>
            </div>
            <div className="mt-3 pt-3 border-t">
              <div className="text-sm text-gray-500 mb-2">包含权益：</div>
              {product.rights.map((r, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-green-500" />
                  <span
                    className={r.right.detailHtml ? 'cursor-pointer text-blue-600 underline' : ''}
                    onClick={() => r.right.detailHtml && setShowRightDetail(r.right.detailHtml)}
                  >
                    {r.right.name}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="mb-4">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">签约渠道</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 bg-gray-50">
              <div className={`w-8 h-8 rounded flex items-center justify-center text-white text-xs font-bold ${
                channel === 'WECHAT' ? 'bg-green-500' : channel === 'ALIPAY' ? 'bg-blue-500' : 'bg-red-500'
              }`}>
                {channel === 'WECHAT' ? '微' : channel === 'ALIPAY' ? '支' : '银'}
              </div>
              <span className="font-medium">
                {channel === 'WECHAT' ? '微信支付' : channel === 'ALIPAY' ? '支付宝' : '银联云闪付'}
              </span>
              <span className="text-xs text-gray-400 ml-auto">ETC发行时已签约</span>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-4">
          <CardContent className="pt-4">
            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                checked={agreementAccepted}
                onChange={(e) => setAgreementAccepted(e.target.checked)}
                className="mt-1"
              />
              <div className="text-sm text-gray-600">
                我已阅读并同意
                <span
                  className="text-blue-600 cursor-pointer underline"
                  onClick={() => setShowAgreement(true)}
                >
                  《会员服务协议》
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-xs text-gray-400 mb-4">
          <p>• 新用户享2个月免费体验期</p>
          <p>• 体验期内可随时取消，不产生费用</p>
          <p>• 体验期满未取消将自动扣费</p>
          <p>• 购买后需激活ETC设备才能开通会员权益</p>
        </div>

        <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
          <div className="max-w-md mx-auto flex items-center justify-between">
            <div>
              <span className="text-gray-500">应付金额：</span>
              <span className="text-xl font-bold text-red-500">¥{product.price}</span>
            </div>
            <Button onClick={handlePay} disabled={loading || !agreementAccepted} className="px-8">
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin mr-2" />支付中...</>
              ) : (
                '立即支付'
              )}
            </Button>
          </div>
        </div>
      </div>

      {showAgreement && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md max-h-[80vh] overflow-auto">
            <CardHeader>
              <CardTitle>会员服务协议</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-gray-600 space-y-3">
                <p>一、服务内容：您将开通粤通卡ETC营销平台会员服务，享受对应套餐内的权益。</p>
                <p>二、免费体验期：新用户可享受2个月免费体验期，体验期内可随时取消，不产生费用。</p>
                <p>三、自动扣费：体验期满未取消的，系统将自动从您绑定的支付账户中扣取会员费用。</p>
                <p>四、取消规则：免费期内取消不收取费用；扣费后取消，权益保留至当前会员期结束。</p>
                <p>五、权益说明：会员权益与ETC设备绑定，实行"一车一卡一会员"原则。</p>
                <p className="text-amber-600">六、代扣授权：您授权本平台通过所选支付渠道进行会员费的自动代扣。</p>
              </div>
              <div className="flex gap-3 mt-6">
                <Button variant="outline" onClick={() => setShowAgreement(false)} className="flex-1">关闭</Button>
                <Button onClick={() => { setAgreementAccepted(true); setShowAgreement(false) }} className="flex-1">同意并继续</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {showRightDetail && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md max-h-[80vh] overflow-auto">
            <CardHeader>
              <CardTitle>权益详情</CardTitle>
            </CardHeader>
            <CardContent>
              <div dangerouslySetInnerHTML={{ __html: showRightDetail }} />
              <Button onClick={() => setShowRightDetail(null)} className="w-full mt-4">关闭</Button>
            </CardContent>
          </Card>
        </div>
      )}
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
