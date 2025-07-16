"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Star, Heart, ShoppingCart, Grid, List } from "lucide-react"
import { useCart } from "@/components/providers/cart-provider"
import { useToast } from "@/hooks/use-toast"

// const products = [
//   {
//     id: 1,
//     name: "Premium Wireless Headphones",
//     price: 299.99,
//     originalPrice: 399.99,
//     rating: 4.8,
//     reviews: 124,
//     image: "/placeholder.svg?height=300&width=300",
//     badge: "Best Seller",
//     category: "Electronics",
//     brand: "Sony",
//     inStock: true,
//     description: "High-quality wireless headphones with noise cancellation",
//   },
//   {
//     id: 2,
//     name: "Designer Leather Jacket",
//     price: 199.99,
//     originalPrice: 299.99,
//     rating: 4.9,
//     reviews: 89,
//     image: "/placeholder.svg?height=300&width=300",
//     badge: "New Arrival",
//     category: "Fashion",
//     brand: "Nike",
//     inStock: true,
//     description: "Stylish leather jacket perfect for any occasion",
//   },
//   {
//     id: 3,
//     name: "Smart Fitness Watch",
//     price: 249.99,
//     originalPrice: 349.99,
//     rating: 4.7,
//     reviews: 156,
//     image: "/placeholder.svg?height=300&width=300",
//     badge: "Limited",
//     category: "Electronics",
//     brand: "Apple",
//     inStock: false,
//     description: "Advanced fitness tracking with heart rate monitoring",
//   },
//   {
//     id: 4,
//     name: "Organic Skincare Set",
//     price: 89.99,
//     originalPrice: 129.99,
//     rating: 4.9,
//     reviews: 203,
//     image: "/placeholder.svg?height=300&width=300",
//     badge: "Trending",
//     category: "Beauty",
//     brand: "Samsung",
//     inStock: true,
//     description: "Complete organic skincare routine for healthy skin",
//   },
//   {
//     id: 5,
//     name: "Professional Camera Lens",
//     price: 599.99,
//     originalPrice: 799.99,
//     rating: 4.6,
//     reviews: 67,
//     image: "/placeholder.svg?height=300&width=300",
//     badge: "Sale",
//     category: "Electronics",
//     brand: "Sony",
//     inStock: true,
//     description: "Professional grade camera lens for stunning photography",
//   },
//   {
//     id: 6,
//     name: "Comfortable Running Shoes",
//     price: 129.99,
//     originalPrice: 179.99,
//     rating: 4.8,
//     reviews: 234,
//     image: "/placeholder.svg?height=300&width=300",
//     badge: "Popular",
//     category: "Sports",
//     brand: "Adidas",
//     inStock: true,
//     description: "Lightweight running shoes with superior comfort",
//   },
// ]

export default function ProductGrid({products} : any) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [sortBy, setSortBy] = useState("featured")
  const { addItem } = useCart()
  const { toast } = useToast()

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

  const sortedProducts = [...products].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price
      case "price-high":
        return b.price - a.price
      case "rating":
        return b.rating - a.rating
      case "newest":
        return b.id - a.id
      default:
        return 0
    }
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <p className="text-gray-600">Showing {products.length} products</p>
        </div>

        <div className="flex items-center gap-4">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="featured">Featured</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="rating">Highest Rated</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex border rounded-lg">
            <Button variant={viewMode === "grid" ? "default" : "ghost"} size="sm" onClick={() => setViewMode("grid")}>
              <Grid className="w-4 h-4" />
            </Button>
            <Button variant={viewMode === "list" ? "default" : "ghost"} size="sm" onClick={() => setViewMode("list")}>
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedProducts.map((product) => (
            <Card key={product.id} className="group hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-0">
                <div className="relative overflow-hidden rounded-t-lg">
                  <Image
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    width={300}
                    height={300}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {product.badge && (
                    <Badge className="absolute top-3 left-3 bg-red-500 hover:bg-red-600">{product.badge}</Badge>
                  )}
                  {!product.inStock && <Badge className="absolute top-3 right-3 bg-gray-500">Out of Stock</Badge>}
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button size="icon" variant="secondary" className="rounded-full">
                      <Heart className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/50 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      className="w-full"
                      size="sm"
                      disabled={!product.inStock}
                      onClick={() => handleAddToCart(product)}
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      {product.inStock ? "Add to Cart" : "Out of Stock"}
                    </Button>
                  </div>
                </div>

                <div className="p-4">
                  <div className="text-sm text-gray-500 mb-1">{product.category}</div>
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                    <Link href={`/products/${product.id}`} className="hover:text-blue-600 transition-colors">
                      {product.name}
                    </Link>
                  </h3>

                  <div className="flex items-center mb-2">
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-500 ml-2">
                      {product.rating} ({product.reviews})
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-bold text-gray-900">${product.price}</span>
                      {product.originalPrice > product.price && (
                        <span className="text-sm text-gray-500 line-through">${product.originalPrice}</span>
                      )}
                    </div>
                    {product.originalPrice > product.price && (
                      <Badge variant="secondary" className="text-green-600">
                        {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {sortedProducts.map((product) => (
            <Card key={product.id} className="hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex gap-6">
                  <div className="relative w-32 h-32 flex-shrink-0">
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      width={128}
                      height={128}
                      className="w-full h-full object-cover rounded-lg"
                    />
                    {product.badge && (
                      <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600 text-xs">
                        {product.badge}
                      </Badge>
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="text-sm text-gray-500 mb-1">
                          {product.category} • {product.brand}
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          <Link href={`/products/${product.id}`} className="hover:text-blue-600 transition-colors">
                            {product.name}
                          </Link>
                        </h3>
                      </div>
                      <Button size="icon" variant="ghost">
                        <Heart className="w-4 h-4" />
                      </Button>
                    </div>

                    <p className="text-gray-600 mb-3">{product.description}</p>

                    <div className="flex items-center mb-3">
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-500 ml-2">
                        {product.rating} ({product.reviews} reviews)
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-xl font-bold text-gray-900">${product.price}</span>
                        {product.originalPrice > product.price && (
                          <span className="text-sm text-gray-500 line-through">${product.originalPrice}</span>
                        )}
                        {product.originalPrice > product.price && (
                          <Badge variant="secondary" className="text-green-600">
                            {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                          </Badge>
                        )}
                      </div>

                      <Button disabled={!product.inStock} onClick={() => handleAddToCart(product)}>
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        {product.inStock ? "Add to Cart" : "Out of Stock"}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
