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
  // New fields for dual-check logic
  riskBasedShares: number
  capitalBasedShares: number
  actualRiskAmount: number
  actualRiskPercentage: number
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

    // --- THE NEW DUAL-CHECK LOGIC ---
    
    // CHECK #1: THE RISK CHECK
    // Calculates max shares based on the user's risk tolerance
    const riskAmount = principal * (riskPercentage / 100)
    const riskPerShare = buyPrice - stopLoss
    const riskBasedShares = (riskPerShare > 0) ? Math.floor(riskAmount / riskPerShare) : 0

    // CHECK #2: THE WALLET CHECK  
    // Calculates max shares based on the user's available capital
    const capitalBasedShares = (buyPrice > 0) ? Math.floor(principal / buyPrice) : 0

    // THE GOLDEN RULE: CHOOSE THE SMALLER NUMBER
    // This ensures the position is both affordable and within risk limits
    const finalShares = Math.min(riskBasedShares, capitalBasedShares)
    
    // Calculate lots based on market using the final safer share count
    let maxLots, maxShares
    if (marketInfo.usesLots) {
      maxLots = Math.floor(finalShares / marketInfo.lotSize)
      maxShares = maxLots * marketInfo.lotSize
    } else {
      // US market - no lot restrictions
      maxLots = 0 // Not applicable
      maxShares = finalShares
    }
    
    const positionValue = maxShares * buyPrice
    const positionSizePercentage = (positionValue / principal) * 100
    
    // NEW: Calculate the actual risk amount and percentage for the trade
    const actualRiskAmount = maxShares * riskPerShare
    const actualRiskPercentage = (principal > 0) ? (actualRiskAmount / principal) * 100 : 0

    const warnings: string[] = []
    
    // Add warnings based on common risk management rules
    if (riskPercentage > 5) {
      warnings.push('High risk: Consider risking no more than 2-5% per trade')
    }
    
    if (riskPerShare / buyPrice < 0.015) {
      warnings.push('Very tight stop loss: Consider if this allows enough room for normal price fluctuation')
    }

    // Market-specific warnings
    if (maxShares === 0) {
      if (marketInfo.usesLots) {
        warnings.push(`Cannot afford any shares with current capital or inputs. Consider increasing capital or adjusting stop loss`)
      } else {
        warnings.push('Cannot afford any shares with current capital or inputs. Consider increasing capital or adjusting stop loss')
      }
    }

    setResult({
      riskAmount,
      maxLots,
      maxShares,
      positionValue,
      riskPerShare,
      positionSizePercentage,
      isValid: maxShares > 0,
      warnings,
      // New fields for dual-check logic
      riskBasedShares,
      capitalBasedShares,
      actualRiskAmount,
      actualRiskPercentage
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

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Input Form */}
        <div className="lg:col-span-2 space-y-6">
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
        <div className="lg:col-span-3 space-y-6">
          {result ? (
            <div className="space-y-4">
              {/* Calculation Breakdown */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="text-md font-semibold text-blue-900 mb-3">
                  How Your Shares Are Calculated
                </h4>
                <p className="text-sm text-blue-800 mb-3">
                  We perform two simple checks to ensure you trade safely:
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-blue-700">Risk Check (based on {formData.riskPercentage}% risk):</span>
                    <span className="font-semibold text-blue-900">
                      {result.riskBasedShares.toLocaleString()} shares
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700">Wallet Check (based on your capital):</span>
                    <span className="font-semibold text-blue-900">
                      {result.capitalBasedShares.toLocaleString()} shares
                    </span>
                  </div>
                  <div className="border-t border-blue-300 pt-2 mt-2">
                    <p className="text-xs text-blue-600">
                      The calculator automatically shows you the smaller and safer number of shares from these two checks.
                    </p>
                  </div>
                </div>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                Final Calculation Results
              </h3>

              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                {getMarketInfo(formData.market).usesLots ? (
                  <>
                    <div className="flex justify-between border-b pb-3">
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
                  <div className="flex justify-between border-b pb-3">
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
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Actual Risk on this Trade:</span>
                  <span className="font-semibold text-red-600">
                    {formatCurrency(result.actualRiskAmount)} ({result.actualRiskPercentage.toFixed(2)}% of capital)
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
                        If stopped out, your actual loss will be <strong>{formatCurrency(result.actualRiskAmount)}</strong>
                        (which is {result.actualRiskPercentage.toFixed(2)}% of your capital).
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
          How Our Dual-Check System Works
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
          <div>
            <h4 className="font-medium mb-2">The Two Safety Checks:</h4>
            <p><strong>1. Risk Check:</strong> Based on your max risk %</p>
            <p>Max Shares = Risk Amount ÷ (Buy Price - Stop Loss)</p>
            <p><strong>2. Wallet Check:</strong> Based on your available capital</p>
            <p>Max Shares = Principal Capital ÷ Buy Price</p>
            <p className="mt-2 font-medium">Final Result: Smaller of the two checks</p>
          </div>
          <div>
            <h4 className="font-medium mb-2">Why This Approach is Safer:</h4>
            <p>• Prevents overexposure to single positions</p>
            <p>• Ensures you never exceed your risk tolerance</p>
            <p>• Guarantees you can afford the position</p>
            <p>• Shows actual risk vs. intended risk</p>
            <p>• Eliminates confusion for new traders</p>
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