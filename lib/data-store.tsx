import type { User, FeedbackForm, FeedbackResponse } from "./types"

// Mock data store - in production this would be replaced with actual database calls
class DataStore {
  private users: User[] = [
    {
      id: "1",
      email: "admin@example.com",
      name: "Admin User",
      role: "admin",
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-01-01"),
    },
  ]

  private forms: FeedbackForm[] = []

  private responses: FeedbackResponse[] = []

  constructor() {
    // Initialize with a sample form for demonstration
    this.initializeSampleData()
  }

  private async initializeSampleData() {
    // Create a sample form
    const sampleForm: FeedbackForm = {
      id: "sample-1",
      userId: "1",
      title: "Product Feedback Survey",
      description: "Help us improve our product with your valuable feedback",
      fields: [
        {
          id: "rating-field",
          type: "rating",
          label: "How would you rate our product?",
          required: true,
          order: 1,
        },
        {
          id: "feedback-field",
          type: "textarea",
          label: "What can we improve?",
          placeholder: "Share your thoughts and suggestions...",
          required: false,
          order: 2,
        },
      ],
      isActive: true,
      embedCode: '<iframe src="/embed/sample-1" width="100%" height="400"></iframe>',
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    this.forms.push(sampleForm)
    
    // Create sample responses for this form
    const sampleResponseData = [
      { rating: 5, text: "Excellent product! Love the new features.", days: 6 },
      { rating: 4, text: "Good overall, but could use better documentation", days: 5 },
      { rating: 5, text: "Outstanding quality and customer support", days: 4 },
      { rating: 3, text: "Average experience, some bugs need fixing", days: 3 },
      { rating: 4, text: "Great product, minor UI improvements needed", days: 2 },
      { rating: 5, text: "Perfect! Exceeds all my expectations", days: 1 },
      { rating: 2, text: "Not satisfied, needs major improvements", days: 0 },
    ]

    sampleResponseData.forEach((data, index) => {
      const response: FeedbackResponse = {
        id: `sample-response-${index + 1}`,
        formId: "sample-1",
        responses: {
          "rating-field": data.rating,
          "feedback-field": data.text,
        },
        createdAt: new Date(Date.now() - data.days * 24 * 60 * 60 * 1000),
      }
      this.responses.push(response)
    })
  }

  // User methods
  async getUsers(): Promise<User[]> {
    return [...this.users]
  }

  async getUserById(id: string): Promise<User | null> {
    return this.users.find((user) => user.id === id) || null
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return this.users.find((user) => user.email === email) || null
  }

  async createUser(userData: Omit<User, "id" | "createdAt" | "updatedAt">): Promise<User> {
    const user: User = {
      ...userData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    this.users.push(user)
    return user
  }

  // Form methods
  async getForms(userId?: string): Promise<FeedbackForm[]> {
    if (userId) {
      return this.forms.filter((form) => form.userId === userId)
    }
    return [...this.forms]
  }

  async getFormById(id: string): Promise<FeedbackForm | null> {
    return this.forms.find((form) => form.id === id) || null
  }

  async createForm(
    formData: Omit<FeedbackForm, "id" | "createdAt" | "updatedAt" | "embedCode">,
  ): Promise<FeedbackForm> {
    const form: FeedbackForm = {
      ...formData,
      id: Date.now().toString(),
      embedCode: `<iframe src="/embed/${Date.now()}" width="100%" height="400"></iframe>`,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    this.forms.push(form)
    
    // Create sample responses for demo purposes if the form has rating or text fields
    const hasRatingOrText = form.fields.some(field => 
      field.type === 'rating' || field.type === 'textarea' || field.type === 'text'
    )
    
    if (hasRatingOrText) {
      await this.createSampleResponses(form.id)
    }
    
    return form
  }

  async updateForm(id: string, updates: Partial<FeedbackForm>): Promise<FeedbackForm | null> {
    const formIndex = this.forms.findIndex((form) => form.id === id)
    if (formIndex === -1) return null

    this.forms[formIndex] = {
      ...this.forms[formIndex],
      ...updates,
      updatedAt: new Date(),
    }
    return this.forms[formIndex]
  }

  async deleteForm(id: string): Promise<boolean> {
    const formIndex = this.forms.findIndex((form) => form.id === id)
    if (formIndex === -1) return false

    this.forms.splice(formIndex, 1)
    // Also delete associated responses
    this.responses = this.responses.filter((response) => response.formId !== id)
    return true
  }

  // Response methods
  async getResponses(formId?: string): Promise<FeedbackResponse[]> {
    if (formId) {
      return this.responses.filter((response) => response.formId === formId)
    }
    return [...this.responses]
  }

  async createResponse(responseData: Omit<FeedbackResponse, "id" | "createdAt">): Promise<FeedbackResponse> {
    const response: FeedbackResponse = {
      ...responseData,
      id: Date.now().toString(),
      createdAt: new Date(),
    }
    this.responses.push(response)
    return response
  }

  // Helper method to create sample responses for demo purposes
  async createSampleResponses(formId: string): Promise<void> {
    const form = await this.getFormById(formId)
    if (!form) return

    const ratingField = form.fields.find(field => field.type === 'rating')
    const textField = form.fields.find(field => field.type === 'textarea' || field.type === 'text')

    const sampleTexts = [
      "Great experience overall!",
      "Could use some improvements",
      "Excellent service, very satisfied",
      "Average experience, room for growth",
      "Outstanding quality and support",
      "Good but could be faster",
      "Really impressed with the service"
    ]

    const sampleResponses = [
      { rating: 5, days: 6 },
      { rating: 4, days: 5 },
      { rating: 5, days: 4 },
      { rating: 3, days: 3 },
      { rating: 4, days: 2 },
      { rating: 5, days: 1 },
      { rating: 2, days: 0 },
    ]

    for (let i = 0; i < sampleResponses.length; i++) {
      const responseData: Record<string, any> = {}
      
      if (ratingField) {
        responseData[ratingField.id] = sampleResponses[i].rating
      }
      
      if (textField) {
        responseData[textField.id] = sampleTexts[i]
      }

      const response: FeedbackResponse = {
        id: (Date.now() + i).toString(),
        formId,
        responses: responseData,
        createdAt: new Date(Date.now() - sampleResponses[i].days * 24 * 60 * 60 * 1000),
      }
      
      this.responses.push(response)
    }
  }

  // Analytics methods
  async getAnalytics(formId: string) {
    const responses = await this.getResponses(formId)
    const form = await this.getFormById(formId)

    if (!form) return null

    const totalResponses = responses.length
    const ratingField = form.fields.find((field) => field.type === "rating")

    let averageRating: number | undefined
    let ratingDistribution: { rating: number; count: number }[] = []
    
    if (ratingField) {
      const ratings = responses
        .map((r) => r.responses[ratingField.id])
        .filter((rating) => typeof rating === "number") as number[]

      if (ratings.length > 0) {
        averageRating = ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length

        // Calculate rating distribution
        const ratingCounts = ratings.reduce((acc, rating) => {
          acc[rating] = (acc[rating] || 0) + 1
          return acc
        }, {} as Record<number, number>)

        ratingDistribution = [1, 2, 3, 4, 5].map(rating => ({
          rating,
          count: ratingCounts[rating] || 0
        }))
      }
    }

    // Group responses by date and fill gaps for better visualization
    const responsesByDateMap = responses.reduce(
      (acc, response) => {
        const date = response.createdAt.toISOString().split("T")[0]
        acc[date] = (acc[date] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    // Create a 7-day range ending today for consistent visualization
    const responsesByDateArray: { date: string; count: number }[] = []
    const today = new Date()
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const dateString = date.toISOString().split("T")[0]
      
      responsesByDateArray.push({
        date: dateString,
        count: responsesByDateMap[dateString] || 0,
      })
    }

    // Calculate response rate
    // Note: For a production app, you would track form views/impressions
    // and calculate this as totalResponses / totalFormViews
    // For now, showing 100% completion rate for responses received
    const responseRate = totalResponses > 0 ? 1.0 : 0

    return {
      totalResponses,
      responseRate,
      averageRating,
      ratingDistribution,
      topFeedback: responses
        .flatMap((r) => Object.values(r.responses))
        .filter((val) => typeof val === "string")
        .slice(0, 5) as string[],
      responsesByDate: responsesByDateArray,
    }
  }
}

export const dataStore = new DataStore()
