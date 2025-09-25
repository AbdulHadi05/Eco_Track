import { firebaseDataStore } from './firebase-data-store'
import { dataStore } from './data-store'
import type { User, FeedbackForm, FeedbackResponse, Analytics } from './types'

// Configuration for data service
const USE_FIREBASE = process.env.NEXT_PUBLIC_USE_FIREBASE === 'true'

console.log('🔥 Data Service Config:', { USE_FIREBASE, env: process.env.NEXT_PUBLIC_USE_FIREBASE })

// Export the appropriate data store based on configuration
export const activeDataStore = USE_FIREBASE ? firebaseDataStore : dataStore

// Type-safe interface for data operations
export interface IDataStore {
  // User methods
  getUserById(id: string): Promise<User | null>
  getUserByEmail(email: string): Promise<User | null>
  createUser(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User>

  // Form methods
  getForms(userId?: string): Promise<FeedbackForm[]>
  getFormById(id: string): Promise<FeedbackForm | null>
  createForm(formData: Omit<FeedbackForm, 'id' | 'createdAt' | 'updatedAt' | 'embedCode'>): Promise<FeedbackForm>
  updateForm(id: string, updates: Partial<FeedbackForm>): Promise<FeedbackForm | null>
  deleteForm(id: string): Promise<boolean | void>

  // Response methods
  getResponses(formId?: string): Promise<FeedbackResponse[]>
  createResponse(responseData: Omit<FeedbackResponse, 'id' | 'createdAt'>): Promise<FeedbackResponse>

  // Analytics methods
  getAnalytics(formId: string): Promise<Analytics | null>
}

// Wrapper class that provides unified interface
class DataService implements IDataStore {
  private store = activeDataStore

  async getUserById(id: string): Promise<User | null> {
    try {
      return await this.store.getUserById(id)
    } catch (error) {
      console.error('Error in getUserById:', error)
      return null
    }
  }

  async getUserByEmail(email: string): Promise<User | null> {
    try {
      return await this.store.getUserByEmail(email)
    } catch (error) {
      console.error('Error in getUserByEmail:', error)
      return null
    }
  }

  async createUser(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    return await this.store.createUser(userData)
  }

  async getForms(userId?: string): Promise<FeedbackForm[]> {
    try {
      return await this.store.getForms(userId)
    } catch (error) {
      console.error('Error in getForms:', error)
      return []
    }
  }

  async getFormById(id: string): Promise<FeedbackForm | null> {
    try {
      return await this.store.getFormById(id)
    } catch (error) {
      console.error('Error in getFormById:', error)
      return null
    }
  }

  async createForm(formData: Omit<FeedbackForm, 'id' | 'createdAt' | 'updatedAt' | 'embedCode'>): Promise<FeedbackForm> {
    return await this.store.createForm(formData)
  }

  async updateForm(id: string, updates: Partial<FeedbackForm>): Promise<FeedbackForm | null> {
    return await this.store.updateForm(id, updates)
  }

  async deleteForm(id: string): Promise<boolean | void> {
    return await this.store.deleteForm(id)
  }

  async getResponses(formId?: string): Promise<FeedbackResponse[]> {
    try {
      return await this.store.getResponses(formId)
    } catch (error) {
      console.error('Error in getResponses:', error)
      return []
    }
  }

  async createResponse(responseData: Omit<FeedbackResponse, 'id' | 'createdAt'>): Promise<FeedbackResponse> {
    return await this.store.createResponse(responseData)
  }

  async getAnalytics(formId: string): Promise<Analytics | null> {
    try {
      return await this.store.getAnalytics(formId)
    } catch (error) {
      console.error('Error in getAnalytics:', error)
      return null
    }
  }

  // Utility method to check if using Firebase
  isUsingFirebase(): boolean {
    return USE_FIREBASE
  }
}

export const dataService = new DataService()

// For backward compatibility, also export individual stores
export { firebaseDataStore, dataStore }
