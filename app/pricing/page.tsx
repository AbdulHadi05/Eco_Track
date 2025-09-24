"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, MessageSquare, ArrowRight, Star } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(false)

  const plans = [
    {
      name: "Starter",
      description: "Perfect for individuals and small projects",
      price: isAnnual ? 9 : 12,
      originalPrice: isAnnual ? 12 : null,
      features: ["Up to 3 forms", "100 responses/month", "Basic analytics", "Email support", "Form customization"],
      popular: false,
      cta: "Start Free Trial",
    },
    {
      name: "Professional",
      description: "Ideal for growing businesses and teams",
      price: isAnnual ? 29 : 39,
      originalPrice: isAnnual ? 39 : null,
      features: [
        "Unlimited forms",
        "5,000 responses/month",
        "Advanced analytics",
        "Priority support",
        "Custom branding",
        "Team collaboration",
        "API access",
      ],
      popular: true,
      cta: "Start Free Trial",
    },
    {
      name: "Enterprise",
      description: "For large organizations with advanced needs",
      price: isAnnual ? 99 : 129,
      originalPrice: isAnnual ? 129 : null,
      features: [
        "Unlimited everything",
        "Advanced integrations",
        "White-label solution",
        "Dedicated support",
        "Custom development",
        "SLA guarantee",
        "Advanced security",
      ],
      popular: false,
      cta: "Contact Sales",
    },
  ]

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-gradient-to-br from-primary to-secondary">
              <MessageSquare className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Micro Feedback
            </span>
          </Link>
          <div className="flex items-center space-x-4">
            <Link href="/auth">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/auth">
              <Button className="bg-gradient-to-r from-primary to-secondary">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 gradient-bg opacity-10"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <Badge className="mb-6 bg-primary/10 text-primary border-primary/20">💰 Save 25% with annual billing</Badge>
          <h1 className="text-5xl md:text-6xl font-bold text-balance mb-6">
            Simple, Transparent
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"> Pricing</span>
          </h1>
          <p className="text-xl text-muted-foreground text-balance mb-12 max-w-3xl mx-auto">
            Choose the perfect plan for your feedback collection needs. Start free, upgrade anytime.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center mb-16">
            <div className="glass-card p-1 rounded-full">
              <div className="flex items-center">
                <button
                  onClick={() => setIsAnnual(false)}
                  className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    !isAnnual
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setIsAnnual(true)}
                  className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    isAnnual
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Annual
                  <Badge className="ml-2 bg-secondary text-secondary-foreground">Save 25%</Badge>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <Card
                key={plan.name}
                className={`relative hover:scale-105 transition-all duration-300 ${
                  plan.popular ? "glass-card border-primary/20 shadow-xl scale-105" : "glass-card border-0"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-primary to-secondary text-white px-4 py-1">
                      <Star className="w-3 h-3 mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                )}

                <CardHeader className="text-center pb-8">
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription className="text-base">{plan.description}</CardDescription>
                  <div className="mt-6">
                    <div className="flex items-center justify-center">
                      <span className="text-5xl font-bold">${plan.price}</span>
                      <div className="ml-2">
                        {plan.originalPrice && (
                          <div className="text-sm text-muted-foreground line-through">${plan.originalPrice}</div>
                        )}
                        <div className="text-sm text-muted-foreground">/{isAnnual ? "month" : "month"}</div>
                      </div>
                    </div>
                    {isAnnual && <div className="text-sm text-secondary font-medium mt-2">Billed annually</div>}
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  <ul className="space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center">
                        <Check className="h-4 w-4 text-primary mr-3 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    className={`w-full ${
                      plan.popular ? "bg-gradient-to-r from-primary to-secondary hover:shadow-lg" : "hover:bg-primary/5"
                    }`}
                    variant={plan.popular ? "default" : "outline"}
                  >
                    {plan.cta}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to know about our pricing and plans
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-6">
            {[
              {
                question: "Can I change plans anytime?",
                answer:
                  "Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately and we'll prorate the billing.",
              },
              {
                question: "What happens if I exceed my response limit?",
                answer:
                  "We'll notify you when you're approaching your limit. You can upgrade your plan or purchase additional responses as needed.",
              },
              {
                question: "Do you offer refunds?",
                answer:
                  "We offer a 30-day money-back guarantee for all paid plans. If you're not satisfied, we'll refund your payment.",
              },
              {
                question: "Is there a free trial?",
                answer: "Yes! All plans come with a 14-day free trial. No credit card required to get started.",
              },
            ].map((faq, index) => (
              <Card key={index} className="glass-card border-0 hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-2">{faq.question}</h3>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 gradient-bg opacity-90"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">Ready to get started?</h2>
          <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
            Join thousands of businesses collecting valuable feedback with Micro Feedback
          </p>
          <Link href="/auth">
            <Button
              size="lg"
              variant="secondary"
              className="text-lg px-8 py-4 bg-white text-primary hover:bg-white/90 hover:scale-105 transition-all duration-300"
            >
              Start Your Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
