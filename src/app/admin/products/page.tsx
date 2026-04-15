'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Shield, Settings, Users, CreditCard, TrendingUp, DollarSign, FileText, BarChart3, Plus, Edit, Package, CheckCircle } from 'lucide-react'
import { format } from 'date-fns'

interface Product {
  id: string
  name: string
  type: string
  price: number
  description: string | null
  effectiveStartTime: string | null
  isActive: boolean
  rights: { right: { id: string; name: string } }[]
}

interface Right {
  id: string
  name: string
  isActive: boolean
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [rights, setRights] = useState<Right[]>([])
  const [showAdd, setShowAdd] = useState(false)
  const [showEdit, setShowEdit] = useState(false)
  const [editData, setEditData] = useState<Product | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    type: 'YEARLY',
    price: '',
    description: '',
    effectiveStartTime: '',
    selectedRights: [] as string[]
  })

  const loadData = () => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => setProducts(data.map((p: Product) => ({ ...p, rights: p.rights || [] }))))
    fetch('/api/rights')
      .then(res => res.json())
      .then(data => setRights(data.filter((r: Right) => r.isActive)))
  }

  useEffect(() => { loadData() }, [])

  const handleAdd = async () => {
    await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: formData.name,
        type: formData.type,
        price: parseFloat(formData.price),
        description: formData.description,
        effectiveStartTime: formData.effectiveStartTime || null,
        rightIds: formData.selectedRights,
      }),
    })
    setShowAdd(false)
    setFormData({ name: '', type: 'YEARLY', price: '', description: '', effectiveStartTime: '', selectedRights: [] })
    loadData()
  }

  const handleEdit = async () => {
    if (!editData) return
    await fetch('/api/products', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: editData.id,
        name: formData.name,
        price: parseFloat(formData.price),
        description: formData.description,
        effectiveStartTime: formData.effectiveStartTime || null,
        rightIds: formData.selectedRights,
      }),
    })
    setShowEdit(false)
    setEditData(null)
    loadData()
  }

  const handleToggle = async (id: string, isActive: boolean) => {
    await fetch('/api/products', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, isActive: !isActive }),
    })
    loadData()
  }

  const openEdit = (product: Product) => {
    setEditData(product)
    setFormData({
      name: product.name,
      type: product.type,
      price: product.price.toString(),
      description: product.description || '',
      effectiveStartTime: product.effectiveStartTime ? format(new Date(product.effectiveStartTime), "yyyy-MM-dd'T'HH:mm") : '',
      selectedRights: product.rights?.map(r => r.right.id) || []
    })
    setShowEdit(true)
  }

  const toggleRight = (rightId: string) => {
    setFormData(prev => ({
      ...prev,
      selectedRights: prev.selectedRights.includes(rightId)
        ? prev.selectedRights.filter(id => id !== rightId)
        : [...prev.selectedRights, rightId]
    }))
  }

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = { YEARLY: '年卡', MONTHLY: '月卡', PER_USE: '次卡' }
    return labels[type] || type
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
          <Link href="/admin/products" className="flex items-center gap-3 px-3 py-2 rounded-lg bg-slate-800 text-white"><Package className="w-5 h-5" /><span>产品管理</span></Link>
          <Link href="/admin/rights" className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white"><Shield className="w-5 h-5" /><span>权益管理</span></Link>
          <Link href="/admin/usages" className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white"><CheckCircle className="w-5 h-5" /><span>权益核销</span></Link>
          <Link href="/admin/orders" className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white"><FileText className="w-5 h-5" /><span>订单管理</span></Link>
          <Link href="/admin/members" className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white"><Users className="w-5 h-5" /><span>会员管理</span></Link>
          <Link href="/admin/billing-control" className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white"><CreditCard className="w-5 h-5" /><span>扣费控制</span></Link>
          <Link href="/admin/settlement" className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white"><DollarSign className="w-5 h-5" /><span>结算对账</span></Link>
          <Link href="/admin/settings" className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white"><Settings className="w-5 h-5" /><span>系统配置</span></Link>
        </nav>
      </aside>

      <main className="ml-64 p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">产品管理</h1>
          <Button onClick={() => setShowAdd(true)}><Plus className="w-4 h-4 mr-2" />新增产品</Button>
        </div>

        {showAdd && (
          <Card className="mb-6">
            <CardHeader><CardTitle className="text-base">新增产品</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>产品名称</Label><Input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="如：年卡会员" /></div>
                <div>
                  <Label>产品类型</Label>
                  <select className="w-full h-9 rounded-md border border-gray-200 px-3" value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })}>
                    <option value="YEARLY">年卡</option>
                    <option value="MONTHLY">月卡</option>
                    <option value="PER_USE">次卡</option>
                  </select>
                </div>
                <div><Label>价格（元）</Label><Input type="number" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} placeholder="如：138" /></div>
                <div>
                  <Label>生效起始时间</Label>
                  <Input type="datetime-local" value={formData.effectiveStartTime} onChange={e => setFormData({ ...formData, effectiveStartTime: e.target.value })} />
                  <p className="text-xs text-gray-400 mt-1">留空表示立即生效</p>
                </div>
                <div className="col-span-2"><Label>产品描述</Label><Input value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} placeholder="如：粤运拯救服务1次 + 中石化年卡权益" /></div>
                <div className="col-span-2">
                  <Label>关联权益</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {rights.map(right => (
                      <label key={right.id} className={`flex items-center gap-2 px-3 py-1.5 rounded-full border cursor-pointer transition-colors ${formData.selectedRights.includes(right.id) ? 'bg-blue-100 border-blue-500 text-blue-700' : 'bg-white border-gray-200 hover:bg-gray-50'}`}>
                        <input type="checkbox" checked={formData.selectedRights.includes(right.id)} onChange={() => toggleRight(right.id)} className="hidden" />
                        {right.name}
                      </label>
                    ))}
                  </div>
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
            <CardHeader><CardTitle className="text-base">编辑产品</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>产品名称</Label><Input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} /></div>
                <div><Label>产品类型</Label><Input value={getTypeLabel(editData.type)} disabled className="bg-gray-100" /><p className="text-xs text-gray-400 mt-1">类型不可修改</p></div>
                <div><Label>价格（元）</Label><Input type="number" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} /></div>
                <div>
                  <Label>生效起始时间</Label>
                  <Input type="datetime-local" value={formData.effectiveStartTime} onChange={e => setFormData({ ...formData, effectiveStartTime: e.target.value })} />
                </div>
                <div className="col-span-2"><Label>产品描述</Label><Input value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} /></div>
                <div className="col-span-2">
                  <Label>关联权益</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {rights.map(right => (
                      <label key={right.id} className={`flex items-center gap-2 px-3 py-1.5 rounded-full border cursor-pointer transition-colors ${formData.selectedRights.includes(right.id) ? 'bg-blue-100 border-blue-500 text-blue-700' : 'bg-white border-gray-200 hover:bg-gray-50'}`}>
                        <input type="checkbox" checked={formData.selectedRights.includes(right.id)} onChange={() => toggleRight(right.id)} className="hidden" />
                        {right.name}
                      </label>
                    ))}
                  </div>
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
                  <th className="text-left p-4 font-medium">产品名称</th>
                  <th className="text-left p-4 font-medium">类型</th>
                  <th className="text-left p-4 font-medium">价格</th>
                  <th className="text-left p-4 font-medium">生效时间</th>
                  <th className="text-left p-4 font-medium">包含权益</th>
                  <th className="text-left p-4 font-medium">状态</th>
                  <th className="text-left p-4 font-medium">操作</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-b last:border-0">
                    <td className="p-4 font-medium">{product.name}</td>
                    <td className="p-4"><Badge variant={product.type === 'YEARLY' ? 'default' : product.type === 'MONTHLY' ? 'secondary' : 'outline'}>{getTypeLabel(product.type)}</Badge></td>
                    <td className="p-4 font-medium text-blue-600">¥{product.price}{product.type === 'PER_USE' ? '/次' : ''}</td>
                    <td className="p-4 text-gray-500 text-sm">{product.effectiveStartTime ? format(new Date(product.effectiveStartTime), 'yyyy-MM-dd') : '立即生效'}</td>
                    <td className="p-4 text-gray-500">{product.rights?.map(r => r.right.name).join('、') || '-'}</td>
                    <td className="p-4"><Badge className={product.isActive ? 'bg-green-500' : 'bg-gray-400'}>{product.isActive ? '上架' : '下架'}</Badge></td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => openEdit(product)}><Edit className="w-4 h-4" /></Button>
                        <Button variant="outline" size="sm" onClick={() => handleToggle(product.id, product.isActive)}>{product.isActive ? '下架' : '上架'}</Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
