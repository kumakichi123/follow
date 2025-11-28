import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { getAllPosts, getPostBySlug } from '@/utils/blog'
import ImagePlaceholder from '@/components/image-placeholder'

type Params = Promise<{ slug: string }>

export const dynamic = 'force-static'

export async function generateStaticParams() {
  const posts = await getAllPosts()
  return posts.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: { params: Params }) {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) return {}
  return {
    title: `${post.title} | 追客プロ ブログ`,
    description: post.excerpt,
  }
}

export default async function BlogPostPage({ params }: { params: Params }) {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) return notFound()

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border-b border-white/10">
        <div className="max-w-4xl mx-auto px-6 py-12 space-y-6">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-200 hover:text-white"
          >
            <ArrowLeft size={16} />
            記事一覧に戻る
          </Link>
          <p className="text-xs font-semibold text-emerald-300 uppercase tracking-[0.4em]">追客プロ Blog</p>
          <h1 className="text-4xl font-black leading-tight tracking-tight">{post.title}</h1>
          <p className="text-base text-slate-200 leading-relaxed">{post.summary ?? post.excerpt}</p>
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300">
            <span className="font-semibold bg-white/10 px-3 py-1 rounded-full border border-white/20">
              想定読者: {post.audience ?? '塗装業の実務者'}
            </span>
            <span className="font-semibold bg-white/5 px-3 py-1 rounded-full border border-white/10">
              読了目安 {post.readingMinutes}分
            </span>
            {post.keywords?.map((keyword) => (
              <span key={keyword} className="font-semibold bg-white/5 px-3 py-1 rounded-full border border-white/10">
                #{keyword}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-10 space-y-10">
        <ImagePlaceholder label="Hero Image" description={post.heroImageIdea ?? '記事内容に合うヒーロー画像を入れてください'} />

        <article className="prose prose-slate prose-invert max-w-none bg-white text-slate-900 border border-slate-200 rounded-[32px] p-8 shadow-xl shadow-slate-900/10">
          <div className="mb-10">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Inline Visual Slot</p>
            <ImagePlaceholder
              label="Inline Visual"
              description={post.inlineImageIdea ?? '本文中に挿入したいビジュアルの指示を書きましょう'}
              aspect="square"
            />
          </div>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h2: ({ node: _node, ...props }) => <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4" {...props} />,
              h3: ({ node: _node, ...props }) => <h3 className="text-xl font-bold text-slate-900 mt-8 mb-3" {...props} />,
              p: ({ node: _node, ...props }) => <p className="text-base leading-relaxed text-slate-700" {...props} />,
              ul: ({ node: _node, ...props }) => <ul className="list-disc pl-6 space-y-2 text-slate-700" {...props} />,
              ol: ({ node: _node, ...props }) => <ol className="list-decimal pl-6 space-y-2 text-slate-700" {...props} />,
              table: ({ node: _node, ...props }) => (
                <div className="overflow-x-auto border border-slate-200 rounded-2xl my-6">
                  <table className="min-w-full text-sm" {...props} />
                </div>
              ),
              th: ({ node: _node, ...props }) => (
                <th className="bg-slate-100 text-slate-700 font-semibold px-4 py-2 text-left" {...props} />
              ),
              td: ({ node: _node, ...props }) => <td className="border-t border-slate-100 px-4 py-2 text-slate-600" {...props} />,
              hr: () => <hr className="my-10 border-dashed border-slate-200" />,
            }}
          >
            {post.content}
          </ReactMarkdown>
        </article>

        <section className="bg-white border border-slate-200 rounded-[32px] p-8 shadow-sm space-y-4 text-slate-900">
          <h2 className="text-2xl font-bold">画像差し込みメモ</h2>
          <ul className="space-y-2 text-sm text-slate-600">
            <li>・ヒーロー：{post.heroImageIdea ?? '記事の主題が伝わる写真やイラストを配置してください。'}</li>
            <li>
              ・本文内：{post.inlineImageIdea ?? 'チェックリストやワークフロー図など、概念を補強するビジュアルを差し込んでください。'}
            </li>
          </ul>
        </section>
      </div>
    </div>
  )
}
