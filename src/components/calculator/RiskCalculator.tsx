'use client'

import { useState, useEffect } from 'react'
import { useAnalytics } from '@/hooks/useAnalytics'
import MarketTradingRules from './MarketTradingRules'
import { 
  CalculatorIcon, 
  ExclamationTriangleIcon,
  CheckCircleIcon,
  InformationCircleIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline'

interface CalculationResult {
  riskAmount: number
  maxLots: number
  maxShares: number
  positionValue: number
  riskPerShare: number
  positionSizePercentage: number
  isValid: boolean
  warnings: string[]
}

const RiskCalculator = () => {
  const { trackClick } = useAnalytics()
  const [formData, setFormData] = useState({
    principal: '',
    riskPercentage: '',
    buyPrice: '',
    stopLoss: '',
    market: 'MY'
  })
  const [result, setResult] = useState<CalculationResult | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateInputs = () => {
    const newErrors: Record<string, string> = {}
    
    const principal = parseFloat(formData.principal)
    const riskPercentage = parseFloat(formData.riskPercentage)
    const buyPrice = parseFloat(formData.buyPrice)
    const stopLoss = parseFloat(formData.stopLoss)

    if (!formData.principal || principal <= 0) {
      newErrors.principal = 'Principal must be greater than 0'
    }
    
    if (!formData.riskPercentage || riskPercentage <= 0 || riskPercentage > 100) {
      newErrors.riskPercentage = 'Risk percentage must be between 0.1% and 100%'
    }
    
    if (!formData.buyPrice || buyPrice <= 0) {
      newErrors.buyPrice = 'Buy price must be greater than 0'
    }
    
    if (!formData.stopLoss || stopLoss <= 0) {
      newErrors.stopLoss = 'Stop loss must be greater than 0'
    }
    
    if (buyPrice && stopLoss && stopLoss >= buyPrice) {
      newErrors.stopLoss = 'Stop loss must be lower than buy price'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const getMarketInfo = (market: string) => {
    const marketInfo: Record<string, {name: string, flag: string, lotSize: number, currency: string, usesLots: boolean}> = {
      'MY': { name: 'Malaysia (KLSE)', flag: '🇲🇾', lotSize: 100, currency: 'RM', usesLots: true },
      'SG': { name: 'Singapore (SGX)', flag: '🇸🇬', lotSize: 100, currency: 'S$', usesLots: true },
      'CN': { name: 'China A-Shares', flag: '🇨🇳', lotSize: 100, currency: '¥', usesLots: true },
      'HK': { name: 'Hong Kong (HKEX)', flag: '🇭🇰', lotSize: 100, currency: 'HK$', usesLots: true },
      'US': { name: 'United States', flag: '🇺🇸', lotSize: 1, currency: '$', usesLots: false }
    }
    return marketInfo[market] || marketInfo['MY']
  }

  const calculateRisk = () => {
    if (!validateInputs()) return

    trackClick('risk_calculator', 'calculate_risk', {
      principal: formData.principal,
      riskPercentage: formData.riskPercentage,
      market: formData.market
    })

    const principal = parseFloat(formData.principal)
    const riskPercentage = parseFloat(formData.riskPercentage)
    const buyPrice = parseFloat(formData.buyPrice)
    const stopLoss = parseFloat(formData.stopLoss)
    const marketInfo = getMarketInfo(formData.market)

    const riskAmount = principal * (riskPercentage / 100)
    const riskPerShare = buyPrice - stopLoss
    const maxSharesCalculated = Math.floor(riskAmount / riskPerShare)
    
    // Calculate lots based on market
    let maxLots, maxShares
    if (marketInfo.usesLots) {
      maxLots = Math.floor(maxSharesCalculated / marketInfo.lotSize)
      maxShares = maxLots * marketInfo.lotSize
    } else {
      // US market - no lot restrictions
      maxLots = 0 // Not applicable
      maxShares = maxSharesCalculated
    }
    
    const positionValue = maxShares * buyPrice
    const positionSizePercentage = (positionValue / principal) * 100

    const warnings: string[] = []
    
    // Add warnings based on common risk management rules
    if (riskPercentage > 5) {
      warnings.push('High risk: Consider risking no more than 2-5% per trade')
    }
    
    if (positionSizePercentage > 20) {
      warnings.push('Large position: Consider diversifying across multiple stocks')
    }
    
    if (riskPerShare / buyPrice < 0.02) {
      warnings.push('Very tight stop loss: Consider if this allows enough room for normal price fluctuation')
    }

    // Market-specific warnings
    if (marketInfo.usesLots) {
      if (maxLots === 0) {
        warnings.push(`Position size too small: Cannot buy even 1 lot (${marketInfo.lotSize} shares). Consider increasing capital or adjusting stop loss`)
      }
      
      if (maxSharesCalculated >= marketInfo.lotSize && maxLots === 0) {
        warnings.push(`Calculated ${maxSharesCalculated} shares, but minimum is 1 lot (${marketInfo.lotSize} shares)`)
      }
    } else {
      // US market specific
      if (maxShares === 0) {
        warnings.push('Position size too small: Cannot buy even 1 share. Consider increasing capital or adjusting stop loss')
      }
    }

    setResult({
      riskAmount,
      maxLots,
      maxShares,
      positionValue,
      riskPerShare,
      positionSizePercentage,
      isValid: marketInfo.usesLots ? maxLots > 0 : maxShares > 0,
      warnings
    })
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Clear specific error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const resetCalculator = () => {
    setFormData({
      principal: '',
      riskPercentage: '',
      buyPrice: '',
      stopLoss: '',
      market: 'MY'
    })
    setResult(null)
    setErrors({})
    trackClick('risk_calculator', 'reset_calculator')
  }

  const formatCurrency = (amount: number) => {
    const marketInfo = getMarketInfo(formData.market)
    const currencyMap: Record<string, string> = {
      'RM': 'MYR',
      'S$': 'SGD', 
      '¥': 'CNY',
      'HK$': 'HKD',
      '$': 'USD'
    }
    
    const currency = currencyMap[marketInfo.currency] || 'MYR'
    
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2
    }).format(amount)
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 max-w-4xl mx-auto">
      <div className="flex items-center mb-6">
        <CalculatorIcon className="h-8 w-8 text-primary-600 mr-3" />
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Risk Management Calculator</h2>
          <p className="text-gray-600">Calculate optimal position size based on your risk tolerance</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Form */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <GlobeAltIcon className="h-4 w-4 inline mr-1" />
              Market
            </label>
            <select
              value={formData.market}
              onChange={(e) => handleInputChange('market', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="MY">🇲🇾 Malaysia (KLSE)</option>
              <option value="SG">🇸🇬 Singapore (SGX)</option>
              <option value="CN">🇨🇳 China A-Shares</option>
              <option value="HK">🇭🇰 Hong Kong (HKEX)</option>
              <option value="US">🇺🇸 United States (NYSE/NASDAQ)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Principal Capital ({getMarketInfo(formData.market).currency})
            </label>
            <input
              type="number"
              value={formData.principal}
              onChange={(e) => handleInputChange('principal', e.target.value)}
              placeholder="e.g., 10000"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                errors.principal ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.principal && (
              <p className="text-red-500 text-sm mt-1">{errors.principal}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Maximum Risk Percentage (%)
            </label>
            <input
              type="number"
              step="0.1"
              max="100"
              value={formData.riskPercentage}
              onChange={(e) => handleInputChange('riskPercentage', e.target.value)}
              placeholder="e.g., 2.5"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                errors.riskPercentage ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.riskPercentage && (
              <p className="text-red-500 text-sm mt-1">{errors.riskPercentage}</p>
            )}
            <p className="text-sm text-gray-500 mt-1">
              Recommended: 1-3% for conservative, 2-5% for moderate risk
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Buy Price ({getMarketInfo(formData.market).currency})
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.buyPrice}
              onChange={(e) => handleInputChange('buyPrice', e.target.value)}
              placeholder="e.g., 2.50"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                errors.buyPrice ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.buyPrice && (
              <p className="text-red-500 text-sm mt-1">{errors.buyPrice}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Stop Loss Price ({getMarketInfo(formData.market).currency})
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.stopLoss}
              onChange={(e) => handleInputChange('stopLoss', e.target.value)}
              placeholder="e.g., 2.25"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                errors.stopLoss ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.stopLoss && (
              <p className="text-red-500 text-sm mt-1">{errors.stopLoss}</p>
            )}
          </div>

          <div className="flex space-x-4">
            <button
              onClick={calculateRisk}
              className="flex-1 bg-primary-600 hover:bg-primary-700 text-white py-3 px-6 rounded-lg font-medium transition-colors"
            >
              Calculate Position Size
            </button>
            <button
              onClick={resetCalculator}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-6">
          {result ? (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                Calculation Results
              </h3>

              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Risk Amount:</span>
                  <span className="font-semibold text-red-600">
                    {formatCurrency(result.riskAmount)}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Risk Per Share:</span>
                  <span className="font-semibold">
                    {formatCurrency(result.riskPerShare)}
                  </span>
                </div>
                
                {getMarketInfo(formData.market).usesLots ? (
                  <>
                    <div className="flex justify-between border-t pt-3">
                      <span className="text-gray-600">Maximum Lots:</span>
                      <span className="font-bold text-2xl text-primary-600">
                        {result.maxLots.toLocaleString()} lots
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Shares:</span>
                      <span className="font-semibold text-primary-600">
                        {result.maxShares.toLocaleString()} shares
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="flex justify-between border-t pt-3">
                    <span className="text-gray-600">Maximum Shares:</span>
                    <span className="font-bold text-2xl text-primary-600">
                      {result.maxShares.toLocaleString()} shares
                    </span>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Position Value:</span>
                  <span className="font-semibold text-green-600">
                    {formatCurrency(result.positionValue)}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Position Size:</span>
                  <span className="font-semibold">
                    {result.positionSizePercentage.toFixed(1)}% of capital
                  </span>
                </div>
              </div>

              {/* Warnings */}
              {result.warnings.length > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600 mr-2 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium text-yellow-800 mb-2">
                        Risk Management Warnings:
                      </h4>
                      <ul className="text-sm text-yellow-700 space-y-1">
                        {result.warnings.map((warning, index) => (
                          <li key={index}>• {warning}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Summary */}
              {result.isValid && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <InformationCircleIcon className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium text-green-800 mb-2">
                        Trading Plan Summary:
                      </h4>
                      <p className="text-sm text-green-700">
                        {getMarketInfo(formData.market).usesLots ? (
                          <>
                            Buy <strong>{result.maxLots.toLocaleString()} lots</strong> ({result.maxShares.toLocaleString()} shares) at{' '}
                            <strong>{formatCurrency(parseFloat(formData.buyPrice))}</strong> per share.
                          </>
                        ) : (
                          <>
                            Buy <strong>{result.maxShares.toLocaleString()} shares</strong> at{' '}
                            <strong>{formatCurrency(parseFloat(formData.buyPrice))}</strong> per share.
                          </>
                        )}
                        Set stop loss at <strong>{formatCurrency(parseFloat(formData.stopLoss))}</strong>.
                        Maximum loss if stopped out: <strong>{formatCurrency(result.riskAmount)}</strong> 
                        ({formData.riskPercentage}% of your capital).
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <CalculatorIcon className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <p>Enter your trading parameters to calculate optimal position size</p>
            </div>
          )}
        </div>
      </div>

      {/* Educational Info */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">
          Risk Management Principles
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
          <div>
            <h4 className="font-medium mb-2">Position Sizing Formula:</h4>
            <p>Risk Amount = Principal × Risk %</p>
            <p>Max Shares = Risk Amount ÷ (Buy Price - Stop Loss)</p>
            <p>Max Lots = Max Shares ÷ 100 (1 lot = 100 shares)</p>
          </div>
          <div>
            <h4 className="font-medium mb-2">Best Practices:</h4>
            <p>• Never risk more than 2-5% per trade</p>
            <p>• Diversify across multiple positions</p>
            <p>• Always set stop losses before buying</p>
            <p>• Lot sizes vary by market (see table below)</p>
          </div>
        </div>
      </div>
      
      {/* Market Trading Rules */}
      <div className="mt-8">
        <MarketTradingRules />
      </div>
    </div>
  )
}

export default RiskCalculator