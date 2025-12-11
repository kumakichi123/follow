'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, RefreshCcw } from 'lucide-react'
import liff from '@line/liff'

type LiffLinkerProps = {
  token: string
  liffId: string
  redirectPath: string
}

type Status = 'initializing' | 'linking' | 'error'

export default function LiffLinker({ token, liffId, redirectPath }: LiffLinkerProps) {
  const [status, setStatus] = useState<Status>('initializing')
  const [message, setMessage] = useState('LINEアプリと接続しています…')
  const router = useRouter()

  useEffect(() => {
    let cancelled = false

    async function bootstrap() {
      try {
        await liff.init({ liffId, withLoginOnExternalBrowser: true })

        if (!liff.isLoggedIn()) {
          liff.login({ redirectUri: window.location.href })
          return
        }

        const profile = await liff.getProfile()
        const decoded = liff.getDecodedIDToken()
        const lineUserId = decoded?.sub

        if (!lineUserId) {
          throw new Error('LINEアカウントの識別情報を取得できませんでした。')
        }

        if (cancelled) return
        setStatus('linking')

        const response = await fetch('/api/liff/link', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            token,
            lineUserId,
            displayName: profile.displayName,
            pictureUrl: profile.pictureUrl ?? null,
          }),
        })

        if (!response.ok) {
          const payload = await response.json().catch(() => ({}))
          throw new Error(payload.error || '見積ページとの連携に失敗しました。')
        }

        if (cancelled) return
        router.replace(redirectPath)
      } catch (error) {
        console.error(error)
        if (cancelled) return
        setStatus('error')
        setMessage(error instanceof Error ? error.message : '予期しないエラーが発生しました。')
      }
    }

    bootstrap()

    return () => {
      cancelled = true
    }
  }, [liffId, redirectPath, router, token])

  const handleRetry = () => {
    setStatus('initializing')
    setMessage('LINEアプリと接続しています…')
    window.location.reload()
  }

  const showRetry = status === 'error'

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-6">
      <div className="max-w-sm w-full text-center space-y-4">
        <div className="flex justify-center">
          <Loader2
            className={`h-12 w-12 ${status === 'error' ? 'text-red-400' : 'text-emerald-300'} ${
              status !== 'error' ? 'animate-spin' : ''
            }`}
          />
        </div>
        <div className="space-y-2">
          <p className="text-sm uppercase tracking-[0.3em] text-emerald-300">Liff Auth</p>
          <h1 className="text-2xl font-bold">顧客アカウントを確認しています</h1>
          <p className="text-sm text-slate-300 leading-relaxed">{message}</p>
        </div>
        <div className="text-xs text-slate-500">
          LINEアプリのブラウザでこのページを開くと、自動で見積内容へ遷移します。
        </div>
        {showRetry && (
          <button
            type="button"
            onClick={handleRetry}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-white/10 text-white text-sm font-semibold hover:bg-white/20 transition"
          >
            <RefreshCcw size={16} />
            もう一度試す
          </button>
        )}
      </div>
    </div>
  )
}
