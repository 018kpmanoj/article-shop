import ArticleCard from './ArticleCard'

export default function ArticleList({ articles }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {articles.map((article, index) => (
        <div key={article.slug} className={`article-list-item scroll-reveal`} style={{animationDelay: `${index * 0.05}s`}}>
          <ArticleCard article={article} />
        </div>
      ))}
    </div>
  )
}

