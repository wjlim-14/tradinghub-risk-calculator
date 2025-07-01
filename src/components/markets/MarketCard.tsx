'use client'

import { MarketSummary } from '@/types'
import { useAnalytics } from '@/hooks/useAnalytics'
import Link from 'next/link'

interface MarketCardProps {
  market: MarketSummary
}

const MarketCard = ({ market }: MarketCardProps) => {
  const { trackClick } = useAnalytics()

  const handleCardClick = () => {
    trackClick(`market_card_${market.market}`, 'view_market_details', {
      market: market.market,
      index: market.index,
      value: market.value
    })
  }

  const getStatusColor = (status: MarketSummary['status']) => {
    switch (status) {
      case 'open':
        return 'text-green-600 bg-green-100'
      case 'closed':
        return 'text-red-600 bg-red-100'
      case 'pre-market':
        return 'text-yellow-600 bg-yellow-100'
      case 'after-hours':
        return 'text-blue-600 bg-blue-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const getChangeColor = (change: number) => {
    if (change > 0) return 'text-success-600 bg-success-50'
    if (change < 0) return 'text-danger-600 bg-danger-50'
    return 'text-gray-600 bg-gray-50'
  }

  return (
    <Link 
      href={`/markets/${market.market.toLowerCase()}`}
      onClick={handleCardClick}
    >
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 p-6 hover:scale-105 cursor-pointer">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {market.market} ({market.index})
            </h3>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(market.status)}`}>
              {market.status.replace('-', ' ').toUpperCase()}
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-2xl font-bold text-gray-900">
            {market.value.toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })}
          </div>

          <div className="flex items-center space-x-2">
            <span className={`inline-flex items-center px-2 py-1 rounded text-sm font-medium ${getChangeColor(market.change)}`}>
              {market.change >= 0 ? '+' : ''}{market.change.toFixed(2)}
            </span>
            <span className={`inline-flex items-center px-2 py-1 rounded text-sm font-medium ${getChangeColor(market.changePercent)}`}>
              {market.changePercent >= 0 ? '+' : ''}{market.changePercent.toFixed(2)}%
            </span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>Last Updated</span>
            <span>{new Date().toLocaleTimeString()}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default MarketCard