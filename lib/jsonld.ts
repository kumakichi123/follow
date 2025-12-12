import type { ContentMeta } from './mdx'

const DEFAULT_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://example.com'

export function buildJsonLd(meta: ContentMeta) {
  const pagePath = meta.collection === 'blog' ? `/blog/${meta.slug}` : `/docs/${meta.slug}`
  const pageUrl = `${DEFAULT_BASE_URL.replace(/\/$/, '')}${pagePath}`

  const payloads: Array<Record<string, unknown>> = []

  const articlePayload = {
    '@context': 'https://schema.org',
    '@type': meta.collection === 'blog' ? 'BlogPosting' : 'Article',
    headline: meta.title,
    description: meta.description,
    author: {
      '@type': 'Person',
      name: meta.author,
    },
    datePublished: meta.createdAt,
    dateModified: meta.updatedAt ?? meta.createdAt,
    mainEntityOfPage: pageUrl,
  }
  payloads.push(articlePayload)

  if (meta.schema?.type === 'HowTo' && meta.schema.howTo) {
    payloads.push({
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      name: meta.title,
      description: meta.description,
      totalTime: meta.schema.howTo.totalTime,
      supply: meta.schema.howTo.supplies?.map((name) => ({ '@type': 'HowToSupply', name })),
      step: meta.schema.howTo.steps?.map((step) => ({
        '@type': 'HowToStep',
        name: step.title,
        text: step.text,
      })),
    })
  }

  if (meta.schema?.faqs?.length) {
    payloads.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: meta.schema.faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer,
        },
      })),
    })
  }

  if (meta.breadcrumbs?.length) {
    payloads.push({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: meta.breadcrumbs.map((crumb, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: crumb.label,
        item: `${DEFAULT_BASE_URL.replace(/\/$/, '')}${crumb.href}`,
      })),
    })
  }

  return payloads
}
