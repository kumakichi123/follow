import { notFound } from 'next/navigation'
import { getAllEntries, getCompiledEntry } from '@/lib/mdx'
import { buildJsonLd } from '@/lib/jsonld'
import { Breadcrumbs } from '@/components/breadcrumbs'

export const dynamic = 'force-static'

type Params = Promise<{ slug: string[] }>

export async function generateStaticParams() {
  const docs = await getAllEntries('docs')
  return docs.map((doc) => ({ slug: doc.slug.split('/') }))
}

export async function generateMetadata({ params }: { params: Params }) {
  const { slug } = await params
  const slugPath = slug.join('/')
  const entry = await getCompiledEntry('docs', slugPath)
  if (!entry) return {}
  return {
    title: `${entry.meta.title} | TsuiPro Docs`,
    description: entry.meta.description,
  }
}

export default async function DocsDetailPage({ params }: { params: Params }) {
  const { slug } = await params
  const slugPath = slug.join('/')
  const entry = await getCompiledEntry('docs', slugPath)
  if (!entry) return notFound()

  const jsonLd = buildJsonLd(entry.meta)

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-6 py-8 space-y-4">
          <Breadcrumbs items={entry.meta.breadcrumbs} />
          <p className="text-xs font-semibold text-emerald-600 uppercase tracking-[0.4em]">Docs</p>
          <h1 className="text-4xl font-black leading-tight">{entry.meta.title}</h1>
          <p className="text-base text-slate-500">{entry.meta.description}</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-10 space-y-6">
        <article className="prose prose-slate max-w-none bg-white rounded-[32px] p-8 shadow border border-slate-200">
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
