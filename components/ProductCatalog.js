'use client'

import { useState, useEffect } from 'react'
import { FaBook, FaVideo, FaCode, FaBell, FaCheckCircle, FaSpinner, FaUsers, FaRocket, FaStar } from 'react-icons/fa'
import { getAllProducts, registerProductInterest, getProductInterestCount } from '@/lib/productCatalog'

const iconMap = {
  book: FaBook,
  course: FaVideo,
  template: FaCode
}

export default function ProductCatalog() {
  const [products, setProducts] = useState([])
  const [interestCounts, setInterestCounts] = useState({})
  const [email, setEmail] = useState('')
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [status, setStatus] = useState({}) // { productId: 'idle' | 'loading' | 'success' | 'error' }
  const [message, setMessage] = useState({})

  useEffect(() => {
    const loadProducts = async () => {
      const allProducts = getAllProducts()
      setProducts(allProducts)
      
      // Load interest counts
      const counts = {}
      for (const product of allProducts) {
        counts[product.id] = await getProductInterestCount(product.id)
      }
      setInterestCounts(counts)
    }
    
    loadProducts()
  }, [])

  const handleInterest = async (productId) => {
    if (!email.trim() || !email.includes('@')) {
      setStatus({ ...status, [productId]: 'error' })
      setMessage({ ...message, [productId]: 'Please enter a valid email' })
      return
    }

    setStatus({ ...status, [productId]: 'loading' })
    
    try {
      const result = await registerProductInterest(productId, email)
      
      if (result.success) {
        setStatus({ ...status, [productId]: 'success' })
        setMessage({ ...message, [productId]: result.message })
        setInterestCounts({ 
          ...interestCounts, 
          [productId]: (interestCounts[productId] || 0) + 1 
        })
        setEmail('')
        setSelectedProduct(null)
      } else {
        setStatus({ ...status, [productId]: 'error' })
        setMessage({ ...message, [productId]: result.message })
      }
    } catch (error) {
      setStatus({ ...status, [productId]: 'error' })
      setMessage({ ...message, [productId]: 'Something went wrong' })
    }

    // Clear status after 3 seconds
    setTimeout(() => {
      setStatus({ ...status, [productId]: 'idle' })
      setMessage({ ...message, [productId]: '' })
    }, 3000)
  }

  return (
    <section id="products" className="py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full text-sm font-semibold mb-4">
            Coming Soon
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Premium Resources
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Deep-dive into AI agents with my upcoming books, courses, and templates.
            Register your interest to get notified first!
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {products.map((product) => {
            const Icon = iconMap[product.type] || FaBook
            const currentStatus = status[product.id] || 'idle'
            const currentMessage = message[product.id] || ''
            const interestCount = interestCounts[product.id] || 0
            
            return (
              <div 
                key={product.id}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700 hover:border-purple-500 dark:hover:border-purple-400 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
              >
                {/* Product Header */}
                <div className="bg-gradient-to-br from-purple-600 to-indigo-700 p-6 text-white">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-white/20 rounded-xl">
                      <Icon className="text-2xl" />
                    </div>
                    <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium">
                      {product.status === 'coming_soon' ? 'Coming Soon' : 'Available'}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold mb-1">{product.title}</h3>
                  <p className="text-purple-200">{product.subtitle}</p>
                </div>

                {/* Product Body */}
                <div className="p-6">
                  <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                    {product.description}
                  </p>

                  {/* Features */}
                  <div className="space-y-2 mb-6">
                    {product.features.slice(0, 4).map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm">
                        <FaCheckCircle className="text-green-500 flex-shrink-0" />
                        <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Interest Count */}
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
                    <FaUsers className="text-purple-500" />
                    <span>
                      <strong className="text-gray-700 dark:text-gray-300">{interestCount}</strong> people interested
                    </span>
                  </div>

                  {/* Status Messages */}
                  {currentStatus === 'success' && (
                    <div className="mb-4 p-3 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg flex items-center gap-2">
                      <FaCheckCircle />
                      <span className="text-sm">{currentMessage}</span>
                    </div>
                  )}
                  
                  {currentStatus === 'error' && (
                    <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg text-sm">
                      {currentMessage}
                    </div>
                  )}

                  {/* Interest Form */}
                  {selectedProduct === product.id ? (
                    <div className="space-y-3">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        disabled={currentStatus === 'loading'}
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleInterest(product.id)}
                          disabled={currentStatus === 'loading'}
                          className="flex-1 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                          {currentStatus === 'loading' ? (
                            <>
                              <FaSpinner className="animate-spin" />
                              <span>Registering...</span>
                            </>
                          ) : (
                            <>
                              <FaRocket />
                              <span>Notify Me</span>
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => setSelectedProduct(null)}
                          className="px-4 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setSelectedProduct(product.id)}
                      className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-purple-500/30"
                    >
                      <FaBell />
                      <span>Get Notified</span>
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-600 dark:text-gray-400">
            <FaStar className="text-yellow-500" />
            <span>More products coming soon. Stay tuned!</span>
          </div>
        </div>
      </div>
    </section>
  )
}
