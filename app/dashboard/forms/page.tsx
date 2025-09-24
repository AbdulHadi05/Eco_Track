"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Plus, Eye, Edit, Copy, Trash2, ExternalLink } from "lucide-react"
import Link from "next/link"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { firebaseDataStore as dataStore } from "@/lib/firebase-data-store"
import type { FeedbackForm, FeedbackResponse } from "@/lib/types"

export default function FormsPage() {
  const [forms, setForms] = useState<FeedbackForm[]>([])
  const [responses, setResponses] = useState<FeedbackResponse[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const [formsData, responsesData] = await Promise.all([dataStore.getForms(), dataStore.getResponses()])
        setForms(formsData)
        setResponses(responsesData)
      } catch (error) {
        console.error("Failed to load forms:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  const handleDeleteForm = async (formId: string) => {
    if (confirm("Are you sure you want to delete this form? This action cannot be undone.")) {
      try {
        await dataStore.deleteForm(formId)
        setForms(forms.filter((form) => form.id !== formId))
        setResponses(responses.filter((response) => response.formId !== formId))
      } catch (error) {
        console.error("Failed to delete form:", error)
      }
    }
  }

  const handleToggleStatus = async (formId: string, isActive: boolean) => {
    try {
      await dataStore.updateForm(formId, { isActive })
      setForms(forms.map((form) => (form.id === formId ? { ...form, isActive } : form)))
    } catch (error) {
      console.error("Failed to update form status:", error)
    }
  }

  const copyEmbedCode = (embedCode: string) => {
    navigator.clipboard.writeText(embedCode)
    // In a real app, you'd show a toast notification here
    alert("Embed code copied to clipboard!")
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex h-full items-center justify-center">
          <div className="text-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading forms...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Forms</h1>
            <p className="text-muted-foreground">Manage your feedback forms</p>
          </div>
          <Link href="/dashboard/forms/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Form
            </Button>
          </Link>
        </div>

        {/* Forms Grid */}
        {forms.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-xl font-semibold mb-2">No forms yet</h3>
              <p className="text-muted-foreground mb-6">Create your first feedback form to get started</p>
              <Link href="/dashboard/forms/new">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Your First Form
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {forms.map((form) => {
              const formResponses = responses.filter((r) => r.formId === form.id)
              return (
                <Card key={form.id} className="relative">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{form.title}</CardTitle>
                        <CardDescription className="mt-1">{form.description || "No description"}</CardDescription>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/forms/${form.id}`} target="_blank">
                              <Eye className="mr-2 h-4 w-4" />
                              Preview
                              <ExternalLink className="ml-auto h-3 w-3" />
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/dashboard/forms/${form.id}/edit`}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => copyEmbedCode(form.embedCode)}>
                            <Copy className="mr-2 h-4 w-4" />
                            Copy Embed Code
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleToggleStatus(form.id, !form.isActive)}>
                            {form.isActive ? "Deactivate" : "Activate"}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDeleteForm(form.id)} className="text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Badge variant={form.isActive ? "default" : "secondary"}>
                          {form.isActive ? "Active" : "Inactive"}
                        </Badge>
                        <span className="text-sm text-muted-foreground">{form.fields.length} fields</span>
                      </div>

                      <div className="text-sm text-muted-foreground">
                        <p>{formResponses.length} responses</p>
                        <p>Created {new Date(form.createdAt).toLocaleDateString()}</p>
                      </div>

                      <div className="flex space-x-2">
                        <Link href={`/forms/${form.id}`} target="_blank" className="flex-1">
                          <Button variant="outline" size="sm" className="w-full bg-transparent">
                            <Eye className="mr-2 h-4 w-4" />
                            Preview
                          </Button>
                        </Link>
                        <Link href={`/dashboard/forms/${form.id}/edit`} className="flex-1">
                          <Button variant="outline" size="sm" className="w-full bg-transparent">
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
