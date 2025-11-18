import Link from 'next/link'
import Image from 'next/image'
import { FaClock, FaEye, FaFire } from 'react-icons/fa'

const categoryGradients = {
  'Agentic AI': 'from-purple-500 via-pink-500 to-red-500',
  'Artificial Intelligence': 'from-blue-500 via-cyan-500 to-teal-500',
  'Business Innovation': 'from-green-500 via-emerald-500 to-cyan-500',
  'Cloud Computing': 'from-sky-500 via-blue-500 to-indigo-500',
  'Machine Learning': 'from-violet-500 via-purple-500 to-fuchsia-500',
  'Software Architecture': 'from-orange-500 via-red-500 to-pink-500',
  'Enterprise AI': 'from-indigo-500 via-blue-500 to-cyan-500',
  'AI Operations': 'from-teal-500 via-green-500 to-lime-500',
  'Infrastructure': 'from-slate-500 via-gray-500 to-zinc-500',
  'AI Architecture': 'from-rose-500 via-pink-500 to-fuchsia-500',
}

const categoryIcons = {
  'Agentic AI': '🤖',
  'Artificial Intelligence': '🧠',
  'Business Innovation': '💡',
  'Cloud Computing': '☁️',
  'Machine Learning': '📊',
  'Software Architecture': '🏗️',
  'Enterprise AI': '🏢',
  'AI Operations': '⚙️',
  'Infrastructure': '🔧',
  'AI Architecture': '🎯',
}

export default function ArticleCard({ article, featured = false }) {
  const gradient = categoryGradients[article.category] || 'from-blue-400 to-purple-500'
  const icon = categoryIcons[article.category] || article.category[0]

  return (
    <Link href={`/articles/${article.slug}`}>
      <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-all hover:scale-105 duration-300 overflow-hidden h-full flex flex-col ${featured ? 'border-2 border-blue-200 dark:border-blue-800' : ''}`}>
        {/* Image/Gradient */}
        <div className={`h-48 bg-gradient-to-br ${gradient} flex items-center justify-center relative overflow-hidden`}>
          {featured && (
            <div className="absolute top-4 right-4 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1 shadow-lg">
              <FaFire /> Featured
            </div>
          )}
          {article.image ? (
            <Image
              src={article.image}
              alt={article.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="text-center">
              <div className="text-7xl mb-2">{icon}</div>
              <div className="text-white text-sm font-semibold opacity-80 px-4">
                {article.category}
              </div>
            </div>
          )}
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

