'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Shield, Crown, Car, Wrench, CheckCircle, Clock } from 'lucide-react'

interface UserRight {
  id: string
  userId: string
  rightId: string
  memberId: string
  status: string
  totalCount: number
  usedCount: number
  expireAt: string
  createdAt: string
  right?: {
    id: string
    name: string
    description: string | null
    type: string
  }
  member?: {
    id: string
    product?: {
      name: string
    }
  }
  usages: {
    id: string
    type: string
    description: string | null
    createdAt: string
  }[]
}

export default function RightsPage() {
  const [userRights, setUserRights] = useState<UserRight[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 获取第一个用户的权益信息
    fetch('/api/users')
      .then(res => res.json())
      .then(users => {
        if (users.length > 0) {
          return fetch(`/api/user-rights?userId=${users[0].id}`)
        }
        return null
      })
      .then(res => res?.json())
      .then(data => {
        if (data) {
          setUserRights(data)
        }
        setLoading(false)
      })
  }, [])

  const getIcon = (name: string) => {
    if (name.includes('拯救') || name.includes('救援')) return Shield
    if (name.includes('更换') || name.includes('维修')) return Wrench
    return Crown
  }

  const getStatusBadge = (status: string, usedCount: number, totalCount: number) => {
    if (status === 'ACTIVE') {
      return (
        <Badge className="bg-green-500 text-white">
          剩余 {totalCount - usedCount} 次
        </Badge>
      )
    }
    if (status === 'USED') {
      return <Badge className="bg-gray-400 text-white">已用完</Badge>
    }
    if (status === 'EXPIRED') {
      return <Badge className="bg-red-400 text-white">已过期</Badge>
    }
    return <Badge>{status}</Badge>
  }

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      RESCUE: '救援',
      REPLACE: '更换',
      INSURANCE: '保险',
    }
    return labels[type] || type
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-400">加载中...</div>
      </div>
    )
  }

  const activeRights = userRights.filter(ur => ur.status === 'ACTIVE')
  const usedRights = userRights.filter(ur => ur.status !== 'ACTIVE')

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* 头部 */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white px-4 py-6">
        <h1 className="text-lg font-semibold mb-2">权益中心</h1>
        <div className="flex items-center gap-4 text-sm text-blue-100">
          <span>可用权益: <span className="text-white font-medium">{activeRights.length}</span></span>
          <span>已用: <span className="text-white font-medium">{usedRights.length}</span></span>
        </div>
      </div>

      <div className="max-w-md mx-auto p-4">
        {userRights.length === 0 ? (
          <Card className="text-center py-8">
            <CardContent>
              <Shield className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">您暂无权益</p>
              <Link href="/">
                <Button>立即开通会员</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {/* 可用权益 */}
            {activeRights.length > 0 && (
              <>
                <h2 className="text-sm font-medium text-gray-500 flex items-center gap-1">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  可用权益
                </h2>
                {activeRights.map((ur) => {
                  const Icon = ur.right ? getIcon(ur.right.name) : Crown
                  return (
                    <Card key={ur.id} className="overflow-hidden">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <Icon className="w-6 h-6 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium">{ur.right?.name || '未知权益'}</span>
                              {getStatusBadge(ur.status, ur.usedCount, ur.totalCount)}
                            </div>
                            <p className="text-sm text-gray-500 mb-2">
                              {ur.right?.description || '暂无描述'}
                            </p>
                            <div className="text-xs text-gray-400">
                              有效期至: {new Date(ur.expireAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </>
            )}

            {/* 已用权益 */}
            {usedRights.length > 0 && (
              <>
                <h2 className="text-sm font-medium text-gray-500 flex items-center gap-1 mt-6">
                  <Clock className="w-4 h-4 text-gray-400" />
                  已用权益
                </h2>
                {usedRights.map((ur) => {
                  const Icon = ur.right ? getIcon(ur.right.name) : Crown
                  return (
                    <Card key={ur.id} className="overflow-hidden bg-gray-50">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                            <Icon className="w-6 h-6 text-gray-400" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-gray-500">{ur.right?.name || '未知权益'}</span>
                              {getStatusBadge(ur.status, ur.usedCount, ur.totalCount)}
                            </div>
                            {/* 使用记录 */}
                            {ur.usages.length > 0 && (
                              <div className="mt-2 space-y-1">
                                {ur.usages.map(u => (
                                  <div key={u.id} className="text-xs text-gray-400 flex items-center gap-2">
                                    <span className="bg-gray-200 px-1.5 py-0.5 rounded">{getTypeLabel(u.type)}</span>
                                    {u.description && <span>{u.description}</span>}
                                    <span>{new Date(u.createdAt).toLocaleDateString()}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </>
            )}

            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">温馨提示</p>
                  <ul className="text-blue-600 space-y-1 text-xs">
                    <li>• 权益在会员有效期内可用</li>
                    <li>• 部分权益需提前预约</li>
                    <li>• 如有问题请联系客服：400-xxx-xxxx</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
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
          <Link href="/rights" className="flex-1 flex flex-col items-center py-2 text-blue-600">
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

function Button({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <button className={`px-4 py-2 bg-blue-600 text-white rounded-lg ${className}`}>
      {children}
    </button>
  )
}
