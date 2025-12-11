'use client'

import { ReactNode } from 'react'
import { Lightbulb } from 'lucide-react'

export function InfoCallout({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50/80 text-amber-900 p-4 space-y-2">
      <div className="flex items-center gap-2 text-sm font-semibold">
        <Lightbulb size={16} />
        {title}
      </div>
      <div className="text-sm leading-relaxed text-amber-800">{children}</div>
    </div>
  )
}
