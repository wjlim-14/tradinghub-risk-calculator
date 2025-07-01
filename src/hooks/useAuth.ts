import { useState, useEffect } from 'react'
import { User } from '@/types'
import toast from 'react-hot-toast'

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Firebase disabled for now - authentication will be added later
    setLoading(false)
  }, [])

  const signInWithGoogle = async () => {
    toast.error('Authentication temporarily disabled. Coming soon!')
  }

  const signOut = async () => {
    toast.error('Authentication temporarily disabled. Coming soon!')
  }

  const updateUserPreferences = async (preferences: Partial<User['preferences']>) => {
    toast.error('User preferences temporarily disabled. Coming soon!')
  }

  return {
    user,
    loading,
    error,
    signInWithGoogle,
    signOut,
    updateUserPreferences,
    isAuthenticated: false
  }
}

// Analytics helper function
const logEvent = (eventName: string, parameters?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, parameters)
  }
}