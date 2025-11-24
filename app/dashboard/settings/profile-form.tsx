'use client'

import { updateProfile } from './actions'
import { useState } from 'react'
import { Save, Loader2, Building2 } from 'lucide-react'
import { useRouter } from 'next/navigation' // ★追加

type ProfileData = {
  company_name: string | null
  phone_number: string | null
  // line_url はフォームで扱わないので型定義からも画面からも除外してOK
}

export default function ProfileForm({ initialProfile }: { initialProfile: ProfileData | null }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter() // ★追加

  const handleSubmit = async (formData: FormData) => {
    setLoading(true)
    try {
      const res = await updateProfile(formData)
      
      if (res?.error) {
        alert(res.error)
      } else {
        alert('会社情報を保存しました！')
        router.refresh() // ★重要: これで画面の値を最新に更新します
      }
    } catch (e) {
      console.error(e)
      alert('エラーが発生しました')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-100">
        <Building2 className="text-green-600" size={24} />
        <h3 className="font-bold text-lg text-gray-800">会社情報</h3>
      </div>
      <p className="text-sm text-gray-500 mb-6">見積書閲覧ページに表示される情報です。</p>
      
      <form action={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">屋号・会社名</label>
          <input 
            name="companyName" 
            defaultValue={initialProfile?.company_name || ''} 
            placeholder="例: 山田塗装工業" 
            required
            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-green-500 outline-none bg-white text-gray-900 placeholder-gray-400"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">電話番号</label>
          <input 
            name="phone" 
            defaultValue={initialProfile?.phone_number || ''} 
            placeholder="例: 090-1234-5678" 
            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-green-500 outline-none bg-white text-gray-900 placeholder-gray-400"
          />
        </div>

        <div className="flex justify-end pt-2">
          <button 
            disabled={loading}
            className="bg-green-600 text-white px-6 py-2.5 rounded-lg font-bold text-sm hover:bg-green-700 flex items-center gap-2 shadow-sm disabled:opacity-50 transition-colors"
          >
            {loading ? <Loader2 className="animate-spin h-4 w-4" /> : <Save size={16} />}
            {loading ? '保存中...' : '情報を保存する'}
          </button>
        </div>
      </form>
    </section>
  )
}
