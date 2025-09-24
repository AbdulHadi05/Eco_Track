// Firebase connection test utility
import { db } from './firebase'
import { collection, getDocs } from 'firebase/firestore'

export async function testFirebaseConnection() {
  try {
    console.log('🔥 Testing Firebase connection...')
    console.log('📊 Database instance:', db)
    
    // Try to read from a collection
    const testRef = collection(db, 'users')
    const snapshot = await getDocs(testRef)
    
    console.log('✅ Firebase connection successful!')
    console.log('📈 Users collection size:', snapshot.size)
    
    return true
  } catch (error) {
    console.error('❌ Firebase connection failed:', error)
    return false
  }
}