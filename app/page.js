import Hero from '@/components/Hero'
import FeaturedArticles from '@/components/FeaturedArticles'
import Newsletter from '@/components/Newsletter'
import TrendingTopics from '@/components/TrendingTopics'
import SearchBar from '@/components/SearchBar'

export default function Home() {
  return (
    <div>
      <Hero />
      <div className="bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SearchBar />
        </div>
      </div>
      <FeaturedArticles />
      <TrendingTopics />
      <Newsletter />
    </div>
  )
}

