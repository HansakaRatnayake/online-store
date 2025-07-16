import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Heart, ShoppingCart } from "lucide-react"

const featuredProducts = [
  {
    id: 1,
    name: "Premium Wireless Headphones",
    price: 299.99,
    originalPrice: 399.99,
    rating: 4.8,
    reviews: 124,
    image: "/placeholder.svg?height=300&width=300",
    badge: "Best Seller",
    category: "Electronics",
  },
  {
    id: 2,
    name: "Designer Leather Jacket",
    price: 199.99,
    originalPrice: 299.99,
    rating: 4.9,
    reviews: 89,
    image: "/placeholder.svg?height=300&width=300",
    badge: "New Arrival",
    category: "Fashion",
  },
  {
    id: 3,
    name: "Smart Fitness Watch",
    price: 249.99,
    originalPrice: 349.99,
    rating: 4.7,
    reviews: 156,
    image: "/placeholder.svg?height=300&width=300",
    badge: "Limited",
    category: "Electronics",
  },
  {
    id: 4,
    name: "Organic Skincare Set",
    price: 89.99,
    originalPrice: 129.99,
    rating: 4.9,
    reviews: 203,
    image: "/placeholder.svg?height=300&width=300",
    badge: "Trending",
    category: "Beauty",
  },

]

export default function FeaturedProducts() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Featured Products</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our handpicked selection of premium products that our customers love most
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
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
                  <Badge className="absolute top-3 left-3 bg-red-500 hover:bg-red-600">{product.badge}</Badge>
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button size="icon" variant="secondary" className="rounded-full">
                      <Heart className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/50 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button className="w-full" size="sm">
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Add to Cart
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
                      <span className="text-sm text-gray-500 line-through">${product.originalPrice}</span>
                    </div>
                    <Badge variant="secondary" className="text-green-600">
                      {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button size="lg" variant="outline" asChild>
            <Link href="/products">View All Products</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
