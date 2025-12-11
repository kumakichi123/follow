'use client'

import { saveLineSettings } from '../actions'
import { useState } from 'react'
import { Loader2, ArrowLeft, Save } from 'lucide-react'
import Link from 'next/link'

export default function LineConnectPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (formData: FormData) => {
    setLoading(true)
    setError(null)

    // Server Actionを呼び出し
    const res = await saveLineSettings(formData)
    
    if (res?.error) {
      setError(res.error)
      setLoading(false)
    }
    // 成功時は redirect されるのでここは通らない
  }

  return (
    <div className="max-w-2xl mx-auto py-8">
      <Link href="/dashboard/settings" className="flex items-center text-gray-500 mb-6 hover:text-gray-800">
        <ArrowLeft size={16} className="mr-1" />
        設定に戻る
      </Link>

      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <span className="text-[#06C755]">LINE</span> 
          公式アカウント連携
        </h2>

        <div className="bg-blue-50 p-4 rounded-lg mb-6 text-sm text-blue-800">
          <p className="font-bold mb-1">準備するもの</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>LINE Developersコンソールの「Messaging API設定」にある情報</li>
            <li><strong>チャネルアクセストークン (長期)</strong></li>
            <li><strong>チャネルシークレット</strong></li>
          </ul>
        </div>

        <form action={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded text-sm font-bold border border-red-100">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              チャネルアクセストークン (長期)
            </label>
            <input 
              name="token" 
              type="text" 
              required 
              placeholder="eyJhbGc..." 
              className="w-full border border-gray-300 rounded-lg p-3 font-mono text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              チャネルシークレット
            </label>
            <input 
              name="secret" 
              type="text" 
              required 
              placeholder="32桁の英数字" 
              className="w-full border border-gray-300 rounded-lg p-3 font-mono text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              LIFF共有URL
            </label>
            <input
              name="liff_url"
              type="url"
              required
              placeholder="https://liff.line.me/XXXX-YYYY"
              className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
            />
            <p className="text-xs text-gray-500 mt-1">
              LINE Developersで作成したLIFFアプリのURLを入力してください。Endpoint URLは
              <code className="px-1 py-0.5 mx-1 bg-gray-100 rounded">https://paint-sales.vercel.app/liff-entry</code>
              に設定し、配布時はこのURLの末尾に見積トークンが自動的に付与されます。
            </p>
          </div>

          <button 
            disabled={loading} 
            className="w-full bg-[#06C755] hover:bg-[#05b34c] text-white font-bold py-3 rounded-lg flex justify-center items-center gap-2 transition-colors disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" /> : <Save size={20} />}
            {loading ? '接続確認中...' : '連携を保存する'}
          </button>
        </form>
      </div>
    </div>
  )
}
