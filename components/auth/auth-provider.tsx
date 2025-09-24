"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import type { User } from "@/lib/types"
import { authManager } from "@/lib/data-service"

interface AuthContextType {
  user: User | null
  token: string | null
  isLoading: boolean
  signOut: () => void
  updateAuth: (user: User, token: string) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    console.log('🔄 Auth Provider: Setting up auth state listener')
    
    // Set up Firebase auth state listener
    const unsubscribe = authManager.onAuthStateChanged((firebaseUser: User | null) => {
      console.log('🔐 Auth state changed:', firebaseUser ? 'User logged in' : 'User logged out')
      setUser(firebaseUser)
      setIsLoading(false)
      
      if (!firebaseUser) {
        setToken(null)
        localStorage.removeItem("auth_token")
      }
    })

    // Check for existing token on mount
    const initAuth = async () => {
      const storedToken = localStorage.getItem("auth_token")
      if (storedToken && !user) {
        setToken(storedToken)
      }
    }

    initAuth()

    return () => {
      console.log('🔄 Auth Provider: Cleaning up auth listener')
      unsubscribe()
    }
  }, [])

  const updateAuth = (newUser: User, newToken: string) => {
    console.log('✅ Auth Provider: Updating auth state', newUser.email)
    setUser(newUser)
    setToken(newToken)
    localStorage.setItem("auth_token", newToken)
  }

  const signOut = async () => {
    console.log('🚪 Auth Provider: Signing out')
    try {
      await authManager.signOut(token || undefined)
      setUser(null)
      setToken(null)
      localStorage.removeItem("auth_token")
    } catch (error) {
      console.error('❌ Sign out error:', error)
    }
  }

  return (
    <AuthContext.Provider value={{ user, token, isLoading, signOut, updateAuth }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
