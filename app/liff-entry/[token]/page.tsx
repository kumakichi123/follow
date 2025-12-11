import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import LiffLinker from './linker'

export default async function LiffEntryPage({ params }: { params: Promise<{ token: string }> }) {
  const supabase = await createClient()
  const { token } = await params

  const { data: estimate, error: estimateError } = await supabase
    .from('estimates')
    .select('id, user_id')
    .eq('token', token)
    .single()

  if (estimateError || !estimate) return notFound()

  const { data: lineSetting } = await supabase
    .from('line_settings')
    .select('liff_id')
    .eq('user_id', estimate.user_id)
    .single()

  if (!lineSetting?.liff_id) {
    redirect(`/e/${token}`)
  }

  return <LiffLinker token={token} liffId={lineSetting.liff_id} redirectPath={`/e/${token}`} />
}
