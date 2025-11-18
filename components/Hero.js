import Link from 'next/link'

export default function Hero() {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Explore Tech Trends & 
            <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              AI Innovation
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            Insights on artificial intelligence, technology trends, and business innovation 
            by KP Manoj, AI Software Engineer
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/articles"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
            >
              Explore Articles
            </Link>
            <Link
              href="/about"
              className="bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white px-8 py-4 rounded-lg font-semibold text-lg border-2 border-gray-300 dark:border-gray-600 transition-colors"
            >
              About Me
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-blue-600 dark:text-blue-400">
                50+
              </div>
              <div className="text-gray-600 dark:text-gray-400 mt-2">
                Articles Published
              </div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-purple-600 dark:text-purple-400">
                10K+
              </div>
              <div className="text-gray-600 dark:text-gray-400 mt-2">
                Monthly Readers
              </div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-green-600 dark:text-green-400">
                15+
              </div>
              <div className="text-gray-600 dark:text-gray-400 mt-2">
                Topics Covered
              </div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-orange-600 dark:text-orange-400">
                500+
              </div>
              <div className="text-gray-600 dark:text-gray-400 mt-2">
                Newsletter Subscribers
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

