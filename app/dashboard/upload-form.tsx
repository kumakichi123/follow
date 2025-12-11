'use client'

import { useMemo, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { nanoid } from 'nanoid'
import { useRouter } from 'next/navigation'
import { Loader2, Sparkles, Copy, Check, Plus, Trash2, MessageSquare } from 'lucide-react'

type ShareInfo = {
  url: string
  liffLink?: string | null
  customer: string
}

const PLAN_LIBRARY = [
  {
    key: 'matsu',
    label: '松プラン',
    accent: 'bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200',
    description: '最上位級のサポートとリッチなオプションを含みます。',
  },
  {
    key: 'take',
    label: '竹プラン',
    accent: 'bg-gradient-to-br from-emerald-50 to-white border-emerald-200',
    description: '迷ったらこれ。コストと成果のバランスが最適です。',
  },
  {
    key: 'ume',
    label: '梅プラン',
    accent: 'bg-gradient-to-br from-slate-50 to-white border-slate-200',
    description: '必要最低限に絞った試しやすいプランです。',
  },
] as const

type PlanKey = typeof PLAN_LIBRARY[number]['key']

type UploadFormProps = {
  userId: string
  liffUrl?: string | null
}

type PlanDetails = Record<
  PlanKey,
  {
    label: string
    description: string
  }
>

export default function UploadForm({ userId, liffUrl }: UploadFormProps) {
  const [loading, setLoading] = useState(false)
  const [shareInfo, setShareInfo] = useState<ShareInfo | null>(null)
  const [copiedField, setCopiedField] = useState<'url' | 'liff' | null>(null)
  const [activePlans, setActivePlans] = useState<PlanKey[]>(PLAN_LIBRARY.map((plan) => plan.key))
  const [planDetails, setPlanDetails] = useState<PlanDetails>(() =>
    PLAN_LIBRARY.reduce(
      (acc, plan) => ({
        ...acc,
        [plan.key]: { label: plan.label, description: plan.description },
      }),
      {} as PlanDetails
    )
  )
  const supabase = createClient()
  const router = useRouter()

  const nextPlanKey = useMemo(
    () => PLAN_LIBRARY.find((plan) => !activePlans.includes(plan.key))?.key ?? null,
    [activePlans]
  )

  const sanitizedLiffBase = liffUrl ? liffUrl.replace(/\/$/, '') : null

  const handleCopy = async (text: string, target: 'url' | 'liff') => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedField(target)
      setTimeout(() => setCopiedField(null), 2000)
    } catch (err) {
      console.error('Copy failed', err)
      alert('クリップボードへコピーできませんでした')
    }
  }

  const handleAddPlan = () => {
    if (!nextPlanKey) return
    setActivePlans((prev) => [...prev, nextPlanKey])
  }

  const handleRemovePlan = (key: PlanKey) => {
    if (activePlans.length === 1) return
    setActivePlans((prev) => prev.filter((planKey) => planKey !== key))
  }

  const handleDetailChange = (planKey: PlanKey, field: 'label' | 'description', value: string) => {
    setPlanDetails((prev) => ({
      ...prev,
      [planKey]: {
        ...prev[planKey],
        [field]: value,
      },
    }))
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setShareInfo(null)
    setCopiedField(null)

    const formData = new FormData(event.currentTarget)
    const customerName = (formData.get('customer_name') as string)?.trim()

    const priceValues: Record<PlanKey, number | null> = {
      matsu: null,
      take: null,
      ume: null,
    }

    activePlans.forEach((planKey) => {
      const raw = (formData.get(`price_${planKey}`) as string)?.trim()
      if (raw) {
        priceValues[planKey] = Number(raw)
      }
    })

    const firstActivePrice = priceValues[activePlans[0]]

    if (!customerName || firstActivePrice === null || Number.isNaN(firstActivePrice)) {
      alert('顧客名と金額を入力してください')
      setLoading(false)
      return
    }

    const token = nanoid(10)

    try {
      const { data, error } = await supabase
        .from('estimates')
        .insert({
          user_id: userId,
          customer_name: customerName,
          matsu_amount: priceValues.matsu,
          take_amount: priceValues.take,
          ume_amount: priceValues.ume,
          matsu_label: planDetails.matsu.label,
          matsu_description: planDetails.matsu.description,
          take_label: planDetails.take.label,
          take_description: planDetails.take.description,
          ume_label: planDetails.ume.label,
          ume_description: planDetails.ume.description,
          amount: firstActivePrice,
          token,
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
        liffLink: sanitizedLiffBase ? `${sanitizedLiffBase}/${data.token}` : null,
        customer: customerName,
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
        <div className="flex items-start gap-3 mb-4">
          <div className="bg-green-100 text-green-700 rounded-full p-2">
            <Sparkles size={20} />
          </div>
          <p className="text-sm text-gray-600">顧客名を入力し、必要なプランだけ作成してください。</p>
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
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-gray-900">プラン金額</p>
          <button
            type="button"
            onClick={handleAddPlan}
            disabled={!nextPlanKey}
            className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-600 disabled:text-slate-300"
          >
            <Plus size={16} />
            プランを追加
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {activePlans.map((planKey) => {
            const plan = PLAN_LIBRARY.find((p) => p.key === planKey)!
            return (
              <div key={plan.key} className={`relative rounded-2xl border p-5 ${plan.accent}`}>
                <button
                  type="button"
                  onClick={() => handleRemovePlan(plan.key)}
                  className={`absolute top-3 right-3 text-slate-400 hover:text-red-500 p-1 rounded-full hover:bg-white/50 transition ${
                    activePlans.length <= 1 ? 'invisible pointer-events-none' : ''
                  }`}
                  aria-label={`${planDetails[plan.key].label}を削除`}
                >
                  <Trash2 size={16} />
                </button>
                <div className="space-y-2 mb-4 pr-6">
                  <input
                    value={planDetails[plan.key].label}
                    onChange={(event) => handleDetailChange(plan.key, 'label', event.target.value)}
                    className="text-lg font-bold text-gray-900 bg-transparent border border-transparent focus:border-gray-300 rounded-lg px-2 py-1 focus:outline-none"
                  />
                </div>
                <textarea
                  value={planDetails[plan.key].description}
                  onChange={(event) => handleDetailChange(plan.key, 'description', event.target.value)}
                  className="text-sm text-gray-600 mb-4 bg-transparent border border-dashed border-gray-200 rounded-xl w-full px-3 py-2 focus:border-gray-400 focus:outline-none resize-none"
                  rows={3}
                  placeholder="プランの説明を入力"
                />
                <div className="relative">
                  <span className="absolute top-1/2 -translate-y-1/2 left-3 text-sm text-gray-500">¥</span>
                  <input
                    name={`price_${plan.key}`}
                    type="number"
                    min={0}
                    required={plan.key === activePlans[0]}
                    placeholder="1000000"
                    className="w-full border border-gray-300 rounded-xl pl-8 pr-4 py-3 text-lg font-semibold text-gray-900 focus:ring-2 focus:ring-green-500 outline-none placeholder-gray-400"
                  />
                </div>
              </div>
            )
          })}
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
          {shareInfo.liffLink ? (
            <div>
              <p className="text-sm font-semibold text-gray-900 mb-1 flex items-center gap-2">
                <MessageSquare size={16} /> LINE共有リンク
              </p>
              <div className="flex flex-col md:flex-row md:items-center gap-3">
                <div className="flex-1">
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 text-sm text-emerald-900 break-all">
                    {shareInfo.liffLink}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(shareInfo.liffLink!, 'liff')}
                  className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-emerald-200 text-sm font-semibold text-emerald-700 hover:bg-emerald-50"
                >
                  {copiedField === 'liff' ? <Check size={16} /> : <Copy size={16} />}
                  {copiedField === 'liff' ? 'コピー済み' : 'LINEリンクをコピー'}
                </button>
              </div>
              <p className="text-xs text-emerald-700 mt-2">
                LINE公式アカウントからこのリンクを送ると、自動で顧客のLINEと見積が紐づきます。
              </p>
            </div>
          ) : (
            <p className="text-xs text-gray-500">
              LINE公式アカウントのLIFF URLが未登録のため、共有リンクはWeb版のみです。設定ページでLIFF URLを登録してください。
            </p>
          )}
        </div>
      )}
    </form>
  )
}
