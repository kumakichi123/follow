import Link from 'next/link'

const businessInfo = [
  { label: 'サービス名', value: '追客プロ' },
  { label: '運営責任者', value: '朝部耀平' },
  { label: '所在地', value: '001-0018 札幌市北区北18条西6-1-7-201' },
  { label: '電話番号', value: '070-3619-7051' },
  { label: 'メールアドレス', value: 'support@ai-secretary.site' },
  { label: 'URL', value: 'https://paint-sales.vercel.app/' },
  { label: '提供内容', value: '塗装専用営業支援ツール（SaaS）' },
] as const

const extraDetails = [
  { title: '販売価格', body: '正式リリース後に料金プランを告知します。モニター期間は無料です。' },
  { title: '商品代金以外の必要料金', body: '消費税、通信料、銀行振込の場合は振込手数料をご負担ください。' },
  { title: '支払方法・時期', body: 'クレジットカード・口座振替・請求書払い（30日以内）を予定しています。モニター期間中は請求いたしません。' },
  { title: 'サービス提供時期', body: '利用契約の締結後、管理画面を発行し次第即時利用可能です。' },
  { title: 'キャンセル・解約', body: 'サブスクリプションは契約更新日の5営業日前までに解約手続きを行ってください。日割り返金は対応していません。' },
  { title: '瑕疵責任', body: 'サービスに重大な欠陥がある場合は、速やかに復旧または代替手段をご案内します。' },
] as const

export default function CommercialNotationPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="max-w-4xl mx-auto px-6 py-16 space-y-10">
        <div className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-300">LEGAL</p>
          <h1 className="text-4xl font-black text-white">特定商取引法に基づく表記</h1>
          <p className="text-sm text-slate-300">
            SaaS提供者として必要な情報を開示しています。契約前の確認事項としてご覧ください。
          </p>
          <Link href="/" className="text-xs text-emerald-300 hover:text-emerald-200 underline underline-offset-4">
            ← トップに戻る
          </Link>
        </div>

        <div className="rounded-3xl bg-slate-900/80 border border-white/5 p-6 space-y-6">
          {businessInfo.map((info) => (
            <div key={info.label} className="flex flex-col sm:flex-row sm:items-center gap-2 border-b border-white/5 pb-4 last:border-none last:pb-0">
              <dt className="text-sm text-slate-400 sm:w-40">{info.label}</dt>
              <dd className="text-base font-medium text-white">{info.value}</dd>
            </div>
          ))}
        </div>

        <div className="space-y-6">
          {extraDetails.map((detail) => (
            <section key={detail.title} className="rounded-3xl bg-slate-900/70 border border-white/5 p-6">
              <h2 className="text-2xl font-semibold text-white mb-3">{detail.title}</h2>
              <p className="text-sm leading-relaxed text-slate-200">{detail.body}</p>
            </section>
          ))}
        </div>
      </div>
    </div>
  )
}
