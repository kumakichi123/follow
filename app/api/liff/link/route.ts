import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function POST(request: Request) {
  const supabase = await createClient()
  const payload = await request.json().catch(() => ({}))
  const token = typeof payload.token === 'string' ? payload.token.trim() : ''
  const lineUserId = typeof payload.lineUserId === 'string' ? payload.lineUserId.trim() : ''
  const displayName = typeof payload.displayName === 'string' ? payload.displayName : null
  const pictureUrl = typeof payload.pictureUrl === 'string' ? payload.pictureUrl : null

  if (!token || !lineUserId) {
    return NextResponse.json({ error: 'token と lineUserId は必須です。' }, { status: 400 })
  }

  const { data: estimate, error: estimateError } = await supabase
    .from('estimates')
    .select('id')
    .eq('token', token)
    .single()

  if (estimateError || !estimate) {
    return NextResponse.json({ error: '該当する見積が見つかりません。' }, { status: 404 })
  }

  const { error: linkError } = await supabase
    .from('estimate_contacts')
    .upsert(
      {
        estimate_id: estimate.id,
        token,
        line_user_id: lineUserId,
        display_name: displayName,
        picture_url: pictureUrl,
        linked_at: new Date().toISOString(),
      },
      { onConflict: 'estimate_id,line_user_id' }
    )

  if (linkError) {
    return NextResponse.json({ error: linkError.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
