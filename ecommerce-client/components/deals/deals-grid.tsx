"use client"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Star, Clock, Flame, ShoppingCart, Heart } from "lucide-react"
import { useCart } from "@/components/providers/cart-provider"
import { useToast } from "@/hooks/use-toast"

const flashDeals = [
  {
    id: 1,
    name: "Premium Wireless Headphones",
    price: 199.99,
    originalPrice: 399.99,
    discount: 50,
    rating: 4.8,
    reviews: 124,
    image: "/placeholder.svg?height=300&width=300",
    timeLeft: "2h 15m",
    sold: 45,
    available: 100,
    category: "Electronics",
  },
  {
    id: 2,
    name: "Smart Fitness Watch",
    price: 149.99,
    originalPrice: 299.99,
    discount: 50,
    rating: 4.7,
    reviews: 89,
    image: "/placeholder.svg?height=300&width=300",
    timeLeft: "1h 45m",
    sold: 78,
    available: 120,
    category: "Electronics",
  },
]

const dailyDeals = [
  {
    id: 3,
    name: "Designer Leather Jacket",
    price: 159.99,
    originalPrice: 299.99,
    discount: 47,
    rating: 4.9,
    reviews: 156,
    image: "/placeholder.svg?height=300&width=300",
    timeLeft: "18h 30m",
    category: "Fashion",
  },
  {
    id: 4,
    name: "Professional Camera Lens",
    price: 399.99,
    originalPrice: 699.99,
    discount: 43,
    rating: 4.6,
    reviews: 67,
    image: "/placeholder.svg?height=300&width=300",
    timeLeft: "22h 15m",
    category: "Electronics",
  },
]

const weeklyDeals = [
  {
    id: 5,
    name: "Organic Skincare Set",
    price: 79.99,
    originalPrice: 129.99,
    discount: 38,
    rating: 4.9,
    reviews: 203,
    image: "/placeholder.svg?height=300&width=300",
    timeLeft: "5d 12h",
    category: "Beauty",
  },
  {
    id: 6,
    name: "Gaming Mechanical Keyboard",
    price: 89.99,
    originalPrice: 149.99,
    discount: 40,
    rating: 4.5,
    reviews: 134,
    image: "/placeholder.svg?height=300&width=300",
    timeLeft: "3d 8h",
    category: "Electronics",
  },
]

export default function DealsGrid() {
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

  const FlashDealCard = ({ product }: { product: any }) => {
    const soldPercentage = (product.sold / product.available) * 100

    return (
      <Card className="group hover:shadow-xl transition-all duration-300 border-2 border-red-200">
        <CardContent className="p-0">
          <div className="relative overflow-hidden rounded-t-lg">
            <Image
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              width={300}
              height={300}
              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute top-3 left-3 flex flex-col gap-2">
              <Badge className="bg-red-500 hover:bg-red-600 flex items-center gap-1">
                <Flame className="w-3 h-3" />
                {product.discount}% OFF
              </Badge>
              <Badge className="bg-black text-white flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {product.timeLeft}
              </Badge>
            </div>
            <Button
              size="icon"
              variant="secondary"
              className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity rounded-full"
            >
              <Heart className="w-4 h-4" />
            </Button>
          </div>

          <div className="p-4">
            <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{product.name}</h3>

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
              <span className="text-sm text-gray-500 ml-2">({product.reviews})</span>
            </div>

            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl font-bold text-red-600">${product.price}</span>
              <span className="text-lg text-gray-500 line-through">${product.originalPrice}</span>
            </div>

            <div className="mb-3">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Sold: {product.sold}</span>
                <span>Available: {product.available}</span>
              </div>
              <Progress value={soldPercentage} className="h-2" />
            </div>

            <Button onClick={() => handleAddToCart(product)} className="w-full bg-red-600 hover:bg-red-700">
              <ShoppingCart className="w-4 h-4 mr-2" />
              Add to Cart
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  const DealCard = ({ product }: { product: any }) => (
    <Card className="group hover:shadow-lg transition-shadow duration-300">
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
          <Badge className="absolute top-3 left-3 bg-orange-500 hover:bg-orange-600">{product.discount}% OFF</Badge>
          <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/70 text-white px-2 py-1 rounded text-xs">
            <Clock className="w-3 h-3" />
            {product.timeLeft}
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
            <span className="text-sm text-gray-500 ml-2">({product.reviews})</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold text-gray-900">${product.price}</span>
              <span className="text-sm text-gray-500 line-through">${product.originalPrice}</span>
            </div>
            <Button size="sm" onClick={() => handleAddToCart(product)}>
              <ShoppingCart className="w-4 h-4 mr-1" />
              Add
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-8">
      {/* Flash Deals */}
      <div>
        <div className="flex items-center gap-2 mb-6">
          <Flame className="w-6 h-6 text-red-500" />
          <h2 className="text-2xl font-bold text-gray-900">Flash Deals</h2>
          <Badge className="bg-red-500 text-white animate-pulse">Limited Time</Badge>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {flashDeals.map((product) => (
            <FlashDealCard key={product.id} product={product} />
          ))}
        </div>
      </div>

      {/* Deal Categories */}
      <Tabs defaultValue="daily" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
          <TabsTrigger value="daily">Daily Deals</TabsTrigger>
          <TabsTrigger value="weekly">Weekly Deals</TabsTrigger>
        </TabsList>

        <TabsContent value="daily" className="mt-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {dailyDeals.map((product) => (
              <DealCard key={product.id} product={product} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="weekly" className="mt-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {weeklyDeals.map((product) => (
              <DealCard key={product.id} product={product} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
