'use client'

import { useState, useEffect } from 'react'
import { FaBook, FaTshirt, FaMugHot, FaBell, FaCheckCircle, FaSpinner, FaUsers, FaRocket, FaStar, FaGift, FaShoppingBag } from 'react-icons/fa'
import { registerProductInterest, getProductInterestCount, PRODUCTS } from '@/lib/productCatalog'

const iconMap = {
  book: FaBook,
  clothing: FaTshirt,
  merch: FaMugHot,
  bundle: FaGift
}

export default function ProductsPage() {
  const [interestCounts, setInterestCounts] = useState({})
  const [email, setEmail] = useState('')
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [status, setStatus] = useState({})
  const [message, setMessage] = useState({})

  useEffect(() => {
    const loadCounts = async () => {
      const counts = {}
      for (const product of PRODUCTS) {
        counts[product.id] = await getProductInterestCount(product.id)
      }
      setInterestCounts(counts)
    }
    loadCounts()
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

    setTimeout(() => {
      setStatus({ ...status, [productId]: 'idle' })
      setMessage({ ...message, [productId]: '' })
    }, 4000)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FaShoppingBag className="text-6xl mx-auto mb-6 opacity-90" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            My Products
          </h1>
          <p className="text-xl text-purple-100 max-w-2xl mx-auto">
            Exciting products coming soon! Books, merchandise, and more. 
            Register your interest to be the first to know when they launch.
          </p>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-2 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded-full text-sm font-semibold mb-4">
            Coming Soon
          </span>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Products in Development
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Be among the first to get notified when these products launch!
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {PRODUCTS.map((product) => {
            const Icon = iconMap[product.type] || FaGift
            const currentStatus = status[product.id] || 'idle'
            const currentMessage = message[product.id] || ''
            const interestCount = interestCounts[product.id] || 0
            
            return (
              <div 
                key={product.id}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 flex flex-col"
              >
                {/* Product Image Placeholder */}
                <div className={`h-48 ${product.bgGradient || 'bg-gradient-to-br from-purple-500 to-indigo-600'} flex items-center justify-center relative`}>
                  <Icon className="text-6xl text-white/80" />
                  <span className="absolute top-4 right-4 px-3 py-1 bg-white/20 backdrop-blur rounded-full text-white text-sm font-medium">
                    Coming Soon
                  </span>
                </div>

                {/* Product Body */}
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{product.title}</h3>
                  <p className="text-sm text-purple-600 dark:text-purple-400 font-medium mb-3">{product.subtitle}</p>
                  <p className="text-gray-600 dark:text-gray-400 mb-4 flex-1 text-sm leading-relaxed">
                    {product.description}
                  </p>

                  {/* Features */}
                  {product.features && (
                    <div className="space-y-2 mb-4">
                      {product.features.slice(0, 3).map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm">
                          <FaCheckCircle className="text-green-500 flex-shrink-0" />
                          <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                        </div>
                      ))}
                    </div>
                  )}

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
                    <div className="space-y-3 mt-auto">
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
                      className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-purple-500/30 mt-auto"
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

        {/* Bottom Section */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-purple-100 to-indigo-100 dark:from-purple-900/30 dark:to-indigo-900/30 rounded-2xl p-8 max-w-2xl mx-auto">
            <FaStar className="text-4xl text-yellow-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Have a Product Idea?
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              I'm always open to suggestions! If you have an idea for a product you'd like to see, 
              feel free to reach out.
            </p>
            <a 
              href="mailto:018kpmanoj@gmail.com?subject=Product%20Suggestion"
              className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors"
            >
              Share Your Idea
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
