'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Crown, Shield, Car, ChevronRight } from 'lucide-react'

interface Product {
  id: string
  name: string
  type: string
  price: number
  description: string | null
  rights: { right: { name: string; description: string | null } }[]
}

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(setProducts)
  }, [])

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

  return (
    <div className="min-h-screen">
      {/* 头部横幅 */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-md mx-auto px-4 py-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <Crown className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">粤通卡会员服务</h1>
              <p className="text-blue-100 text-sm">高速出行，权益护航</p>
            </div>
          </div>
          <p className="text-blue-100 text-sm mb-4">
            新用户享2个月免费体验期，高速救援、设备更换等专属权益等你来享
          </p>
          <div className="flex gap-2">
            <Link href="/member">
              <Button variant="secondary" size="sm">我的会员</Button>
            </Link>
            <Link href="/rights">
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">权益中心</Button>
            </Link>
          </div>
        </div>
      </div>

      {/* 产品列表 */}
      <div className="max-w-md mx-auto px-4 py-6">
        <h2 className="text-lg font-semibold mb-4">选择会员套餐</h2>
        <div className="space-y-4">
          {products.map((product) => (
            <Card key={product.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{product.name}</CardTitle>
                    <CardDescription>{product.description}</CardDescription>
                  </div>
                  {getTypeBadge(product.type)}
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="text-2xl font-bold text-blue-600 mb-3">
                  {getPriceText(product)}
                </div>
                <div className="space-y-2">
                  {product.rights.map((r, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                      <Shield className="w-4 h-4 text-green-500" />
                      <span>{r.right.name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="bg-gray-50 pt-3">
                <Link href={`/purchase?productId=${product.id}`} className="w-full">
                  <Button className="w-full">
                    立即开通
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* 功能入口 */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-4">服务功能</h2>
          <div className="grid grid-cols-2 gap-4">
            <Link href="/rights">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="flex items-center gap-3 p-4">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                    <Shield className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <div className="font-medium">权益中心</div>
                    <div className="text-xs text-gray-500">查看会员权益</div>
                  </div>
                </CardContent>
              </Card>
            </Link>
            <Link href="/member">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="flex items-center gap-3 p-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Car className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium">我的会员</div>
                    <div className="text-xs text-gray-500">管理会员服务</div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </div>

      {/* 底部导航 */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t">
        <div className="max-w-md mx-auto flex">
          <Link href="/" className="flex-1 flex flex-col items-center py-2 text-blue-600">
            <Crown className="w-5 h-5" />
            <span className="text-xs mt-1">首页</span>
          </Link>
          <Link href="/rights" className="flex-1 flex flex-col items-center py-2 text-gray-400">
            <Shield className="w-5 h-5" />
            <span className="text-xs mt-1">权益</span>
          </Link>
          <Link href="/member" className="flex-1 flex flex-col items-center py-2 text-gray-400">
            <Car className="w-5 h-5" />
            <span className="text-xs mt-1">我的</span>
          </Link>
        </div>
      </nav>
    </div>
  )
}
