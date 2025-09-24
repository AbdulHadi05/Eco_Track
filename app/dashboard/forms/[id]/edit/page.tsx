"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { FormBuilder } from "@/components/forms/form-builder"
import { firebaseDataStore as dataStore } from "@/lib/firebase-data-store"
import type { FeedbackForm } from "@/lib/types"

interface EditFormPageProps {
  params: { id: string }
}

export default function EditFormPage({ params }: EditFormPageProps) {
  const [form, setForm] = useState<FeedbackForm | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const loadForm = async () => {
      try {
        const formData = await dataStore.getFormById(params.id)
        setForm(formData)
      } catch (error) {
        console.error("Failed to load form:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadForm()
  }, [params.id])

  const handleSave = async (formData: any) => {
    try {
      await dataStore.updateForm(params.id, formData)
      router.push("/dashboard/forms")
    } catch (error) {
      console.error("Failed to update form:", error)
    }
  }

  const handleCancel = () => {
    router.push("/dashboard/forms")
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex h-full items-center justify-center">
          <div className="text-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading form...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (!form) {
    return (
      <DashboardLayout>
        <div className="flex h-full items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Form not found</h2>
            <p className="text-muted-foreground">The form you're looking for doesn't exist.</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <FormBuilder form={form} onSave={handleSave} onCancel={handleCancel} />
    </DashboardLayout>
  )
}
