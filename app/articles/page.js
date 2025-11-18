import ArticleList from '@/components/ArticleList'
import { getAllArticles } from '@/lib/articles'

export const metadata = {
  title: 'All Articles - KP Manoj Tech Trends',
  description: 'Browse all articles on AI, technology, and business innovation',
}

export default function ArticlesPage() {
  const articles = getAllArticles()

  return (
    <div className="bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            All Articles
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Explore {articles.length} articles on technology, AI, and business innovation
          </p>
        </div>

        <ArticleList articles={articles} />
      </div>
    </div>
  )
}

