// Configuration to switch between mock and Firebase data stores
import { firebaseDataStore } from './firebase-data-store'
import { firebaseAuthManager } from './firebase-auth'

// Import the original mock stores for fallback
import { dataStore as mockDataStore } from './data-store'
import { authManager as mockAuthManager } from './auth'

// Configuration flag - set to true to use Firebase, false for mock
const USE_FIREBASE = process.env.NEXT_PUBLIC_USE_FIREBASE === 'true'

console.log('🔥 Data Service Config:', { USE_FIREBASE, env: process.env.NEXT_PUBLIC_USE_FIREBASE })

// Export the appropriate data store and auth manager based on configuration
export const dataStore = USE_FIREBASE ? firebaseDataStore : mockDataStore
export const authManager = USE_FIREBASE ? firebaseAuthManager : mockAuthManager

// Export type for consistency
export type { AuthSession } from './auth'
