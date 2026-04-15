'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Shield, Settings, Users, CreditCard, TrendingUp, DollarSign, FileText, BarChart3, Plus, Edit, Package, CheckCircle, Eye } from 'lucide-react'

interface Right {
  id: string
  name: string
  description: string | null
  totalLimit: number | null
  currentTotal: number
  detailHtml: string | null
  isActive: boolean
  products: { product: { name: string } }[]
  userRights: { id: string }[]
}

export default function RightsPage() {
  const [rights, setRights] = useState<Right[]>([])
  const [showAdd, setShowAdd] = useState(false)
  const [showEdit, setShowEdit] = useState(false)
  const [editData, setEditData] = useState<Right | null>(null)
  const [showDetailPreview, setShowDetailPreview] = useState<string | null>(null)
  const [formData, setFormData] = useState({ name: '', description: '', totalLimit: '', detailHtml: '' })

  const loadRights = () => {
    fetch('/api/rights')
      .then(res => res.json())
      .then(setRights)
  }

  useEffect(() => { loadRights() }, [])

  const handleAdd = async () => {
    await fetch('/api/rights', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })
    setShowAdd(false)
    setFormData({ name: '', description: '', totalLimit: '', detailHtml: '' })
    loadRights()
  }

  const handleEdit = async () => {
    if (!editData) return
    await fetch('/api/rights', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: editData.id,
        name: formData.name,
        description: formData.description,
        totalLimit: formData.totalLimit || null,
        detailHtml: formData.detailHtml || null,
      }),
    })
    setShowEdit(false)
    setEditData(null)
    setFormData({ name: '', description: '', totalLimit: '', detailHtml: '' })
    loadRights()
  }

  const handleToggle = async (id: string, isActive: boolean) => {
    if (!isActive) {
      const confirmed = confirm('禁用权益后，旧会员的权益将保留至会员期结束。确认禁用？')
      if (!confirmed) return
    }
    await fetch('/api/rights', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, isActive: !isActive }),
    })
    loadRights()
  }

  const openEdit = (right: Right) => {
    setEditData(right)
    setFormData({
      name: right.name,
      description: right.description || '',
      totalLimit: right.totalLimit?.toString() || '',
      detailHtml: right.detailHtml || '',
    })
    setShowEdit(true)
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <aside className="fixed left-0 top-0 bottom-0 w-64 bg-slate-900 text-white p-4">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center"><BarChart3 className="w-5 h-5" /></div>
          <span className="font-bold">营销平台管理</span>
        </div>
        <nav className="space-y-1">
          <Link href="/admin" className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white"><TrendingUp className="w-5 h-5" /><span>仪表盘</span></Link>
          <Link href="/admin/products" className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white"><Package className="w-5 h-5" /><span>产品管理</span></Link>
          <Link href="/admin/rights" className="flex items-center gap-3 px-3 py-2 rounded-lg bg-slate-800 text-white"><Shield className="w-5 h-5" /><span>权益管理</span></Link>
          <Link href="/admin/usages" className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white"><CheckCircle className="w-5 h-5" /><span>权益核销</span></Link>
          <Link href="/admin/orders" className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white"><FileText className="w-5 h-5" /><span>订单管理</span></Link>
          <Link href="/admin/members" className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white"><Users className="w-5 h-5" /><span>会员管理</span></Link>
          <Link href="/admin/billing-control" className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white"><CreditCard className="w-5 h-5" /><span>扣费控制</span></Link>
          <Link href="/admin/settlement" className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white"><DollarSign className="w-5 h-5" /><span>结算对账</span></Link>
          {/* <Link href="/admin/settings" className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white"><Settings className="w-5 h-5" /><span>系统配置</span></Link> */}
        </nav>
      </aside>

      <main className="ml-64 p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">权益管理</h1>
          <Button onClick={() => setShowAdd(true)}><Plus className="w-4 h-4 mr-2" />新增权益</Button>
        </div>

        {showAdd && (
          <Card className="mb-6">
            <CardHeader><CardTitle className="text-base">新增权益</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>权益名称</Label><Input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="请输入权益名称" /></div>
                <div><Label>权益描述</Label><Input value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} placeholder="请输入权益描述" /></div>
                <div>
                  <Label>总量控制</Label>
                  <Input type="number" value={formData.totalLimit} onChange={e => setFormData({ ...formData, totalLimit: e.target.value })} placeholder="留空表示不限制" />
                  <p className="text-xs text-gray-400 mt-1">可发放的权益总数量，留空不限制</p>
                </div>
                <div>
                  <Label>详情HTML</Label>
                  <Input value={formData.detailHtml} onChange={e => setFormData({ ...formData, detailHtml: e.target.value })} placeholder="可选，权益详情展示内容" />
                  <p className="text-xs text-gray-400 mt-1">用户点击权益详情时展示的HTML内容</p>
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={() => setShowAdd(false)}>取消</Button>
                <Button onClick={handleAdd}>确认添加</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {showEdit && editData && (
          <Card className="mb-6">
            <CardHeader><CardTitle className="text-base">编辑权益</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>权益名称</Label><Input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} /></div>
                <div><Label>权益描述</Label><Input value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} /></div>
                <div>
                  <Label>总量控制</Label>
                  <Input type="number" value={formData.totalLimit} onChange={e => setFormData({ ...formData, totalLimit: e.target.value })} placeholder="留空表示不限制" />
                </div>
                <div>
                  <Label>详情HTML</Label>
                  <textarea
                    className="w-full h-24 rounded-md border border-gray-200 px-3 py-2 text-sm"
                    value={formData.detailHtml}
                    onChange={e => setFormData({ ...formData, detailHtml: e.target.value })}
                    placeholder="权益详情展示的HTML内容"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={() => { setShowEdit(false); setEditData(null) }}>取消</Button>
                <Button onClick={handleEdit}>保存修改</Button>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardContent className="p-0">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left p-4 font-medium">权益名称</th>
                  <th className="text-left p-4 font-medium">描述</th>
                  <th className="text-left p-4 font-medium">总量控制</th>
                  <th className="text-left p-4 font-medium">已发放</th>
                  <th className="text-left p-4 font-medium">详情</th>
                  <th className="text-left p-4 font-medium">状态</th>
                  <th className="text-left p-4 font-medium">关联产品</th>
                  <th className="text-left p-4 font-medium">操作</th>
                </tr>
              </thead>
              <tbody>
                {rights.map((right) => (
                  <tr key={right.id} className="border-b last:border-0">
                    <td className="p-4 font-medium">{right.name}</td>
                    <td className="p-4 text-gray-500 max-w-xs truncate">{right.description || '-'}</td>
                    <td className="p-4">
                      {right.totalLimit !== null ? (
                        <span className={right.currentTotal >= right.totalLimit ? 'text-red-500 font-medium' : ''}>
                          {right.totalLimit}
                        </span>
                      ) : (
                        <span className="text-gray-400">不限</span>
                      )}
                    </td>
                    <td className="p-4">{right.currentTotal}</td>
                    <td className="p-4">
                      {right.detailHtml ? (
                        <Button variant="ghost" size="sm" onClick={() => setShowDetailPreview(right.detailHtml)}>
                          <Eye className="w-4 h-4 mr-1" />预览
                        </Button>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="p-4">
                      <Badge className={right.isActive ? 'bg-green-500' : 'bg-gray-400'}>
                        {right.isActive ? '启用' : '禁用'}
                      </Badge>
                    </td>
                    <td className="p-4 text-gray-500">
                      {right.products.map(p => p.product.name).join('、') || '-'}
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => openEdit(right)}><Edit className="w-4 h-4" /></Button>
                        <Button variant="outline" size="sm" onClick={() => handleToggle(right.id, right.isActive)}>
                          {right.isActive ? '禁用' : '启用'}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </main>

      {showDetailPreview && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-lg max-h-[80vh] overflow-auto">
            <CardHeader><CardTitle>权益详情预览</CardTitle></CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: showDetailPreview }} />
              <Button onClick={() => setShowDetailPreview(null)} className="w-full mt-4">关闭</Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
