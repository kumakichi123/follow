import Sidebar from './sidebar' // 作成したコンポーネントをインポート

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* 共通サイドバー */}
      <Sidebar />

      {/* メインコンテンツエリア */}
      <main className="flex-1 ml-64 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}