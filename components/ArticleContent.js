'use client'

import { useState, useEffect } from 'react'
import { FaClock, FaEye, FaCalendar, FaShare, FaTwitter, FaLinkedin, FaFacebook, FaCopy, FaCheck } from 'react-icons/fa'
import Newsletter from './Newsletter'

export default function ArticleContent({ article }) {
  const [showShareMenu, setShowShareMenu] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    // Initialize Mermaid when component mounts
    if (typeof window !== 'undefined') {
      import('mermaid').then((mermaid) => {
        mermaid.default.initialize({
          startOnLoad: true,
          theme: 'base',
          themeVariables: {
            primaryColor: '#3B82F6',
            primaryTextColor: '#1F2937',
            primaryBorderColor: '#2563EB',
            lineColor: '#6B7280',
            secondaryColor: '#8B5CF6',
            tertiaryColor: '#EC4899',
            background: '#FFFFFF',
            mainBkg: '#DBEAFE',
            secondBkg: '#E0E7FF',
            tertiaryBkg: '#FCE7F3',
          },
          fontFamily: 'Inter, system-ui, sans-serif',
        })
        
        // Run mermaid after a short delay to ensure DOM is ready
        setTimeout(() => {
          mermaid.default.contentLoaded()
        }, 100)
      })
    }
  }, [article.slug])

  const articleUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/articles/${article.slug}`
    : ''

  const handleShare = (platform) => {
    const title = encodeURIComponent(article.title)
    const url = encodeURIComponent(articleUrl)
    
    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?text=${title}&url=${url}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
    }

    if (shareUrls[platform]) {
      window.open(shareUrls[platform], '_blank', 'width=600,height=400')
    }
    setShowShareMenu(false)
  }

  const copyLink = () => {
    if (typeof window !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(articleUrl).then(() => {
        setCopied(true)
        setTimeout(() => {
          setCopied(false)
          setShowShareMenu(false)
        }, 2000)
      })
    }
  }
  return (
    <div className="bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <span className="text-blue-600 dark:text-blue-400 font-semibold">
              {article.category}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            {article.title}
          </h1>
          
          {/* Meta information */}
          <div className="flex flex-wrap items-center gap-6 text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <FaCalendar />
              <span>{article.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <FaClock />
              <span>{article.readTime}</span>
            </div>
            <div className="flex items-center gap-2">
              <FaEye />
              <span>{article.views} views</span>
            </div>
            <div className="relative">
              <button 
                onClick={() => setShowShareMenu(!showShareMenu)}
                className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
              >
                <FaShare />
                <span>Share</span>
              </button>

              {showShareMenu && (
                <div className="absolute top-full mt-2 right-0 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 z-10 min-w-[200px]">
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => handleShare('twitter')}
                      className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors text-gray-700 dark:text-gray-300"
                    >
                      <FaTwitter className="text-blue-400" size={20} />
                      <span>Twitter</span>
                    </button>
                    <button
                      onClick={() => handleShare('linkedin')}
                      className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors text-gray-700 dark:text-gray-300"
                    >
                      <FaLinkedin className="text-blue-600" size={20} />
                      <span>LinkedIn</span>
                    </button>
                    <button
                      onClick={() => handleShare('facebook')}
                      className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors text-gray-700 dark:text-gray-300"
                    >
                      <FaFacebook className="text-blue-500" size={20} />
                      <span>Facebook</span>
                    </button>
                    <button
                      onClick={copyLink}
                      className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors text-gray-700 dark:text-gray-300"
                    >
                      {copied ? (
                        <>
                          <FaCheck className="text-green-500" size={20} />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <FaCopy className="text-gray-500" size={20} />
                          <span>Copy Link</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose prose-lg max-w-none dark:prose-invert">
          {/* Article excerpt */}
          <p className="text-xl text-gray-700 dark:text-gray-300 leading-relaxed mb-8 font-medium">
            {article.excerpt}
          </p>

          {/* Article content */}
          <div className="article-content text-gray-800 dark:text-gray-200">
            {article.content.split('\n\n').map((paragraph, index) => {
              // Check if paragraph is a heading
              if (paragraph.startsWith('## ')) {
                return (
                  <h2 key={index} className="text-2xl font-semibold mt-8 mb-4 text-gray-900 dark:text-white">
                    {paragraph.replace('## ', '')}
                  </h2>
                )
              }
              
              // Check if paragraph contains Mermaid diagram
              if (paragraph.includes('```mermaid')) {
                const mermaidCode = paragraph
                  .replace(/```mermaid\s*/g, '')
                  .replace(/```\s*/g, '')
                  .trim()
                
                return (
                  <div key={index} className="my-8 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md overflow-x-auto">
                    <pre className="mermaid text-center">
                      {mermaidCode}
                    </pre>
                  </div>
                )
              }
              
              // Regular paragraph - process bold text
              const processedParagraph = paragraph.split(/(\*\*[^*]+\*\*)/).map((part, i) => {
                if (part.startsWith('**') && part.endsWith('**')) {
                  return (
                    <strong key={i} className="font-semibold text-blue-600 dark:text-blue-400">
                      {part.slice(2, -2)}
                    </strong>
                  )
                }
                return part
              })
              
              return (
                <p key={index} className="mb-4 leading-relaxed">
                  {processedParagraph}
                </p>
              )
            })}
          </div>

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </article>

      {/* Newsletter CTA */}
      <div className="bg-gray-50 dark:bg-gray-800 py-12">
        <Newsletter />
      </div>
    </div>
  )
}

