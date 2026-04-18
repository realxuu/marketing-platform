'use client'

import { useEffect, useState } from 'react'
import { Sidebar } from '@/components/admin/Sidebar'
import { Plus, Edit } from 'lucide-react'
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

  const renderForm = (isEdit: boolean) => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
      <div>
        <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6 }}>产品名称</label>
        <input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="如：年卡会员" style={{ width: '100%', border: '1px solid rgba(0, 0, 0, 0.1)', borderRadius: 6, padding: '8px 12px', fontSize: 14 }} />
      </div>
      <div>
        <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6 }}>产品类型</label>
        {isEdit ? (
          <>
            <input value={getTypeLabel(editData?.type || 'YEARLY')} disabled style={{ width: '100%', border: '1px solid rgba(0, 0, 0, 0.1)', borderRadius: 6, padding: '8px 12px', fontSize: 14, background: '#f6f5f4' }} />
            <p style={{ fontSize: 12, color: '#a39e98', marginTop: 4 }}>类型不可修改</p>
          </>
        ) : (
          <select value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })} style={{ width: '100%', border: '1px solid rgba(0, 0, 0, 0.1)', borderRadius: 6, padding: '8px 12px', fontSize: 14, background: '#fff' }}>
            <option value="YEARLY">年卡</option>
            <option value="MONTHLY">月卡</option>
            <option value="PER_USE">次卡</option>
          </select>
        )}
      </div>
      <div>
        <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6 }}>价格（元）</label>
        <input type="number" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} placeholder="如：138" style={{ width: '100%', border: '1px solid rgba(0, 0, 0, 0.1)', borderRadius: 6, padding: '8px 12px', fontSize: 14 }} />
      </div>
      <div>
        <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6 }}>生效起始时间</label>
        <input type="datetime-local" value={formData.effectiveStartTime} onChange={e => setFormData({ ...formData, effectiveStartTime: e.target.value })} style={{ width: '100%', border: '1px solid rgba(0, 0, 0, 0.1)', borderRadius: 6, padding: '8px 12px', fontSize: 14 }} />
        <p style={{ fontSize: 12, color: '#a39e98', marginTop: 4 }}>留空表示立即生效</p>
      </div>
      <div style={{ gridColumn: 'span 2' }}>
        <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6 }}>产品描述</label>
        <input value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} placeholder="如：粤运拯救服务1次 + 中石化年卡权益" style={{ width: '100%', border: '1px solid rgba(0, 0, 0, 0.1)', borderRadius: 6, padding: '8px 12px', fontSize: 14 }} />
      </div>
      <div style={{ gridColumn: 'span 2' }}>
        <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6 }}>关联权益</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
          {rights.map(right => (
            <button
              key={right.id}
              onClick={() => toggleRight(right.id)}
              style={{
                padding: '6px 12px',
                borderRadius: 9999,
                border: formData.selectedRights.includes(right.id) ? '1px solid #0075de' : '1px solid rgba(0, 0, 0, 0.1)',
                background: formData.selectedRights.includes(right.id) ? '#f2f9ff' : '#fff',
                color: formData.selectedRights.includes(right.id) ? '#0075de' : '#615d59',
                fontSize: 13,
                cursor: 'pointer',
              }}
            >
              {right.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: '#f6f5f4' }}>
      <Sidebar activePath="/admin/products" />

      <main style={{ marginLeft: 220, padding: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: 'rgba(0,0,0,0.95)' }}>产品管理</h1>
          <button onClick={() => setShowAdd(true)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', background: '#0075de', color: '#fff', border: 'none', borderRadius: 6, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
            <Plus style={{ width: 16, height: 16 }} />新增产品
          </button>
        </div>

        {showAdd && (
          <div style={{ background: '#fff', border: '1px solid rgba(0, 0, 0, 0.1)', borderRadius: 12, marginBottom: 24 }}>
            <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(0, 0, 0, 0.1)' }}>
              <h2 style={{ fontSize: 14, fontWeight: 600, margin: 0 }}>新增产品</h2>
            </div>
            <div style={{ padding: 16 }}>{renderForm(false)}</div>
            <div style={{ padding: '12px 16px', borderTop: '1px solid rgba(0, 0, 0, 0.05)', display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <button onClick={() => setShowAdd(false)} style={{ padding: '8px 16px', background: 'transparent', border: '1px solid rgba(0,0,0,0.1)', borderRadius: 6, fontSize: 14, cursor: 'pointer' }}>取消</button>
              <button onClick={handleAdd} style={{ padding: '8px 16px', background: '#0075de', color: '#fff', border: 'none', borderRadius: 6, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>确认添加</button>
            </div>
          </div>
        )}

        {showEdit && editData && (
          <div style={{ background: '#fff', border: '1px solid rgba(0, 0, 0, 0.1)', borderRadius: 12, marginBottom: 24 }}>
            <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(0, 0, 0, 0.1)' }}>
              <h2 style={{ fontSize: 14, fontWeight: 600, margin: 0 }}>编辑产品</h2>
            </div>
            <div style={{ padding: 16 }}>{renderForm(true)}</div>
            <div style={{ padding: '12px 16px', borderTop: '1px solid rgba(0, 0, 0, 0.05)', display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <button onClick={() => { setShowEdit(false); setEditData(null) }} style={{ padding: '8px 16px', background: 'transparent', border: '1px solid rgba(0,0,0,0.1)', borderRadius: 6, fontSize: 14, cursor: 'pointer' }}>取消</button>
              <button onClick={handleEdit} style={{ padding: '8px 16px', background: '#0075de', color: '#fff', border: 'none', borderRadius: 6, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>保存修改</button>
            </div>
          </div>
        )}

        <div style={{ background: '#fff', border: '1px solid rgba(0, 0, 0, 0.1)', borderRadius: 12, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f6f5f4', borderBottom: '1px solid rgba(0, 0, 0, 0.1)' }}>
                {['产品名称', '类型', '价格', '生效时间', '包含权益', '状态', '操作'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '12px 16px', fontWeight: 500, fontSize: 13, color: '#615d59' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} style={{ borderBottom: '1px solid rgba(0, 0, 0, 0.05)' }}>
                  <td style={{ padding: '12px 16px', fontWeight: 500 }}>{product.name}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ background: product.type === 'YEARLY' ? '#f2f9ff' : product.type === 'MONTHLY' ? '#f0fdf4' : '#fff7ed', color: product.type === 'YEARLY' ? '#0075de' : product.type === 'MONTHLY' ? '#1aae39' : '#dd5b00', padding: '4px 10px', borderRadius: 9999, fontSize: 12, fontWeight: 500 }}>
                      {getTypeLabel(product.type)}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', fontWeight: 600, color: '#0075de' }}>¥{product.price}{product.type === 'PER_USE' ? '/次' : ''}</td>
                  <td style={{ padding: '12px 16px', fontSize: 13, color: '#615d59' }}>{product.effectiveStartTime ? format(new Date(product.effectiveStartTime), 'yyyy-MM-dd') : '立即生效'}</td>
                  <td style={{ padding: '12px 16px', fontSize: 13, color: '#615d59' }}>{product.rights?.map(r => r.right.name).join('、') || '-'}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ background: product.isActive ? '#f0fdf4' : '#f6f5f4', color: product.isActive ? '#1aae39' : '#615d59', padding: '4px 10px', borderRadius: 9999, fontSize: 12, fontWeight: 500 }}>
                      {product.isActive ? '上架' : '下架'}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button onClick={() => openEdit(product)} style={{ padding: '6px 10px', background: 'transparent', border: '1px solid rgba(0,0,0,0.1)', borderRadius: 4, cursor: 'pointer' }}><Edit style={{ width: 14, height: 14 }} /></button>
                      <button onClick={() => handleToggle(product.id, product.isActive)} style={{ padding: '6px 10px', background: 'transparent', border: '1px solid rgba(0,0,0,0.1)', borderRadius: 4, fontSize: 13, cursor: 'pointer' }}>{product.isActive ? '下架' : '上架'}</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}
