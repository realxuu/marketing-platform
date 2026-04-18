'use client'

import { useEffect, useState } from 'react'
import { Sidebar } from '@/components/admin/Sidebar'
import { Plus, ArrowUpCircle, ArrowDownCircle, DollarSign } from 'lucide-react'
import { format } from 'date-fns'

interface Settlement {
  id: string
  type: string
  amount: number
  description: string | null
  status: string
  createdAt: string
}

interface SettlementData {
  settlements: Settlement[]
  summary: {
    income: number
    expense: number
    profit: number
    pendingIncome: number
    pendingExpense: number
  }
}

export default function SettlementPage() {
  const [data, setData] = useState<SettlementData | null>(null)
  const [showAdd, setShowAdd] = useState(false)
  const [formData, setFormData] = useState({ type: 'INCOME', amount: '', description: '' })

  const loadData = () => {
    fetch('/api/settlements')
      .then(res => res.json())
      .then(setData)
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleAdd = async () => {
    await fetch('/api/settlements', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: formData.type,
        amount: parseFloat(formData.amount),
        description: formData.description,
      }),
    })
    setShowAdd(false)
    setFormData({ type: 'INCOME', amount: '', description: '' })
    loadData()
  }

  if (!data) return null

  return (
    <div style={{ minHeight: '100vh', background: '#f6f5f4' }}>
      <Sidebar activePath="/admin/settlement" />

      <main style={{ marginLeft: 220, padding: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: 'rgba(0,0,0,0.95)' }}>结算对账</h1>
          <button onClick={() => setShowAdd(true)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', background: '#0075de', color: '#fff', border: 'none', borderRadius: 6, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
            <Plus style={{ width: 16, height: 16 }} />新增记录
          </button>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
          <div style={{ background: '#fff', border: '1px solid rgba(0, 0, 0, 0.1)', borderRadius: 12, padding: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
            <ArrowUpCircle style={{ width: 32, height: 32, color: '#1aae39' }} />
            <div>
              <div style={{ fontSize: 13, color: '#615d59' }}>总收入</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: '#1aae39' }}>¥{data.summary.income.toFixed(2)}</div>
            </div>
          </div>
          <div style={{ background: '#fff', border: '1px solid rgba(0, 0, 0, 0.1)', borderRadius: 12, padding: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
            <ArrowDownCircle style={{ width: 32, height: 32, color: '#dc2626' }} />
            <div>
              <div style={{ fontSize: 13, color: '#615d59' }}>总支出</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: '#dc2626' }}>¥{data.summary.expense.toFixed(2)}</div>
            </div>
          </div>
          <div style={{ background: '#fff', border: '1px solid rgba(0, 0, 0, 0.1)', borderRadius: 12, padding: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
            <DollarSign style={{ width: 32, height: 32, color: '#0075de' }} />
            <div>
              <div style={{ fontSize: 13, color: '#615d59' }}>净利润</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: '#0075de' }}>¥{data.summary.profit.toFixed(2)}</div>
            </div>
          </div>
          <div style={{ background: '#fff', border: '1px solid rgba(0, 0, 0, 0.1)', borderRadius: 12, padding: 16 }}>
            <div style={{ fontSize: 13, color: '#615d59', marginBottom: 4 }}>待处理</div>
            <div style={{ fontSize: 14 }}>
              <span style={{ color: '#1aae39' }}>+¥{data.summary.pendingIncome.toFixed(2)}</span>
              <span style={{ margin: '0 8px', color: '#ebebeb' }}>|</span>
              <span style={{ color: '#dc2626' }}>-¥{data.summary.pendingExpense.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Add Form */}
        {showAdd && (
          <div style={{ background: '#fff', border: '1px solid rgba(0, 0, 0, 0.1)', borderRadius: 12, marginBottom: 24 }}>
            <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(0, 0, 0, 0.1)' }}>
              <h2 style={{ fontSize: 14, fontWeight: 600, margin: 0 }}>新增结算记录</h2>
            </div>
            <div style={{ padding: 16, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6 }}>类型</label>
                <select value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })} style={{ width: '100%', border: '1px solid rgba(0, 0, 0, 0.1)', borderRadius: 6, padding: '8px 12px', fontSize: 14, background: '#fff' }}>
                  <option value="INCOME">收入</option>
                  <option value="EXPENSE">支出</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6 }}>金额</label>
                <input type="number" value={formData.amount} onChange={e => setFormData({ ...formData, amount: e.target.value })} placeholder="请输入金额" style={{ width: '100%', border: '1px solid rgba(0, 0, 0, 0.1)', borderRadius: 6, padding: '8px 12px', fontSize: 14 }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6 }}>说明</label>
                <input value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} placeholder="请输入说明" style={{ width: '100%', border: '1px solid rgba(0, 0, 0, 0.1)', borderRadius: 6, padding: '8px 12px', fontSize: 14 }} />
              </div>
            </div>
            <div style={{ padding: '12px 16px', borderTop: '1px solid rgba(0, 0, 0, 0.05)', display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <button onClick={() => setShowAdd(false)} style={{ padding: '8px 16px', background: 'transparent', border: '1px solid rgba(0,0,0,0.1)', borderRadius: 6, fontSize: 14, cursor: 'pointer' }}>取消</button>
              <button onClick={handleAdd} style={{ padding: '8px 16px', background: '#0075de', color: '#fff', border: 'none', borderRadius: 6, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>确认添加</button>
            </div>
          </div>
        )}

        {/* List */}
        <div style={{ background: '#fff', border: '1px solid rgba(0, 0, 0, 0.1)', borderRadius: 12, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f6f5f4', borderBottom: '1px solid rgba(0, 0, 0, 0.1)' }}>
                {['类型', '金额', '说明', '状态', '时间'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '12px 16px', fontWeight: 500, fontSize: 13, color: '#615d59' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.settlements.map((item) => (
                <tr key={item.id} style={{ borderBottom: '1px solid rgba(0, 0, 0, 0.05)' }}>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      {item.type === 'INCOME' ? (
                        <ArrowUpCircle style={{ width: 18, height: 18, color: '#1aae39' }} />
                      ) : (
                        <ArrowDownCircle style={{ width: 18, height: 18, color: '#dc2626' }} />
                      )}
                      <span>{item.type === 'INCOME' ? '收入' : '支出'}</span>
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px', fontWeight: 600 }}>
                    <span style={{ color: item.type === 'INCOME' ? '#1aae39' : '#dc2626' }}>
                      {item.type === 'INCOME' ? '+' : '-'}¥{item.amount.toFixed(2)}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', color: '#615d59' }}>{item.description || '-'}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ background: item.status === 'COMPLETED' ? '#f0fdf4' : '#fff7ed', color: item.status === 'COMPLETED' ? '#1aae39' : '#dd5b00', padding: '4px 10px', borderRadius: 9999, fontSize: 12, fontWeight: 500 }}>
                      {item.status === 'COMPLETED' ? '已完成' : '待处理'}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: 13, color: '#615d59' }}>{format(new Date(item.createdAt), 'yyyy-MM-dd HH:mm')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}
