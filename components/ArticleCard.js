import Link from 'next/link'
import { FaClock, FaEye, FaFire } from 'react-icons/fa'

export default function ArticleCard({ article, featured = false }) {
  return (
    <Link href={`/articles/${article.slug}`}>
      <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden h-full flex flex-col ${featured ? 'border-2 border-blue-200 dark:border-blue-800' : ''}`}>
        {/* Image placeholder */}
        <div className="h-48 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center relative">
          {featured && (
            <div className="absolute top-4 right-4 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
              <FaFire /> Featured
            </div>
          )}
          <div className="text-white text-6xl font-bold opacity-20">
            {article.category[0]}
          </div>
        </div>

        <div className="p-6 flex flex-col flex-grow">
          {/* Category */}
          <div className="mb-3">
            <span className="text-blue-600 dark:text-blue-400 text-sm font-semibold">
              {article.category}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2">
            {article.title}
          </h3>

          {/* Excerpt */}
          <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3 flex-grow">
            {article.excerpt}
          </p>

          {/* Meta */}
          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <FaClock /> {article.readTime}
              </span>
              <span className="flex items-center gap-1">
                <FaEye /> {article.views}
              </span>
            </div>
            <span className="text-xs">{article.date}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}

