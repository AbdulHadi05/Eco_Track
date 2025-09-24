export interface User {
  id: string
  email: string
  name: string
  role: "admin" | "user"
  createdAt: Date
  updatedAt: Date
}

export interface FeedbackForm {
  id: string
  userId: string
  title: string
  description: string
  fields: FormField[]
  isActive: boolean
  embedCode: string
  createdAt: Date
  updatedAt: Date
}

export interface FormField {
  id: string
  type: "text" | "textarea" | "rating" | "select" | "checkbox"
  label: string
  placeholder?: string
  required: boolean
  options?: string[] // for select and checkbox fields
  order: number
}

export interface FeedbackResponse {
  id: string
  formId: string
  responses: Record<string, any>
  userAgent?: string
  ipAddress?: string
  createdAt: Date
}

export interface Analytics {
  totalResponses: number
  responseRate: number
  averageRating?: number
  topFeedback: string[]
  responsesByDate: { date: string; count: number }[]
  ratingDistribution?: { rating: number; count: number }[]
}

export interface TeamMember {
  id: string
  userId: string
  organizationId: string
  role: "owner" | "admin" | "member"
  status: "active" | "pending" | "suspended"
  invitedBy: string
  joinedAt: Date
  invitedAt: Date
}

export interface Organization {
  id: string
  name: string
  slug: string
  ownerId: string
  plan: "starter" | "professional" | "enterprise"
  billingCycle: "monthly" | "annual"
  subscriptionStatus: "active" | "canceled" | "past_due"
  createdAt: Date
  updatedAt: Date
}

export interface Subscription {
  id: string
  organizationId: string
  plan: string
  status: "active" | "canceled" | "past_due"
  currentPeriodStart: Date
  currentPeriodEnd: Date
  cancelAtPeriodEnd: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Usage {
  organizationId: string
  period: string
  formsCreated: number
  responsesReceived: number
  storageUsed: number
  apiCalls: number
  updatedAt: Date
}

export interface Integration {
  id: string
  organizationId: string
  type: "webhook" | "zapier" | "slack" | "email"
  name: string
  config: Record<string, any>
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Notification {
  id: string
  userId: string
  type: "info" | "success" | "warning" | "error"
  title: string
  message: string
  isRead: boolean
  createdAt: Date
}

export interface FormTemplate {
  id: string
  name: string
  description: string
  category: string
  fields: FormField[]
  previewImage?: string
  isPopular: boolean
  createdAt: Date
}
