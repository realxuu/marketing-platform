'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Crown, Shield, Car, Calendar, ChevronRight, LogOut } from 'lucide-react'
import { format } from 'date-fns'

interface Member {
  id: string
  status: string
  startDate: string
  endDate: string
  isTrial: boolean
  product: {
    id: string
    name: string
    type: string
    price: number
  }
}

export default function MemberPage() {
  const [member, setMember] = useState<Member | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 获取第一个用户的会员信息作为演示
    fetch('/api/members')
      .then(res => res.json())
      .then((data: Member[]) => {
        if (data.length > 0) {
          setMember(data[0])
        }
        setLoading(false)
      })
  }, [])

  const statusMap: Record<string, { label: string; color: string; bg: string }> = {
    TRIAL: { label: '体验期', color: 'text-orange-600', bg: 'bg-orange-100' },
    ACTIVE: { label: '生效中', color: 'text-green-600', bg: 'bg-green-100' },
    EXPIRED: { label: '已过期', color: 'text-gray-600', bg: 'bg-gray-100' },
    CANCELLED: { label: '已取消', color: 'text-red-600', bg: 'bg-red-100' },
  }

  const handleCancel = () => {
    if (confirm('确定要取消会员服务吗？')) {
      alert('取消成功（演示）')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-400">加载中...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* 头部 */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-lg font-semibold">我的会员</h1>
          <Link href="/admin" className="text-xs text-blue-200 hover:text-white">
            管理后台
          </Link>
        </div>
        {member && (
          <Card className="bg-white/10 border-0 backdrop-blur">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Crown className="w-6 h-6 text-yellow-400" />
                  <span className="font-medium">{member.product.name}</span>
                </div>
                <Badge className={`${statusMap[member.status]?.bg} ${statusMap[member.status]?.color}`}>
                  {statusMap[member.status]?.label}
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-blue-200">有效期至</div>
                  <div className="font-medium">
                    {format(new Date(member.endDate), 'yyyy-MM-dd')}
                  </div>
                </div>
                <div>
                  <div className="text-blue-200">{member.isTrial ? '试用剩余' : '剩余天数'}</div>
                  <div className="font-medium">
                    {Math.max(0, Math.ceil((new Date(member.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))} 天
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="max-w-md mx-auto p-4">
        {!member ? (
          <Card className="text-center py-8">
            <CardContent>
              <Crown className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">您还未开通会员</p>
              <Link href="/">
                <Button>立即开通</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {/* 会员信息 */}
            <Card>
              <CardContent className="p-4">
                <h3 className="font-medium mb-3">会员信息</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">产品类型</span>
                    <span>{member.product.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">开通时间</span>
                    <span>{format(new Date(member.startDate), 'yyyy-MM-dd')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">到期时间</span>
                    <span>{format(new Date(member.endDate), 'yyyy-MM-dd')}</span>
                  </div>
                  {member.isTrial && (
                    <div className="flex justify-between text-orange-600">
                      <span>体验状态</span>
                      <span>免费体验期</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* 快捷入口 */}
            <Card>
              <CardContent className="p-0">
                <Link href="/rights" className="flex items-center justify-between p-4 border-b hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-gray-400" />
                    <span>权益中心</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </Link>
                <Link href="/billing" className="flex items-center justify-between p-4 border-b hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <span>扣费记录</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </Link>
                <div className="flex items-center justify-between p-4 hover:bg-gray-50 cursor-pointer">
                  <div className="flex items-center gap-3">
                    <Car className="w-5 h-5 text-gray-400" />
                    <span>车辆管理</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </CardContent>
            </Card>

            {/* 取消会员 */}
            {member.status !== 'CANCELLED' && member.status !== 'EXPIRED' && (
              <Button
                variant="outline"
                className="w-full text-red-600 border-red-200 hover:bg-red-50"
                onClick={handleCancel}
              >
                <LogOut className="w-4 h-4 mr-2" />
                取消会员服务
              </Button>
            )}

            {/* 说明 */}
            <div className="text-xs text-gray-400 space-y-1">
              <p>• 体验期内取消即时生效</p>
              <p>• 会员生效后取消，次年/次月生效</p>
              <p>• 已扣费会员原则上不予退款</p>
            </div>
          </div>
        )}
      </div>

      {/* 底部导航 */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t">
        <div className="max-w-md mx-auto flex">
          <Link href="/" className="flex-1 flex flex-col items-center py-2 text-gray-400">
            <Crown className="w-5 h-5" />
            <span className="text-xs mt-1">首页</span>
          </Link>
          <Link href="/rights" className="flex-1 flex flex-col items-center py-2 text-gray-400">
            <Shield className="w-5 h-5" />
            <span className="text-xs mt-1">权益</span>
          </Link>
          <Link href="/member" className="flex-1 flex flex-col items-center py-2 text-blue-600">
            <Car className="w-5 h-5" />
            <span className="text-xs mt-1">我的</span>
          </Link>
        </div>
      </nav>
    </div>
  )
}
