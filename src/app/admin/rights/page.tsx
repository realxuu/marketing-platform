'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Shield, Settings, Users, CreditCard, TrendingUp, DollarSign, FileText, BarChart3, Plus, Edit, Trash2, X, Package, CheckCircle } from 'lucide-react'

interface Right {
  id: string
  name: string
  description: string | null
  type: string
  isActive: boolean
  products: { product: { name: string } }[]
}

export default function RightsPage() {
  const [rights, setRights] = useState<Right[]>([])
  const [showAdd, setShowAdd] = useState(false)
  const [showEdit, setShowEdit] = useState(false)
  const [editData, setEditData] = useState<Right | null>(null)
  const [formData, setFormData] = useState({ name: '', description: '', type: 'SELF_OPERATED' })

  const loadRights = () => {
    fetch('/api/rights')
      .then(res => res.json())
      .then(setRights)
  }

  useEffect(() => {
    loadRights()
  }, [])

  const handleAdd = async () => {
    await fetch('/api/rights', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })
    setShowAdd(false)
    setFormData({ name: '', description: '', type: 'SELF_OPERATED' })
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
      }),
    })
    setShowEdit(false)
    setEditData(null)
    setFormData({ name: '', description: '', type: 'SELF_OPERATED' })
    loadRights()
  }

  const handleToggle = async (id: string, isActive: boolean) => {
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
      type: right.type,
    })
    setShowEdit(true)
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <aside className="fixed left-0 top-0 bottom-0 w-64 bg-slate-900 text-white p-4">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
            <BarChart3 className="w-5 h-5" />
          </div>
          <span className="font-bold">营销平台管理</span>
        </div>
        <nav className="space-y-1">
          <Link href="/admin" className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white">
            <TrendingUp className="w-5 h-5" />
            <span>仪表盘</span>
          </Link>
          <Link href="/admin/products" className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white">
            <Package className="w-5 h-5" />
            <span>产品管理</span>
          </Link>
          <Link href="/admin/rights" className="flex items-center gap-3 px-3 py-2 rounded-lg bg-slate-800 text-white">
            <Shield className="w-5 h-5" />
            <span>权益管理</span>
          </Link>
          <Link href="/admin/usages" className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white">
            <CheckCircle className="w-5 h-5" />
            <span>权益核销</span>
          </Link>
          <Link href="/admin/orders" className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white">
            <FileText className="w-5 h-5" />
            <span>订单管理</span>
          </Link>
          <Link href="/admin/members" className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white">
            <Users className="w-5 h-5" />
            <span>会员管理</span>
          </Link>
          <Link href="/admin/settlement" className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white">
            <DollarSign className="w-5 h-5" />
            <span>结算对账</span>
          </Link>
          <Link href="/admin/settings" className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white">
            <Settings className="w-5 h-5" />
            <span>系统配置</span>
          </Link>
        </nav>
      </aside>

      <main className="ml-64 p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">权益管理</h1>
          <Button onClick={() => setShowAdd(true)}>
            <Plus className="w-4 h-4 mr-2" />
            新增权益
          </Button>
        </div>

        {/* 新增表单 */}
        {showAdd && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-base">新增权益</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>权益名称</Label>
                  <Input
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    placeholder="请输入权益名称"
                  />
                </div>
                <div>
                  <Label>权益描述</Label>
                  <Input
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    placeholder="请输入权益描述"
                  />
                </div>
                <div>
                  <Label>权益类型</Label>
                  <select
                    className="w-full h-9 rounded-md border border-gray-200 px-3"
                    value={formData.type}
                    onChange={e => setFormData({ ...formData, type: e.target.value })}
                  >
                    <option value="SELF_OPERATED">自营</option>
                    <option value="COMMISSION">代销</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={() => setShowAdd(false)}>取消</Button>
                <Button onClick={handleAdd}>确认添加</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 编辑表单 */}
        {showEdit && editData && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-base">编辑权益</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>权益名称</Label>
                  <Input
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    placeholder="请输入权益名称"
                  />
                </div>
                <div>
                  <Label>权益描述</Label>
                  <Input
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    placeholder="请输入权益描述"
                  />
                </div>
                <div>
                  <Label>权益类型</Label>
                  <select
                    className="w-full h-9 rounded-md border border-gray-200 px-3 bg-gray-100"
                    value={editData.type}
                    disabled
                  >
                    <option value="SELF_OPERATED">自营</option>
                    <option value="COMMISSION">代销</option>
                  </select>
                  <p className="text-xs text-gray-400 mt-1">类型不可修改</p>
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={() => { setShowEdit(false); setEditData(null) }}>取消</Button>
                <Button onClick={handleEdit}>保存修改</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 权益列表 */}
        <Card>
          <CardContent className="p-0">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left p-4 font-medium">权益名称</th>
                  <th className="text-left p-4 font-medium">描述</th>
                  <th className="text-left p-4 font-medium">类型</th>
                  <th className="text-left p-4 font-medium">状态</th>
                  <th className="text-left p-4 font-medium">关联产品</th>
                  <th className="text-left p-4 font-medium">操作</th>
                </tr>
              </thead>
              <tbody>
                {rights.map((right) => (
                  <tr key={right.id} className="border-b last:border-0">
                    <td className="p-4 font-medium">{right.name}</td>
                    <td className="p-4 text-gray-500">{right.description || '-'}</td>
                    <td className="p-4">
                      <Badge variant={right.type === 'SELF_OPERATED' ? 'default' : 'secondary'}>
                        {right.type === 'SELF_OPERATED' ? '自营' : '代销'}
                      </Badge>
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
                        <Button variant="outline" size="sm" onClick={() => openEdit(right)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleToggle(right.id, right.isActive)}
                        >
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
    </div>
  )
}
