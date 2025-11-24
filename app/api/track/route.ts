import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = await createClient()
  
  try {
    const { estimateId, eventType } = await request.json()

    // ユーザーエージェント (スマホかPCか判定用)
    const userAgent = request.headers.get('user-agent') || ''

    // ログを保存
    // ※ RLSポリシーで 'Allow public insert logs' を設定していればこれで通ります
    const { error } = await supabase.from('access_logs').insert({
      estimate_id: estimateId,
      event_type: eventType,
      user_agent: userAgent
    })

    if (error) {
      console.error('Log insert error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
    
  } catch (err) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}