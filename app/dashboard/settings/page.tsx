import { createClient } from '@/utils/supabase/server'
import { LogOut, CheckCircle2 } from 'lucide-react'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import ProfileForm from './profile-form'

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  // 1. LINE設定があるか確認
  const { data: lineSetting } = await supabase
    .from('line_settings')
    .select('bot_user_id, liff_url')
    .eq('user_id', user.id)
    .single()

  const isLinked = !!lineSetting

  // 2. プロフィール情報取得
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return (
    <div className="max-w-2xl mx-auto pb-20">
      <h2 className="text-2xl font-bold mb-6">設定</h2>

      <div className="space-y-8">
        
        {/* ▼ 会社情報設定 (URL入力を削除したバージョン) */}
        <ProfileForm initialProfile={profile} />

        {/* LINE連携設定 */}
        <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="font-bold text-lg mb-4 text-gray-800">LINE連携設定</h3>

          {isLinked ? (
            <div className="p-4 bg-green-50 rounded-lg border border-green-100 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#06C755] rounded-full flex items-center justify-center text-white font-bold">L</div>
                <div>
                  <p className="font-bold text-green-900">公式アカウント連携済み</p>
                  <p className="text-xs text-green-700">自動追客が有効になっています。</p>
                </div>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-1 text-xs bg-white text-green-700 px-2 py-1 rounded border border-green-200 font-bold">
                  <CheckCircle2 size={12} />
                  Active
                </div>
                <Link
                  href="/dashboard/settings/line"
                  className="text-xs font-bold text-green-700 bg-white px-3 py-2 rounded-lg border border-green-200 hover:bg-green-100"
                >
                  設定を編集する
                </Link>
              </div>

              {lineSetting?.liff_url ? (
                <div className="bg-white rounded-xl border border-emerald-100 p-4 text-sm text-emerald-800">
                  <p className="font-semibold">共有リンク例</p>
                  <p className="break-all text-xs mt-1">
                    {lineSetting.liff_url.replace(/\/$/, '')}
                    /<span className="text-emerald-500 font-mono">[token]</span>
                  </p>
                  <p className="text-xs mt-2">
                    見積を作成すると token が発行されます。上記リンクをコピーして顧客へ送ると、自動でLINEの顧客IDと見積が紐づきます。
                  </p>
                </div>
              ) : (
                <p className="text-xs text-green-800">
                  LIFF共有URLが未登録です。設定ページで https://liff.line.me/ から始まるURLを追加すると、顧客ごとに自動追客リンクを作成できます。
                </p>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-white font-bold">L</div>
                <div>
                  <p className="font-bold text-gray-600">未連携</p>
                  <p className="text-xs text-gray-500">自動追客機能を使うにはLINE公式アカウントとの連携が必要です。</p>
                </div>
              </div>
              <Link
                href="/dashboard/settings/line"
                className="bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 px-4 py-2 rounded-lg text-sm font-bold shadow-sm transition-colors"
              >
                連携設定へ
              </Link>
            </div>
          )}
        </section>

        {/* アカウント情報 */}
        <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 opacity-80 hover:opacity-100 transition-opacity">
          <h3 className="font-bold text-lg mb-4 text-gray-800">ログイン情報</h3>
          <div className="text-sm text-gray-600">
            <p>現在 <strong>{user.email}</strong> としてログインしています。</p>
          </div>
        </section>

        <section className="pt-4 flex justify-center">
          <form action="/auth/signout" method="post">
            <button className="flex items-center gap-2 text-red-600 hover:bg-red-50 px-6 py-3 rounded-lg transition-colors font-bold text-sm border border-transparent hover:border-red-100">
              <LogOut size={16} />
              ログアウトする
            </button>
          </form>
        </section>
      </div>
    </div>
  )
}
