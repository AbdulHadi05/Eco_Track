import type { User } from "./types"
import { dataStore } from "./data-store"

export interface AuthSession {
  user: User
  token: string
  expiresAt: Date
}

class AuthManager {
  private sessions: Map<string, AuthSession> = new Map()

  async signIn(email: string, password: string): Promise<AuthSession | null> {
    // Mock authentication - in production this would verify against hashed passwords
    const user = await dataStore.getUserByEmail(email)

    if (!user) return null

    // For demo purposes, accept any password for existing users
    const token = this.generateToken()
    const session: AuthSession = {
      user,
      token,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    }

    this.sessions.set(token, session)
    return session
  }

  async signUp(email: string, password: string, name: string): Promise<AuthSession | null> {
    // Check if user already exists
    const existingUser = await dataStore.getUserByEmail(email)
    if (existingUser) return null

    // Create new user
    const user = await dataStore.createUser({
      email,
      name,
      role: "user",
    })

    const token = this.generateToken()
    const session: AuthSession = {
      user,
      token,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    }

    this.sessions.set(token, session)
    return session
  }

  async getSession(token: string): Promise<AuthSession | null> {
    const session = this.sessions.get(token)

    if (!session || session.expiresAt < new Date()) {
      if (session) this.sessions.delete(token)
      return null
    }

    return session
  }

  async signOut(token?: string): Promise<void> {
    if (token) {
      this.sessions.delete(token)
    }
  }

  // Mock implementation for Firebase compatibility
  onAuthStateChanged(callback: (user: User | null) => void): () => void {
    // In mock mode, we don't have persistent auth state
    // Just call with null initially
    setTimeout(() => callback(null), 0)
    return () => {} // Return empty unsubscribe function
  }

  private generateToken(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36)
  }
}

export const authManager = new AuthManager()
