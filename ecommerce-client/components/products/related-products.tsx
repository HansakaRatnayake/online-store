import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star } from "lucide-react"

const relatedProducts = [
  {
    id: 2,
    name: "Wireless Earbuds Pro",
    price: 199.99,
    originalPrice: 249.99,
    rating: 4.7,
    reviews: 89,
    image: "/placeholder.svg?height=300&width=300",
    badge: "New",
  },
  {
    id: 3,
    name: "Bluetooth Speaker",
    price: 149.99,
    originalPrice: 199.99,
    rating: 4.6,
    reviews: 156,
    image: "/placeholder.svg?height=300&width=300",
    badge: "Sale",
  },
  {
    id: 4,
    name: "Gaming Headset",
    price: 89.99,
    originalPrice: 129.99,
    rating: 4.5,
    reviews: 203,
    image: "/placeholder.svg?height=300&width=300",
    badge: "Popular",
  },
  {
    id: 5,
    name: "Noise Cancelling Headphones",
    price: 349.99,
    originalPrice: 449.99,
    rating: 4.9,
    reviews: 67,
    image: "/placeholder.svg?height=300&width=300",
    badge: "Premium",
  },
]

interface RelatedProductsProps {
  productId: string
}

export default function RelatedProducts({ productId }: RelatedProductsProps) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Products</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {relatedProducts.map((product) => (
          <Card key={product.id} className="group hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-0">
              <div className="relative overflow-hidden rounded-t-lg">
                <Link href={`/products/${product.id}`}>
                  <Image
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    width={300}
                    height={300}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </Link>
                <Badge className="absolute top-3 left-3 bg-red-500 hover:bg-red-600">{product.badge}</Badge>
              </div>

              <div className="p-4">
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
    </div>
  )
}
