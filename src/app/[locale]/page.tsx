'use client'

import { useEffect, useState } from 'react'
import { useAnalytics } from '@/hooks/useAnalytics'
import RiskCalculator from '@/components/calculator/RiskCalculator'
import MarketCard from '@/components/markets/MarketCard'
import CryptoCard from '@/components/markets/CryptoCard'
import { MarketSummary, CryptoData } from '@/types'
import { getDictionary, type Locale } from '@/lib/dictionaries'
import { 
  ChartBarIcon, 
  CurrencyDollarIcon, 
  AcademicCapIcon,
  BellIcon,
  CalculatorIcon,
  MagnifyingGlassIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline'

interface HomeProps {
  params: Promise<{ locale: Locale }>
}

export default function Home({ params }: HomeProps) {
  const { trackPageView, trackClick } = useAnalytics()
  const [marketData, setMarketData] = useState<MarketSummary[]>([])
  const [cryptoData, setCryptoData] = useState<CryptoData[]>([])
  const [loading, setLoading] = useState(true)
  const [dict, setDict] = useState<any>(null)
  const [locale, setLocale] = useState<Locale>('en')

  useEffect(() => {
    const loadParams = async () => {
      const { locale: paramLocale } = await params
      setLocale(paramLocale)
      const dictionary = getDictionary(paramLocale)
      setDict(dictionary)
    }
    loadParams()
    trackPageView('Home')
    loadData()
  }, [trackPageView, params])

  const loadData = async () => {
    // Simulate API calls with mock data
    setTimeout(() => {
      setMarketData([
        {
          market: 'MY',
          index: 'KLSE',
          value: 1456.78,
          change: 12.34,
          changePercent: 0.85,
          status: 'closed'
        },
        {
          market: 'US',
          index: 'S&P 500',
          value: 4234.56,
          change: -23.45,
          changePercent: -0.55,
          status: 'after-hours'
        },
        {
          market: 'CN',
          index: 'CSI 300',
          value: 3987.12,
          change: 45.67,
          changePercent: 1.16,
          status: 'closed'
        },
        {
          market: 'HK',
          index: 'HSI',
          value: 18456.78,
          change: -89.12,
          changePercent: -0.48,
          status: 'closed'
        },
        {
          market: 'SG',
          index: 'STI',
          value: 3234.56,
          change: 15.67,
          changePercent: 0.49,
          status: 'closed'
        }
      ])

      setCryptoData([
        {
          id: 'bitcoin',
          symbol: 'BTC',
          name: 'Bitcoin',
          price: 43234.56,
          change24h: 1234.56,
          changePercent24h: 2.94,
          marketCap: 850000000000,
          volume24h: 25000000000,
          lastUpdated: new Date()
        },
        {
          id: 'ethereum',
          symbol: 'ETH',
          name: 'Ethereum',
          price: 2567.89,
          change24h: -45.67,
          changePercent24h: -1.75,
          marketCap: 310000000000,
          volume24h: 15000000000,
          lastUpdated: new Date()
        },
        {
          id: 'binancecoin',
          symbol: 'BNB',
          name: 'Binance Coin',
          price: 234.56,
          change24h: 12.45,
          changePercent24h: 5.61,
          marketCap: 36000000000,
          volume24h: 1200000000,
          lastUpdated: new Date()
        }
      ])

      setLoading(false)
    }, 1000)
  }

  const handleHeroButtonClick = (action: string) => {
    trackClick(`hero_${action}`, 'hero_interaction', { action })
  }

  const handleToolClick = (tool: string) => {
    trackClick(`tool_${tool}`, 'tool_interaction', { tool })
  }

  if (!dict) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-blue-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-white/10 p-4 rounded-2xl">
                <ShieldCheckIcon className="h-16 w-16 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fadeInUp">
              {dict.hero.title}
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90 animate-fadeInUp animation-delay-200">
              {dict.hero.subtitle}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-fadeInUp animation-delay-400">
              <button 
                className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                onClick={() => {
                  handleHeroButtonClick('try_calculator')
                  document.getElementById('risk-calculator')?.scrollIntoView({ behavior: 'smooth' })
                }}
              >
                {dict.riskCalculator.calculate}
              </button>
              <button 
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors"
                onClick={() => handleHeroButtonClick('learn_risk_management')}
              >
                {dict.nav.learn}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto animate-fadeInUp animation-delay-600">
              <div className="text-center">
                <div className="text-3xl font-bold">2-5%</div>
                <div className="text-lg opacity-80">
                  {locale === 'cn' ? '推荐风险' : 'Recommended Risk'}
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">100%</div>
                <div className="text-lg opacity-80">
                  {locale === 'cn' ? '免费使用' : 'Free to Use'}
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">∞</div>
                <div className="text-lg opacity-80">
                  {locale === 'cn' ? '计算次数' : 'Calculations'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Risk Calculator - Main MVP Feature */}
      <section id="risk-calculator" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <RiskCalculator locale={locale} dict={dict} />
        </div>
      </section>

      {/* Market Overview */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {locale === 'cn' ? '全球市场概览' : 'Global Market Overview'}
            </h2>
            <p className="text-xl text-gray-600">
              {locale === 'cn' ? '来自主要证券交易所的实时数据' : 'Real-time data from major stock exchanges'}
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="bg-gray-200 rounded-lg h-48 animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {marketData.map((market, index) => (
                <div key={market.market} className={`animate-fadeInUp animation-delay-${index * 200}`}>
                  <MarketCard market={market} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Commodities & Forex */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Commodities */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {dict.nav.commodities}
              </h2>
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg shadow-sm flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">🥇</span>
                    <div>
                      <div className="font-semibold">Gold (XAU/USD)</div>
                      <div className="text-sm text-gray-500">Troy Ounce</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">$1,923.45</div>
                    <div className="text-success-600 text-sm">+12.34 (+0.65%)</div>
                  </div>
                </div>
                
                <div className="bg-white p-4 rounded-lg shadow-sm flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">🥈</span>
                    <div>
                      <div className="font-semibold">Silver (XAG/USD)</div>
                      <div className="text-sm text-gray-500">Troy Ounce</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">$24.78</div>
                    <div className="text-danger-600 text-sm">-0.45 (-1.78%)</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Forex */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {locale === 'cn' ? '主要外汇对' : 'Major Forex Pairs'}
              </h2>
              <div className="space-y-4">
                {[
                  { pair: 'EUR/USD', rate: 1.0845, change: -0.0023, changePercent: -0.21 },
                  { pair: 'GBP/USD', rate: 1.2634, change: 0.0045, changePercent: 0.36 },
                  { pair: 'USD/MYR', rate: 4.6789, change: 0.0123, changePercent: 0.26 }
                ].map((forex) => (
                  <div key={forex.pair} className="bg-white p-4 rounded-lg shadow-sm flex justify-between items-center">
                    <div className="font-semibold">{forex.pair}</div>
                    <div className="text-right">
                      <div className="font-bold">{forex.rate.toFixed(4)}</div>
                      <div className={`text-sm ${forex.change >= 0 ? 'text-success-600' : 'text-danger-600'}`}>
                        {forex.change >= 0 ? '+' : ''}{forex.change.toFixed(4)} ({forex.changePercent >= 0 ? '+' : ''}{forex.changePercent.toFixed(2)}%)
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cryptocurrency */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {dict.nav.crypto}
            </h2>
            <p className="text-xl text-gray-600">
              {locale === 'cn' ? '按市值排名的顶级加密货币' : 'Top cryptocurrencies by market cap'}
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-gray-200 rounded-lg h-64 animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cryptoData.map((crypto, index) => (
                <div key={crypto.id} className={`animate-fadeInUp animation-delay-${index * 200}`}>
                  <CryptoCard crypto={crypto} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Investment Tools */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {locale === 'cn' ? '投资工具' : 'Investment Tools'}
            </h2>
            <p className="text-xl text-gray-600">
              {locale === 'cn' ? '帮助您做出明智投资决策的强大工具' : 'Powerful tools to help you make informed investment decisions'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: MagnifyingGlassIcon,
                title: dict.nav.screeners,
                description: locale === 'cn' ? '按市值、市盈率、股息收益率等筛选股票' : 'Filter stocks by market cap, P/E ratio, dividend yield, and more',
                id: 'screeners'
              },
              {
                icon: CalculatorIcon,
                title: dict.nav.calculators,
                description: locale === 'cn' ? '计算收益、复利和投资组合分配' : 'Calculate returns, compound interest, and portfolio allocation',
                id: 'calculators'
              },
              {
                icon: ChartBarIcon,
                title: dict.nav.analysis,
                description: locale === 'cn' ? '带有指标和形态识别的高级图表工具' : 'Advanced charting tools with indicators and pattern recognition',
                id: 'technical_analysis'
              },
              {
                icon: BellIcon,
                title: locale === 'cn' ? '价格提醒' : 'Price Alerts',
                description: locale === 'cn' ? '当您的股票达到目标价格时获得通知' : 'Get notified when your stocks reach target prices',
                id: 'alerts'
              }
            ].map((tool, index) => (
              <div 
                key={tool.id}
                className={`bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer hover:scale-105 animate-fadeInUp animation-delay-${index * 200}`}
                onClick={() => handleToolClick(tool.id)}
              >
                <tool.icon className="h-12 w-12 text-primary-600 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {tool.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {tool.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}