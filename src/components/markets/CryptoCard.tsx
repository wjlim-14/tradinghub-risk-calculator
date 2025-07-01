'use client'

import { CryptoData } from '@/types'
import { useAnalytics } from '@/hooks/useAnalytics'
import Image from 'next/image'

interface CryptoCardProps {
  crypto: CryptoData
}

const CryptoCard = ({ crypto }: CryptoCardProps) => {
  const { trackClick } = useAnalytics()

  const handleCardClick = () => {
    trackClick(`crypto_card_${crypto.symbol}`, 'view_crypto_details', {
      symbol: crypto.symbol,
      price: crypto.price,
      marketCap: crypto.marketCap
    })
  }

  const getChangeColor = (change: number) => {
    if (change > 0) return 'text-success-600 bg-success-50'
    if (change < 0) return 'text-danger-600 bg-danger-50'
    return 'text-gray-600 bg-gray-50'
  }

  const formatMarketCap = (value: number) => {
    if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`
    return `$${value.toLocaleString()}`
  }

  const formatVolume = (value: number) => {
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`
    if (value >= 1e3) return `$${(value / 1e3).toFixed(2)}K`
    return `$${value.toLocaleString()}`
  }

  return (
    <div 
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 p-6 hover:scale-105 cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-yellow-400 rounded-full flex items-center justify-center text-white font-bold text-sm">
            {crypto.symbol.slice(0, 2)}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{crypto.name}</h3>
            <p className="text-sm text-gray-500">{crypto.symbol}</p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="text-2xl font-bold text-gray-900">
          ${crypto.price.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })}
        </div>

        <div className="flex items-center space-x-2">
          <span className={`inline-flex items-center px-2 py-1 rounded text-sm font-medium ${getChangeColor(crypto.change24h)}`}>
            {crypto.change24h >= 0 ? '+' : ''}{crypto.change24h.toFixed(2)}
          </span>
          <span className={`inline-flex items-center px-2 py-1 rounded text-sm font-medium ${getChangeColor(crypto.changePercent24h)}`}>
            {crypto.changePercent24h >= 0 ? '+' : ''}{crypto.changePercent24h.toFixed(2)}%
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
          <div>
            <p className="text-xs text-gray-500 mb-1">Market Cap</p>
            <p className="text-sm font-semibold text-gray-900">{formatMarketCap(crypto.marketCap)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">24h Volume</p>
            <p className="text-sm font-semibold text-gray-900">{formatVolume(crypto.volume24h)}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CryptoCard