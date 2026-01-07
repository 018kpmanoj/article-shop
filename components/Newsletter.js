'use client'

import { useState } from 'react'
import { FaEnvelope, FaCheckCircle, FaExclamationCircle, FaSpinner } from 'react-icons/fa'
import { subscribeToNewsletter } from '@/lib/newsletter'

export default function Newsletter() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle') // idle, loading, success, error
  const [message, setMessage] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!email || !email.includes('@')) {
      setStatus('error')
      setMessage('Please enter a valid email address')
      return
    }

    setStatus('loading')
    setMessage('Subscribing...')

    try {
      const result = await subscribeToNewsletter(email)
      
      if (result.success) {
        setStatus('success')
        setMessage('🎉 Successfully subscribed! Check your inbox.')
        setEmail('')
        setTimeout(() => { setStatus('idle'); setMessage(''); }, 5000)
      } else {
        setStatus('error')
        setMessage(result.error || 'Failed to subscribe')
        setTimeout(() => { setStatus('idle'); setMessage(''); }, 3000)
      }
    } catch (error) {
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
            delivered directly to your inbox every Sunday. No spam, unsubscribe anytime.
          </p>
        </div>

        {status === 'success' ? (
          <div className="bg-white rounded-lg p-8 text-center max-w-2xl mx-auto animate-pulse">
            <FaCheckCircle className="text-5xl text-green-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Thank You for Subscribing!
            </h3>
            <p className="text-gray-600">{message}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                disabled={status === 'loading'}
                className="flex-1 px-6 py-4 rounded-lg text-gray-900 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-colors disabled:opacity-50 whitespace-nowrap flex items-center justify-center gap-2"
              >
                {status === 'loading' ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    Subscribing...
                  </>
                ) : (
                  'Subscribe Now'
                )}
              </button>
            </div>
            
            {/* Status Message */}
            {message && status !== 'success' && (
              <div className={`mt-4 p-3 rounded-lg flex items-center gap-2 ${
                status === 'error' ? 'bg-red-100 text-red-700' : 
                status === 'loading' ? 'bg-blue-100 text-blue-700' : ''
              }`}>
                {status === 'error' && <FaExclamationCircle />}
                {status === 'loading' && <FaSpinner className="animate-spin" />}
                <span>{message}</span>
              </div>
            )}
            
            <p className="text-blue-100 text-sm mt-4 text-center">
              📅 Weekly newsletter sent every Sunday • 🔒 No spam, ever
            </p>
          </form>
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
