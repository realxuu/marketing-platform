'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Crown, Shield, Car, Calendar } from 'lucide-react'
import { format } from 'date-fns'

interface BillingRecord {
  id: string
  amount: number
  type: string
  status: string
  remark: string | null
  createdAt: string
  member: {
    product: { name: string }
    user: { name: string }
  }
}

export default function BillingPage() {
  const [records, setRecords] = useState<BillingRecord[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/billing')
      .then(res => res.json())
      .then((data: BillingRecord[]) => {
        setRecords(data)
        setLoading(false)
      })
  }, [])

  const typeMap: Record<string, { label: string; color: string }> = {
    MEMBERSHIP_FEE: { label: '会员费', color: 'bg-blue-500' },
    TOLL_FEE: { label: '通行费', color: 'bg-green-500' },
  }

  const statusMap: Record<string, { label: string; color: string }> = {
    SUCCESS: { label: '成功', color: 'text-green-600' },
    FAILED: { label: '失败', color: 'text-red-600' },
    PENDING: { label: '处理中', color: 'text-orange-600' },
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
      <div className="bg-white border-b px-4 py-4">
        <h1 className="text-lg font-semibold text-center">扣费记录</h1>
      </div>

      <div className="max-w-md mx-auto p-4">
        {records.length === 0 ? (
          <Card className="text-center py-8">
            <CardContent>
              <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">暂无扣费记录</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {records.map((record) => (
              <Card key={record.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge className={`${typeMap[record.type]?.color} text-white`}>
                          {typeMap[record.type]?.label}
                        </Badge>
                        <span className={statusMap[record.status]?.color}>
                          {statusMap[record.status]?.label}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500">
                        {record.member.product.name} · {record.member.user.name}
                      </div>
                      {record.remark && (
                        <div className="text-xs text-gray-400 mt-1">{record.remark}</div>
                      )}
                      <div className="text-xs text-gray-400 mt-1">
                        {format(new Date(record.createdAt), 'yyyy-MM-dd HH:mm')}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-lg font-bold ${record.type === 'TOLL_FEE' ? 'text-orange-600' : 'text-blue-600'}`}>
                        -¥{record.amount.toFixed(2)}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
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
          <Link href="/member" className="flex-1 flex flex-col items-center py-2 text-gray-400">
            <Car className="w-5 h-5" />
            <span className="text-xs mt-1">我的</span>
          </Link>
        </div>
      </nav>
    </div>
  )
}
