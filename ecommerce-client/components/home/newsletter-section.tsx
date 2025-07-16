"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mail, CheckCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function NewsletterSection() {
  const [email, setEmail] = useState("")
  const [isSubscribed, setIsSubscribed] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    // Simulate API call
    setTimeout(() => {
      setIsSubscribed(true)
      toast({
        title: "Successfully subscribed!",
        description: "Thank you for subscribing to our newsletter.",
      })
      setEmail("")
    }, 1000)
  }

  return (
    <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="mb-8">
          <Mail className="w-16 h-16 mx-auto mb-4 opacity-90" />
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">Stay Updated with Our Newsletter</h2>
          <p className="text-lg opacity-90 max-w-2xl mx-auto">
            Get the latest updates on new products, exclusive deals, and special offers delivered straight to your
            inbox.
          </p>
        </div>

        {!isSubscribed ? (
          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/70"
                required
              />
              <Button type="submit" className="bg-white text-blue-600 hover:bg-gray-100">
                Subscribe
              </Button>
            </div>
            <p className="text-sm opacity-75 mt-3">We respect your privacy. Unsubscribe at any time.</p>
          </form>
        ) : (
          <div className="flex items-center justify-center space-x-2">
            <CheckCircle className="w-6 h-6 text-green-400" />
            <span className="text-lg">Thank you for subscribing!</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-12 pt-8 border-t border-white/20">
          <div>
            <h3 className="font-semibold mb-2">Exclusive Deals</h3>
            <p className="text-sm opacity-75">Get access to member-only discounts and flash sales</p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">New Arrivals</h3>
            <p className="text-sm opacity-75">Be the first to know about our latest products</p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Style Tips</h3>
            <p className="text-sm opacity-75">Receive curated content and styling advice</p>
          </div>
        </div>
      </div>
    </section>
  )
}
