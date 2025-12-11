import Link from "next/link"
import { getAllEntries } from "@/lib/mdx"

export const dynamic = "force-static"

const legalLinks = [
  { href: "/legal/terms", label: "利用規約" },
  { href: "/legal/privacy", label: "プライバシーポリシー" },
  { href: "/legal/commercial", label: "特定商取引法に基づく表記" }
] as const

export default async function BlogIndexPage() {
  const posts = await getAllEntries("blog")

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">
      <section className="border-b border-white/10 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900">
        <div className="max-w-5xl mx-auto px-6 py-16 space-y-6">
          <p className="text-sm font-semibold text-emerald-300 uppercase tracking-[0.3em]">Blog</p>
          <h1 className="text-4xl md:text-5xl font-black leading-tight">TsuiPro Lab Notes</h1>
          <p className="text-lg text-slate-200 leading-relaxed max-w-3xl">
            Playbooks and experiments that prove how to build AI-ready sales operations.
          </p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-14 grid gap-8 flex-1 w-full">
        {posts.map((post) => (
          <article
            key={post.slug}
            className="bg-white text-slate-900 border border-slate-200 rounded-[28px] p-6 shadow-lg shadow-slate-900/5"
          >
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-[0.3em] mb-2">AI READY</p>
            <h2 className="text-2xl font-bold mb-2">{post.title}</h2>
            <p className="text-slate-600 mb-4">{post.description}</p>
            <div className="flex flex-wrap gap-2 mb-6">
              {post.tags.map((tag: string) => (
                <span key={tag} className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 text-slate-600">
                  #{tag}
                </span>
              ))}
            </div>
            <div className="text-xs text-slate-400 mb-4">
              Updated: {post.updatedAt?.slice(0, 10) ?? post.createdAt.slice(0, 10)} | Reading time {post.readingTimeMinutes} min
            </div>
            <Link
              href={`/blog/${post.slug}`}
              className="inline-flex items-center gap-2 font-semibold text-emerald-600 hover:text-emerald-500"
            >
              Read article →
            </Link>
          </article>
        ))}
      </section>

      <footer className="border-t border-white/10 bg-slate-900/70">
        <div className="max-w-5xl mx-auto px-6 py-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-lg font-semibold">追客プロ</p>
            <p className="text-sm text-slate-400">AI営業の実験記録と導入ノウハウを発信しています。</p>
          </div>
          <div className="flex flex-wrap gap-4 text-sm">
            {legalLinks.map((link) => (
              <Link key={link.href} href={link.href} className="text-emerald-300 hover:text-emerald-200 underline underline-offset-4">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}
