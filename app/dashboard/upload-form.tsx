'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { nanoid } from 'nanoid'
import { useRouter } from 'next/navigation'
import { Loader2, Sparkles, Copy, Check, MessageSquare } from 'lucide-react'

type ShareInfo = {
  url: string
  sms: string
  customer: string
}

const PLAN_FIELDS = [
  {
    key: 'matsu',
    label: '松プラン',
    sub: 'プレミアム',
    accent: 'bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200',
    description: '最上位のサポートとリッチなオプションを含みます。'
  },
  {
    key: 'take',
    label: '竹プラン',
    sub: 'スタンダード',
    accent: 'bg-gradient-to-br from-emerald-50 to-white border-emerald-200',
    description: '迷ったらコレ。コストと成果のバランスが最適です。'
  },
  {
    key: 'ume',
    label: '梅プラン',
    sub: 'ライト',
    accent: 'bg-gradient-to-br from-slate-50 to-white border-slate-200',
    description: '必要最低限の内容だけを抑えた手軽なプランです。'
  }
] as const

const buildSmsTemplate = (customer: string, url: string) =>
  `お世話になっております。${customer}様向けに松・竹・梅の３プランをご用意しました。こちらから比較・お申し込みが可能です：${url}（LINE・電話でのご相談も歓迎です）`

export default function UploadForm({ userId }: { userId: string }) {
  const [loading, setLoading] = useState(false)
  const [shareInfo, setShareInfo] = useState<ShareInfo | null>(null)
  const [copiedField, setCopiedField] = useState<'url' | 'sms' | null>(null)
  const supabase = createClient()
  const router = useRouter()

  const handleCopy = async (text: string, target: 'url' | 'sms') => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedField(target)
      setTimeout(() => setCopiedField(null), 2000)
    } catch (err) {
      console.error('Copy failed', err)
      alert('クリップボードへコピーできませんでした')
    }
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setShareInfo(null)
    setCopiedField(null)

    const formData = new FormData(event.currentTarget)
    const customerName = (formData.get('customer_name') as string)?.trim()
    const customerPhone = (formData.get('customer_phone') as string)?.trim()
    const matsu = Number(formData.get('price_matsu'))
    const take = Number(formData.get('price_take'))
    const ume = Number(formData.get('price_ume'))

    if (!customerName || !customerPhone || Number.isNaN(matsu) || Number.isNaN(take) || Number.isNaN(ume)) {
      alert('顧客名・電話番号・各プラン金額をすべて入力してください')
      setLoading(false)
      return
    }

    const token = nanoid(10)
    const cleanedPhone = customerPhone.replace(/[^0-9+]/g, '')

    try {
      const { data, error } = await supabase
        .from('estimates')
        .insert({
          user_id: userId,
          customer_name: customerName,
          customer_phone: cleanedPhone,
          matsu_amount: matsu,
          take_amount: take,
          ume_amount: ume,
          amount: take, // 既存ダッシュボード互換用の代表金額
          token
        })
        .select('id, token')
        .single()

      if (error) throw error

      const baseUrl =
        process.env.NEXT_PUBLIC_BASE_URL ||
        (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000')
      const url = `${baseUrl}/e/${data.token}`

      router.refresh()
      event.currentTarget.reset()
      setShareInfo({
        url,
        sms: buildSmsTemplate(customerName, url),
        customer: customerName
      })
    } catch (error) {
      console.error('Creation failed:', error)
      const message = error instanceof Error ? error.message : '原因不明のエラーです'
      alert(`エラーが発生しました: ${message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6">
        <div className="flex items-start gap-3 mb-6">
          <div className="bg-green-100 text-green-700 rounded-full p-2">
            <Sparkles size={20} />
          </div>
          <div>
            <p className="text-sm font-semibold text-green-700">顧客情報</p>
            <p className="text-sm text-gray-600 mt-1">
              SMSで送信できるよう、顧客名と電話番号（ハイフンなし推奨）を入力してください。
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label htmlFor="customer_name" className="block text-sm font-semibold text-gray-700 mb-2">
              顧客名 <span className="text-red-500">*</span>
            </label>
            <input
              id="customer_name"
              name="customer_name"
              placeholder="例: 佐藤建設さま"
              required
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-500 outline-none text-gray-900 placeholder-gray-400"
            />
          </div>
          <div>
            <label htmlFor="customer_phone" className="block text-sm font-semibold text-gray-700 mb-2">
              顧客の電話番号 <span className="text-red-500">*</span>
            </label>
            <input
              id="customer_phone"
              name="customer_phone"
              type="tel"
              placeholder="例: 09012345678"
              required
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-500 outline-none text-gray-900 placeholder-gray-400"
            />
          </div>
        </div>
      </div>

      <div>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
          <div>
            <p className="text-sm font-semibold text-gray-900">松・竹・梅の料金</p>
            <p className="text-sm text-gray-500">1つのフォームで3プラン同時発行。中間の竹プランはダッシュボード上での「代表金額」になります。</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {PLAN_FIELDS.map((plan) => (
            <div key={plan.key} className={`rounded-2xl border p-5 ${plan.accent}`}>
              <div className="flex items-baseline justify-between mb-4">
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-500">{plan.sub}</p>
                  <p className="text-lg font-bold text-gray-900">{plan.label}</p>
                </div>
                <span className="text-[11px] font-semibold text-gray-500 bg-white/70 px-2 py-0.5 rounded-full border border-white shadow-sm">
                  税込
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-4">{plan.description}</p>
              <div className="relative">
                <span className="absolute top-1/2 -translate-y-1/2 left-3 text-sm text-gray-500">¥</span>
                <input
                  name={`price_${plan.key}`}
                  type="number"
                  min={0}
                  required
                  placeholder="1000000"
                  className="w-full border border-gray-300 rounded-xl pl-8 pr-4 py-3 text-lg font-semibold text-gray-900 focus:ring-2 focus:ring-green-500 outline-none placeholder-gray-400"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white py-4 rounded-2xl font-bold text-base tracking-wide shadow-lg shadow-green-200 flex items-center justify-center gap-3 hover:bg-green-700 transition-colors disabled:opacity-60"
        >
          {loading && <Loader2 className="animate-spin h-5 w-5" />}
          {loading ? '発行中...' : '専用URLを発行する'}
        </button>
        <p className="text-xs text-center text-gray-500">
          発行と同時にアクセスログを計測し、閲覧状況をダッシュボードで追跡できます。
        </p>
      </div>

      {shareInfo && (
        <div className="rounded-2xl border border-gray-200 bg-white p-6 space-y-6">
          <div>
            <p className="text-sm font-semibold text-gray-900 mb-1">{shareInfo.customer}さま用URL</p>
            <div className="flex flex-col md:flex-row md:items-center gap-3">
              <div className="flex-1">
                <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 break-all">
                  {shareInfo.url}
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleCopy(shareInfo.url, 'url')}
                className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-gray-300 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                {copiedField === 'url' ? <Check size={16} /> : <Copy size={16} />}
                {copiedField === 'url' ? 'コピー済み' : 'URLをコピー'}
              </button>
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <MessageSquare size={16} /> SMS送信用テンプレ
            </p>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm text-slate-700 leading-relaxed">
              {shareInfo.sms}
            </div>
            <div className="flex justify-end mt-3">
              <button
                type="button"
                onClick={() => handleCopy(shareInfo.sms, 'sms')}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-slate-300 text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                {copiedField === 'sms' ? <Check size={14} /> : <Copy size={14} />}
                {copiedField === 'sms' ? 'コピー済み' : 'SMS文面をコピー'}
              </button>
            </div>
          </div>
        </div>
      )}
    </form>
  )
}
