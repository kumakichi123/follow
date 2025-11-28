'use client'

import { login, loginWithGoogle } from '@/app/auth/actions' // パス変更に注意
import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  
  // Submitハンドラをラップしてloading状態を管理
  const handleLogin = async (formData: FormData) => {
    setLoading(true)
    const res = await login(formData)
    if (res?.error) {
      alert(res.error)
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow text-center space-y-6">
        <h1 className="text-2xl font-bold">追客プロ ログイン</h1>
        
        <form action={loginWithGoogle}>
          <button className="flex w-full items-center justify-center gap-3 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">
             <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="h-5 w-5" />
            Googleでログイン
          </button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-300" /></div>
          <div className="relative flex justify-center text-sm"><span className="bg-white px-2 text-gray-500">または</span></div>
        </div>

        <form action={handleLogin} className="space-y-4">
          <input name="email" type="email" placeholder="Email" required className="w-full border p-2 rounded" />
          <input name="password" type="password" placeholder="Password" required className="w-full border p-2 rounded" />
          <button disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded font-bold hover:bg-blue-700 flex justify-center items-center gap-2">
            {loading && <Loader2 className="animate-spin h-4 w-4" />}
            ログイン
          </button>
        </form>

        <p className="text-sm text-gray-600">
          まだアカウントがありませんか？{' '}
          <Link href="/signup" className="text-blue-600 font-bold hover:underline">
            新規登録
          </Link>
        </p>
      </div>
    </div>
  )
}