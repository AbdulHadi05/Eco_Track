"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, BarChart3, Users, TrendingUp, Plus, ArrowUpRight } from "lucide-react"
import Link from "next/link"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { dataStore } from "@/lib/data-service"
import type { FeedbackForm, FeedbackResponse } from "@/lib/types"

export default function DashboardPage() {
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
        console.error("Failed to load dashboard data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  const activeForms = forms.filter((form) => form.isActive)
  const totalResponses = responses.length
  const recentResponses = responses.slice(-5).reverse()

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex h-full items-center justify-center">
          <div className="text-center">
            <div className="relative">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary/20 border-t-primary mx-auto mb-4"></div>
              <div className="absolute inset-0 h-12 w-12 animate-ping rounded-full border-2 border-primary/10 mx-auto"></div>
            </div>
            <p className="text-muted-foreground">Loading your dashboard...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-8">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Dashboard
            </h1>
            <p className="text-lg text-muted-foreground">Welcome back! Here's what's happening with your forms.</p>
          </div>
          <Link href="/dashboard/forms/new">
            <Button
              size="lg"
              className="bg-gradient-to-r from-primary to-secondary hover:shadow-lg hover:scale-105 transition-all duration-200"
            >
              <Plus className="mr-2 h-5 w-5" />
              Create New Form
            </Button>
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="group hover:scale-105 hover:shadow-xl transition-all duration-300 glass-card border-0 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
              <CardTitle className="text-sm font-medium">Total Forms</CardTitle>
              <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <MessageSquare className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-3xl font-bold text-primary">{forms.length}</div>
              <p className="text-xs text-muted-foreground flex items-center mt-1">
                <Badge variant="secondary" className="mr-2 text-xs">
                  {activeForms.length} active
                </Badge>
                <ArrowUpRight className="h-3 w-3" />
              </p>
            </CardContent>
          </Card>

          <Card className="group hover:scale-105 hover:shadow-xl transition-all duration-300 glass-card border-0 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-transparent"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
              <CardTitle className="text-sm font-medium">Total Responses</CardTitle>
              <div className="p-2 rounded-lg bg-secondary/10 group-hover:bg-secondary/20 transition-colors">
                <BarChart3 className="h-4 w-4 text-secondary" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-3xl font-bold text-secondary">{totalResponses}</div>
              <p className="text-xs text-muted-foreground flex items-center mt-1">
                Across all forms
                <ArrowUpRight className="h-3 w-3 ml-1" />
              </p>
            </CardContent>
          </Card>

          <Card className="group hover:scale-105 hover:shadow-xl transition-all duration-300 glass-card border-0 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
              <CardTitle className="text-sm font-medium">Response Rate</CardTitle>
              <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <TrendingUp className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-3xl font-bold text-primary">75%</div>
              <p className="text-xs text-muted-foreground flex items-center mt-1">
                Average completion
                <ArrowUpRight className="h-3 w-3 ml-1" />
              </p>
            </CardContent>
          </Card>

          <Card className="group hover:scale-105 hover:shadow-xl transition-all duration-300 glass-card border-0 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-transparent"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              <div className="p-2 rounded-lg bg-secondary/10 group-hover:bg-secondary/20 transition-colors">
                <Users className="h-4 w-4 text-secondary" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-3xl font-bold text-secondary">1,234</div>
              <p className="text-xs text-muted-foreground flex items-center mt-1">
                This month
                <ArrowUpRight className="h-3 w-3 ml-1" />
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Recent Forms */}
          <Card className="glass-card border-0 hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageSquare className="mr-2 h-5 w-5 text-primary" />
                Recent Forms
              </CardTitle>
              <CardDescription>Your latest feedback forms</CardDescription>
            </CardHeader>
            <CardContent>
              {forms.length === 0 ? (
                <div className="text-center py-12">
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 inline-block mb-4">
                    <MessageSquare className="h-12 w-12 text-primary" />
                  </div>
                  <p className="text-muted-foreground mb-6 text-lg">No forms created yet</p>
                  <Link href="/dashboard/forms/new">
                    <Button className="bg-gradient-to-r from-primary to-secondary hover:shadow-lg hover:scale-105 transition-all duration-200">
                      Create Your First Form
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {forms.slice(0, 5).map((form, index) => (
                    <div
                      key={form.id}
                      className="group p-4 border rounded-xl hover:bg-muted/50 hover:scale-[1.02] transition-all duration-200"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="font-semibold group-hover:text-primary transition-colors">{form.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {responses.filter((r) => r.formId === form.id).length} responses
                          </p>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Badge variant={form.isActive ? "default" : "secondary"} className="text-xs">
                            {form.isActive ? "Active" : "Inactive"}
                          </Badge>
                          <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                      </div>
                    </div>
                  ))}
                  <Link href="/dashboard/forms">
                    <Button
                      variant="outline"
                      className="w-full mt-4 hover:bg-primary/5 hover:border-primary/20 transition-all duration-200 bg-transparent"
                    >
                      View All Forms
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Responses */}
          <Card className="glass-card border-0 hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="mr-2 h-5 w-5 text-secondary" />
                Recent Responses
              </CardTitle>
              <CardDescription>Latest feedback submissions</CardDescription>
            </CardHeader>
            <CardContent>
              {recentResponses.length === 0 ? (
                <div className="text-center py-12">
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-secondary/10 to-primary/10 inline-block mb-4">
                    <BarChart3 className="h-12 w-12 text-secondary" />
                  </div>
                  <p className="text-muted-foreground text-lg">No responses yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentResponses.map((response, index) => {
                    const form = forms.find((f) => f.id === response.formId)
                    return (
                      <div
                        key={response.id}
                        className="group p-4 border rounded-xl hover:bg-muted/50 hover:scale-[1.02] transition-all duration-200"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold group-hover:text-secondary transition-colors">
                              {form?.title || "Unknown Form"}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(response.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-secondary transition-colors" />
                        </div>
                      </div>
                    )
                  })}
                  <Link href="/dashboard/analytics">
                    <Button
                      variant="outline"
                      className="w-full mt-4 hover:bg-secondary/5 hover:border-secondary/20 transition-all duration-200 bg-transparent"
                    >
                      View All Analytics
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
