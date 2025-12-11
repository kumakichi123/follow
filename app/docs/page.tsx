import Link from "next/link"
import { getAllEntries, type ContentMeta } from "@/lib/mdx"

export const dynamic = "force-static"

export default async function DocsIndexPage() {
  const docs = await getAllEntries("docs")

  const grouped = docs.reduce<Record<string, ContentMeta[]>>((acc, doc) => {
    const key = doc.slug.split("/")[0]
    acc[key] = acc[key] || []
    acc[key].push(doc)
    return acc
  }, {})

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-6 py-16 space-y-4">
          <p className="text-sm font-semibold text-emerald-600 uppercase tracking-[0.3em]">Docs</p>
          <h1 className="text-4xl md:text-5xl font-black leading-tight">TsuiPro Documentation</h1>
          <p className="text-lg text-slate-600 max-w-3xl">
            Structured manuals for onboarding, automation, and AI-ready workflows.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-12 space-y-10">
        {Object.entries(grouped).map(([section, items]) => (
          <section key={section} className="space-y-4">
            <h2 className="text-2xl font-bold capitalize">{section.replace('-', ' ')}</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {items.map((doc) => (
                <article key={doc.slug} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                  <h3 className="text-xl font-semibold mb-2">{doc.title}</h3>
                  <p className="text-sm text-slate-600 mb-3">{doc.description}</p>
                  <div className="text-xs text-slate-400 mb-4">Updated: {(doc.updatedAt ?? doc.createdAt).slice(0, 10)}</div>
                  <Link href={`/docs/${doc.slug}`} className="text-sm font-bold text-emerald-600">
                    Read the guide →
                  </Link>
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
