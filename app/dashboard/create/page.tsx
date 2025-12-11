import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import UploadForm from '../upload-form'

export default async function CreateEstimatePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-emerald-600 uppercase tracking-[0.3em]">Create</p>
          <h2 className="text-3xl font-bold text-gray-900">プラン見積もりを作成</h2>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
        <UploadForm userId={user.id} />
      </div>
    </div>
  )
}
