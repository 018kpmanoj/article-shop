'use client'

import { useState } from 'react'
import { FaStar } from 'react-icons/fa'

export default function ArticleRating({ articleSlug }) {
  const [rating, setRating] = useState(0)
  const [hover, setHover] = useState(0)
  const [hasRated, setHasRated] = useState(false)

  const handleRating = (ratingValue) => {
    setRating(ratingValue)
    setHasRated(true)
    
    // Store rating locally (in future, this will go to database)
    if (typeof window !== 'undefined') {
      localStorage.setItem(`rating_${articleSlug}`, ratingValue.toString())
    }
    
    // TODO: Send to database when DB is set up
    console.log(`Article: ${articleSlug}, Rating: ${ratingValue}`)
  }

  return (
    <div className="my-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 text-center">
        {hasRated ? '✨ Thank you for your feedback!' : 'How would you rate this article?'}
      </h3>
      
      <div className="flex justify-center gap-2 mb-3">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className="star-rating focus:outline-none"
            onClick={() => handleRating(star)}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
            aria-label={`Rate ${star} stars`}
          >
            <FaStar
              size={32}
              className={`transition-all duration-200 ${
                star <= (hover || rating)
                  ? 'text-yellow-400 drop-shadow-lg'
                  : 'text-gray-300 dark:text-gray-600'
              }`}
            />
          </button>
        ))}
      </div>
      
      {hasRated && (
        <p className="text-sm text-center text-gray-600 dark:text-gray-400 animate-fade-in">
          You rated this article {rating} star{rating !== 1 ? 's' : ''}
        </p>
      )}
      
      {!hasRated && (
        <p className="text-xs text-center text-gray-500 dark:text-gray-400">
          Your rating helps us create better content
        </p>
      )}
      
      {/* Note: Ratings are collected but not displayed publicly yet */}
    </div>
  )
}

