'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FaSearch } from 'react-icons/fa'

export default function SearchBar() {
  const [searchQuery, setSearchQuery] = useState('')
  const router = useRouter()

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/articles?search=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  return (
    <form onSubmit={handleSearch} className="w-full max-w-2xl mx-auto">
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search articles by keyword, topic, or technology..."
          className="w-full px-6 py-4 pr-12 text-lg rounded-full border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-all"
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 transform -translate-y-1/2 p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-all"
          aria-label="Search"
        >
          <FaSearch size={20} />
        </button>
      </div>
    </form>
  )
}

