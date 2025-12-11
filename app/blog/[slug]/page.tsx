import { notFound } from "next/navigation"
import { getAllEntries, getCompiledEntry } from "@/lib/mdx"
import { buildJsonLd } from "@/lib/jsonld"
import { Breadcrumbs } from "@/components/breadcrumbs"

export const dynamic = "force-static"

type Params = Promise<{ slug: string }>

export async function generateStaticParams() {
  const posts = await getAllEntries("blog")
  return posts.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: { params: Params }) {
  const { slug } = await params
  const entry = await getCompiledEntry("blog", slug)
  if (!entry) return {}
  return {
    title: `${entry.meta.title} | TsuiPro Blog`,
    description: entry.meta.description,
  }
}

export default async function BlogDetailPage({ params }: { params: Params }) {
  const { slug } = await params
  const entry = await getCompiledEntry("blog", slug)
  if (!entry) return notFound()

  const jsonLd = buildJsonLd(entry.meta)

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border-b border-white/5">
        <div className="max-w-4xl mx-auto px-6 py-12 space-y-4">
          <Breadcrumbs items={entry.meta.breadcrumbs} />
          <p className="text-xs font-semibold text-emerald-300 uppercase tracking-[0.4em]">Blog</p>
          <h1 className="text-4xl font-black leading-tight">{entry.meta.title}</h1>
          <p className="text-base text-slate-200">{entry.meta.description}</p>
          <div className="text-xs text-slate-400">
            Author: {entry.meta.author} | Updated: {(entry.meta.updatedAt ?? entry.meta.createdAt).slice(0, 10)} | Reading time {entry.meta.readingTimeMinutes} min
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-10 space-y-6">
        <article className="prose prose-slate prose-invert max-w-none bg-white text-slate-900 rounded-[32px] p-8 shadow-xl border border-slate-200">
          {entry.content}
        </article>
      </div>

      {jsonLd.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </div>
  )
}
