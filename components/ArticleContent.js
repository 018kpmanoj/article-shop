import { FaClock, FaEye, FaCalendar, FaShare } from 'react-icons/fa'
import Newsletter from './Newsletter'

export default function ArticleContent({ article }) {
  return (
    <div className="bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <span className="text-blue-600 dark:text-blue-400 font-semibold">
              {article.category}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            {article.title}
          </h1>
          
          {/* Meta information */}
          <div className="flex flex-wrap items-center gap-6 text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <FaCalendar />
              <span>{article.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <FaClock />
              <span>{article.readTime}</span>
            </div>
            <div className="flex items-center gap-2">
              <FaEye />
              <span>{article.views} views</span>
            </div>
            <button className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
              <FaShare />
              <span>Share</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose prose-lg max-w-none dark:prose-invert">
          {/* Article excerpt */}
          <p className="text-xl text-gray-700 dark:text-gray-300 leading-relaxed mb-8 font-medium">
            {article.excerpt}
          </p>

          {/* Article content */}
          <div className="article-content text-gray-800 dark:text-gray-200">
            {article.content.split('\n\n').map((paragraph, index) => (
              <p key={index} className="mb-4 leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </article>

      {/* Newsletter CTA */}
      <div className="bg-gray-50 dark:bg-gray-800 py-12">
        <Newsletter />
      </div>
    </div>
  )
}

