import Link from 'next/link'

const company = {
  name: '追客プロ',
  owner: '朝部耀平',
  address: '001-0018 札幌市北区北18条西6-1-7-201',
  phone: '070-3619-7051',
  email: 'support@ai-secretary.site',
}

const sections = [
  {
    title: '第1条（適用）',
    body: '本利用規約（以下、「本規約」）は、追客プロ（以下、「本サービス」）を利用するすべての事業者に適用されます。ユーザーは本規約へ同意したうえで、本サービスを営業支援の目的に限って利用するものとします。',
  },
  {
    title: '第2条（禁止事項）',
    body: '法令違反、第三者の権利侵害、過度なスパム行為、リバースエンジニアリング、サービスの運営を妨げる行為を禁止します。違反が判明した場合、事前の通知なく利用停止を行うことがあります。',
  },
  {
    title: '第3条（提供内容と免責）',
    body: '本サービスは営業プロセスを補助するSaaSです。AIによる提案や自動配信結果の正確性・完全性は保証しません。ユーザーは自社の責任で最終判断を行い、万一の損害が生じた場合でも運営者は逸失利益等の責任を負いません。',
  },
  {
    title: '第4条（アカウントとデータ）',
    body: 'ユーザーは正確な情報でアカウントを開設し、ID/パスワードを適切に管理してください。登録データはSupabase等のクラウド基盤に保存され、退会時には当社ポリシーに基づいて削除または匿名化されます。',
  },
  {
    title: '第5条（サービス提供の中断）',
    body: 'システム保守、障害、天災、外部サービス停止などにより本サービスの提供を一時的に中断・終了する場合があります。運営者は可能な範囲で事前に通知しますが、これによる損害について責任を負いません。',
  },
  {
    title: '第6条（改定）',
    body: '本規約の内容は必要に応じて改定されます。変更後の規約をウェブサイトで告知した時点から効力を生じ、ユーザーが継続して利用した場合には改定内容へ同意したものとみなします。',
  },
]

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="max-w-4xl mx-auto px-6 py-16 space-y-10">
        <div className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-300">LEGAL</p>
          <h1 className="text-4xl font-black text-white">利用規約</h1>
          <p className="text-sm text-slate-300">
            本サービスを安心して導入いただくための利用条件です。必ずご確認のうえでご活用ください。
          </p>
          <Link href="/" className="text-xs text-emerald-300 hover:text-emerald-200 underline underline-offset-4">
            ← トップに戻る
          </Link>
        </div>

        <div className="space-y-8">
          {sections.map((section) => (
            <section key={section.title} className="rounded-3xl bg-slate-900/70 border border-white/5 p-6 shadow-inner">
              <h2 className="text-2xl font-semibold text-white mb-3">{section.title}</h2>
              <p className="text-sm leading-relaxed text-slate-200">{section.body}</p>
            </section>
          ))}
        </div>

        <section className="rounded-3xl bg-gradient-to-br from-slate-900 to-slate-950 border border-white/5 p-6">
          <h2 className="text-xl font-semibold mb-4 text-white">お問い合わせ</h2>
          <ul className="space-y-2 text-sm text-slate-200">
            <li>サービス名：{company.name}</li>
            <li>運営責任者：{company.owner}</li>
            <li>所在地：{company.address}</li>
            <li>TEL：{company.phone}</li>
            <li>メール：{company.email}</li>
          </ul>
        </section>
      </div>
    </div>
  )
}
