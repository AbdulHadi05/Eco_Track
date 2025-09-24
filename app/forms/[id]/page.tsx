import { notFound } from "next/navigation"
import { FeedbackForm } from "@/components/forms/feedback-form"
import { firebaseDataStore as dataStore } from "@/lib/firebase-data-store"

interface FormPageProps {
  params: { id: string }
}

export default async function FormPage({ params }: FormPageProps) {
  const form = await dataStore.getFormById(params.id)

  if (!form || !form.isActive) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <FeedbackForm form={form} />
      </div>
    </div>
  )
}
