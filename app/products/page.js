'use client'

import { useState, useEffect } from 'react'
import { FaBook, FaTshirt, FaMugHot, FaVideo, FaCode, FaBell, FaCheckCircle, FaSpinner, FaUsers, FaGoogle, FaLock, FaShoppingBag, FaClock } from 'react-icons/fa'
import { registerProductInterest, getProductInterestCount, isUserInterested, PRODUCTS, COMING_SOON_CATEGORIES } from '@/lib/productCatalog'
import { useAuth } from '@/context/AuthContext'

const iconMap = {
  book: FaBook,
  clothing: FaTshirt,
  merch: FaMugHot,
  course: FaVideo,
  template: FaCode
}

export default function ProductsPage() {
  const { user, loginWithGoogle, firebaseReady } = useAuth()
  const [interestCounts, setInterestCounts] = useState({})
  const [userInterests, setUserInterests] = useState({})
  const [status, setStatus] = useState({})
  const [message, setMessage] = useState({})
  const [signingIn, setSigningIn] = useState(false)

  useEffect(() => {
    const loadData = async () => {
      const counts = {}
      const interests = {}
      
      for (const product of PRODUCTS) {
        counts[product.id] = await getProductInterestCount(product.id)
        if (user?.email) {
          interests[product.id] = await isUserInterested(product.id, user.email)
        }
      }
      
      setInterestCounts(counts)
      setUserInterests(interests)
    }
    loadData()
  }, [user])

  const handleSignIn = async () => {
    setSigningIn(true)
    try {
      await loginWithGoogle()
    } catch (error) {
      console.error('Sign in error:', error)
    }
    setSigningIn(false)
  }

  const handleNotify = async (productId) => {
    if (!user?.email) return
    
    setStatus({ ...status, [productId]: 'loading' })
    
    try {
      const result = await registerProductInterest(productId, user.email, user.displayName || '')
      
      if (result.success) {
        setStatus({ ...status, [productId]: 'success' })
        setMessage({ ...message, [productId]: result.message })
        setUserInterests({ ...userInterests, [productId]: true })
        setInterestCounts({ 
          ...interestCounts, 
          [productId]: (interestCounts[productId] || 0) + 1 
        })
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
            Books and resources to help you master AI and technology. 
            Sign in to get notified when they launch!
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Sign In Prompt (if not signed in) */}
        {!user && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-12 text-center max-w-2xl mx-auto border border-purple-200 dark:border-purple-800">
            <FaLock className="text-4xl text-purple-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Sign in to Get Notified
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Sign in with your Google account to register your interest and be notified when products launch.
            </p>
            
            {firebaseReady ? (
              <button
                onClick={handleSignIn}
                disabled={signingIn}
                className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors flex items-center justify-center gap-2 mx-auto disabled:opacity-70"
              >
                {signingIn ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <FaGoogle />
                    <span>Sign in with Google</span>
                  </>
                )}
              </button>
            ) : (
              <p className="text-orange-600 text-sm">
                Authentication is not configured. Please contact the administrator.
              </p>
            )}
          </div>
        )}

        {/* Books Section */}
        <div className="mb-16">
          <div className="text-center mb-10">
            <span className="inline-block px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-sm font-semibold mb-4">
              Books
            </span>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Coming Soon
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {PRODUCTS.map((product) => {
              const currentStatus = status[product.id] || 'idle'
              const currentMessage = message[product.id] || ''
              const interestCount = interestCounts[product.id] || 0
              const alreadyInterested = userInterests[product.id]
              
              return (
                <div 
                  key={product.id}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700"
                >
                  {/* Book Cover */}
                  <div className={`h-48 ${product.bgGradient} flex items-center justify-center relative`}>
                    <FaBook className="text-6xl text-white/80" />
                    <span className="absolute top-4 right-4 px-3 py-1 bg-white/20 backdrop-blur rounded-full text-white text-sm font-medium flex items-center gap-1">
                      <FaClock className="text-xs" /> Coming Soon
                    </span>
                  </div>

                  {/* Book Info */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{product.title}</h3>
                    <p className="text-sm text-purple-600 dark:text-purple-400 font-medium mb-3">{product.subtitle}</p>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm leading-relaxed">
                      {product.description}
                    </p>

                    {/* Features */}
                    <div className="space-y-2 mb-4">
                      {product.features.slice(0, 3).map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm">
                          <FaCheckCircle className="text-green-500 flex-shrink-0" />
                          <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                        </div>
                      ))}
                    </div>

                    {/* Interest Count */}
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
                      <FaUsers className="text-purple-500" />
                      <span><strong>{interestCount}</strong> people interested</span>
                    </div>

                    {/* Status Messages */}
                    {currentStatus === 'success' && (
                      <div className="mb-4 p-3 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg flex items-center gap-2 text-sm">
                        <FaCheckCircle />
                        <span>{currentMessage}</span>
                      </div>
                    )}
                    
                    {currentStatus === 'error' && (
                      <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg text-sm">
                        {currentMessage}
                      </div>
                    )}

                    {/* Action Button */}
                    {user ? (
                      alreadyInterested ? (
                        <div className="w-full py-3 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg font-medium text-center flex items-center justify-center gap-2">
                          <FaCheckCircle />
                          <span>You'll be notified!</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleNotify(product.id)}
                          disabled={currentStatus === 'loading'}
                          className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                          {currentStatus === 'loading' ? (
                            <>
                              <FaSpinner className="animate-spin" />
                              <span>Registering...</span>
                            </>
                          ) : (
                            <>
                              <FaBell />
                              <span>Notify Me When Available</span>
                            </>
                          )}
                        </button>
                      )
                    ) : (
                      <button
                        onClick={handleSignIn}
                        disabled={signingIn || !firebaseReady}
                        className="w-full py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium flex items-center justify-center gap-2"
                      >
                        <FaLock />
                        <span>Sign in to Get Notified</span>
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Coming Soon Categories */}
        <div>
          <div className="text-center mb-10">
            <span className="inline-block px-4 py-2 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded-full text-sm font-semibold mb-4">
              More Coming Soon
            </span>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Future Product Categories
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Stay tuned for more exciting products in these categories!
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {COMING_SOON_CATEGORIES.map((category, idx) => {
              const Icon = iconMap[category.icon] || FaShoppingBag
              return (
                <div 
                  key={idx}
                  className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center border border-dashed border-gray-300 dark:border-gray-600 opacity-75"
                >
                  <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="text-2xl text-gray-400" />
                  </div>
                  <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-1">{category.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{category.description}</p>
                  <span className="inline-block mt-3 px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-xs rounded-full">
                    Coming Soon
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
