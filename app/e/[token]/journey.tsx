'use client'

import { useEffect, useMemo, useState } from 'react'
import { CalendarDays, Check, CheckCircle2, Clock, Trash2 } from 'lucide-react'

type PlanOption = {
  key: 'matsu' | 'take' | 'ume'
  title: string
  amount: number
  description: string
  perks: string[]
  recommended?: boolean
}

type JourneyProps = {
  estimateId: string
  token: string
  planOptions: PlanOption[]
}

type ScheduleChoice = {
  key: string
  dateISO: string
  dateLabel: string
  slot: string
  slotLabel: string
}

const MAX_CHOICES = 3

const TIME_SLOTS = [
  { value: 'morning', label: '10:00 - 12:00（午前）' },
  { value: 'early_afternoon', label: '13:00 - 15:00（午後早め）' },
  { value: 'late_afternoon', label: '15:00 - 17:00（夕方前）' },
  { value: 'evening', label: '17:00 - 19:00（夕方遅め）' },
] as const

const slotLabelMap = TIME_SLOTS.reduce<Record<string, string>>((acc, slot) => {
  acc[slot.value] = slot.label
  return acc
}, {})

const generateDateOptions = () => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const start = new Date(today)
  start.setDate(start.getDate() + 14)
  const options: { iso: string; label: string }[] = []
  for (let i = 0; i < 21; i += 1) {
    const date = new Date(start)
    date.setDate(start.getDate() + i)
    const iso = date.toISOString().split('T')[0]
    const label = date.toLocaleDateString('ja-JP', { month: 'numeric', day: 'numeric', weekday: 'short' })
    options.push({ iso, label })
  }
  return options
}

const trackEvent = async (estimateId: string, eventType: string) => {
  try {
    await fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ estimateId, eventType }),
    })
  } catch (err) {
    console.error('Tracking failed', err)
  }
}

export default function Journey({ estimateId, token, planOptions }: JourneyProps) {
  const dateOptions = useMemo(() => generateDateOptions(), [])
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [focusedDate, setFocusedDate] = useState(dateOptions[0]?.iso ?? '')
  const [choices, setChoices] = useState<ScheduleChoice[]>([])
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    trackEvent(estimateId, 'open')
  }, [estimateId])

  const selectedDateLabel = dateOptions.find((d) => d.iso === focusedDate)?.label || ''

  const handlePlanClick = (planKey: string) => {
    setSelectedPlan(planKey)
    trackEvent(estimateId, `plan_select_${planKey}`)
  }

  const handleSlotPick = (slotValue: string) => {
    if (!focusedDate) return
    const choiceKey = `${focusedDate}_${slotValue}`
    if (choices.some((choice) => choice.key === choiceKey)) return
    if (choices.length >= MAX_CHOICES) return

    setChoices((prev) => [
      ...prev,
      {
        key: choiceKey,
        dateISO: focusedDate,
        dateLabel: selectedDateLabel,
        slot: slotValue,
        slotLabel: slotLabelMap[slotValue],
      },
    ])
  }

  const handleRemoveChoice = (choiceKey: string) => {
    setChoices((prev) => prev.filter((choice) => choice.key !== choiceKey))
  }

  const handleScheduleSubmit = async () => {
    if (!choices.length || !selectedPlan) return
    setSubmitting(true)
    try {
      await trackEvent(estimateId, 'schedule_submit')
      const slotStrings = choices.map((choice) => `${choice.dateLabel} / ${choice.slotLabel}`)
      const response = await fetch('/api/contracts/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          estimateId,
          token,
          planKey: selectedPlan,
          slots: slotStrings,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to submit contract request')
      }

      alert('ご希望内容を送信しました。担当者から折り返します。')
    } catch (err) {
      console.error('契約情報の送信に失敗しました', err)
      alert('送信に失敗しました。時間をおいて再度お試しください。')
    } finally {
      setSubmitting(false)
    }
  }

  const remainingSlots = MAX_CHOICES - choices.length
  const isSubmitDisabled = !choices.length || !selectedPlan || submitting

  return (
    <div className="space-y-8">
      <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <p className="text-xs font-semibold text-green-600 uppercase tracking-wide mb-1">プラン比較</p>
            <h3 className="text-2xl font-bold text-slate-900">プランを選択してください</h3>
            <p className="text-sm text-slate-500 mt-1">希望プランを決めると、次のステップが表示されます。</p>
          </div>
          {selectedPlan && (
            <div className="flex items-center gap-2 bg-green-50 text-green-700 px-3 py-2 rounded-xl text-sm font-semibold">
              <CheckCircle2 size={16} />
              {planOptions.find((p) => p.key === selectedPlan)?.title} を選択中
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {planOptions.map((plan) => {
            const isActive = selectedPlan === plan.key
            return (
              <button
                type="button"
                key={plan.key}
                onClick={() => handlePlanClick(plan.key)}
                className={`text-left rounded-2xl border p-5 transition-all ${
                  isActive
                    ? 'border-green-500 shadow-lg shadow-green-100 bg-gradient-to-br from-white to-green-50'
                    : 'border-slate-200 hover:border-green-300 hover:shadow'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xl font-bold text-slate-900">{plan.title}</p>
                  {plan.recommended && (
                    <span className="text-[10px] font-semibold bg-green-100 text-green-700 px-2 py-0.5 rounded-full uppercase tracking-wide">
                      おすすめ
                    </span>
                  )}
                </div>
                <p className="text-2xl font-extrabold text-slate-900 mb-2">¥{plan.amount.toLocaleString()}</p>
                <p className="text-sm text-slate-600 mb-4">{plan.description}</p>
                <ul className="space-y-2 text-sm text-slate-600">
                  {plan.perks.map((perk) => (
                    <li key={perk} className="flex items-center gap-2">
                      <Check size={16} className="text-green-500" />
                      {perk}
                    </li>
                  ))}
                </ul>
              </button>
            )
          })}
        </div>
      </section>

      <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-1">日程調整</p>
            <h3 className="text-2xl font-bold text-slate-900">第三希望まで日程調整</h3>
            <p className="text-sm text-slate-500 mt-1">
              本日から2週間後以降の日程から選択できます。カレンダーから日付を選び、希望時間帯を三枠まで追加してください。
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-2 rounded-full">
            <CalendarDays size={16} />
            残り {remainingSlots} / {MAX_CHOICES} 枠
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-slate-200 p-4">
            <p className="text-sm font-semibold text-slate-700 mb-3">候補日</p>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {dateOptions.map((date) => {
                const isFocused = focusedDate === date.iso
                return (
                  <button
                    type="button"
                    key={date.iso}
                    onClick={() => setFocusedDate(date.iso)}
                    className={`rounded-xl px-3 py-2 text-sm font-semibold border ${
                      isFocused ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-200 text-slate-600 hover:border-blue-200'
                    }`}
                  >
                    {date.label}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 p-4 space-y-4">
            <div>
              <p className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <Clock size={16} />
                {selectedDateLabel || '日付を選択してください'}
              </p>
              <p className="text-xs text-slate-500">時間帯をタップすると希望リストに追加されます。</p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {TIME_SLOTS.map((slot) => {
                const key = `${focusedDate}_${slot.value}`
                const isChosen = choices.some((choice) => choice.key === key)
                const isDisabled = (!isChosen && choices.length >= MAX_CHOICES) || !focusedDate
                return (
                  <button
                    type="button"
                    key={slot.value}
                    disabled={isDisabled}
                    onClick={() => handleSlotPick(slot.value)}
                    className={`rounded-xl border px-3 py-3 text-sm font-semibold ${
                      isChosen
                        ? 'bg-blue-600 text-white border-blue-600'
                        : isDisabled
                        ? 'border-slate-200 text-slate-300 cursor-not-allowed'
                        : 'border-slate-200 text-slate-600 hover:border-blue-200'
                    }`}
                  >
                    {slot.label}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 p-4 space-y-4 bg-slate-50">
          <p className="text-sm font-semibold text-slate-700">選択中の希望日時</p>
          {choices.length === 0 ? (
            <p className="text-sm text-slate-500">まだ候補が選択されていません。左のカレンダーから追加してください。</p>
          ) : (
            <ul className="space-y-3">
              {choices.map((choice, index) => (
                <li key={choice.key} className="flex items-center justify-between gap-2 rounded-xl bg-white border border-slate-200 px-4 py-3 text-sm">
                  <div>
                    <p className="font-semibold text-slate-900">第{index + 1}希望</p>
                    <p className="text-slate-600">
                      {choice.dateLabel} / {choice.slotLabel}
                    </p>
                  </div>
                  <button type="button" onClick={() => handleRemoveChoice(choice.key)} className="text-slate-400 hover:text-red-500">
                    <Trash2 size={16} />
                  </button>
                </li>
              ))}
            </ul>
          )}

          <button
            type="button"
            disabled={isSubmitDisabled}
            onClick={handleScheduleSubmit}
            className={`w-full inline-flex items-center justify-center gap-2 rounded-2xl py-3 font-semibold ${
              isSubmitDisabled ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            <CalendarDays size={18} />
            {submitting ? '送信中...' : '希望日時を送信する'}
          </button>
        </div>
      </section>
    </div>
  )
}
