import Link from 'next/link'
import ArticleCard from './ArticleCard'
import { getFeaturedArticles } from '@/lib/articles'

export default function FeaturedArticles() {
  const featuredArticles = getFeaturedArticles()

  return (
    <section className="py-16 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Featured Articles
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Handpicked articles on trending topics
            </p>
          </div>
          <Link
            href="/articles"
            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-semibold"
          >
            View All →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredArticles.map((article) => (
            <ArticleCard key={article.slug} article={article} featured />
          ))}
        </div>
      </div>
    </section>
  )
}

