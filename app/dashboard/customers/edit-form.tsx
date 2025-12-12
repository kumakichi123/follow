'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Plus, Trash2 } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'

type EstimateForEdit = {
  id: string
  customer_name: string
  matsu_amount: number | null
  take_amount: number | null
  ume_amount: number | null
  matsu_label: string | null
  matsu_description: string | null
  take_label: string | null
  take_description: string | null
  ume_label: string | null
  ume_description: string | null
  gallery_description: string | null
  gallery_images: string[] | null
}

const PLAN_LIBRARY = [
  {
    key: 'matsu' as const,
    label: '松プラン',
    accent: 'bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200',
  },
  {
    key: 'take' as const,
    label: '竹プラン',
    accent: 'bg-gradient-to-br from-emerald-50 to-white border-emerald-200',
  },
  {
    key: 'ume' as const,
    label: '梅プラン',
    accent: 'bg-gradient-to-br from-slate-50 to-white border-slate-200',
  },
]

type PlanKey = typeof PLAN_LIBRARY[number]['key']

type PlanDetails = Record<
  PlanKey,
  {
    label: string
    description: string
  }
>

type GalleryFile = {
  file: File
  preview: string
}

export function EditForm({ estimate }: { estimate: EstimateForEdit }) {
  const router = useRouter()
  const supabase = createClient()

  const planInitialDetails: PlanDetails = {
    matsu: {
      label: estimate.matsu_label ?? PLAN_LIBRARY[0].label,
      description: estimate.matsu_description ?? '最上位級のサポートとリッチなオプションを含みます。',
    },
    take: {
      label: estimate.take_label ?? PLAN_LIBRARY[1].label,
      description: estimate.take_description ?? '迷ったらこれ。コストと成果のバランスが最適です。',
    },
    ume: {
      label: estimate.ume_label ?? PLAN_LIBRARY[2].label,
      description: estimate.ume_description ?? '必要最低限に絞った試しやすいプランです。',
    },
  }

  const amountMap: Record<PlanKey, number | null> = {
    matsu: estimate.matsu_amount,
    take: estimate.take_amount,
    ume: estimate.ume_amount,
  }

  const presetPlans = (Object.keys(amountMap) as PlanKey[]).filter(
    (key) => typeof amountMap[key] === 'number' && amountMap[key] !== null
  )

  const [activePlans, setActivePlans] = useState<PlanKey[]>(presetPlans.length ? presetPlans : PLAN_LIBRARY.map((p) => p.key))
  const [planDetails, setPlanDetails] = useState<PlanDetails>(planInitialDetails)
  const [galleryDescription, setGalleryDescription] = useState(estimate.gallery_description ?? '')
  const [existingImages, setExistingImages] = useState<string[]>(estimate.gallery_images ?? [])
  const [galleryFiles, setGalleryFiles] = useState<GalleryFile[]>([])
  const [loading, setLoading] = useState(false)

  const nextPlanKey = useMemo(
    () => PLAN_LIBRARY.find((plan) => !activePlans.includes(plan.key))?.key ?? null,
    [activePlans]
  )

  useEffect(() => {
    return () => {
      galleryFiles.forEach((item) => URL.revokeObjectURL(item.preview))
    }
  }, [galleryFiles])

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

  const handleFilesSelected = (files: File[]) => {
    if (!files.length) return
    setGalleryFiles((prev) => {
      const next = [...prev]
      files.forEach((file) => {
        if (next.length + existingImages.length < 5) {
          next.push({ file, preview: URL.createObjectURL(file) })
        }
      })
      return next
    })
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    const formData = new FormData(event.currentTarget)

    const customerName = (formData.get('customer_name') as string)?.trim()

    if (!customerName) {
      alert('顧客名を入力してください')
      setLoading(false)
      return
    }

    const priceValues: Record<PlanKey, number | null> = {
      matsu: null,
      take: null,
      ume: null,
    }

    activePlans.forEach((planKey) => {
      const input = (formData.get(`price_${planKey}`) as string)?.trim()
      priceValues[planKey] = input ? Number(input) : null
    })

    const representative = priceValues[activePlans[0]]
    if (representative === null || Number.isNaN(representative)) {
      alert('最初のプラン金額を入力してください')
      setLoading(false)
      return
    }

    try {
      const uploadedUrls: string[] = []
      for (const [index, item] of galleryFiles.entries()) {
        const ext = item.file.name.split('.').pop() ?? 'jpg'
        const storagePath = `${estimate.id}/${Date.now()}-${index}.${ext}`
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('estimate-gallery')
          .upload(storagePath, item.file, { upsert: true })
        if (uploadError) throw uploadError
        const { data: publicData } = supabase.storage.from('estimate-gallery').getPublicUrl(uploadData.path)
        uploadedUrls.push(publicData.publicUrl)
      }

      const { error } = await supabase
        .from('estimates')
        .update({
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
          gallery_description: galleryDescription.trim() || null,
          gallery_images: [...existingImages, ...uploadedUrls],
          amount: representative,
        })
        .eq('id', estimate.id)

      if (error) throw error

      galleryFiles.forEach((item) => URL.revokeObjectURL(item.preview))
      setGalleryFiles([])

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
          const amount = amountMap[plan.key]
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

      <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-4">
        <p className="text-sm font-semibold text-gray-900">現場メモ / 画像</p>
        <textarea
          value={galleryDescription}
          onChange={(event) => setGalleryDescription(event.target.value)}
          placeholder="任意で説明文を入力できます"
          className="w-full border border-gray-200 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-green-500 outline-none text-gray-900 placeholder-gray-400"
          rows={4}
        />

        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {existingImages.map((url) => (
              <div key={url} className="relative">
                <img src={url} alt="現場写真" className="rounded-2xl border border-gray-200 w-full h-40 object-cover" />
                <button
                  type="button"
                  onClick={() => setExistingImages((prev) => prev.filter((item) => item !== url))}
                  className="absolute top-3 right-3 bg-white/80 text-slate-500 hover:text-red-500 rounded-full p-1"
                  aria-label="画像を削除"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}

            {galleryFiles.map((item, index) => (
              <div key={item.preview} className="relative">
                <img src={item.preview} alt={`preview-${index}`} className="rounded-2xl border border-gray-200 w-full h-40 object-cover" />
                <button
                  type="button"
                  onClick={() =>
                    setGalleryFiles((prev) => {
                      const next = [...prev]
                      const removed = next.splice(index, 1)[0]
                      URL.revokeObjectURL(removed.preview)
                      return next
                    })
                  }
                  className="absolute top-3 right-3 bg-white/80 text-slate-500 hover:text-red-500 rounded-full p-1"
                  aria-label="画像を削除"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>

          {existingImages.length + galleryFiles.length < 5 && (
            <label className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-600 cursor-pointer">
              <Plus size={16} />
              画像をアップロード
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(event) => {
                  const files = Array.from(event.target.files ?? [])
                  handleFilesSelected(files)
                  event.target.value = ''
                }}
              />
            </label>
          )}
        </div>
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
