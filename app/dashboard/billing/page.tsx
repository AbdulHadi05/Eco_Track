"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { CreditCard, Download, Calendar, TrendingUp, AlertCircle, CheckCircle } from "lucide-react"

export default function BillingPage() {
  const [currentPlan] = useState({
    name: "Professional",
    price: 39,
    billing: "monthly",
    nextBilling: "2024-02-15",
    status: "active",
  })

  const [usage] = useState({
    forms: { current: 12, limit: "unlimited" },
    responses: { current: 3247, limit: 5000 },
    storage: { current: 2.4, limit: 10 },
  })

  const [billingHistory] = useState([
    { id: 1, date: "2024-01-15", amount: 39, status: "paid", invoice: "INV-001" },
    { id: 2, date: "2023-12-15", amount: 39, status: "paid", invoice: "INV-002" },
    { id: 3, date: "2023-11-15", amount: 39, status: "paid", invoice: "INV-003" },
  ])

  return (
    <DashboardLayout>
      <div className="p-6 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Billing & Subscription
            </h1>
            <p className="text-muted-foreground mt-2">Manage your subscription and billing information</p>
          </div>
        </div>

        {/* Current Plan */}
        <Card className="glass-card border-0 hover:shadow-xl transition-all duration-300">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center">
                  <CreditCard className="mr-2 h-5 w-5 text-primary" />
                  Current Plan
                </CardTitle>
                <CardDescription>Your active subscription details</CardDescription>
              </div>
              <Badge className="bg-gradient-to-r from-primary to-secondary text-white">
                {currentPlan.status === "active" ? "Active" : "Inactive"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-4 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10">
                <h3 className="text-2xl font-bold text-primary">{currentPlan.name}</h3>
                <p className="text-muted-foreground">Plan</p>
              </div>
              <div className="text-center p-4 rounded-xl bg-gradient-to-br from-secondary/10 to-primary/10">
                <h3 className="text-2xl font-bold text-secondary">${currentPlan.price}</h3>
                <p className="text-muted-foreground">Per {currentPlan.billing}</p>
              </div>
              <div className="text-center p-4 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10">
                <h3 className="text-2xl font-bold text-primary">{currentPlan.nextBilling}</h3>
                <p className="text-muted-foreground">Next billing</p>
              </div>
            </div>

            <div className="flex gap-4">
              <Button className="bg-gradient-to-r from-primary to-secondary hover:shadow-lg hover:scale-105 transition-all duration-200">
                Upgrade Plan
              </Button>
              <Button variant="outline" className="hover:bg-primary/5 bg-transparent">
                Change Billing Cycle
              </Button>
              <Button variant="outline" className="hover:bg-destructive/5 text-destructive bg-transparent">
                Cancel Subscription
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Usage Overview */}
        <Card className="glass-card border-0 hover:shadow-xl transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="mr-2 h-5 w-5 text-secondary" />
              Usage Overview
            </CardTitle>
            <CardDescription>Your current usage across all features</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6">
              {/* Forms Usage */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Forms Created</span>
                  <span className="text-sm text-muted-foreground">
                    {usage.forms.current} / {usage.forms.limit}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-600">Unlimited</span>
                </div>
              </div>

              {/* Responses Usage */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Monthly Responses</span>
                  <span className="text-sm text-muted-foreground">
                    {usage.responses.current} / {usage.responses.limit}
                  </span>
                </div>
                <Progress value={(usage.responses.current / usage.responses.limit) * 100} className="h-2" />
                <div className="flex items-center space-x-2">
                  <AlertCircle className="h-4 w-4 text-orange-500" />
                  <span className="text-sm text-orange-600">
                    {Math.round(((usage.responses.limit - usage.responses.current) / usage.responses.limit) * 100)}%
                    remaining
                  </span>
                </div>
              </div>

              {/* Storage Usage */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Storage Used</span>
                  <span className="text-sm text-muted-foreground">
                    {usage.storage.current}GB / {usage.storage.limit}GB
                  </span>
                </div>
                <Progress value={(usage.storage.current / usage.storage.limit) * 100} className="h-2" />
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-600">
                    {usage.storage.limit - usage.storage.current}GB available
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Method */}
        <Card className="glass-card border-0 hover:shadow-xl transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center">
              <CreditCard className="mr-2 h-5 w-5 text-primary" />
              Payment Method
            </CardTitle>
            <CardDescription>Manage your payment information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 border rounded-xl">
              <div className="flex items-center space-x-4">
                <div className="p-2 rounded-lg bg-primary/10">
                  <CreditCard className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-medium">•••• •••• •••• 4242</p>
                  <p className="text-sm text-muted-foreground">Expires 12/25</p>
                </div>
              </div>
              <Button variant="outline" className="hover:bg-primary/5 bg-transparent">
                Update
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Billing History */}
        <Card className="glass-card border-0 hover:shadow-xl transition-all duration-300">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center">
                  <Calendar className="mr-2 h-5 w-5 text-secondary" />
                  Billing History
                </CardTitle>
                <CardDescription>Your recent invoices and payments</CardDescription>
              </div>
              <Button variant="outline" className="hover:bg-secondary/5 bg-transparent">
                <Download className="mr-2 h-4 w-4" />
                Export All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {billingHistory.map((invoice) => (
                <div
                  key={invoice.id}
                  className="flex items-center justify-between p-4 border rounded-xl hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="p-2 rounded-lg bg-secondary/10">
                      <Calendar className="h-4 w-4 text-secondary" />
                    </div>
                    <div>
                      <p className="font-medium">{invoice.invoice}</p>
                      <p className="text-sm text-muted-foreground">{invoice.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="font-medium">${invoice.amount}</p>
                      <Badge variant={invoice.status === "paid" ? "default" : "destructive"} className="text-xs">
                        {invoice.status}
                      </Badge>
                    </div>
                    <Button variant="ghost" size="sm" className="hover:bg-primary/5">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
