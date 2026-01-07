import Link from 'next/link'
import { FaFire, FaRobot, FaChartLine, FaCloud, FaCode } from 'react-icons/fa'

export default function TrendingTopics() {
  const topics = [
    {
      name: 'Artificial Intelligence',
      icon: FaRobot,
      count: 12,
      color: 'from-purple-500 to-pink-500',
      href: '/articles',
    },
    {
      name: 'Business Innovation',
      icon: FaChartLine,
      count: 6,
      color: 'from-blue-500 to-cyan-500',
      href: '/articles',
    },
    {
      name: 'Cloud Computing',
      icon: FaCloud,
      count: 4,
      color: 'from-green-500 to-teal-500',
      href: '/articles',
    },
    {
      name: 'Software Architecture',
      icon: FaCode,
      count: 5,
      color: 'from-orange-500 to-red-500',
      href: '/articles',
    },
  ]

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 flex items-center justify-center gap-3">
            <FaFire className="text-orange-500" />
            Trending Topics
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Explore popular categories and discover new insights
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {topics.map((topic) => {
            const Icon = topic.icon
            return (
              <Link
                key={topic.name}
                href={topic.href}
                className="bg-white dark:bg-gray-900 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 p-6 cursor-pointer group block card-hover"
              >
                <div className={`w-16 h-16 rounded-lg bg-gradient-to-br ${topic.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="text-3xl text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {topic.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {topic.count} articles
                </p>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}

