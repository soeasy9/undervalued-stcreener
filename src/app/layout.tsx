import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Undervalued Stock Screener',
  description: 'Find potentially undervalued stocks by industry',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
            <html lang="en">
          <body className={`${inter.className} bg-gray-900 text-white min-h-screen`}>
            <div className="flex flex-col min-h-screen">
              {/* Header */}
              <header className="bg-gray-800 border-b border-gray-700">
                <div className="container mx-auto px-4 py-6">
                  <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold">
                      Undervalued Stock Screener
                    </h1>
                  </div>
                </div>
              </header>

              {/* Main Content */}
              <main className="flex-1 container mx-auto px-4 py-8">
                {children}
              </main>

              {/* Footer */}
              <footer className="bg-gray-800 border-t border-gray-700">
                <div className="container mx-auto px-4 py-4">
                  <p className="text-center text-gray-400">
                    © {new Date().getFullYear()} Undervalued Stock Screener. All rights reserved.
                  </p>
                </div>
              </footer>
            </div>
          </body>
        </html>
  )
}
