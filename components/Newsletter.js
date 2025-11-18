'use client'

import { useState } from 'react'
import { FaEnvelope, FaCheckCircle } from 'react-icons/fa'

export default function Newsletter() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle') // idle, loading, success, error

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('loading')

    // Simulate API call (replace with actual newsletter service integration)
    setTimeout(() => {
      console.log('Newsletter subscription:', email)
      setStatus('success')
      setEmail('')
      
      // Reset after 3 seconds
      setTimeout(() => {
        setStatus('idle')
      }, 3000)
    }, 1000)
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
            delivered directly to your inbox. No spam, unsubscribe anytime.
          </p>
        </div>

        {status === 'success' ? (
          <div className="bg-white rounded-lg p-8 text-center">
            <FaCheckCircle className="text-5xl text-green-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Thank You for Subscribing!
            </h3>
            <p className="text-gray-600">
              Check your email to confirm your subscription.
            </p>
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
                className="flex-1 px-6 py-4 rounded-lg text-gray-900 focus:outline-none focus:ring-4 focus:ring-blue-300"
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
              >
                {status === 'loading' ? 'Subscribing...' : 'Subscribe Now'}
              </button>
            </div>
            <p className="text-blue-100 text-sm mt-4 text-center">
              Join 500+ subscribers already getting weekly insights
            </p>
          </form>
        )}

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="text-center text-white">
            <div className="text-3xl font-bold mb-2">📧</div>
            <h3 className="font-semibold mb-1">Weekly Updates</h3>
            <p className="text-blue-100 text-sm">New articles every week</p>
          </div>
          <div className="text-center text-white">
            <div className="text-3xl font-bold mb-2">🎯</div>
            <h3 className="font-semibold mb-1">Curated Content</h3>
            <p className="text-blue-100 text-sm">Only the best insights</p>
          </div>
          <div className="text-center text-white">
            <div className="text-3xl font-bold mb-2">🔒</div>
            <h3 className="font-semibold mb-1">Privacy First</h3>
            <p className="text-blue-100 text-sm">No spam, ever</p>
          </div>
        </div>
      </div>
    </section>
  )
}

