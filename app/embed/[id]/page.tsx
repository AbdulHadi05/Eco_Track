import { notFound } from "next/navigation"
import { FeedbackForm } from "@/components/forms/feedback-form"
import { firebaseDataStore as dataStore } from "@/lib/firebase-data-store"

interface EmbedPageProps {
  params: { id: string }
}

export default async function EmbedPage({ params }: EmbedPageProps) {
  const form = await dataStore.getFormById(params.id)

  if (!form || !form.isActive) {
    notFound()
  }

  return (
    <div className="p-4">
      <FeedbackForm form={form} embedded />
    </div>
  )
}
