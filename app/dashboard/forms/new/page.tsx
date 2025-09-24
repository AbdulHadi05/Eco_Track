"use client"

import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { FormBuilder } from "@/components/forms/form-builder"
import { firebaseDataStore as dataStore } from "@/lib/firebase-data-store"

export default function NewFormPage() {
  const router = useRouter()

  const handleSave = async (formData: any) => {
    try {
      const newForm = await dataStore.createForm(formData)
      router.push(`/dashboard/forms`)
    } catch (error) {
      console.error("Failed to create form:", error)
    }
  }

  const handleCancel = () => {
    router.push("/dashboard/forms")
  }

  return (
    <DashboardLayout>
      <FormBuilder onSave={handleSave} onCancel={handleCancel} />
    </DashboardLayout>
  )
}
