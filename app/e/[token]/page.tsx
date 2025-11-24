import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import { Phone, MessageCircle, Calendar, ShieldCheck, Sparkles } from 'lucide-react'
import Journey from './journey'

export default async function EstimateViewPage({ params }: { params: Promise<{ token: string }> }) {
  const supabase = await createClient()
  const { token } = await params

  const { data, error } = await supabase.rpc('get_estimate_by_token', {
    request_token: token
  })

  if (error || !data || data.length === 0) return notFound()

  const estimate = data[0]
  const createdDate = new Date(estimate.created_at)
  const today = createdDate.toLocaleDateString('ja-JP')
  const validUntil = new Date(createdDate)
  validUntil.setDate(validUntil.getDate() + 14)

  const planOptions = [
    {
      key: 'matsu' as const,
      title: '松プラン',
      subtitle: 'Premium',
      amount: estimate.matsu_amount ?? estimate.amount ?? 0,
      description: 'フルサポートと最速導入をセットにしたプレミアムプラン。',
      perks: ['専任ディレクター', '即日着手サポート', '充実のアフターフォロー'],
      recommended: false
    },
    {
      key: 'take' as const,
      title: '竹プラン',
      subtitle: 'Standard',
      amount: estimate.take_amount ?? estimate.amount ?? 0,
      description: 'コストと成果のバランスを重視した一番人気のプランです。',
      perks: ['必要十分な機能', 'チャットサポート', '基本保証1年'],
      recommended: true
    },
    {
      key: 'ume' as const,
      title: '梅プラン',
      subtitle: 'Light',
      amount: estimate.ume_amount ?? estimate.amount ?? 0,
      description: 'まずはお試しで導入したい方向けのミニマム構成。',
      perks: ['シンプル導入', '短納期スタート', 'オプションで拡張可'],
      recommended: false
    }
  ]

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900">
      <header className="bg-white shadow-sm sticky top-0 z-20 border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-green-600 p-2 rounded-xl text-white">
              <Sparkles size={18} />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500">Proposal from</p>
              <p className="font-bold text-lg text-slate-900">{estimate.company_name}</p>
            </div>
          </div>
          <div className="text-xs text-slate-500 bg-slate-100 px-3 py-1 rounded-full border border-slate-200 hidden sm:block">
            ID: {token.substring(0, 6).toUpperCase()}
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-8 space-y-8">
        <section className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-sm text-slate-500">To: {estimate.customer_name} 様</p>
              <h1 className="text-3xl font-bold text-slate-900 mt-1">松・竹・梅プランのご提案</h1>
              <p className="text-sm text-slate-600 mt-3 leading-relaxed">
                ご依頼内容をもとに3パターンのプランをご用意しました。気になるプランをお選びいただき、
                契約・電子サイン・日程調整の順でお手続きを進めていただけます。
                不明点は下部のLINEまたはお電話からすぐにご相談ください。
              </p>
            </div>
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 w-full sm:w-auto">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Calendar size={14} />
                発行日
              </div>
              <p className="text-lg font-semibold text-slate-900">{today}</p>
              <div className="flex items-center gap-2 text-xs text-red-500 mt-3">
                <ShieldCheck size={14} />
                有効期限
              </div>
              <p className="text-lg font-semibold text-red-600">{validUntil.toLocaleDateString('ja-JP')}</p>
            </div>
          </div>
        </section>

        <Journey estimateId={estimate.id} planOptions={planOptions} />
      </main>

      <footer className="bg-white border-t border-slate-200 px-4 py-6 mt-auto">
        <div className="max-w-4xl mx-auto">
          <p className="text-center text-xs text-slate-500 mb-3">ご質問は以下のチャネルからどうぞ。</p>
          <div className="flex flex-col sm:flex-row gap-3">
            {estimate.phone_number ? (
              <a
                href={`tel:${estimate.phone_number}`}
                className="flex-1 bg-slate-900 text-white py-4 rounded-2xl font-semibold flex justify-center items-center gap-2 hover:bg-slate-800"
              >
                <Phone size={18} />
                電話で質問する
              </a>
            ) : (
              <button className="flex-1 bg-slate-100 text-slate-400 py-4 rounded-2xl font-semibold cursor-not-allowed">
                電話受付なし
              </button>
            )}

            {estimate.line_url ? (
              <a
                href={estimate.line_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-[#06C755] text-white py-4 rounded-2xl font-semibold flex justify-center items-center gap-2 hover:bg-[#05b34c]"
              >
                <MessageCircle size={18} />
                LINEで相談する
              </a>
            ) : (
              <button className="flex-1 bg-slate-100 text-slate-400 py-4 rounded-2xl font-semibold cursor-not-allowed">
                LINE受付なし
              </button>
            )}
          </div>
        </div>
      </footer>
    </div>
  )
}
