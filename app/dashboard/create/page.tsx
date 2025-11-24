import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import UploadForm from '../upload-form'

export default async function CreateEstimatePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <p className="text-sm font-semibold text-green-600 mb-2 tracking-wide">STEP 1</p>
        <h2 className="text-3xl font-bold text-gray-900">松・竹・梅プランの見積もりURLを発行</h2>
        <p className="text-gray-600 mt-4 leading-relaxed">
          PDFのやり取りをやめて、顧客名とプラン金額を入力するだけで専用ページを生成します。
          作成後はSMSでURLを送れば、そのままお問い合わせ・契約・日程調整まで誘導できます。
        </p>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
        <UploadForm userId={user.id} />
      </div>
    </div>
  )
}
