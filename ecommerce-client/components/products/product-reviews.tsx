"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Star, ThumbsUp, ThumbsDown } from "lucide-react"
import { useAuth } from "@/components/providers/auth-provider"
import { useToast } from "@/hooks/use-toast"

interface ProductReviewsProps {
  productId: string
}

export default function ProductReviews({ productId }: ProductReviewsProps) {
  const [reviews, setReviews] = useState<any[]>([])
  const [ratingDistribution, setRatingDistribution] = useState([
    { stars: 5, count: 0, percentage: 0 },
    { stars: 4, count: 0, percentage: 0 },
    { stars: 3, count: 0, percentage: 0 },
    { stars: 2, count: 0, percentage: 0 },
    { stars: 1, count: 0, percentage: 0 },
  ])
  const [averageRating, setAverageRating] = useState(0)
  const [totalReviews, setTotalReviews] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [newReview, setNewReview] = useState({ rating: 5, title: "", comment: "" })
  const [showReviewForm, setShowReviewForm] = useState(false)
  const { user } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    async function fetchReviews() {
      try {
        const response = await fetch(`http://localhost:5000/api/reviews/${productId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch reviews");
        }
        const data = await response.json();
        setReviews(data);

        // Calculate rating distribution and average
        const total = data.length;
        const distribution = [0, 0, 0, 0, 0];
        let sum = 0;

        data.forEach((review: any) => {
          if (review.rating >= 1 && review.rating <= 5) {
            distribution[review.rating - 1]++;
            sum += review.rating;
          }
        });

        setRatingDistribution(
            distribution.map((count, index) => ({
              stars: 5 - index,
              count,
              percentage: total > 0 ? (count / total) * 100 : 0,
            }))
        );
        setAverageRating(total > 0 ? sum / total : 0);
        setTotalReviews(total);
        setIsLoading(false);
      } catch (err) {
        setError("Error fetching reviews");
        setIsLoading(false);
        console.error(err);
      }
    }

    fetchReviews();
  }, [productId]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to write a review.",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: parseInt(productId),
          user: user.name,
          rating: newReview.rating,
          title: newReview.title,
          comment: newReview.comment,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit review");
      }

      toast({
        title: "Review submitted!",
        description: "Thank you for your review. It will be published after moderation.",
      });

      setNewReview({ rating: 5, title: "", comment: "" });
      setShowReviewForm(false);

      // Refresh reviews
      const updatedReviews = await fetch(`http://localhost:5000/api/reviews/${productId}`);
      const data = await updatedReviews.json();
      setReviews(data);

      // Update rating distribution
      const total = data.length;
      const distribution = [0, 0, 0, 0, 0];
      let sum = 0;

      data.forEach((review: any) => {
        if (review.rating >= 1 && review.rating <= 5) {
          distribution[review.rating - 1]++;
          sum += review.rating;
        }
      });

      setRatingDistribution(
          distribution.map((count, index) => ({
            stars: 5 - index,
            count,
            percentage: total > 0 ? (count / total) * 100 : 0,
          }))
      );
      setAverageRating(total > 0 ? sum / total : 0);
      setTotalReviews(total);
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to submit review. Please try again.",
        variant: "destructive",
      });
      console.error(err);
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading reviews...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-600">{error}</div>;
  }

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
                  <div className="text-4xl font-bold mb-2">{averageRating.toFixed(1)}</div>
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
            {reviews.length === 0 && <div className="text-center py-4">No reviews yet</div>}
            {reviews.map((review) => (
                <Card key={review._id}>
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