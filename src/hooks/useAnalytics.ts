import { useCallback } from 'react'
import { ClickEvent } from '@/types'
import { useAuth } from './useAuth'

export const useAnalytics = () => {
  const { user } = useAuth()

  const trackClick = useCallback(async (
    elementId: string, 
    action: string, 
    metadata?: Record<string, any>
  ) => {
    try {
      // Basic console logging for now - Firebase disabled
      console.log('Click tracked:', {
        elementId,
        action,
        timestamp: new Date(),
        userId: user?.uid,
        page: typeof window !== 'undefined' ? window.location.pathname : '',
        metadata
      })

      // Send to Google Analytics if available
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', action, {
          event_category: 'user_interaction',
          event_label: elementId,
          custom_parameter_1: JSON.stringify(metadata),
          user_id: user?.uid
        })
      }
    } catch (error) {
      console.error('Error tracking click:', error)
    }
  }, [user])

  const trackPageView = useCallback((pageName: string) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', process.env.NEXT_PUBLIC_GA_ID!, {
        page_title: pageName,
        page_location: window.location.href,
        user_id: user?.uid
      })
    }
  }, [user])

  const trackMarketView = useCallback((market: string) => {
    trackClick('market_view', 'view_market', { market })
  }, [trackClick])

  const trackToolUsage = useCallback((tool: string) => {
    trackClick('tool_usage', 'use_tool', { tool })
  }, [trackClick])

  const trackAuthAction = useCallback((action: 'login' | 'logout' | 'register') => {
    trackClick('auth_action', action, { timestamp: new Date().toISOString() })
  }, [trackClick])

  return {
    trackClick,
    trackPageView,
    trackMarketView,
    trackToolUsage,
    trackAuthAction
  }
}