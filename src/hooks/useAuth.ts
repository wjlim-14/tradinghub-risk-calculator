import { useState, useEffect } from 'react'
import { 
  User as FirebaseUser, 
  signInWithPopup, 
  signOut as firebaseSignOut,
  onAuthStateChanged 
} from 'firebase/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { auth, googleProvider, db } from '@/lib/firebase'
import { User } from '@/types'
import toast from 'react-hot-toast'

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userData = await getUserData(firebaseUser)
          setUser(userData)
        } catch (err) {
          console.error('Error getting user data:', err)
          setError('Failed to load user data')
        }
      } else {
        setUser(null)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const getUserData = async (firebaseUser: FirebaseUser): Promise<User> => {
    const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid))
    
    const userData: User = {
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      displayName: firebaseUser.displayName,
      photoURL: firebaseUser.photoURL,
      createdAt: userDoc.exists() ? userDoc.data().createdAt?.toDate() : new Date(),
      lastLoginAt: new Date(),
      preferences: userDoc.exists() ? userDoc.data().preferences : {
        favoriteMarkets: [],
        defaultCurrency: 'USD',
        notifications: true,
        theme: 'light'
      }
    }

    // Update user data in Firestore
    await setDoc(doc(db, 'users', firebaseUser.uid), {
      ...userData,
      lastLoginAt: new Date()
    }, { merge: true })

    return userData
  }

  const signInWithGoogle = async () => {
    try {
      setLoading(true)
      setError(null)
      const result = await signInWithPopup(auth, googleProvider)
      
      // Log the sign-in event for analytics
      logEvent('sign_in', {
        method: 'google',
        userId: result.user.uid
      })
      
      toast.success('Successfully signed in!')
    } catch (err: any) {
      console.error('Sign in error:', err)
      setError(err.message)
      toast.error('Failed to sign in')
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      await firebaseSignOut(auth)
      toast.success('Successfully signed out!')
    } catch (err: any) {
      console.error('Sign out error:', err)
      toast.error('Failed to sign out')
    }
  }

  const updateUserPreferences = async (preferences: Partial<User['preferences']>) => {
    if (!user) return

    try {
      const currentPreferences = user.preferences || {
        favoriteMarkets: [],
        defaultCurrency: 'USD',
        notifications: true,
        theme: 'light' as const
      }
      
      const updatedPreferences = { ...currentPreferences, ...preferences }
      
      await setDoc(doc(db, 'users', user.uid), {
        preferences: updatedPreferences
      }, { merge: true })

      setUser(prev => prev ? { ...prev, preferences: updatedPreferences } : null)
      toast.success('Preferences updated!')
    } catch (err) {
      console.error('Error updating preferences:', err)
      toast.error('Failed to update preferences')
    }
  }

  return {
    user,
    loading,
    error,
    signInWithGoogle,
    signOut,
    updateUserPreferences,
    isAuthenticated: !!user
  }
}

// Analytics helper function
const logEvent = (eventName: string, parameters?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, parameters)
  }
}