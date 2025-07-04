import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '../globals.css'
import Navbar from '@/components/layout/Navbar'
import { Toaster } from 'react-hot-toast'
import { Analytics } from "@vercel/analytics/next"
import { getDictionary, type Locale } from '@/lib/dictionaries'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'InvestHub - Multi-Market Investment Platform',
  description: 'Track stocks, commodities, forex, and crypto across Malaysia, US, China, Hong Kong, and Singapore',
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: Locale }>
}) {
  const { locale } = await params
  const dict = getDictionary(locale)
  
  return (
    <html lang={locale}>
      <body className={inter.className}>
        <div className="bg-gray-50 min-h-screen">
          <Navbar locale={locale} dict={dict} />
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
                  <p className="text-gray-400">{dict.footer.tagline}</p>
                </div>
                <div>
                  <h4 className="text-md font-semibold mb-4">{dict.footer.marketsTitle}</h4>
                  <ul className="space-y-2 text-gray-400">
                    <li><a href={`/${locale}/markets/my`} className="hover:text-white">{dict.footer.malaysia}</a></li>
                    <li><a href={`/${locale}/markets/us`} className="hover:text-white">{dict.footer.us}</a></li>
                    <li><a href={`/${locale}/markets/cn`} className="hover:text-white">{dict.footer.china}</a></li>
                    <li><a href={`/${locale}/markets/hk`} className="hover:text-white">{dict.footer.hongkong}</a></li>
                    <li><a href={`/${locale}/markets/sg`} className="hover:text-white">{dict.footer.singapore}</a></li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-md font-semibold mb-4">{dict.footer.assetsTitle}</h4>
                  <ul className="space-y-2 text-gray-400">
                    <li><a href={`/${locale}/commodities`} className="hover:text-white">{dict.footer.commodities}</a></li>
                    <li><a href={`/${locale}/forex`} className="hover:text-white">{dict.footer.forex}</a></li>
                    <li><a href={`/${locale}/crypto`} className="hover:text-white">{dict.footer.crypto}</a></li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-md font-semibold mb-4">{dict.footer.toolsTitle}</h4>
                  <ul className="space-y-2 text-gray-400">
                    <li><a href={`/${locale}/tools/screeners`} className="hover:text-white">{dict.footer.screeners}</a></li>
                    <li><a href={`/${locale}/tools/calculators`} className="hover:text-white">{dict.footer.calculators}</a></li>
                    <li><a href={`/${locale}/learn`} className="hover:text-white">{dict.footer.education}</a></li>
                  </ul>
                </div>
              </div>
              <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
                <p>{dict.footer.copyright}</p>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}