import './globals.css'
import { Inter } from 'next/font/google'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ScrollProgress from '@/components/ScrollProgress'
import SmoothScroll from '@/components/SmoothScroll'
import { AuthProvider } from '@/context/AuthContext'
import ActivityTracker from '@/components/ActivityTracker'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'K P Manoj - Tech Trends & AI Insights',
  description: 'Explore cutting-edge articles on AI, technology trends, and business innovation by K P Manoj, AI Software Engineer',
  keywords: 'AI, Technology, Business Trends, K P Manoj, Tech Articles, Artificial Intelligence, Software Engineering',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <ScrollProgress />
          <SmoothScroll />
          <ActivityTracker />
          <div className="page-transition">
            <Header />
            <main className="min-h-screen">
              {children}
            </main>
            <Footer />
          </div>
        </AuthProvider>
      </body>
    </html>
  )
}

