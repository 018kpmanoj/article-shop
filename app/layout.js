import './globals.css'
import { Inter } from 'next/font/google'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'KP Manoj - Tech Trends & AI Insights',
  description: 'Explore cutting-edge articles on AI, technology trends, and business innovation by KP Manoj, AI Software Engineer',
  keywords: 'AI, Technology, Business Trends, KP Manoj, Tech Articles, Artificial Intelligence, Software Engineering',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}

