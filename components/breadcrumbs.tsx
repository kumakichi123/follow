import Link from 'next/link'
import type { Breadcrumb } from '@/lib/mdx'

export function Breadcrumbs({ items }: { items: Breadcrumb[] }) {
  if (!items.length) return null
  return (
    <nav className="text-xs text-slate-500" aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-1">
        {items.map((item, index) => (
          <li key={`${item.href}-${index}`} className="flex items-center gap-1">
            {index > 0 && <span className="text-slate-400">/</span>}
            <Link href={item.href} className="font-semibold hover:text-slate-700">
              {item.label}
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  )
}
