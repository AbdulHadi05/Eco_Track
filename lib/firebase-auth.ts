// Firebase Authentication Manager
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth'
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db } from './firebase'
import type { User } from './types'
import type { AuthSession } from './auth'

class FirebaseAuthManager {
  async signIn(email: string, password: string): Promise<AuthSession | null> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const firebaseUser = userCredential.user
      
      // Get user profile from Firestore
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid))
      const userData = userDoc.data() as User
      
      return {
        token: await firebaseUser.getIdToken(),
        user: {
          id: firebaseUser.uid,
          email: firebaseUser.email!,
          name: userData?.name || firebaseUser.displayName || 'User',
          role: userData?.role || 'user',
          createdAt: userData?.createdAt || new Date(),
          updatedAt: new Date(),
        },
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      }
    } catch (error: any) {
      console.error('Sign in error:', error)
      throw new Error(this.getErrorMessage(error.code))
    }
  }

  async signUp(email: string, password: string, name: string): Promise<AuthSession | null> {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const firebaseUser = userCredential.user
      
      // Create user profile in Firestore with serverTimestamp
      const userData = {
        id: firebaseUser.uid,
        email: firebaseUser.email!,
        name,
        role: 'user',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }
      
      await setDoc(doc(db, 'users', firebaseUser.uid), userData)
      
      return {
        token: await firebaseUser.getIdToken(),
        user: {
          id: firebaseUser.uid,
          email: firebaseUser.email!,
          name,
          role: 'user' as const,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      }
    } catch (error: any) {
      console.error('Sign up error:', error)
      throw new Error(this.getErrorMessage(error.code))
    }
  }

  async signOut(token?: string): Promise<void> {
    // Firebase handles signOut automatically, token parameter is for compatibility with mock auth
    await signOut(auth)
  }

  onAuthStateChanged(callback: (user: User | null) => void): () => void {
    return onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid))
          const userData = userDoc.data() as User
          
          callback({
            id: firebaseUser.uid,
            email: firebaseUser.email!,
            name: userData?.name || firebaseUser.displayName || 'User',
            role: userData?.role || 'user',
            createdAt: userData?.createdAt || new Date(),
            updatedAt: new Date(),
          })
        } catch (error) {
          console.error('Error fetching user data:', error)
          callback(null)
        }
      } else {
        callback(null)
      }
    })
  }

  private getErrorMessage(errorCode: string): string {
    switch (errorCode) {
      case 'auth/user-not-found':
        return 'No account found with this email address.'
      case 'auth/wrong-password':
        return 'Incorrect password.'
      case 'auth/email-already-in-use':
        return 'An account with this email already exists.'
      case 'auth/weak-password':
        return 'Password should be at least 6 characters.'
      case 'auth/invalid-email':
        return 'Invalid email address.'
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Please try again later.'
      default:
        return 'An error occurred. Please try again.'
    }
  }
}

export const firebaseAuthManager = new FirebaseAuthManager()
