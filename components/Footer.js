import { FaLinkedin, FaGithub, FaTwitter, FaEnvelope } from 'react-icons/fa'

// Last deployment timestamp - Update this when deploying
const LAST_UPDATED = '2026-01-21T13:10:00+05:30'

export default function Footer() {
  const currentYear = new Date().getFullYear()
  const lastUpdated = new Date(LAST_UPDATED)
  const formattedDate = lastUpdated.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short'
  })

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              K P Manoj Tech Trends
            </h3>
            <p className="text-gray-400 mb-4">
              Exploring the intersection of AI, technology, and business innovation. 
              Stay updated with the latest insights and trends.
            </p>
            <div className="flex gap-4">
              <a href="https://linkedin.com/in/018kpmanoj" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-400 transition-colors">
                <FaLinkedin size={24} />
              </a>
              <a href="https://github.com/018kpmanoj" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-400 transition-colors">
                <FaGithub size={24} />
              </a>
              <a href="https://twitter.com/018kpmanoj" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-400 transition-colors">
                <FaTwitter size={24} />
              </a>
              <a href="mailto:018kpmanoj@gmail.com" className="text-gray-400 hover:text-blue-400 transition-colors">
                <FaEnvelope size={24} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-gray-400 hover:text-white transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="/articles" className="text-gray-400 hover:text-white transition-colors">
                  All Articles
                </a>
              </li>
              <li>
                <a href="/products" className="text-gray-400 hover:text-white transition-colors">
                  Products
                </a>
              </li>
              <li>
                <a href="/about" className="text-gray-400 hover:text-white transition-colors">
                  About Me
                </a>
              </li>
              <li>
                <a href="#newsletter" className="text-gray-400 hover:text-white transition-colors">
                  Newsletter
                </a>
              </li>
            </ul>
          </div>

          {/* Topics */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Topics</h4>
            <ul className="space-y-2">
              <li>
                <a href="/articles" className="text-gray-400 hover:text-white transition-colors">
                  Artificial Intelligence
                </a>
              </li>
              <li>
                <a href="/articles" className="text-gray-400 hover:text-white transition-colors">
                  Technology Trends
                </a>
              </li>
              <li>
                <a href="/articles" className="text-gray-400 hover:text-white transition-colors">
                  Business Innovation
                </a>
              </li>
              <li>
                <a href="/articles" className="text-gray-400 hover:text-white transition-colors">
                  Software Engineering
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>© {currentYear} K P Manoj. All rights reserved. Built with Next.js & Tailwind CSS</p>
          <p className="text-sm mt-2 text-gray-500">Last Updated: {formattedDate}</p>
        </div>
      </div>
    </footer>
  )
}

