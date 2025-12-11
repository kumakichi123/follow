import fs from 'fs/promises'
import path from 'path'
import matter from 'gray-matter'
import remarkGfm from 'remark-gfm'
import { compileMDX } from 'next-mdx-remote/rsc'
import type { ReactNode } from 'react'
import { InfoCallout } from '@/components/mdx/info-callout'
import { StepCard } from '@/components/mdx/step-card'

export type Collection = 'blog' | 'docs'

type SchemaConfig = {
  type?: 'Article' | 'HowTo'
  howTo?: {
    totalTime?: string
    supplies?: string[]
    steps?: {
      title: string
      text: string
    }[]
  }
  faqs?: {
    question: string
    answer: string
  }[]
}

export type Breadcrumb = {
  label: string
  href: string
}

export type ContentMeta = {
  title: string
  description: string
  slug: string
  author: string
  createdAt: string
  updatedAt?: string
  tags: string[]
  heroImage?: string
  breadcrumbs: Breadcrumb[]
  schema?: SchemaConfig
  collection: Collection
  readingTimeMinutes: number
}

type RawFrontmatter = {
  title?: string
  description?: string
  slug?: string
  author?: string
  createdAt?: string
  updatedAt?: string
  heroImage?: string
  tags?: string[]
  breadcrumbs?: Breadcrumb[]
  schema?: SchemaConfig
}

export type CompiledEntry = {
  meta: ContentMeta
  content: ReactNode
}

const CONTENT_ROOT = path.join(process.cwd(), 'content')

const COLLECTION_PATH: Record<Collection, string> = {
  blog: path.join(CONTENT_ROOT, 'blog'),
  docs: path.join(CONTENT_ROOT, 'docs'),
}

const mdxComponents = {
  InfoCallout,
  StepCard,
}

const defaultBreadcrumbs: Record<Collection, Breadcrumb[]> = {
  blog: [
    { label: 'Home', href: '/' },
    { label: 'Blog', href: '/blog' },
  ],
  docs: [
    { label: 'Docs', href: '/docs' },
  ],
}

export async function getAllEntries(collection: Collection) {
  const dir = COLLECTION_PATH[collection]
  const files = await collectMdxFiles(dir)

  const entries = await Promise.all(
    files.map(async (file: string) => {
      const raw = await fs.readFile(file, 'utf-8')
      const { data, content } = matter(raw)
      const slug = data.slug ?? fileToSlug(file, dir)
      const meta = normalizeFrontmatter(collection, data, slug, content)
      return meta
    })
  )

  return entries.sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1))
}

export async function getCompiledEntry(collection: Collection, slug: string): Promise<CompiledEntry | null> {
  const dir = COLLECTION_PATH[collection]
  const fullPath = await resolveFilePath(dir, slug)
  if (!fullPath) return null

  const source = await fs.readFile(fullPath, 'utf-8')
  const parsed = matter(source)
  const { frontmatter, content } = await compileMDX<RawFrontmatter>({
    source,
    options: {
      parseFrontmatter: true,
      mdxOptions: {
        remarkPlugins: [remarkGfm],
      },
    },
    components: mdxComponents,
  })

  const cleanSlug = frontmatter?.slug ?? fileToSlug(fullPath, dir)
  const meta = normalizeFrontmatter(collection, frontmatter ?? (parsed.data as RawFrontmatter), cleanSlug, parsed.content)

  return { meta, content }
}

async function collectMdxFiles(dir: string): Promise<string[]> {
  const dirents = await fs.readdir(dir, { withFileTypes: true })
  const files = await Promise.all(
    dirents.map((dirent) => {
      const res = path.resolve(dir, dirent.name)
      if (dirent.isDirectory()) {
        return collectMdxFiles(res)
      }
      return res.endsWith('.mdx') ? [res] : []
    })
  )
  return files.flat()
}

function fileToSlug(file: string, baseDir: string) {
  return file.replace(baseDir, '').replace(/\\/g, '/').replace(/^\//, '').replace(/\.mdx$/, '')
}

async function resolveFilePath(dir: string, slug: string) {
  const candidate = path.join(dir, `${slug}.mdx`)
  try {
    await fs.access(candidate)
    return candidate
  } catch {
    return null
  }
}

function normalizeFrontmatter(collection: Collection, data: RawFrontmatter = {}, slug: string, body: string): ContentMeta {
  const fallbackTitle = slug.split('/').pop()?.replace(/-/g, ' ') ?? 'Untitled'
  const fallbackDescription = body.trim().slice(0, 120) || 'Content description'
  const resolvedTitle = data.title?.trim() ?? fallbackTitle
  const resolvedDescription = data.description?.trim() ?? fallbackDescription

  if (!resolvedTitle || !resolvedDescription) {
    throw new Error(`Missing title or description in frontmatter for ${collection}/${slug}`)
  }

  const breadcrumbs = data.breadcrumbs?.length
    ? data.breadcrumbs
    : [...defaultBreadcrumbs[collection], { label: resolvedTitle, href: `/${collection}/${slug}` }]

  return {
    title: resolvedTitle,
    description: resolvedDescription,
    slug,
    author: data.author ?? '追客プロ編集部',
    createdAt: data.createdAt ?? new Date().toISOString(),
    updatedAt: data.updatedAt ?? data.createdAt ?? undefined,
    heroImage: data.heroImage,
    tags: data.tags ?? [],
    breadcrumbs,
    schema: data.schema,
    collection,
    readingTimeMinutes: calculateReadingTime(body),
  }
}

function calculateReadingTime(body: string) {
  const words = body.split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(words / 300))
}
