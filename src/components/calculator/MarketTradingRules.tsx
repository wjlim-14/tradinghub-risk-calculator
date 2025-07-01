'use client'

import { InformationCircleIcon } from '@heroicons/react/24/outline'

const MarketTradingRules = () => {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
      <div className="flex items-center mb-4">
        <InformationCircleIcon className="h-6 w-6 text-blue-600 mr-2" />
        <h3 className="text-lg font-semibold text-blue-900">
          Multi-Market Trading Rules
        </h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center mb-2">
            <span className="text-xl mr-2">🇲🇾</span>
            <h4 className="font-semibold text-gray-900">Malaysia</h4>
          </div>
          <p className="text-sm text-gray-600">100 shares per lot</p>
          <p className="text-xs text-gray-500">Standard for all stocks</p>
        </div>
        
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center mb-2">
            <span className="text-xl mr-2">🇸🇬</span>
            <h4 className="font-semibold text-gray-900">Singapore</h4>
          </div>
          <p className="text-sm text-gray-600">100 shares per lot</p>
          <p className="text-xs text-gray-500">Odd lots available</p>
        </div>
        
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center mb-2">
            <span className="text-xl mr-2">🇨🇳</span>
            <h4 className="font-semibold text-gray-900">China</h4>
          </div>
          <p className="text-sm text-gray-600">100 shares per lot</p>
          <p className="text-xs text-gray-500">A-shares standard</p>
        </div>
        
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center mb-2">
            <span className="text-xl mr-2">🇭🇰</span>
            <h4 className="font-semibold text-gray-900">Hong Kong</h4>
          </div>
          <p className="text-sm text-gray-600">Variable lot sizes</p>
          <p className="text-xs text-gray-500">Check individual stocks</p>
        </div>
        
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center mb-2">
            <span className="text-xl mr-2">🇺🇸</span>
            <h4 className="font-semibold text-gray-900">United States</h4>
          </div>
          <p className="text-sm text-gray-600">Any number of shares</p>
          <p className="text-xs text-gray-500">Fractional shares OK</p>
        </div>
      </div>
      
      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
        <strong>Calculator Default:</strong> Our calculator uses 100-share lots, which works perfectly for 
        Malaysia, Singapore, and China A-shares. For Hong Kong stocks, check individual stock lot sizes. 
        For US stocks, you can trade any number of shares.
      </div>
    </div>
  )
}

export default MarketTradingRules