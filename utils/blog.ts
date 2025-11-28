import fs from 'fs/promises'
import path from 'path'
import { cache } from 'react'
import { BLOG_META, type BlogMetaNote } from '@/data/blog-meta'

const BLOG_DIR = path.join(process.cwd(), 'content', 'blog')

export type BlogPostMeta = {
  slug: string
  title: string
  excerpt: string
  summary?: string
  audience?: string
  keywords?: string[]
  heroImageIdea?: string
  inlineImageIdea?: string
  readingMinutes: number
}

export type BlogPost = BlogPostMeta & {
  content: string
}

const normalizeWhitespace = (value: string) =>
  value
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map((line) => line.trimEnd())
    .join('\n')

const extractTitle = (raw: string) => {
  const match = raw.match(/^#\s+(.*)$/m)
  return match ? match[1].trim() : '無題の記事'
}

const extractExcerpt = (raw: string) => {
  const cleaned = raw
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0 && !line.startsWith('#'))[0]

  if (!cleaned) return ''

  return cleaned.replace(/[*_`>]/g, '')
}

const getMetaOverride = (slug: string) => BLOG_META[slug] ?? null

const parsePost = (slug: string, rawContent: string): BlogPost => {
  const normalized = normalizeWhitespace(rawContent)
  const override = getMetaOverride(slug)
  const words = normalized.split(/\s+/).filter(Boolean).length
  const readingMinutes = Math.max(1, Math.round(words / 350))
  return {
    slug,
    title: override?.title ?? extractTitle(normalized),
    excerpt: extractExcerpt(normalized),
    summary: override?.summary,
    audience: override?.audience,
    keywords: override?.keywords,
    heroImageIdea: override?.heroImageIdea,
    inlineImageIdea: override?.inlineImageIdea,
    readingMinutes,
    content: normalized,
  }
}

export const getAllPosts = cache(async (): Promise<BlogPostMeta[]> => {
  const entries = await fs.readdir(BLOG_DIR)
  const posts = await Promise.all(
    entries
      .filter((file) => file.endsWith('.md'))
      .map(async (file) => {
        const slug = file.replace(/\.md$/, '')
        const raw = await fs.readFile(path.join(BLOG_DIR, file), 'utf-8')
        const post = parsePost(slug, raw)
        return post
      })
  )

  return posts.sort((a, b) => a.slug.localeCompare(b.slug))
})

export const getPostBySlug = cache(async (slug: string): Promise<BlogPost | null> => {
  const filePath = path.join(BLOG_DIR, `${slug}.md`)

  try {
    const raw = await fs.readFile(filePath, 'utf-8')
    return parsePost(slug, raw)
  } catch {
    return null
  }
})
