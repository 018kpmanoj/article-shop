'use client'

import { useState } from 'react'
import { FaEnvelope, FaCheckCircle, FaExclamationCircle, FaSpinner, FaGoogle, FaLock } from 'react-icons/fa'
import { subscribeToNewsletter } from '@/lib/newsletter'
import { useAuth } from '@/context/AuthContext'

export default function Newsletter() {
  const { user, loginWithGoogle, firebaseReady } = useAuth()
  const [status, setStatus] = useState('idle') // idle, loading, success, error
  const [message, setMessage] = useState('')
  const [signingIn, setSigningIn] = useState(false)

  const handleSignIn = async () => {
    setSigningIn(true)
    try {
      await loginWithGoogle()
    } catch (error) {
      console.error('Sign in error:', error)
    }
    setSigningIn(false)
  }

  const handleSubscribe = async () => {
    if (!user?.email) return
    
    setStatus('loading')
    setMessage('Subscribing...')

    try {
      console.log('Subscribing:', user.email)
      const result = await subscribeToNewsletter(user.email)
      console.log('Subscription result:', result)
      
      if (result.success) {
        setStatus('success')
        setMessage('🎉 Successfully subscribed! Check your email for a welcome message.')
        setTimeout(() => { setStatus('idle'); setMessage(''); }, 8000)
      } else {
        setStatus('error')
        setMessage(result.error || 'Failed to subscribe')
        setTimeout(() => { setStatus('idle'); setMessage(''); }, 4000)
      }
    } catch (error) {
      console.error('Subscribe error:', error)
      setStatus('error')
      setMessage('Connection error. Please try again.')
      setTimeout(() => { setStatus('idle'); setMessage(''); }, 3000)
    }
  }

  return (
    <section id="newsletter" className="py-16 bg-gradient-to-br from-blue-600 to-purple-600">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <FaEnvelope className="text-5xl text-white mx-auto mb-4" />
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Subscribe to My Newsletter
          </h2>
          <p className="text-xl text-blue-100">
            Get the latest articles on AI, technology trends, and business innovation 
            delivered directly to your inbox every Sunday.
          </p>
        </div>

        {status === 'success' ? (
          <div className="bg-white rounded-lg p-8 text-center max-w-2xl mx-auto">
            <FaCheckCircle className="text-5xl text-green-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Thank You for Subscribing!
            </h3>
            <p className="text-gray-600">{message}</p>
          </div>
        ) : user ? (
          // User is signed in - show subscribe button
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white/10 backdrop-blur rounded-lg p-6 mb-4">
              <p className="text-white mb-2">Subscribing as:</p>
              <p className="text-xl font-semibold text-white">{user.email}</p>
            </div>
            
            <button
              onClick={handleSubscribe}
              disabled={status === 'loading'}
              className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-colors disabled:opacity-70 whitespace-nowrap flex items-center justify-center gap-2 mx-auto min-w-[200px]"
            >
              {status === 'loading' ? (
                <>
                  <FaSpinner className="animate-spin" />
                  <span>Subscribing...</span>
                </>
              ) : (
                <>
                  <FaEnvelope />
                  <span>Subscribe Now</span>
                </>
              )}
            </button>
            
            {/* Status Message */}
            {message && status !== 'success' && (
              <div className={`mt-4 p-3 rounded-lg inline-flex items-center gap-2 ${
                status === 'error' ? 'bg-red-500 text-white' : 
                status === 'loading' ? 'bg-white/20 text-white' : ''
              }`}>
                {status === 'error' && <FaExclamationCircle />}
                {status === 'loading' && <FaSpinner className="animate-spin" />}
                <span>{message}</span>
              </div>
            )}
          </div>
        ) : (
          // User not signed in - show sign in prompt
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white rounded-lg p-8">
              <FaLock className="text-4xl text-blue-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Sign in to Subscribe
              </h3>
              <p className="text-gray-600 mb-6">
                Please sign in with your Google account to subscribe to the newsletter.
              </p>
              
              {firebaseReady ? (
                <button
                  onClick={handleSignIn}
                  disabled={signingIn}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 mx-auto disabled:opacity-70"
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
          </div>
        )}

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="text-center text-white">
            <div className="text-3xl font-bold mb-2">📧</div>
            <h3 className="font-semibold mb-1">Weekly Updates</h3>
            <p className="text-blue-100 text-sm">New articles every Sunday</p>
          </div>
          <div className="text-center text-white">
            <div className="text-3xl font-bold mb-2">🎯</div>
            <h3 className="font-semibold mb-1">Curated Content</h3>
            <p className="text-blue-100 text-sm">Only the best insights</p>
          </div>
          <div className="text-center text-white">
            <div className="text-3xl font-bold mb-2">🔒</div>
            <h3 className="font-semibold mb-1">Privacy First</h3>
            <p className="text-blue-100 text-sm">Unsubscribe anytime</p>
          </div>
        </div>
      </div>
    </section>
  )
}
