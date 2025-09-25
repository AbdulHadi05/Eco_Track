"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Download, Filter } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { AnalyticsCharts } from "@/components/analytics/analytics-charts"
import { dataService } from "@/lib/data-service"
import type { FeedbackForm, Analytics } from "@/lib/types"

export default function AnalyticsPage() {
  const [forms, setForms] = useState<FeedbackForm[]>([])
  const [selectedFormId, setSelectedFormId] = useState<string>("")
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadForms = async () => {
      try {
        const formsData = await dataService.getForms()
        setForms(formsData)
        if (formsData.length > 0) {
          setSelectedFormId(formsData[0].id)
        }
      } catch (error) {
        console.error("Failed to load forms:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadForms()
  }, [])

  useEffect(() => {
    const loadAnalytics = async () => {
      if (!selectedFormId) return

      try {
        const analyticsData = await dataService.getAnalytics(selectedFormId)
        setAnalytics(analyticsData)
      } catch (error) {
        console.error("Failed to load analytics:", error)
      }
    }

    loadAnalytics()
  }, [selectedFormId])

  const selectedForm = forms.find((form) => form.id === selectedFormId)

  const exportData = () => {
    if (!analytics || !selectedForm) return

    const data = {
      form: selectedForm.title,
      analytics,
      exportedAt: new Date().toISOString(),
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${selectedForm.title.replace(/\s+/g, "_")}_analytics.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex h-full items-center justify-center">
          <div className="text-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading analytics...</p>
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
            <h1 className="text-3xl font-bold">Analytics</h1>
            <p className="text-muted-foreground">Insights and metrics for your feedback forms</p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={exportData} disabled={!analytics}>
              <Download className="mr-2 h-4 w-4" />
              Export Data
            </Button>
          </div>
        </div>

        {forms.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <div className="text-6xl mb-4">📊</div>
              <h3 className="text-xl font-semibold mb-2">No forms to analyze</h3>
              <p className="text-muted-foreground">Create a form and collect responses to see analytics</p>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Form Selector */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Filter className="mr-2 h-5 w-5" />
                  Select Form
                </CardTitle>
                <CardDescription>Choose a form to view its analytics</CardDescription>
              </CardHeader>
              <CardContent>
                <Select value={selectedFormId} onValueChange={setSelectedFormId}>
                  <SelectTrigger className="w-full max-w-md">
                    <SelectValue placeholder="Select a form" />
                  </SelectTrigger>
                  <SelectContent>
                    {forms.map((form) => (
                      <SelectItem key={form.id} value={form.id}>
                        {form.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Analytics Content */}
            {analytics && selectedForm ? (
              <AnalyticsCharts analytics={analytics} formTitle={selectedForm.title} />
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <div className="text-6xl mb-4">📈</div>
                  <h3 className="text-xl font-semibold mb-2">No data available</h3>
                  <p className="text-muted-foreground">
                    This form hasn't received any responses yet. Share your form to start collecting data.
                  </p>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  )
}
