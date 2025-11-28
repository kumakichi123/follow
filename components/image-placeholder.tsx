'use client'

type ImagePlaceholderProps = {
  label: string
  description: string
  aspect?: 'wide' | 'square'
}

export default function ImagePlaceholder({ label, description, aspect = 'wide' }: ImagePlaceholderProps) {
  return (
    <div
      className={`border-2 border-dashed border-slate-300 rounded-2xl bg-slate-50 text-slate-500 flex flex-col gap-2 justify-center items-center text-center p-6 ${
        aspect === 'wide' ? 'aspect-[16/7]' : 'aspect-square'
      }`}
    >
      <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">{label}</p>
      <p className="text-base font-medium max-w-lg leading-relaxed">{description}</p>
    </div>
  )
}
