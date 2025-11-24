import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  // 1. 初期のレスポンスを作成
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // 2. Supabaseクライアントを作成（Cookie操作用）
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          // リクエストとレスポンスの両方にCookieをセット（Next.jsの仕様対応）
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          response = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // 3. ユーザー情報を取得
  // ※ ここで supabase.auth.getUser() を呼ぶことで、古いセッショントークンが自動的にリフレッシュされます
  const { data: { user } } = await supabase.auth.getUser()

  // 4. ルーティング保護ロジック
  // 「未ログイン」かつ「保護除外リストに含まれていないパス」へのアクセスを弾く
  if (
    !user &&
    !request.nextUrl.pathname.startsWith('/login') &&   // ログイン画面
    !request.nextUrl.pathname.startsWith('/signup') &&  // サインアップ画面
    !request.nextUrl.pathname.startsWith('/e/') &&      // 見積もり閲覧画面 (施主用)
    !request.nextUrl.pathname.startsWith('/auth') &&    // OAuthコールバック等
    request.nextUrl.pathname !== '/'                    // トップページ (LP)
  ) {
    // ログイン画面へ強制リダイレクト
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  return response
}