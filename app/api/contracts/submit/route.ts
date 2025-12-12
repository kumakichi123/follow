import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

const VALID_PLANS = ['matsu', 'take', 'ume']

export async function POST(request: Request) {
  const supabase = await createClient()

  try {
    const payload = await request.json()
    const estimateId = typeof payload.estimateId === 'string' ? payload.estimateId : ''
    const token = typeof payload.token === 'string' ? payload.token : ''
    const planKey = typeof payload.planKey === 'string' ? payload.planKey : ''
    const slotsRaw: unknown[] = Array.isArray(payload.slots) ? payload.slots : []
    const slots = slotsRaw
      .map((slot) => (typeof slot === 'string' ? slot.trim() : ''))
      .filter((slot) => slot.length > 0)

    if (!estimateId || !token || !VALID_PLANS.includes(planKey) || slots.length === 0) {
      return NextResponse.json({ error: '入力が不足しています。' }, { status: 400 })
    }

    const { data: estimate, error: findError } = await supabase
      .from('estimates')
      .select('id')
      .eq('id', estimateId)
      .eq('token', token)
      .single()

    if (findError || !estimate) {
      return NextResponse.json({ error: '対象の見積が見つかりません。' }, { status: 404 })
    }

    const { error: updateError } = await supabase
      .from('estimates')
      .update({
        contract_status: 'tentative',
        contract_plan: planKey,
        contract_slots: slots,
      })
      .eq('id', estimateId)

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Contract submit failed', err)
    return NextResponse.json({ error: 'サーバーエラーが発生しました。' }, { status: 500 })
  }
}
