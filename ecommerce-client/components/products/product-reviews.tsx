"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Star, ThumbsUp, ThumbsDown } from "lucide-react"
import { useAuth } from "@/components/providers/auth-provider"
import { useToast } from "@/hooks/use-toast"

const mockReviews = [
  {
    id: 1,
    user: "John D.",
    rating: 5,
    date: "2024-01-15",
    title: "Excellent quality!",
    comment:
      "These headphones exceeded my expectations. The sound quality is amazing and the noise cancellation works perfectly.",
    helpful: 12,
    verified: true,
  },
  {
    id: 2,
    user: "Sarah M.",
    rating: 4,
    date: "2024-01-10",
    title: "Great value for money",
    comment: "Really good headphones for the price. Battery life is as advertised and they're very comfortable.",
    helpful: 8,
    verified: true,
  },
  {
    id: 3,
    user: "Mike R.",
    rating: 5,
    date: "2024-01-05",
    title: "Perfect for work from home",
    comment: "The noise cancellation is a game changer for video calls. Highly recommend!",
    helpful: 15,
    verified: false,
  },
]

const ratingDistribution = [
  { stars: 5, count: 45, percentage: 60 },
  { stars: 4, count: 20, percentage: 27 },
  { stars: 3, count: 8, percentage: 11 },
  { stars: 2, count: 1, percentage: 1 },
  { stars: 1, count: 1, percentage: 1 },
]

interface ProductReviewsProps {
  productId: string
}

export default function ProductReviews({ productId }: ProductReviewsProps) {
  const [newReview, setNewReview] = useState({ rating: 5, title: "", comment: "" })
  const [showReviewForm, setShowReviewForm] = useState(false)
  const { user } = useAuth()
  const { toast } = useToast()

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to write a review.",
        variant: "destructive",
      })
      return
    }

    // Here you would submit the review to your API
    toast({
      title: "Review submitted!",
      description: "Thank you for your review. It will be published after moderation.",
    })

    setNewReview({ rating: 5, title: "", comment: "" })
    setShowReviewForm(false)
  }

  const averageRating = 4.8
  const totalReviews = 75

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Rating Summary */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Customer Reviews</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">{averageRating}</div>
                <div className="flex justify-center mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(averageRating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-sm text-gray-600">{totalReviews} reviews</p>
              </div>

              <div className="space-y-2">
                {ratingDistribution.map((item) => (
                  <div key={item.stars} className="flex items-center gap-2 text-sm">
                    <span className="w-8">{item.stars}★</span>
                    <Progress value={item.percentage} className="flex-1" />
                    <span className="w-8 text-gray-600">{item.count}</span>
                  </div>
                ))}
              </div>

              <Button
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="w-full"
                variant={showReviewForm ? "outline" : "default"}
              >
                {showReviewForm ? "Cancel" : "Write a Review"}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Reviews List */}
        <div className="lg:col-span-2 space-y-6">
          {/* Review Form */}
          {showReviewForm && (
            <Card>
              <CardHeader>
                <CardTitle>Write a Review</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmitReview} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Rating</label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setNewReview((prev) => ({ ...prev, rating: star }))}
                          className="p-1"
                        >
                          <Star
                            className={`w-6 h-6 ${
                              star <= newReview.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Title</label>
                    <input
                      type="text"
                      value={newReview.title}
                      onChange={(e) => setNewReview((prev) => ({ ...prev, title: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Summarize your review"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Review</label>
                    <Textarea
                      value={newReview.comment}
                      onChange={(e) => setNewReview((prev) => ({ ...prev, comment: e.target.value }))}
                      placeholder="Share your experience with this product"
                      rows={4}
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full">
                    Submit Review
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Individual Reviews */}
          {mockReviews.map((review) => (
            <Card key={review.id}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{review.user}</span>
                      {review.verified && (
                        <Badge variant="secondary" className="text-xs">
                          Verified Purchase
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">{review.date}</span>
                    </div>
                  </div>
                </div>

                <h4 className="font-medium mb-2">{review.title}</h4>
                <p className="text-gray-700 mb-4">{review.comment}</p>

                <div className="flex items-center gap-4 text-sm">
                  <button className="flex items-center gap-1 text-gray-600 hover:text-gray-800">
                    <ThumbsUp className="w-4 h-4" />
                    Helpful ({review.helpful})
                  </button>
                  <button className="flex items-center gap-1 text-gray-600 hover:text-gray-800">
                    <ThumbsDown className="w-4 h-4" />
                    Not helpful
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
