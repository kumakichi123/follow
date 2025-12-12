import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { MessageCircle, Calendar, Sparkles, Phone } from 'lucide-react'

type PlanOption = {
  key: 'matsu' | 'take' | 'ume'
  title: string
  amount: number
  description: string
  perks: string[]
  recommended?: boolean
}

export default async function EstimateViewPage({ params }: { params: Promise<{ token: string }> }) {
  const supabase = await createClient()
  const { token } = await params

  const { data, error } = await supabase.rpc('get_estimate_by_token', {
    request_token: token,
  })

  if (error || !data || data.length === 0) return notFound()

  const estimate = data[0]
  const issuedOn = new Date(estimate.created_at).toLocaleDateString('ja-JP')

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
      description: estimate.ume_description ?? 'まずは試してみたい方向けのミニマム構成です。',
      perks: ['シンプル導入', '短納期スタート', 'オプションで拡張可'],
    },
  ]

  const galleryImages: string[] = Array.isArray(estimate.gallery_images) ? estimate.gallery_images : []
  const hasGallery =
    galleryImages.length > 0 || Boolean(estimate.gallery_description && estimate.gallery_description.trim().length > 0)

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
            <div className="space-y-3">
              <p className="text-xs text-slate-500">To: {estimate.customer_name} 様</p>
              <h1 className="text-3xl font-bold text-slate-900">{estimate.customer_name} 様邸 お見積もり書</h1>
              <p className="text-sm text-slate-600 leading-relaxed">
                ご依頼内容をもとに、松・竹・梅の3プランをご提案いたします。違いをご確認のうえ、「お申し込みに進む」ボタンから
                プラン選択・契約手続きへお進みください。LINEやお電話でのご相談も随時承っています。
              </p>
            </div>
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 w-full sm:w-auto">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Calendar size={14} />
                発行日
              </div>
              <p className="text-lg font-semibold text-slate-900">{issuedOn}</p>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-8">
          <div>
            <p className="text-xs font-semibold text-green-600 uppercase tracking-wide mb-1">Plan Overview</p>
            <h2 className="text-2xl font-bold text-slate-900">プラン比較</h2>
            <p className="text-sm text-slate-600 mt-1">それぞれのプラン内容をご確認のうえ、ご希望のプランをお選びください。</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {planOptions.map((plan) => (
              <div
                key={plan.key}
                className={`rounded-2xl border p-5 space-y-4 ${
                  plan.recommended ? 'border-green-200 bg-emerald-50' : 'border-slate-100 bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <p className="text-xl font-bold text-slate-900">{plan.title}</p>
                  {plan.recommended && (
                    <span className="text-[10px] font-semibold bg-green-100 text-green-700 px-2 py-0.5 rounded-full uppercase tracking-wide">
                      おすすめ
                    </span>
                  )}
                </div>
                <p className="text-2xl font-extrabold text-slate-900">¥{plan.amount.toLocaleString()}</p>
                <p className="text-sm text-slate-600">{plan.description}</p>
                <ul className="space-y-2 text-sm text-slate-600">
                  {plan.perks.map((perk) => (
                    <li key={perk} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                      {perk}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <p className="text-sm text-slate-500">
              お申し込み後に、プランの最終選択・契約手続き・日程調整のステップをご案内します。
            </p>
            <Link
              href={`/e/${token}/journey`}
              className="inline-flex items-center justify-center bg-slate-900 text-white px-6 py-3 rounded-2xl font-semibold text-sm hover:bg-slate-800 transition"
            >
              お申し込みに進む
            </Link>
          </div>
        </section>

        {hasGallery && (
          <section className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-6">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Inspection Notes</p>
              <h2 className="text-2xl font-bold text-slate-900">現場メモ・参考画像</h2>
            </div>
            {estimate.gallery_description && (
              <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3">
                {estimate.gallery_description}
              </p>
            )}
            {galleryImages.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {galleryImages.slice(0, 5).map((url) => (
                  <div key={url} className="aspect-video rounded-2xl border border-slate-200 overflow-hidden bg-slate-100">
                    <img src={url} alt="現場写真" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </main>

      <footer className="bg-white border-t border-slate-200 px-4 py-6 mt-auto">
        <div className="max-w-4xl mx-auto">
          <p className="text-center text-xs text-slate-500 mb-3">ご質問はLINEやお電話でお気軽にどうぞ。</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href={estimate.phone_number ? `tel:${estimate.phone_number}` : undefined}
              className={`flex-1 py-4 rounded-2xl font-semibold flex justify-center items-center gap-2 ${
                estimate.phone_number
                  ? 'bg-slate-900 text-white hover:bg-slate-800'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
              aria-disabled={!estimate.phone_number}
            >
              <Phone size={18} />
              電話で相談する
            </a>
            <a
              href={estimate.line_url || undefined}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex-1 py-4 rounded-2xl font-semibold flex justify-center items-center gap-2 ${
                estimate.line_url ? 'bg-[#06C755] text-white hover:bg-[#05b34c]' : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
              aria-disabled={!estimate.line_url}
            >
              <MessageCircle size={18} />
              LINEで相談する
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
