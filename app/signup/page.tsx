'use client'

import { signup, loginWithGoogle } from '@/app/auth/actions'
import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'

export default function SignupPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (formData: FormData) => {
    setLoading(true)
    setError(null)
    const res = await signup(formData)
    // Server Actionから戻り値があればエラー
    if (res?.error) {
      setError(res.error)
      setLoading(false)
    }
    // 成功時は redirect されるのでここは通らない
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">アカウント作成</h2>
          <p className="mt-2 text-sm text-gray-600">
            追客プロで、営業を自動化しましょう。
          </p>
        </div>

        {/* Google Login Button */}
        <form action={loginWithGoogle}>
          <button className="flex w-full items-center justify-center gap-3 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="h-5 w-5" />
            Googleで登録 / ログイン
          </button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-2 text-gray-500">またはメールアドレスで</span>
          </div>
        </div>

        {/* Email Form */}
        <form action={handleSubmit} className="space-y-6">
          {error && <div className="bg-red-50 text-red-600 p-3 rounded text-sm">{error}</div>}
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">メールアドレス</label>
            <input name="email" type="email" required className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500" />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">パスワード</label>
            <input name="password" type="password" required minLength={6} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500" />
          </div>

          <button disabled={loading} className="flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50">
            {loading ? <Loader2 className="animate-spin h-5 w-5" /> : 'アカウント作成'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600">
          すでにアカウントをお持ちですか？{' '}
          <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
            ログインはこちら
          </Link>
        </p>
      </div>
    </div>
  )
}