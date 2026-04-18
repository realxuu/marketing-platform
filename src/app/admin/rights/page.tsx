'use client'

import { useEffect, useState } from 'react'
import { Sidebar } from '@/components/admin/Sidebar'
import { Plus, Edit, Eye } from 'lucide-react'

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

  const renderForm = (isEdit: boolean) => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
      <div>
        <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6 }}>权益名称</label>
        <input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="请输入权益名称" style={{ width: '100%', border: '1px solid rgba(0, 0, 0, 0.1)', borderRadius: 6, padding: '8px 12px', fontSize: 14 }} />
      </div>
      <div>
        <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6 }}>权益描述</label>
        <input value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} placeholder="请输入权益描述" style={{ width: '100%', border: '1px solid rgba(0, 0, 0, 0.1)', borderRadius: 6, padding: '8px 12px', fontSize: 14 }} />
      </div>
      <div>
        <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6 }}>总量控制</label>
        <input type="number" value={formData.totalLimit} onChange={e => setFormData({ ...formData, totalLimit: e.target.value })} placeholder="留空表示不限制" style={{ width: '100%', border: '1px solid rgba(0, 0, 0, 0.1)', borderRadius: 6, padding: '8px 12px', fontSize: 14 }} />
        <p style={{ fontSize: 12, color: '#a39e98', marginTop: 4 }}>可发放的权益总数量，留空不限制</p>
      </div>
      <div>
        <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6 }}>详情HTML</label>
        <textarea value={formData.detailHtml} onChange={e => setFormData({ ...formData, detailHtml: e.target.value })} placeholder="可选，权益详情展示内容" style={{ width: '100%', height: 60, border: '1px solid rgba(0, 0, 0, 0.1)', borderRadius: 6, padding: '8px 12px', fontSize: 14, resize: 'none' }} />
        <p style={{ fontSize: 12, color: '#a39e98', marginTop: 4 }}>用户点击权益详情时展示的HTML内容</p>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: '#f6f5f4' }}>
      <Sidebar activePath="/admin/rights" />

      <main style={{ marginLeft: 220, padding: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: 'rgba(0,0,0,0.95)' }}>权益管理</h1>
          <button onClick={() => setShowAdd(true)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', background: '#0075de', color: '#fff', border: 'none', borderRadius: 6, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
            <Plus style={{ width: 16, height: 16 }} />新增权益
          </button>
        </div>

        {showAdd && (
          <div style={{ background: '#fff', border: '1px solid rgba(0, 0, 0, 0.1)', borderRadius: 12, marginBottom: 24 }}>
            <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(0, 0, 0, 0.1)' }}>
              <h2 style={{ fontSize: 14, fontWeight: 600, margin: 0 }}>新增权益</h2>
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
              <h2 style={{ fontSize: 14, fontWeight: 600, margin: 0 }}>编辑权益</h2>
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
                {['权益名称', '描述', '总量控制', '已发放', '详情', '状态', '关联产品', '操作'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '12px 16px', fontWeight: 500, fontSize: 13, color: '#615d59' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rights.map((right) => (
                <tr key={right.id} style={{ borderBottom: '1px solid rgba(0, 0, 0, 0.05)' }}>
                  <td style={{ padding: '12px 16px', fontWeight: 500 }}>{right.name}</td>
                  <td style={{ padding: '12px 16px', color: '#615d59', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{right.description || '-'}</td>
                  <td style={{ padding: '12px 16px' }}>
                    {right.totalLimit !== null ? (
                      <span style={{ color: right.currentTotal >= right.totalLimit ? '#dc2626' : 'rgba(0,0,0,0.95)', fontWeight: right.currentTotal >= right.totalLimit ? 600 : 400 }}>
                        {right.totalLimit}
                      </span>
                    ) : (
                      <span style={{ color: '#a39e98' }}>不限</span>
                    )}
                  </td>
                  <td style={{ padding: '12px 16px' }}>{right.currentTotal}</td>
                  <td style={{ padding: '12px 16px' }}>
                    {right.detailHtml ? (
                      <button onClick={() => setShowDetailPreview(right.detailHtml)} style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'transparent', border: 'none', color: '#0075de', fontSize: 13, cursor: 'pointer' }}>
                        <Eye style={{ width: 14, height: 14 }} />预览
                      </button>
                    ) : (
                      <span style={{ color: '#a39e98' }}>-</span>
                    )}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ background: right.isActive ? '#f0fdf4' : '#f6f5f4', color: right.isActive ? '#1aae39' : '#615d59', padding: '4px 10px', borderRadius: 9999, fontSize: 12, fontWeight: 500 }}>
                      {right.isActive ? '启用' : '禁用'}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', color: '#615d59' }}>{right.products.map(p => p.product.name).join('、') || '-'}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button onClick={() => openEdit(right)} style={{ padding: '6px 10px', background: 'transparent', border: '1px solid rgba(0,0,0,0.1)', borderRadius: 4, cursor: 'pointer' }}><Edit style={{ width: 14, height: 14 }} /></button>
                      <button onClick={() => handleToggle(right.id, right.isActive)} style={{ padding: '6px 10px', background: 'transparent', border: '1px solid rgba(0,0,0,0.1)', borderRadius: 4, fontSize: 13, cursor: 'pointer' }}>{right.isActive ? '禁用' : '启用'}</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {showDetailPreview && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <div style={{ background: '#fff', borderRadius: 12, maxWidth: 500, width: '100%', maxHeight: '80vh', overflow: 'auto' }}>
            <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(0, 0, 0, 0.1)' }}>
              <h3 style={{ fontSize: 16, fontWeight: 600, margin: 0 }}>权益详情预览</h3>
            </div>
            <div style={{ padding: 16 }} dangerouslySetInnerHTML={{ __html: showDetailPreview }} />
            <div style={{ padding: '12px 16px', borderTop: '1px solid rgba(0, 0, 0, 0.05)' }}>
              <button onClick={() => setShowDetailPreview(null)} style={{ width: '100%', padding: '10px 16px', background: '#0075de', color: '#fff', border: 'none', borderRadius: 6, fontWeight: 600, cursor: 'pointer' }}>关闭</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
