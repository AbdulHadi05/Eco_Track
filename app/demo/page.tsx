"use client"

import { FeedbackForm } from "@/components/forms/feedback-form"
import type { FeedbackForm as FeedbackFormType } from "@/lib/types"

const demoForm: FeedbackFormType = {
  id: "demo",
  userId: "demo",
  title: "Product Feedback Survey",
  description: "Help us improve our product by sharing your thoughts and experiences.",
  fields: [
    {
      id: "1",
      type: "rating",
      label: "How would you rate our product overall?",
      required: true,
      order: 1,
    },
    {
      id: "2",
      type: "select",
      label: "Which feature do you use most?",
      required: true,
      options: ["Dashboard", "Analytics", "Form Builder", "Integrations"],
      order: 2,
    },
    {
      id: "3",
      type: "textarea",
      label: "What improvements would you like to see?",
      placeholder: "Share your suggestions...",
      required: false,
      order: 3,
    },
    {
      id: "4",
      type: "checkbox",
      label: "Which topics interest you? (Select all that apply)",
      required: false,
      options: ["Product Updates", "New Features", "Best Practices", "Case Studies"],
      order: 4,
    },
  ],
  isActive: true,
  embedCode: "",
  createdAt: new Date(),
  updatedAt: new Date(),
}

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Interactive Demo</h1>
          <p className="text-muted-foreground">
            Try out our feedback form builder - this is what your customers will see
          </p>
        </div>
        <FeedbackForm
          form={demoForm}
          onSubmit={() => {
            alert("Demo submission! In the real app, this would be saved to your dashboard.")
          }}
        />
      </div>
    </div>
  )
}
