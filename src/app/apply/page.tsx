'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, CheckCircle } from 'lucide-react'
import Link from 'next/link'

export default function ApplyPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    idNumber: '',
    plateNumber: '',
    plateColor: 'BLUE',
    channel: '',
  })
  const [agreed, setAgreed] = useState(false)

  const handleSubmit = async () => {
    if (!agreed || !formData.channel) return

    // 模拟提交到互联网系统
    // 实际应该调用互联网系统的申办接口
    setStep(3)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 头部 */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <h1 className="font-medium">ETC申办</h1>
        </div>
      </div>

      {/* 步骤指示 */}
      <div className="bg-white border-b">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-center gap-4 text-sm">
          <div className={`flex items-center gap-1 ${step >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
            <div className={`w-5 h-5 rounded-full text-xs flex items-center justify-center ${step >= 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
              {step > 1 ? '✓' : '1'}
            </div>
            <span>填写信息</span>
          </div>
          <div className="w-6 h-px bg-gray-300" />
          <div className={`flex items-center gap-1 ${step >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
            <div className={`w-5 h-5 rounded-full text-xs flex items-center justify-center ${step >= 2 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
              {step > 2 ? '✓' : '2'}
            </div>
            <span>选择渠道</span>
          </div>
          <div className="w-6 h-px bg-gray-300" />
          <div className={`flex items-center gap-1 ${step >= 3 ? 'text-blue-600' : 'text-gray-400'}`}>
            <div className={`w-5 h-5 rounded-full text-xs flex items-center justify-center ${step >= 3 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
              3
            </div>
            <span>提交</span>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6">
        {step === 1 && (
          <div className="space-y-4">
            <Card className="p-4">
              <h2 className="font-medium mb-4">填写申办信息</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">姓名</label>
                  <input
                    type="text"
                    className="w-full border rounded-lg px-3 py-2 text-sm"
                    placeholder="请输入姓名"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">手机号</label>
                  <input
                    type="tel"
                    className="w-full border rounded-lg px-3 py-2 text-sm"
                    placeholder="请输入手机号"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">身份证号</label>
                  <input
                    type="text"
                    className="w-full border rounded-lg px-3 py-2 text-sm"
                    placeholder="请输入身份证号"
                    value={formData.idNumber}
                    onChange={(e) => setFormData({ ...formData, idNumber: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">车牌号</label>
                  <input
                    type="text"
                    className="w-full border rounded-lg px-3 py-2 text-sm"
                    placeholder="请输入车牌号，如：粤A12345"
                    value={formData.plateNumber}
                    onChange={(e) => setFormData({ ...formData, plateNumber: e.target.value.toUpperCase() })}
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">车牌颜色</label>
                  <div className="flex gap-2">
                    {[
                      { key: 'BLUE', label: '蓝色' },
                      { key: 'YELLOW', label: '黄色' },
                      { key: 'GREEN', label: '绿色' },
                    ].map((c) => (
                      <button
                        key={c.key}
                        onClick={() => setFormData({ ...formData, plateColor: c.key })}
                        className={`flex-1 py-2 rounded-lg border text-sm ${
                          formData.plateColor === c.key
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-200 text-gray-600'
                        }`}
                      >
                        {c.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
            <Button
              className="w-full"
              onClick={() => setStep(2)}
              disabled={!formData.name || !formData.phone || !formData.plateNumber}
            >
              下一步
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <Card className="p-4">
              <h2 className="font-medium mb-4">选择签约渠道</h2>
              <p className="text-sm text-gray-500 mb-4">
                选择用于ETC通行费扣款的签约渠道，后续开通会员将使用同一渠道
              </p>
              <div className="space-y-3">
                {[
                  { key: 'ALIPAY', label: '支付宝', desc: '使用支付宝签约扣款' },
                  { key: 'WECHAT', label: '微信支付', desc: '使用微信签约扣款' },
                  { key: 'UNIONPAY', label: '银联云闪付', desc: '使用银联签约扣款' },
                ].map((c) => (
                  <div
                    key={c.key}
                    onClick={() => setFormData({ ...formData, channel: c.key })}
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                      formData.channel === c.key
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{c.label}</div>
                        <div className="text-xs text-gray-400">{c.desc}</div>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        formData.channel === c.key ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                      }`}>
                        {formData.channel === c.key && (
                          <CheckCircle className="w-3 h-3 text-white" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* 协议 */}
            <div className="flex items-start gap-2 px-1">
              <input
                type="checkbox"
                id="agreement"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-0.5 w-4 h-4 text-blue-600 rounded border-gray-300"
              />
              <label htmlFor="agreement" className="text-xs text-gray-500">
                我已阅读并同意《ETC申办服务协议》
              </label>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setStep(1)}>
                上一步
              </Button>
              <Button
                className="flex-1"
                onClick={handleSubmit}
                disabled={!formData.channel || !agreed}
              >
                提交申办
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-xl font-bold mb-2">申办成功</h2>
            <p className="text-gray-500 text-sm mb-6">
              您的ETC申办已提交，审核通过后将邮寄到您填写的地址
            </p>
            <div className="bg-white rounded-xl border p-4 text-left mb-6">
              <div className="text-sm text-gray-500 space-y-2">
                <div className="flex justify-between">
                  <span>申请人</span>
                  <span className="text-gray-900">{formData.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>车牌号</span>
                  <span className="text-gray-900">{formData.plateNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span>签约渠道</span>
                  <span className="text-gray-900">
                    {formData.channel === 'ALIPAY' && '支付宝'}
                    {formData.channel === 'WECHAT' && '微信'}
                    {formData.channel === 'UNIONPAY' && '银联'}
                  </span>
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-400 mb-6">
              预计3-5个工作日审核完成，届时会有短信通知
            </p>

            {/* 模拟激活入口 */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-blue-700 mb-3">
                演示模式：模拟用户已收到卡签并激活
              </p>
              <Link
                href={`/activate?userId=demo&plateNumber=${formData.plateNumber}&plateColor=${formData.plateColor}&channel=${formData.channel}&name=${encodeURIComponent(formData.name)}&phone=${formData.phone}`}
              >
                <Button className="w-full">模拟激活ETC</Button>
              </Link>
            </div>

            <Link href="/">
              <Button variant="outline" className="w-full">返回首页</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
