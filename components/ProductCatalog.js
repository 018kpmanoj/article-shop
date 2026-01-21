'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { FaBook, FaTshirt, FaMugHot, FaBell, FaUsers, FaArrowRight, FaGift } from 'react-icons/fa'
import { PRODUCTS, getProductInterestCount } from '@/lib/productCatalog'

const iconMap = {
  book: FaBook,
  clothing: FaTshirt,
  merch: FaMugHot,
  bundle: FaGift
}

export default function ProductCatalog() {
  const [interestCounts, setInterestCounts] = useState({})
  
  // Show only first 3 products as preview
  const previewProducts = PRODUCTS.slice(0, 3)

  useEffect(() => {
    const loadCounts = async () => {
      const counts = {}
      for (const product of previewProducts) {
        counts[product.id] = await getProductInterestCount(product.id)
      }
      setInterestCounts(counts)
    }
    loadCounts()
  }, [])

  return (
    <section id="products" className="py-20 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full text-sm font-semibold mb-4">
            Coming Soon
          </span>
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            My Products
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Books, merchandise, and more. Register your interest to be notified when they launch!
          </p>
        </div>

        {/* Products Preview Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {previewProducts.map((product) => {
            const Icon = iconMap[product.type] || FaGift
            const interestCount = interestCounts[product.id] || 0
            
            return (
              <div 
                key={product.id}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300"
              >
                {/* Product Image */}
                <div className={`h-40 ${product.bgGradient || 'bg-gradient-to-br from-purple-500 to-indigo-600'} flex items-center justify-center relative`}>
                  <Icon className="text-5xl text-white/80" />
                  <span className="absolute top-3 right-3 px-2 py-1 bg-white/20 backdrop-blur rounded-full text-white text-xs font-medium">
                    Coming Soon
                  </span>
                </div>

                {/* Product Info */}
                <div className="p-5">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{product.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                    {product.description}
                  </p>

                  {/* Interest Count */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                      <FaUsers className="text-purple-500" />
                      <span><strong>{interestCount}</strong> interested</span>
                    </div>
                    <FaBell className="text-purple-500" />
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <Link 
            href="/products"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all shadow-lg shadow-purple-500/30"
          >
            View All Products & Get Notified
            <FaArrowRight />
          </Link>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
            {PRODUCTS.length} products coming soon
          </p>
        </div>
      </div>
    </section>
  )
}
