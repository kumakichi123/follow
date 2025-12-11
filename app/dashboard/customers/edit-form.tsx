'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Plus, Trash2 } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'

type EstimateForEdit = {
  id: string
  customer_name: string
  customer_phone: string | null
  matsu_amount: number | null
  take_amount: number | null
  ume_amount: number | null
}

const PLAN_LIBRARY = [
  {
    key: 'matsu' as const,
    label: '松プラン',
    sub: 'プレミアム',
    accent: 'bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200',
    description: '最上位のサポートとリッチなオプションを含みます。',
  },
  {
    key: 'take' as const,
    label: '竹プラン',
    sub: 'スタンダード',
    accent: 'bg-gradient-to-br from-emerald-50 to-white border-emerald-200',
    description: '迷ったらこれ。コストと成果のバランスが最適です。',
  },
  {
    key: 'ume' as const,
    label: '梅プラン',
    sub: 'ライト',
    accent: 'bg-gradient-to-br from-slate-50 to-white border-slate-200',
    description: '必要最低限に絞った試しやすいプランです。',
  },
]

type PlanKey = typeof PLAN_LIBRARY[number]['key']

export function EditForm({ estimate }: { estimate: EstimateForEdit }) {
  const router = useRouter()
  const supabase = createClient()
  const presetPlans = PLAN_LIBRARY.map((plan) => plan.key).filter((key) => {
    const value = estimate[${key}_amount as keyof EstimateForEdit]
    return typeof value === 'number' && value !== null
  }) as PlanKey[]
  const [activePlans, setActivePlans] = useState<PlanKey[]>(
    presetPlans.length ? presetPlans : [PLAN_LIBRARY[0].key],
  )
  const nextPlanKey = useMemo(
    () => PLAN_LIBRARY.find((plan) => !activePlans.includes(plan.key))?.key ?? null,
    [activePlans],
  )
  const [loading, setLoading] = useState(false)

  const handleAddPlan = () => {
    if (!nextPlanKey) return
    setActivePlans((prev) => [...prev, nextPlanKey])
  }

  const handleRemovePlan = (key: PlanKey) => {
    if (activePlans.length === 1) return
    setActivePlans((prev) => prev.filter((planKey) => planKey !== key))
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    const formData = new FormData(event.currentTarget)

    const customerName = (formData.get('customer_name') as string)?.trim()
    const customerPhone = (formData.get('customer_phone') as string)?.trim()

    if (!customerName || !customerPhone) {
      alert('顧客名と電話番号を入力してください')
      setLoading(false)
      return
    }

    const priceValues: Record<PlanKey, number | null> = {
      matsu: null,
      take: null,
      ume: null,
    }

    activePlans.forEach((planKey) => {
      const input = (formData.get(price_) as string)?.trim()
      priceValues[planKey] = input ? Number(input) : null
    })

    const representative = priceValues[activePlans[0]]
    if (representative === null || Number.isNaN(representative)) {
      alert('最低1つのプラン金額を入力してください')
      setLoading(false)
      return
    }

    try {
      const { error } = await supabase
        .from('estimates')
        .update({
          customer_name: customerName,
          customer_phone: customerPhone.replace(/[^0-9+]/g, ''),
          matsu_amount: priceValues.matsu,
          take_amount: priceValues.take,
          ume_amount: priceValues.ume,
          amount: representative,
        })
        .eq('id', estimate.id)

      if (error) throw error

      router.refresh()
      router.push('/dashboard/customers')
      alert('見積もり情報を更新しました')
    } catch (err) {
      console.error(err)
      alert('更新に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">顧客名</label>
          <input
            name="customer_name"
            defaultValue={estimate.customer_name}
            required
            className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-500 outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">顧客の電話番号</label>
          <input
            name="customer_phone"
            defaultValue={estimate.customer_phone ?? ''}
            required
            className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-500 outline-none"
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-gray-900">プラン金額</p>
        <button
          type="button"
          onClick={handleAddPlan}
          disabled={!nextPlanKey}
          className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-600 disabled:text-slate-300"
        >
          <Plus size={16} /> プランを追加
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {activePlans.map((planKey) => {
          const plan = PLAN_LIBRARY.find((p) => p.key === planKey)!
          const amount = estimate[${planKey}_amount as keyof EstimateForEdit]
          return (
            <div key={plan.key} className={ounded-2xl border p-5 }>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-500">{plan.sub}</p>
                  <p className="text-lg font-bold text-gray-900">{plan.label}</p>
                </div>
                {activePlans.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemovePlan(plan.key)}
                    className="text-slate-400 hover:text-red-500"
                    aria-label={${plan.label}を削除}
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
              <p className="text-sm text-gray-600 mb-4">{plan.description}</p>
              <div className="relative">
                <span className="absolute top-1/2 -translate-y-1/2 left-3 text-sm text-gray-500">¥</span>
                <input
                  name={price_}
                  type="number"
                  min={0}
                  defaultValue={typeof amount === 'number' ? amount ?? undefined : undefined}
                  required={plan.key === activePlans[0]}
                  placeholder="1000000"
                  className="w-full border border-gray-300 rounded-xl pl-8 pr-4 py-3 text-lg font-semibold text-gray-900 focus:ring-2 focus:ring-green-500 outline-none"
                />
              </div>
            </div>
          )
        })}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold text-base tracking-wide shadow-lg shadow-emerald-200 hover:bg-emerald-700 disabled:opacity-60"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 className="animate-spin" size={20} /> 保存中...
          </span>
        ) : (
          '変更を保存'
        )}
      </button>
    </form>
  )
}