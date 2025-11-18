import Hero from '@/components/Hero'
import FeaturedArticles from '@/components/FeaturedArticles'
import Newsletter from '@/components/Newsletter'
import TrendingTopics from '@/components/TrendingTopics'

export default function Home() {
  return (
    <div>
      <Hero />
      <FeaturedArticles />
      <TrendingTopics />
      <Newsletter />
    </div>
  )
}

