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
    title: '1. 取得する情報',
    body: '顧客名・連絡先・案件情報・閲覧ログ・問い合わせ内容・ユーザーのメールアドレス等を取得します。サービス改善のため操作ログや端末情報を収集する場合があります。',
  },
  {
    title: '2. 利用目的',
    bullets: [
      '顧客管理、見積発行、追客オートメーションの提供',
      'サポート対応・本人確認・重要なお知らせの連絡',
      '新機能やキャンペーン情報の案内（受信停止可能）',
      'サービス品質向上のためのデータ分析',
    ],
  },
  {
    title: '3. 安全管理',
    body: 'Supabaseなどのクラウド基盤で暗号化・アクセス制御・ログ監査を行い、外部委託先とも機密保持契約を締結します。不正アクセスが判明した場合は速やかに通知し、影響範囲を調査します。',
  },
  {
    title: '4. 第三者提供・共同利用',
    body: '法令に基づく開示要請や緊急時を除き、事前同意なく第三者に提供しません。提携パートナーと共同利用する際は、利用目的・管理者・取得項目を明示します。',
  },
  {
    title: '5. 開示・訂正・削除',
    body: '利用者本人からの請求に応じて、保有個人データの開示・訂正・利用停止を行います。本人確認のうえで速やかに対応しますが、法令に反する場合は応じられないことがあります。',
  },
]

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="max-w-4xl mx-auto px-6 py-16 space-y-10">
        <div className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-300">LEGAL</p>
          <h1 className="text-4xl font-black text-white">プライバシーポリシー</h1>
          <p className="text-sm text-slate-300">
            追客プロが取得する情報と、その取り扱い方針をまとめました。安心して長期運用いただくための指針です。
          </p>
          <Link href="/" className="text-xs text-emerald-300 hover:text-emerald-200 underline underline-offset-4">
            ← トップに戻る
          </Link>
        </div>

        <div className="space-y-8">
          {sections.map((section) => (
            <section key={section.title} className="rounded-3xl bg-slate-900/70 border border-white/5 p-6 shadow-inner">
              <h2 className="text-2xl font-semibold text-white mb-3">{section.title}</h2>
              {'bullets' in section && section.bullets ? (
                <ul className="space-y-2 text-sm text-slate-200">
                  {section.bullets.map((item) => (
                    <li key={item} className="flex gap-3">
                      <span className="mt-1 h-2 w-2 rounded-full bg-emerald-400" />
                      <span className="flex-1">{item}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm leading-relaxed text-slate-200">{section.body}</p>
              )}
            </section>
          ))}
        </div>

        <section className="rounded-3xl bg-gradient-to-br from-slate-900 to-slate-950 border border-white/5 p-6">
          <h2 className="text-xl font-semibold mb-4 text-white">個人情報保護管理者</h2>
          <p className="text-sm text-slate-200 mb-3">
            運営責任者が個人情報保護管理者を兼務し、内部規程に従って取り扱いを監督します。お問い合わせは下記連絡先までメールでご連絡ください。
          </p>
          <ul className="space-y-2 text-sm text-slate-200">
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
