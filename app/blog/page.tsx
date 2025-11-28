import Link from 'next/link'
import type { Metadata } from 'next'
import { ArrowRight, BookOpenCheck } from 'lucide-react'
import { getAllPosts } from '@/utils/blog'

export const metadata: Metadata = {
  title: '追客プロ Blog | 塗装ビジネスの現場ノウハウ',
  description: '見積もり・追客・DXなど、塗装ビジネスを強くするための作戦記録をまとめています。',
}

export const dynamic = 'force-static'

export default async function BlogIndexPage() {
  const posts = await getAllPosts()

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <section className="border-b border-white/10 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900">
        <div className="max-w-5xl mx-auto px-6 py-20 space-y-6">
          <p className="text-sm font-semibold text-emerald-300 uppercase tracking-[0.3em]">BLOG</p>
          <h1 className="text-4xl md:text-5xl font-black leading-tight tracking-tight">
            現場で結果を出す塗装業のための<br className="hidden md:block" />
            作戦ログ
          </h1>
          <p className="text-lg text-slate-200 leading-relaxed max-w-3xl">
            見積もりを即レスで返す方法から、追客自動化、アフターの掘り起こしまで。
            追客プロチームが試行錯誤したノウハウを毎日ブログ形式で公開します。
            画像が必要な箇所には「どんなビジュアルを入れるか」の指示を入れてあるので、
            デザイナーに渡しても迷いません。
          </p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-14 grid gap-8">
        {posts.map((post) => (
          <article
            key={post.slug}
            className="bg-white text-slate-900 border border-slate-200 rounded-[28px] p-6 shadow-xl shadow-slate-900/5"
          >
            <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.3em] text-emerald-600">
                <BookOpenCheck size={16} />
                Playbook
              </div>
              <div className="text-xs font-semibold text-slate-500">
                読了目安 {post.readingMinutes}分 ・ 想定読者: {post.audience}
              </div>
            </div>
            <div className="mb-4">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Thumbnail Guide</p>
              <div className="border border-dashed border-slate-300 rounded-2xl text-sm text-slate-500 p-4 bg-slate-50">
                {post.heroImageIdea}
              </div>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-3">{post.title}</h2>
            <p className="text-slate-600 text-base leading-relaxed mb-6">{post.summary ?? post.excerpt}</p>
            <div className="flex flex-wrap items-center gap-2 mb-6">
              {post.keywords?.map((keyword) => (
                <span key={keyword} className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 text-slate-600">
                  #{keyword}
                </span>
              ))}
            </div>
            <Link
              href={`/blog/${post.slug}`}
              className="inline-flex items-center gap-2 font-semibold text-emerald-600 hover:text-emerald-500"
            >
              記事を読む <ArrowRight size={16} />
            </Link>
          </article>
        ))}
      </section>
    </div>
  )
}
