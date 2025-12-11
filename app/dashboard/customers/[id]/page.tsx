import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'
import { EditForm } from '../edit-form'

export default async function CustomerEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data, error } = await supabase
    .from('estimates')
    .select('id, customer_name, customer_phone, matsu_amount, take_amount, ume_amount')
    .eq('id', id)
    .single()

  if (error || !data) return notFound()

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-emerald-600 uppercase tracking-[0.3em]">Edit</p>
          <h2 className="text-3xl font-bold text-gray-900">{data.customer_name} 様の見積もり</h2>
        </div>
        <Link href="/dashboard/customers" className="text-sm font-semibold text-gray-500 hover:text-gray-700">
          ← 顧客リストへ戻る
        </Link>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
        <EditForm estimate={data} />
      </div>
    </div>
  )
}