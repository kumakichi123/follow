import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { FileText, Phone, Edit } from 'lucide-react'

type EstimateRow = {
  id: string
  token: string
  customer_name: string
  customer_phone: string | null
  matsu_amount: number | null
  take_amount: number | null
  ume_amount: number | null
  created_at: string
}

const planLabelMap: Record<'matsu_amount' | 'take_amount' | 'ume_amount', string> = {
  matsu_amount: '松',
  take_amount: '竹',
  ume_amount: '梅',
}

const formatCurrency = (value?: number | null) => {
  if (value === null || value === undefined) return '—'
  return `¥${value.toLocaleString('ja-JP')}`
}

const disabledActionClasses =
  'pointer-events-none cursor-not-allowed opacity-50 border border-gray-200 text-gray-400'
const actionButtonBase =
  'inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-colors duration-150'

export default async function CustomersPage() {
  const supabase = await createClient()

  const { data: estimates } = await supabase
    .from('estimates')
    .select('id, token, customer_name, customer_phone, matsu_amount, take_amount, ume_amount, created_at')
    .order('created_at', { ascending: false })
  const rows = (estimates ?? []) as EstimateRow[]

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <p className="text-xs font-semibold text-green-600 uppercase tracking-wide mb-1">顧客ハブ</p>
          <h2 className="text-3xl font-bold text-gray-900">顧客・案件リスト</h2>
          <p className="text-sm text-gray-500 mt-1">専用URLを共有し、気になる顧客はLINEや電話でフォローしましょう。</p>
        </div>
        <Link
          href="/dashboard/create"
          className="bg-green-600 text-white px-5 py-3 rounded-2xl font-bold text-sm hover:bg-green-700 shadow-md text-center"
        >
          + 見積もりを作成
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 text-xs uppercase tracking-wide">
              <th className="p-4 font-semibold">顧客 / 連絡先</th>
              <th className="p-4 font-semibold">松竹梅プラン</th>
              <th className="p-4 font-semibold text-right">送付 / 閲覧</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rows.map((est) => {
              const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
              const shareUrl = `${baseUrl}/e/${est.token}`
              const phoneHref = est.customer_phone ? `tel:${est.customer_phone}` : undefined
              const createdAt = new Date(est.created_at).toLocaleDateString('ja-JP', {
                month: 'short',
                day: 'numeric',
              })
              const callClasses = phoneHref
                ? `${actionButtonBase} border border-gray-200 text-gray-700 hover:bg-gray-50`
                : `${actionButtonBase} ${disabledActionClasses}`

              return (
                <tr key={est.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 align-top">
                    <p className="font-semibold text-gray-900">{est.customer_name} 様</p>
                    <p className="text-xs text-gray-400 mt-1">作成日: {createdAt}</p>
                    {est.customer_phone ? (
                      <p className="text-xs text-gray-500 mt-1">電話: {est.customer_phone}</p>
                    ) : (
                      <p className="text-xs text-red-500 mt-1">顧客の電話番号が未登録です</p>
                    )}
                  </td>
                  <td className="p-4 align-top">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {(['matsu_amount', 'take_amount', 'ume_amount'] as const).map((key) => (
                        <div key={key} className="rounded-xl border border-gray-100 bg-gray-50 p-3">
                          <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">{planLabelMap[key]}</p>
                          <p className="text-base font-semibold text-gray-900 mt-1">{formatCurrency(est[key])}</p>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="p-4 align-top text-right">
                    <div className="flex flex-col items-end gap-2">
                      <a
                        href={shareUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-semibold text-gray-700 hover:bg-gray-50"
                      >
                        <FileText size={16} />
                        プレビュー
                      </a>
                      <Link
                        href={`/dashboard/customers/${est.id}`}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-semibold text-emerald-600 hover:bg-emerald-50"
                      >
                        <Edit size={16} />
                        編集
                      </Link>
                      <a href={phoneHref || undefined} className={callClasses} aria-disabled={!phoneHref}>
                        <Phone size={16} />
                        電話する
                      </a>
                    </div>
                  </td>
                </tr>
              )
            })}

            {rows.length === 0 && (
              <tr>
                <td colSpan={3} className="p-8 text-center text-gray-500">
                  まだ見積もりはありません。右上のボタンから発行できます。
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
