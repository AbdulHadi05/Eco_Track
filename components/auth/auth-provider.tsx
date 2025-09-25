"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import type { User } from "@/lib/types"
import { firebaseAuthManager } from "@/lib/firebase-auth"

interface AuthContextType {
  user: User | null
  token: string | null
  isLoading: boolean
  signOut: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Use Firebase auth state listener
    const unsubscribe = firebaseAuthManager.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser)
        // Get fresh token
        try {
          const { auth } = await import('@/lib/firebase')
          if (auth.currentUser) {
            const freshToken = await auth.currentUser.getIdToken()
            setToken(freshToken)
            localStorage.setItem("auth_token", freshToken)
          }
        } catch (error) {
          console.error('Error getting token:', error)
        }
      } else {
        setUser(null)
        setToken(null)
        localStorage.removeItem("auth_token")
      }
      setIsLoading(false)
    })

    return unsubscribe
  }, [])

  const signOut = async () => {
    try {
      await firebaseAuthManager.signOut()
      localStorage.removeItem("auth_token")
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  return <AuthContext.Provider value={{ user, token, isLoading, signOut }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
