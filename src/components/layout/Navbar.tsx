'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { useAnalytics } from '@/hooks/useAnalytics'
import { 
  ChartBarIcon, 
  CurrencyDollarIcon, 
  AcademicCapIcon,
  Bars3Icon,
  XMarkIcon,
  ArrowRightOnRectangleIcon,
  UserCircleIcon,
  CalculatorIcon
} from '@heroicons/react/24/outline'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { user, isAuthenticated, signInWithGoogle, signOut } = useAuth()
  const { trackClick } = useAnalytics()

  const handleNavClick = (item: string) => {
    trackClick(`nav_${item}`, 'navigation_click', { item })
    setIsOpen(false)
  }

  const handleAuthClick = async (action: 'login' | 'logout') => {
    trackClick(`auth_${action}`, 'auth_action', { action })
    if (action === 'login') {
      await signInWithGoogle()
    } else {
      await signOut()
    }
  }

  const markets = [
    { code: 'MY', name: 'Malaysia', flag: '🇲🇾' },
    { code: 'US', name: 'United States', flag: '🇺🇸' },
    { code: 'CN', name: 'China', flag: '🇨🇳' },
    { code: 'HK', name: 'Hong Kong', flag: '🇭🇰' },
    { code: 'SG', name: 'Singapore', flag: '🇸🇬' },
  ]

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link 
              href="/" 
              className="flex-shrink-0 flex items-center"
              onClick={() => handleNavClick('logo')}
            >
              <ChartBarIcon className="h-8 w-8 text-primary-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">InvestHub</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {/* Markets Dropdown */}
            <div className="relative group">
              <button 
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors"
                onClick={() => handleNavClick('markets')}
              >
                <ChartBarIcon className="h-4 w-4 mr-1" />
                Markets
                <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="py-1">
                  {markets.map((market) => (
                    <Link
                      key={market.code}
                      href={`/markets/${market.code.toLowerCase()}`}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => handleNavClick(`market_${market.code}`)}
                    >
                      <span className="mr-2">{market.flag}</span>
                      {market.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Commodities */}
            <div className="relative group">
              <button 
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors"
                onClick={() => handleNavClick('commodities')}
              >
                <CurrencyDollarIcon className="h-4 w-4 mr-1" />
                Commodities
                <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="absolute left-0 mt-2 w-32 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="py-1">
                  <Link href="/commodities/gold" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    🥇 Gold
                  </Link>
                  <Link href="/commodities/silver" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    🥈 Silver
                  </Link>
                </div>
              </div>
            </div>

            {/* Risk Calculator - Featured */}
            <button 
              onClick={() => {
                handleNavClick('risk_calculator')
                document.getElementById('risk-calculator')?.scrollIntoView({ behavior: 'smooth' })
              }}
              className="flex items-center px-3 py-2 text-sm font-medium bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 transition-colors"
            >
              <CalculatorIcon className="h-4 w-4 mr-1" />
              Risk Calculator
            </button>

            {/* Other Links */}
            <Link 
              href="/forex" 
              className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors"
              onClick={() => handleNavClick('forex')}
            >
              Forex
            </Link>
            <Link 
              href="/crypto" 
              className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors"
              onClick={() => handleNavClick('crypto')}
            >
              Crypto
            </Link>
            <Link 
              href="/learn" 
              className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors"
              onClick={() => handleNavClick('learn')}
            >
              <AcademicCapIcon className="h-4 w-4 mr-1" />
              Learn
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  {user?.photoURL ? (
                    <img 
                      src={user.photoURL} 
                      alt="Profile" 
                      className="h-8 w-8 rounded-full"
                    />
                  ) : (
                    <UserCircleIcon className="h-8 w-8 text-gray-400" />
                  )}
                  <span className="text-sm font-medium text-gray-700">
                    {user?.displayName || user?.email}
                  </span>
                </div>
                <button
                  onClick={() => handleAuthClick('logout')}
                  className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-red-600 transition-colors"
                >
                  <ArrowRightOnRectangleIcon className="h-4 w-4 mr-1" />
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => handleAuthClick('login')}
                className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Sign In with Google
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              {isOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
              {/* Markets */}
              <div className="space-y-1">
                <div className="text-gray-900 font-medium px-3 py-2">Markets</div>
                {markets.map((market) => (
                  <Link
                    key={market.code}
                    href={`/markets/${market.code.toLowerCase()}`}
                    className="flex items-center px-6 py-2 text-sm text-gray-600 hover:text-primary-600"
                    onClick={() => handleNavClick(`mobile_market_${market.code}`)}
                  >
                    <span className="mr-2">{market.flag}</span>
                    {market.name}
                  </Link>
                ))}
              </div>

              {/* Risk Calculator - Featured */}
              <button 
                onClick={() => {
                  handleNavClick('mobile_risk_calculator')
                  document.getElementById('risk-calculator')?.scrollIntoView({ behavior: 'smooth' })
                  setIsOpen(false)
                }}
                className="w-full text-left px-3 py-2 bg-primary-100 text-primary-700 rounded hover:bg-primary-200 font-medium"
              >
                🧮 Risk Calculator
              </button>

              {/* Other Links */}
              <Link href="/commodities" className="block px-3 py-2 text-gray-600 hover:text-primary-600">
                Commodities
              </Link>
              <Link href="/forex" className="block px-3 py-2 text-gray-600 hover:text-primary-600">
                Forex
              </Link>
              <Link href="/crypto" className="block px-3 py-2 text-gray-600 hover:text-primary-600">
                Crypto
              </Link>
              <Link href="/learn" className="block px-3 py-2 text-gray-600 hover:text-primary-600">
                Learn
              </Link>

              {/* Mobile Auth */}
              <div className="border-t pt-4 mt-4">
                {isAuthenticated ? (
                  <div className="space-y-2">
                    <div className="flex items-center px-3 py-2">
                      {user?.photoURL ? (
                        <img src={user.photoURL} alt="Profile" className="h-8 w-8 rounded-full mr-2" />
                      ) : (
                        <UserCircleIcon className="h-8 w-8 text-gray-400 mr-2" />
                      )}
                      <span className="text-sm font-medium text-gray-700">
                        {user?.displayName || user?.email}
                      </span>
                    </div>
                    <button
                      onClick={() => handleAuthClick('logout')}
                      className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleAuthClick('login')}
                    className="w-full bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                  >
                    Sign In with Google
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar