"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Webhook, Zap, MessageCircle, Mail, Settings, Plus, ExternalLink, Copy, Check } from "lucide-react"

export default function IntegrationsPage() {
  const [integrations] = useState([
    {
      id: 1,
      name: "Slack Notifications",
      type: "slack",
      description: "Get notified in Slack when new responses are received",
      isActive: true,
      config: { channel: "#feedback", webhook: "https://hooks.slack.com/..." },
    },
    {
      id: 2,
      name: "Email Alerts",
      type: "email",
      description: "Send email notifications for new responses",
      isActive: false,
      config: { recipients: ["admin@company.com"] },
    },
    {
      id: 3,
      name: "Custom Webhook",
      type: "webhook",
      description: "Send response data to your custom endpoint",
      isActive: true,
      config: { url: "https://api.myapp.com/webhook", secret: "sk_..." },
    },
  ])

  const [webhookUrl, setWebhookUrl] = useState("")
  const [isWebhookDialogOpen, setIsWebhookDialogOpen] = useState(false)
  const [copiedApiKey, setCopiedApiKey] = useState(false)

  const availableIntegrations = [
    {
      name: "Slack",
      icon: <MessageCircle className="h-8 w-8 text-green-600" />,
      description: "Send notifications to Slack channels",
      category: "Communication",
      isPopular: true,
    },
    {
      name: "Zapier",
      icon: <Zap className="h-8 w-8 text-orange-500" />,
      description: "Connect to 5000+ apps with Zapier",
      category: "Automation",
      isPopular: true,
    },
    {
      name: "Webhooks",
      icon: <Webhook className="h-8 w-8 text-blue-600" />,
      description: "Send data to custom endpoints",
      category: "Developer",
      isPopular: false,
    },
    {
      name: "Email",
      icon: <Mail className="h-8 w-8 text-red-500" />,
      description: "Email notifications and alerts",
      category: "Communication",
      isPopular: true,
    },
  ]

  const copyApiKey = () => {
    navigator.clipboard.writeText("mf_sk_1234567890abcdef")
    setCopiedApiKey(true)
    setTimeout(() => setCopiedApiKey(false), 2000)
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Integrations
            </h1>
            <p className="text-muted-foreground mt-2">Connect your feedback forms with your favorite tools</p>
          </div>
        </div>

        {/* API Keys Section */}
        <Card className="glass-card border-0 hover:shadow-xl transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="mr-2 h-5 w-5 text-primary" />
              API Configuration
            </CardTitle>
            <CardDescription>Manage your API keys and webhook settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>API Key</Label>
              <div className="flex items-center space-x-2">
                <Input value="mf_sk_1234567890abcdef" readOnly className="font-mono text-sm" />
                <Button variant="outline" size="sm" onClick={copyApiKey} className="hover:bg-primary/5 bg-transparent">
                  {copiedApiKey ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Use this key to authenticate API requests. Keep it secure!
              </p>
            </div>

            <div className="flex gap-4">
              <Button variant="outline" className="hover:bg-primary/5 bg-transparent">
                <ExternalLink className="mr-2 h-4 w-4" />
                View API Docs
              </Button>
              <Button variant="outline" className="hover:bg-secondary/5 bg-transparent">
                Regenerate Key
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Active Integrations */}
        <Card className="glass-card border-0 hover:shadow-xl transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Webhook className="mr-2 h-5 w-5 text-secondary" />
              Active Integrations
            </CardTitle>
            <CardDescription>Your currently configured integrations</CardDescription>
          </CardHeader>
          <CardContent>
            {integrations.length === 0 ? (
              <div className="text-center py-12">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 inline-block mb-4">
                  <Webhook className="h-12 w-12 text-primary" />
                </div>
                <p className="text-muted-foreground text-lg mb-6">No integrations configured yet</p>
                <Button className="bg-gradient-to-r from-primary to-secondary">Add Your First Integration</Button>
              </div>
            ) : (
              <div className="space-y-4">
                {integrations.map((integration, index) => (
                  <div
                    key={integration.id}
                    className="group flex items-center justify-between p-4 border rounded-xl hover:bg-muted/50 hover:scale-[1.02] transition-all duration-200"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="p-2 rounded-lg bg-primary/10">
                        {integration.type === "slack" && <MessageCircle className="h-5 w-5 text-green-600" />}
                        {integration.type === "email" && <Mail className="h-5 w-5 text-red-500" />}
                        {integration.type === "webhook" && <Webhook className="h-5 w-5 text-blue-600" />}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <p className="font-semibold group-hover:text-primary transition-colors">{integration.name}</p>
                          <Badge variant={integration.isActive ? "default" : "secondary"} className="text-xs">
                            {integration.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{integration.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Switch checked={integration.isActive} />
                      <Button
                        variant="ghost"
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Available Integrations */}
        <Card className="glass-card border-0 hover:shadow-xl transition-all duration-300">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center">
                  <Plus className="mr-2 h-5 w-5 text-primary" />
                  Available Integrations
                </CardTitle>
                <CardDescription>Connect with popular tools and services</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {availableIntegrations.map((integration, index) => (
                <Card
                  key={integration.name}
                  className="group hover:scale-105 hover:shadow-xl transition-all duration-300 glass-card border-0 relative"
                >
                  {integration.isPopular && (
                    <div className="absolute -top-2 -right-2">
                      <Badge className="bg-gradient-to-r from-secondary to-primary text-white text-xs">Popular</Badge>
                    </div>
                  )}

                  <CardContent className="p-6 text-center">
                    <div className="mb-4 flex justify-center">
                      <div className="p-3 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 group-hover:from-primary/20 group-hover:to-secondary/20 transition-all duration-300">
                        {integration.icon}
                      </div>
                    </div>
                    <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">
                      {integration.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">{integration.description}</p>
                    <Badge variant="secondary" className="text-xs mb-4">
                      {integration.category}
                    </Badge>
                    <Dialog
                      open={isWebhookDialogOpen && integration.name === "Webhooks"}
                      onOpenChange={setIsWebhookDialogOpen}
                    >
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full hover:bg-primary/5 hover:border-primary/20 bg-transparent"
                          onClick={() => integration.name === "Webhooks" && setIsWebhookDialogOpen(true)}
                        >
                          Connect
                        </Button>
                      </DialogTrigger>
                      {integration.name === "Webhooks" && (
                        <DialogContent className="glass-card border-0">
                          <DialogHeader>
                            <DialogTitle>Configure Webhook</DialogTitle>
                            <DialogDescription>
                              Set up a webhook to receive form responses in real-time
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="webhook-url">Webhook URL</Label>
                              <Input
                                id="webhook-url"
                                placeholder="https://your-app.com/webhook"
                                value={webhookUrl}
                                onChange={(e) => setWebhookUrl(e.target.value)}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="webhook-secret">Secret (Optional)</Label>
                              <Input id="webhook-secret" placeholder="Your webhook secret" type="password" />
                            </div>
                            <div className="space-y-2">
                              <Label>Events to Send</Label>
                              <div className="space-y-2">
                                <div className="flex items-center space-x-2">
                                  <Switch defaultChecked />
                                  <Label className="text-sm">New Response</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Switch />
                                  <Label className="text-sm">Form Updated</Label>
                                </div>
                              </div>
                            </div>
                            <div className="flex justify-end space-x-2">
                              <Button variant="outline" onClick={() => setIsWebhookDialogOpen(false)}>
                                Cancel
                              </Button>
                              <Button className="bg-gradient-to-r from-primary to-secondary">Save Webhook</Button>
                            </div>
                          </div>
                        </DialogContent>
                      )}
                    </Dialog>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
