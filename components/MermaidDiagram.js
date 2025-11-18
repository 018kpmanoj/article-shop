'use client'

import { useEffect, useRef } from 'react'

export default function MermaidDiagram({ chart }) {
  const ref = useRef(null)

  useEffect(() => {
    if (typeof window !== 'undefined' && ref.current) {
      import('mermaid').then((mermaid) => {
        mermaid.default.initialize({ 
          startOnLoad: true,
          theme: 'base',
          themeVariables: {
            primaryColor: '#3B82F6',
            primaryTextColor: '#fff',
            primaryBorderColor: '#2563EB',
            lineColor: '#6B7280',
            secondaryColor: '#8B5CF6',
            tertiaryColor: '#EC4899',
          }
        })
        mermaid.default.contentLoaded()
      })
    }
  }, [])

  return (
    <div className="mermaid-diagram my-8 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md overflow-x-auto">
      <div ref={ref} className="mermaid">
        {chart}
      </div>
    </div>
  )
}

