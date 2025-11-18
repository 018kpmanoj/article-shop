import { getArticleBySlug, getAllArticles } from '@/lib/articles'
import { notFound } from 'next/navigation'
import ArticleContent from '@/components/ArticleContent'

export async function generateStaticParams() {
  const articles = getAllArticles()
  return articles.map((article) => ({
    slug: article.slug,
  }))
}

export async function generateMetadata({ params }) {
  const article = getArticleBySlug(params.slug)
  
  if (!article) {
    return {}
  }

  return {
    title: `${article.title} - KP Manoj`,
    description: article.excerpt,
  }
}

export default function ArticlePage({ params }) {
  const article = getArticleBySlug(params.slug)

  if (!article) {
    notFound()
  }

  return <ArticleContent article={article} />
}

