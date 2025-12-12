import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Journey from '../journey'

type PlanOption = {
  key: 'matsu' | 'take' | 'ume'
  title: string
  amount: number
  description: string
  perks: string[]
  recommended?: boolean
}

export default async function JourneyPage({ params }: { params: Promise<{ token: string }> }) {
  const supabase = await createClient()
  const { token } = await params

  const { data, error } = await supabase.rpc('get_estimate_by_token', {
    request_token: token,
  })

  if (error || !data || data.length === 0) return notFound()

  const estimate = data[0]

  const planOptions: PlanOption[] = [
    {
      key: 'matsu',
      title: estimate.matsu_label ?? '松プラン',
      amount: estimate.matsu_amount ?? estimate.amount ?? 0,
      description: estimate.matsu_description ?? '最上位のサポートとスピード導入をセットにしたプランです。',
      perks: ['専任ディレクターが伴走', '即日着手サポート', '優先アフターフォロー'],
    },
    {
      key: 'take',
      title: estimate.take_label ?? '竹プラン',
      amount: estimate.take_amount ?? estimate.amount ?? 0,
      description: estimate.take_description ?? 'コストと成果のバランスを重視した標準プランです。',
      perks: ['十分な自動化機能', 'チャネルサポート', '基本保証1年'],
      recommended: true,
    },
    {
      key: 'ume',
      title: estimate.ume_label ?? '梅プラン',
      amount: estimate.ume_amount ?? estimate.amount ?? 0,
      description: estimate.ume_description ?? 'まず試してみたい方向けのミニマム構成です。',
      perks: ['シンプル導入', '短納期スタート', 'オプションで拡張可'],
    },
  ]

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900">
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wide text-emerald-500">Next Steps</p>
            <h1 className="text-2xl font-bold text-slate-900">プラン選択と日程調整</h1>
            <p className="text-sm text-slate-500">ご希望のプランを選び、現地調査や契約の候補日時をお知らせください。</p>
          </div>
          <Link href={`/e/${token}`} className="text-sm text-slate-500 hover:text-slate-700 font-semibold">
            ← お見積もりに戻る
          </Link>
        </div>
      </header>

      <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-8">
        <Journey estimateId={estimate.id} token={token} planOptions={planOptions} />
      </main>
    </div>
  )
}
