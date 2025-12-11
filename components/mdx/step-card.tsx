'use client'

import { ReactNode } from 'react'

export function StepCard({ title, summary, children }: { title: string; summary: string; children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white/80 shadow-sm p-4 space-y-2">
      <div className="text-xs font-bold uppercase tracking-widest text-emerald-600">{title}</div>
      <p className="text-base font-semibold text-slate-900">{summary}</p>
      <div className="text-sm text-slate-600 leading-relaxed">{children}</div>
    </div>
  )
}
