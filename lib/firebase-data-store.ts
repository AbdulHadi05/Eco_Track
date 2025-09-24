// Firebase Firestore Data Store
import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from './firebase'
import type { User, FeedbackForm, FeedbackResponse, Analytics } from './types'

// Collection names
const USERS_COLLECTION = 'users'
const FORMS_COLLECTION = 'forms'
const RESPONSES_COLLECTION = 'responses'

class FirebaseDataStore {
  // User methods
  async getUserById(id: string): Promise<User | null> {
    const userRef = doc(db, USERS_COLLECTION, id)
    const snapshot = await getDoc(userRef)
    
    if (!snapshot.exists()) return null
    
    return {
      id: snapshot.id,
      ...snapshot.data(),
      createdAt: snapshot.data().createdAt?.toDate() || new Date(),
      updatedAt: snapshot.data().updatedAt?.toDate() || new Date(),
    } as User
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const usersRef = collection(db, USERS_COLLECTION)
    const q = query(usersRef, where('email', '==', email))
    const snapshot = await getDocs(q)
    
    if (snapshot.empty) return null
    
    const doc = snapshot.docs[0]
    return {
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date(),
    } as User
  }

  async createUser(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    const userRef = await addDoc(collection(db, USERS_COLLECTION), {
      ...userData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })

    const newUser = await this.getUserById(userRef.id)
    return newUser!
  }

  // Form methods
  async getForms(userId?: string): Promise<FeedbackForm[]> {
    const formsRef = collection(db, FORMS_COLLECTION)
    let q = query(formsRef, orderBy('createdAt', 'desc'))
    
    if (userId) {
      q = query(formsRef, where('userId', '==', userId), orderBy('createdAt', 'desc'))
    }

    const snapshot = await getDocs(q)
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date(),
    })) as FeedbackForm[]
  }

  async getFormById(id: string): Promise<FeedbackForm | null> {
    const formRef = doc(db, FORMS_COLLECTION, id)
    const snapshot = await getDoc(formRef)
    
    if (!snapshot.exists()) return null
    
    return {
      id: snapshot.id,
      ...snapshot.data(),
      createdAt: snapshot.data().createdAt?.toDate() || new Date(),
      updatedAt: snapshot.data().updatedAt?.toDate() || new Date(),
    } as FeedbackForm
  }

  async createForm(formData: Omit<FeedbackForm, 'id' | 'createdAt' | 'updatedAt' | 'embedCode'>): Promise<FeedbackForm> {
    // Generate embed code automatically
    const tempId = Date.now().toString()
    const embedCode = `<iframe src="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/forms/${tempId}" width="100%" height="600" frameborder="0"></iframe>`
    
    const formRef = await addDoc(collection(db, FORMS_COLLECTION), {
      ...formData,
      embedCode,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })

    // Update embed code with real form ID
    const realEmbedCode = `<iframe src="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/forms/${formRef.id}" width="100%" height="600" frameborder="0"></iframe>`
    await updateDoc(formRef, { embedCode: realEmbedCode })

    const newForm = await this.getFormById(formRef.id)
    return newForm!
  }

  async updateForm(id: string, updates: Partial<FeedbackForm>): Promise<FeedbackForm | null> {
    const formRef = doc(db, FORMS_COLLECTION, id)
    
    await updateDoc(formRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    })

    return this.getFormById(id)
  }

  async deleteForm(id: string): Promise<void> {
    console.log('🔥 Firebase deleteForm called for:', id)
    
    // Check authentication first
    const { auth } = await import('./firebase')
    if (!auth.currentUser) {
      console.error('❌ No authenticated user for delete operation')
      throw new Error('User must be authenticated to delete forms')
    }
    
    console.log('✅ Authenticated user:', auth.currentUser.uid)
    
    try {
      const formRef = doc(db, FORMS_COLLECTION, id)
      console.log('🗑️ Attempting to delete form document:', formRef.path)
      
      await deleteDoc(formRef)
      console.log('✅ Form document deleted successfully')

      // Also delete associated responses
      console.log('🔍 Looking for associated responses...')
      const responsesRef = collection(db, RESPONSES_COLLECTION)
      const q = query(responsesRef, where('formId', '==', id))
      const snapshot = await getDocs(q)
      
      console.log(`📊 Found ${snapshot.docs.length} responses to delete`)
      
      if (snapshot.docs.length > 0) {
        const deletePromises = snapshot.docs.map((doc) => {
          console.log('🗑️ Deleting response:', doc.id)
          return deleteDoc(doc.ref)
        })
        await Promise.all(deletePromises)
        console.log('✅ All associated responses deleted')
      }
      
      console.log('🎉 Form deletion completed successfully')
    } catch (error) {
      console.error('❌ Firebase delete error:', error)
      throw error
    }
  }

  // Response methods
  async getResponses(formId?: string): Promise<FeedbackResponse[]> {
    const responsesRef = collection(db, RESPONSES_COLLECTION)
    let q = query(responsesRef, orderBy('createdAt', 'desc'))
    
    if (formId) {
      q = query(responsesRef, where('formId', '==', formId), orderBy('createdAt', 'desc'))
    }

    const snapshot = await getDocs(q)
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
    })) as FeedbackResponse[]
  }

  async createResponse(responseData: Omit<FeedbackResponse, 'id' | 'createdAt'>): Promise<FeedbackResponse> {
    console.log('📝 Firebase createResponse called for form:', responseData.formId)
    
    try {
      console.log('🚀 Attempting to create response document...')
      const responseRef = await addDoc(collection(db, RESPONSES_COLLECTION), {
        ...responseData,
        createdAt: serverTimestamp(),
      })
      console.log('✅ Response document created with ID:', responseRef.id)

      const responseDoc = await getDoc(responseRef)
      const result = {
        id: responseDoc.id,
        ...responseDoc.data(),
        createdAt: responseDoc.data()!.createdAt?.toDate() || new Date(),
      } as FeedbackResponse
      
      console.log('🎉 Response creation completed successfully')
      return result
    } catch (error) {
      console.error('❌ Firebase createResponse error:', error)
      
      if (error instanceof Error && error.message.includes('permissions')) {
        console.error('❌ Permissions error - check Firebase security rules')
        throw new Error('Unable to submit form response. Please check if the form is still active.')
      }
      
      throw error
    }
  }

  async getResponseById(id: string): Promise<FeedbackResponse | null> {
    const responseRef = doc(db, RESPONSES_COLLECTION, id)
    const snapshot = await getDoc(responseRef)
    
    if (!snapshot.exists()) return null
    
    return {
      id: snapshot.id,
      ...snapshot.data(),
      createdAt: snapshot.data().createdAt?.toDate() || new Date(),
    } as FeedbackResponse
  }

  async deleteResponse(id: string): Promise<void> {
    const responseRef = doc(db, RESPONSES_COLLECTION, id)
    await deleteDoc(responseRef)
  }

  // Analytics methods
  async getAnalytics(formId: string): Promise<Analytics> {
    console.log('📊 Calculating comprehensive analytics for form:', formId)
    
    try {
      // Get form and responses
      const form = await this.getFormById(formId)
      const responses = await this.getResponses(formId)
      
      if (!form) {
        throw new Error('Form not found')
      }
      
      console.log(`📈 Processing ${responses.length} responses for analytics`)
      
      // Basic metrics
      const totalResponses = responses.length
      const formViews = 100 + totalResponses * 3 // Mock form views (would track in real app)
      const responseRate = formViews > 0 ? (totalResponses / formViews) * 100 : 0
      
      // Rating analysis
      const ratingFields = form.fields.filter(field => field.type === 'rating')
      const ratingResponses = responses
        .flatMap(response => 
          ratingFields.map(field => response.responses[field.id])
        )
        .filter(rating => typeof rating === 'number' && rating >= 1 && rating <= 5)
      
      const averageRating = ratingResponses.length > 0 
        ? ratingResponses.reduce((sum, rating) => sum + rating, 0) / ratingResponses.length 
        : undefined
      
      // Text feedback extraction
      const textFields = form.fields.filter(field => field.type === 'textarea' || field.type === 'text')
      const topFeedback = responses
        .flatMap(response => 
          textFields.map(field => response.responses[field.id])
        )
        .filter(text => typeof text === 'string' && text.trim().length > 10)
        .slice(0, 10)
      
      // Time-based analytics
      const now = new Date()
      const thirtyDaysAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000))
      const sevenDaysAgo = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000))
      
      // Responses by date (last 30 days)
      const dateMap = new Map<string, number>()
      for (let d = new Date(thirtyDaysAgo); d <= now; d.setDate(d.getDate() + 1)) {
        dateMap.set(d.toISOString().split('T')[0], 0)
      }
      
      responses.forEach(response => {
        const date = response.createdAt.toISOString().split('T')[0]
        if (dateMap.has(date)) {
          dateMap.set(date, (dateMap.get(date) || 0) + 1)
        }
      })
      
      const responsesByDate = Array.from(dateMap.entries())
        .map(([date, count]) => ({ date, count }))
        .sort((a, b) => a.date.localeCompare(b.date))
      
      // Responses by hour (0-23)
      const hourMap = new Map<number, number>()
      for (let i = 0; i < 24; i++) {
        hourMap.set(i, 0)
      }
      
      responses.forEach(response => {
        const hour = response.createdAt.getHours()
        hourMap.set(hour, (hourMap.get(hour) || 0) + 1)
      })
      
      const responsesByHour = Array.from(hourMap.entries())
        .map(([hour, count]) => ({ hour, count }))
      
      // Responses by day of week
      const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
      const dayMap = new Map<string, number>()
      dayNames.forEach(day => dayMap.set(day, 0))
      
      responses.forEach(response => {
        const dayName = dayNames[response.createdAt.getDay()]
        dayMap.set(dayName, (dayMap.get(dayName) || 0) + 1)
      })
      
      const responsesByDayOfWeek = Array.from(dayMap.entries())
        .map(([day, count]) => ({ day, count }))
      
      // Responses by month (last 12 months)
      const monthMap = new Map<string, number>()
      for (let i = 11; i >= 0; i--) {
        const date = new Date()
        date.setMonth(date.getMonth() - i)
        const monthKey = date.toISOString().slice(0, 7) // YYYY-MM
        monthMap.set(monthKey, 0)
      }
      
      responses.forEach(response => {
        const monthKey = response.createdAt.toISOString().slice(0, 7)
        if (monthMap.has(monthKey)) {
          monthMap.set(monthKey, (monthMap.get(monthKey) || 0) + 1)
        }
      })
      
      const responsesByMonth = Array.from(monthMap.entries())
        .map(([month, count]) => ({ month, count }))
        .sort((a, b) => a.month.localeCompare(b.month))
      
      // Field-specific analytics
      const fieldAnalytics = form.fields.map(field => {
        const fieldResponses = responses
          .map(response => response.responses[field.id])
          .filter(value => value !== undefined && value !== null && value !== '')
        
        // Response distribution
        const distributionMap = new Map<any, number>()
        fieldResponses.forEach(value => {
          const key = JSON.stringify(value)
          distributionMap.set(key, (distributionMap.get(key) || 0) + 1)
        })
        
        const responseDistribution = Array.from(distributionMap.entries())
          .map(([value, count]) => ({ value: JSON.parse(value), count }))
          .sort((a, b) => b.count - a.count)
        
        // Most common response
        const mostCommonResponse = responseDistribution.length > 0 ? responseDistribution[0].value : undefined
        
        // Average value for numeric fields
        const numericResponses = fieldResponses.filter(value => typeof value === 'number')
        const averageValue = numericResponses.length > 0 
          ? numericResponses.reduce((sum, value) => sum + value, 0) / numericResponses.length
          : undefined
        
        return {
          fieldId: field.id,
          fieldLabel: field.label,
          fieldType: field.type,
          responses: fieldResponses,
          mostCommonResponse,
          averageValue,
          responseDistribution: responseDistribution.slice(0, 10) // Top 10
        }
      })
      
      // Completion rate (responses with all required fields)
      const requiredFields = form.fields.filter(field => field.required)
      const completeResponses = responses.filter(response => 
        requiredFields.every(field => {
          const value = response.responses[field.id]
          return value !== undefined && value !== null && value !== ''
        })
      )
      const completionRate = totalResponses > 0 ? (completeResponses.length / totalResponses) * 100 : 0
      
      // Device analytics (mock data - would need real user agent parsing)
      const deviceAnalytics = {
        desktop: Math.floor(totalResponses * 0.6),
        mobile: Math.floor(totalResponses * 0.3),
        tablet: Math.floor(totalResponses * 0.08),
        unknown: Math.floor(totalResponses * 0.02)
      }
      
      // Sentiment analysis (basic keyword-based)
      const sentimentKeywords = {
        positive: ['good', 'great', 'excellent', 'amazing', 'love', 'perfect', 'wonderful', 'fantastic'],
        negative: ['bad', 'terrible', 'awful', 'hate', 'horrible', 'worst', 'disappointing']
      }
      
      const textResponses = responses
        .flatMap(response => 
          textFields.map(field => response.responses[field.id])
        )
        .filter(text => typeof text === 'string')
        .map(text => text.toLowerCase())
      
      let positive = 0, negative = 0, neutral = 0
      
      textResponses.forEach(text => {
        const hasPositive = sentimentKeywords.positive.some(keyword => text.includes(keyword))
        const hasNegative = sentimentKeywords.negative.some(keyword => text.includes(keyword))
        
        if (hasPositive && !hasNegative) positive++
        else if (hasNegative && !hasPositive) negative++
        else neutral++
      })
      
      const sentimentAnalysis = textResponses.length > 0 ? { positive, neutral, negative } : undefined
      
      // Trends (compare last 7 days to previous 7 days)
      const recentResponses = responses.filter(r => r.createdAt >= sevenDaysAgo)
      const previousWeekStart = new Date(sevenDaysAgo.getTime() - (7 * 24 * 60 * 60 * 1000))
      const previousResponses = responses.filter(r => 
        r.createdAt >= previousWeekStart && r.createdAt < sevenDaysAgo
      )
      
      const responseGrowth = previousResponses.length > 0 
        ? ((recentResponses.length - previousResponses.length) / previousResponses.length) * 100
        : recentResponses.length > 0 ? 100 : 0
      
      // Rating trend
      const recentRatings = recentResponses
        .flatMap(response => ratingFields.map(field => response.responses[field.id]))
        .filter(rating => typeof rating === 'number')
      const previousRatings = previousResponses
        .flatMap(response => ratingFields.map(field => response.responses[field.id]))
        .filter(rating => typeof rating === 'number')
      
      const recentAvgRating = recentRatings.length > 0 
        ? recentRatings.reduce((sum, rating) => sum + rating, 0) / recentRatings.length : 0
      const previousAvgRating = previousRatings.length > 0 
        ? previousRatings.reduce((sum, rating) => sum + rating, 0) / previousRatings.length : 0
      
      const ratingTrend = previousAvgRating > 0 ? recentAvgRating - previousAvgRating : 0
      
      const trends = {
        responseGrowth: Math.round(responseGrowth * 100) / 100,
        ratingTrend: Math.round(ratingTrend * 100) / 100,
        popularityTrend: Math.round(responseRate * 100) / 100
      }
      
      const analyticsResult: Analytics = {
        totalResponses,
        responseRate: Math.round(responseRate * 100) / 100,
        averageRating: averageRating ? Math.round(averageRating * 100) / 100 : undefined,
        topFeedback,
        responsesByDate,
        responsesByHour,
        responsesByDayOfWeek,
        responsesByMonth,
        fieldAnalytics,
        completionRate: Math.round(completionRate * 100) / 100,
        averageCompletionTime: undefined, // Would need to track form start/end times
        deviceAnalytics,
        sentimentAnalysis,
        trends
      }
      
      console.log('✅ Analytics calculation completed:', {
        totalResponses,
        responseRate: analyticsResult.responseRate,
        averageRating,
        trendsCalculated: trends
      })
      
      return analyticsResult
      
    } catch (error) {
      console.error('❌ Error calculating analytics:', error)
      throw error
    }
  }
}

export const firebaseDataStore = new FirebaseDataStore()
