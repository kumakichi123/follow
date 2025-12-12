import { createClient } from '@/utils/supabase/server'
import { Phone, AlertTriangle, Activity } from 'lucide-react'
import Link from 'next/link'

type AccessLogRow = {
  id: string
  event_type: string
  created_at: string
  estimates: {
    customer_name: string
    amount: number | null
    token: string
  }
}

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data: logsData } = await supabase
    .from('access_logs')
    .select(
      `
      id,
      event_type,
      created_at,
      estimates (
        customer_name,
        amount,
        token
      )
    `
    )
    .order('created_at', { ascending: false })
    .limit(20)

  const logs = (logsData ?? []).map((row: any) => {
    const estimates = Array.isArray(row.estimates) ? row.estimates[0] : row.estimates
    return {
      id: row.id,
      event_type: row.event_type,
      created_at: row.created_at,
      estimates: {
        customer_name: estimates?.customer_name ?? '不明',
        amount: typeof estimates?.amount === 'number' ? estimates.amount : null,
        token: estimates?.token ?? '',
      },
    } satisfies AccessLogRow
  })

  if (logs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] text-gray-500">
        <Activity size={48} className="mb-4 text-gray-300" />
        <p className="text-lg font-bold">まだ動きはありません</p>
        <p className="text-sm mb-6">見積もりを送信して、お客様の反応を待ちましょう。</p>
        <Link href="/dashboard/create" className="bg-green-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-green-700">
          見積もりを作成する
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <header className="mb-8 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">リアルタイム閲覧タイムライン</h2>
        <div className="flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500" />
          </span>
          <span className="text-sm text-gray-500 font-medium">Live</span>
        </div>
      </header>

      <div className="relative pl-4">
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200" />

        <div className="space-y-8">
          {logs.map((log) => {
            const estimate = log.estimates ?? { customer_name: '不明', amount: null, token: '' }
            const isUrgent = log.event_type === 'stay_price' || log.event_type === 'scroll_80'
            const timestamp = new Date(log.created_at)
            const timeLabel = timestamp.toLocaleString('ja-JP', {
              month: 'numeric',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })

            let actionText = 'ページを開きました'
            if (log.event_type === 'open') actionText = '見積もりを開封しました'
            if (log.event_type === 'stay_price') actionText = '金額欄をじっくり見ています'
            if (log.event_type === 'scroll_80') actionText = 'ページを深くスクロールしています'

            const amountLabel = estimate.amount !== null ? `¥${estimate.amount.toLocaleString()}` : '未入力'

            return (
              <div key={log.id} className="relative flex gap-6">
                <div className="z-10 flex-shrink-0">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border-2 ${
                      isUrgent ? 'bg-white border-green-500 text-green-700' : 'bg-gray-100 border-white text-gray-500'
                    }`}
                  >
                    {estimate.customer_name.charAt(0)}
                  </div>
                </div>

                <div
                  className={`flex-1 rounded-xl p-5 shadow-sm border transition-all ${
                    isUrgent
                      ? 'bg-white border-green-500 ring-4 ring-green-50 shadow-md'
                      : 'bg-white border-gray-100 hover:border-gray-300'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-lg text-gray-800">{estimate.customer_name} 様</h3>
                      {isUrgent && (
                        <span className="bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded-full font-bold flex items-center gap-1 animate-pulse">
                          <AlertTriangle size={12} />
                          要注目
                        </span>
                      )}
                    </div>
                    <span className="text-sm text-gray-400 font-medium whitespace-nowrap">{timeLabel}</span>
                  </div>

                  <p className={`text-base ${isUrgent ? 'font-bold text-gray-800' : 'text-gray-600'}`}>{actionText}</p>

                  <p className="text-xs text-gray-400 mt-1">案件金額 {amountLabel}</p>

                  {isUrgent && (
                    <div className="mt-4 flex justify-end">
                      <button className="bg-green-600 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-green-700">
                        <Phone size={18} />
                        電話をかける
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
