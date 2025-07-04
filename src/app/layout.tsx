import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/layout/Navbar'
import { Toaster } from 'react-hot-toast'
import { Analytics } from "@vercel/analytics/next"

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'InvestHub - Multi-Market Investment Platform',
  description: 'Track stocks, commodities, forex, and crypto across Malaysia, US, China, Hong Kong, and Singapore',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="bg-gray-50 min-h-screen">
          <Navbar />
          <main className="min-h-screen">
            {children}
          </main>
          <Toaster position="top-right" />
          <Analytics />
          
          <footer className="bg-gray-900 text-white py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div>
                  <h3 className="text-lg font-semibold mb-4">InvestHub</h3>
                  <p className="text-gray-400">Your gateway to global markets</p>
                </div>
                <div>
                  <h4 className="text-md font-semibold mb-4">Markets</h4>
                  <ul className="space-y-2 text-gray-400">
                    <li><a href="/markets/my" className="hover:text-white">Malaysia</a></li>
                    <li><a href="/markets/us" className="hover:text-white">United States</a></li>
                    <li><a href="/markets/cn" className="hover:text-white">China</a></li>
                    <li><a href="/markets/hk" className="hover:text-white">Hong Kong</a></li>
                    <li><a href="/markets/sg" className="hover:text-white">Singapore</a></li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-md font-semibold mb-4">Assets</h4>
                  <ul className="space-y-2 text-gray-400">
                    <li><a href="/commodities" className="hover:text-white">Commodities</a></li>
                    <li><a href="/forex" className="hover:text-white">Forex</a></li>
                    <li><a href="/crypto" className="hover:text-white">Cryptocurrency</a></li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-md font-semibold mb-4">Tools</h4>
                  <ul className="space-y-2 text-gray-400">
                    <li><a href="/tools/screeners" className="hover:text-white">Screeners</a></li>
                    <li><a href="/tools/calculators" className="hover:text-white">Calculators</a></li>
                    <li><a href="/learn" className="hover:text-white">Education</a></li>
                  </ul>
                </div>
              </div>
              <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
                <p>&copy; 2024 InvestHub. All rights reserved.</p>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}