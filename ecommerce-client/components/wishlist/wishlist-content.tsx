"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, ShoppingCart, Trash2, Share2, Star } from "lucide-react"
import { useCart } from "@/components/providers/cart-provider"
import { useAuth } from "@/components/providers/auth-provider"
import { useToast } from "@/hooks/use-toast"

// Mock wishlist data - in real app, this would come from API
const mockWishlistItems = [
  {
    id: 1,
    name: "Premium Wireless Headphones",
    price: 299.99,
    originalPrice: 399.99,
    rating: 4.8,
    reviews: 124,
    image: "/placeholder.svg?height=300&width=300",
    inStock: true,
    category: "Electronics",
    addedDate: "2024-01-15",
  },
  {
    id: 2,
    name: "Designer Leather Jacket",
    price: 199.99,
    originalPrice: 299.99,
    rating: 4.9,
    reviews: 89,
    image: "/placeholder.svg?height=300&width=300",
    inStock: true,
    category: "Fashion",
    addedDate: "2024-01-10",
  },
  {
    id: 3,
    name: "Smart Fitness Watch",
    price: 249.99,
    originalPrice: 349.99,
    rating: 4.7,
    reviews: 156,
    image: "/placeholder.svg?height=300&width=300",
    inStock: false,
    category: "Electronics",
    addedDate: "2024-01-05",
  },
]

export default function WishlistContent() {
  const [wishlistItems, setWishlistItems] = useState(mockWishlistItems)
  const { addItem } = useCart()
  const { user } = useAuth()
  const { toast } = useToast()

  const handleRemoveFromWishlist = (id: number, name: string) => {
    setWishlistItems((items) => items.filter((item) => item.id !== id))
    toast({
      title: "Removed from wishlist",
      description: `${name} has been removed from your wishlist.`,
    })
  }

  const handleAddToCart = (product: any) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
    })
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    })
  }

  const handleAddAllToCart = () => {
    const inStockItems = wishlistItems.filter((item) => item.inStock)
    inStockItems.forEach((item) => {
      addItem({
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
        quantity: 1,
      })
    })
    toast({
      title: "Added to cart",
      description: `${inStockItems.length} items have been added to your cart.`,
    })
  }

  const handleShare = (product: any) => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Check out this ${product.name} on EliteStore`,
        url: `${window.location.origin}/products/${product.id}`,
      })
    } else {
      navigator.clipboard.writeText(`${window.location.origin}/products/${product.id}`)
      toast({
        title: "Link copied",
        description: "Product link has been copied to clipboard.",
      })
    }
  }

  if (!user) {
    return (
      <div className="text-center py-16">
        <Heart className="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Please log in to view your wishlist</h2>
        <p className="text-gray-600 mb-6">Sign in to save and manage your favorite items</p>
        <Button asChild>
          <Link href="/login">Sign In</Link>
        </Button>
      </div>
    )
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="text-center py-16">
        <Heart className="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Your wishlist is empty</h2>
        <p className="text-gray-600 mb-6">Start adding items you love to your wishlist</p>
        <Button asChild>
          <Link href="/products">Browse Products</Link>
        </Button>
      </div>
    )
  }

  const inStockCount = wishlistItems.filter((item) => item.inStock).length

  return (
    <div className="space-y-6">
      {/* Wishlist Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-lg shadow-sm">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            {wishlistItems.length} {wishlistItems.length === 1 ? "Item" : "Items"} in Wishlist
          </h2>
          <p className="text-gray-600">
            {inStockCount} {inStockCount === 1 ? "item" : "items"} available in stock
          </p>
        </div>
        {inStockCount > 0 && (
          <Button onClick={handleAddAllToCart} className="flex items-center gap-2">
            <ShoppingCart className="w-4 h-4" />
            Add All to Cart ({inStockCount})
          </Button>
        )}
      </div>

      {/* Wishlist Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {wishlistItems.map((item) => (
          <Card key={item.id} className="group hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-0">
              <div className="relative overflow-hidden rounded-t-lg">
                <Link href={`/products/${item.id}`}>
                  <Image
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    width={300}
                    height={300}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </Link>
                {!item.inStock && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <Badge variant="destructive">Out of Stock</Badge>
                  </div>
                )}
                <div className="absolute top-3 right-3 flex gap-2">
                  <Button
                    size="icon"
                    variant="secondary"
                    className="rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleShare(item)}
                  >
                    <Share2 className="w-4 h-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="secondary"
                    className="rounded-full text-red-600 hover:text-red-700"
                    onClick={() => handleRemoveFromWishlist(item.id, item.name)}
                  >
                    <Heart className="w-4 h-4 fill-current" />
                  </Button>
                </div>
              </div>

              <div className="p-4">
                <div className="text-sm text-gray-500 mb-1">{item.category}</div>
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                  <Link href={`/products/${item.id}`} className="hover:text-blue-600 transition-colors">
                    {item.name}
                  </Link>
                </h3>

                <div className="flex items-center mb-2">
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(item.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-500 ml-2">({item.reviews})</span>
                </div>

                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-bold text-gray-900">${item.price}</span>
                    {item.originalPrice > item.price && (
                      <span className="text-sm text-gray-500 line-through">${item.originalPrice}</span>
                    )}
                  </div>
                  {item.originalPrice > item.price && (
                    <Badge variant="secondary" className="text-green-600">
                      {Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}% OFF
                    </Badge>
                  )}
                </div>

                <div className="text-xs text-gray-500 mb-3">Added on {item.addedDate}</div>

                <div className="flex gap-2">
                  <Button onClick={() => handleAddToCart(item)} disabled={!item.inStock} className="flex-1" size="sm">
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    {item.inStock ? "Add to Cart" : "Out of Stock"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRemoveFromWishlist(item.id, item.name)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
