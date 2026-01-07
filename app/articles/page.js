'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import ArticleList from '@/components/ArticleList'
import SearchBar from '@/components/SearchBar'
import { getAllArticles, getAllTags, getAllCategories } from '@/lib/articles'
import { FaFilter, FaTimes, FaTags, FaFolderOpen } from 'react-icons/fa'

function ArticlesContent() {
  const allArticles = getAllArticles()
  const allTags = getAllTags()
  const allCategories = getAllCategories()
  const searchParams = useSearchParams()
  
  const [selectedTags, setSelectedTags] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const query = searchParams?.get('search')
    if (query) {
      setSearchQuery(query)
    }
  }, [searchParams])

  // Filter articles
  const filteredArticles = allArticles.filter(article => {
    const matchesCategory = selectedCategory === 'All' || article.category === selectedCategory
    const matchesTags = selectedTags.length === 0 || 
      (article.tags && selectedTags.some(tag => article.tags.includes(tag)))
    
    // Search filter
    const matchesSearch = !searchQuery || 
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (article.tags && article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))
    
    return matchesCategory && matchesTags && matchesSearch
  })

  const toggleTag = (tag) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    )
  }

  const clearFilters = () => {
    setSelectedTags([])
    setSelectedCategory('All')
  }

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 scroll-reveal">
            All Articles
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 scroll-reveal stagger-2">
            Explore {filteredArticles.length} of {allArticles.length} articles on technology, AI, and business innovation
          </p>
          <div className="scroll-reveal stagger-3">
            <SearchBar />
          </div>
          {searchQuery && (
            <p className="text-gray-600 dark:text-gray-400 mt-4 scroll-reveal stagger-4">
              Showing results for: <span className="font-semibold text-blue-600 dark:text-blue-400">"{searchQuery}"</span>
            </p>
          )}
        </div>

        {/* Mobile filter toggle */}
        <div className="lg:hidden mb-6">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
          >
            <FaFilter />
            {isSidebarOpen ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className={`lg:w-64 flex-shrink-0 ${isSidebarOpen ? 'block' : 'hidden lg:block'}`}>
            <div className="sticky top-24 bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
              {/* Active Filters */}
              {(selectedTags.length > 0 || selectedCategory !== 'All') && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      Active Filters
                    </h3>
                    <button
                      onClick={clearFilters}
                      className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
                    >
                      Clear All
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedCategory !== 'All' && (
                      <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                        {selectedCategory}
                        <button onClick={() => setSelectedCategory('All')}>
                          <FaTimes size={12} />
                        </button>
                      </span>
                    )}
                    {selectedTags.map(tag => (
                      <span
                        key={tag}
                        className="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                      >
                        {tag}
                        <button onClick={() => toggleTag(tag)}>
                          <FaTimes size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Categories */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <FaFolderOpen /> Categories
                </h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedCategory('All')}
                    className={`w-full text-left px-3 py-2 rounded transition-colors ${
                      selectedCategory === 'All'
                        ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 font-semibold'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    All Categories ({allArticles.length})
                  </button>
                  {allCategories.map(category => {
                    const count = allArticles.filter(a => a.category === category).length
                    return (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`w-full text-left px-3 py-2 rounded transition-colors ${
                          selectedCategory === category
                            ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 font-semibold'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                        }`}
                      >
                        {category} ({count})
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Tags */}
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <FaTags /> Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {allTags.map(tag => {
                    const isSelected = selectedTags.includes(tag)
                    return (
                      <button
                        key={tag}
                        onClick={() => toggleTag(tag)}
                        className={`px-3 py-1 rounded-full text-sm transition-colors ${
                          isSelected
                            ? 'bg-purple-600 text-white'
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                        }`}
                      >
                        {tag}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Articles Grid */}
          <div className="flex-1">
            {filteredArticles.length > 0 ? (
              <ArticleList articles={filteredArticles} />
            ) : (
              <div className="text-center py-12">
                <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">
                  No articles found with selected filters
                </p>
                <button
                  onClick={clearFilters}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ArticlesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600 dark:text-gray-400">Loading articles...</div>
      </div>
    }>
      <ArticlesContent />
    </Suspense>
  )
}
