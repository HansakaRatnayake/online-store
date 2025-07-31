"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Star, Heart, Share2, ShoppingCart, Minus, Plus, Truck, Shield, RotateCcw, Check } from "lucide-react"
import { useCart } from "@/components/providers/cart-provider"
import { useToast } from "@/hooks/use-toast"

interface ProductDetailsProps {
  productId: string
}

export default function ProductDetails({ productId }: ProductDetailsProps) {
  const [product, setProduct] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedColor, setSelectedColor] = useState("")
  const [selectedSize, setSelectedSize] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [isWishlisted, setIsWishlisted] = useState(false)

  const { addToCart } = useCart()
  const { toast } = useToast()

  useEffect(() => {
    async function fetchProduct() {
      try {
        const response = await fetch(`http://localhost:5000/api/products/${productId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch product");
        }
        const productData = await response.json();
        setProduct(productData);
        setIsLoading(false);
        if (productData?.colors?.length > 0) {
          setSelectedColor(productData.colors[0]);
        }
        if (productData?.sizes?.length > 0) {
          setSelectedSize(productData.sizes[0]);
        }
      } catch (err) {
        setError("Error fetching product details");
        setIsLoading(false);
        console.error(err);
      }
    }

    fetchProduct();
  }, [productId]);

  const handleAddToCart = () => {
    if (!product) return

    addToCart({
      id: product.id.toString(),
      name: product.name,
      price: product.price,
      image: product.images[0],
      category: product.category,
      brand: product.brand,
      shipping: product.shipping,

    },quantity);

    toast({
      title: "Added to cart",
      description: `${quantity} ${product.name} added to your cart.`,
    })
  }

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted)
    toast({
      title: isWishlisted ? "Removed from wishlist" : "Added to wishlist",
      description: isWishlisted ? "Product removed from your wishlist." : "Product added to your wishlist.",
    })
  }

  if (isLoading) {
    return <div className="text-center py-8">Loading product details...</div>
  }

  if (error || !product) {
    return <div className="text-center py-8 text-red-600">{error || "Product not found"}</div>
  }

  return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
            <Image
                src={product.images[selectedImage] || "/placeholder.svg"}
                alt={product.name}
                width={600}
                height={600}
                className="w-full h-full object-cover"
            />
          </div>

          <div className="grid grid-cols-4 gap-4">
            {product.images.map((image: string, index: number) => (
                <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square overflow-hidden rounded-lg border-2 ${
                        selectedImage === index ? "border-blue-500" : "border-gray-200"
                    }`}
                >
                  <Image
                      src={image || "/placeholder.svg"}
                      alt={`${product.name} ${index + 1}`}
                      width={150}
                      height={150}
                      className="w-full h-full object-cover"
                  />
                </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge className="bg-red-500 hover:bg-red-600">{product.badge}</Badge>
              <span className="text-sm text-gray-500">{product.category}</span>
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
            <p className="text-gray-600 mb-4">{product.description}</p>

            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                    <Star
                        key={i}
                        className={`w-5 h-5 ${
                            i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                        }`}
                    />
                ))}
                <span className="ml-2 text-sm text-gray-600">
                {product.rating} ({product.reviews} reviews)
              </span>
              </div>
            </div>

            <div className="flex items-center gap-4 mb-6">
              <span className="text-3xl font-bold text-gray-900">${product.price}</span>
              {product.originalPrice > product.price && (
                  <>
                    <span className="text-xl text-gray-500 line-through">${product.originalPrice}</span>
                    <Badge variant="secondary" className="text-green-600">
                      {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                    </Badge>
                  </>
              )}
            </div>
          </div>

          {/* Color Selection */}
          {product.colors?.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">Color</h3>
                <div className="flex gap-2">
                  {product.colors.map((color: string) => (
                      <button
                          key={color}
                          onClick={() => setSelectedColor(color)}
                          className={`px-4 py-2 border rounded-md text-sm font-medium ${
                              selectedColor === color
                                  ? "border-blue-500 bg-blue-50 text-blue-700"
                                  : "border-gray-300 text-gray-700 hover:border-gray-400"
                          }`}
                      >
                        {color}
                      </button>
                  ))}
                </div>
              </div>
          )}

          {/* Size Selection */}
          {product.sizes?.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">Size</h3>
                <div className="flex gap-2">
                  {product.sizes.map((size: string) => (
                      <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`px-4 py-2 border rounded-md text-sm font-medium ${
                              selectedSize === size
                                  ? "border-blue-500 bg-blue-50 text-blue-700"
                                  : "border-gray-300 text-gray-700 hover:border-gray-400"
                          }`}
                      >
                        {size}
                      </button>
                  ))}
                </div>
              </div>
          )}

          {/* Quantity */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-3">Quantity</h3>
            <div className="flex items-center gap-3">
              <div className="flex items-center border rounded-md">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="px-4 py-2 font-medium">{quantity}</span>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setQuantity(Math.min(product.stockCount, quantity + 1))}
                    disabled={quantity >= product.stockCount}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <span className="text-sm text-gray-500">{product.stockCount} items available</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <Button onClick={handleAddToCart} className="flex-1" size="lg" disabled={!product.inStock}>
              <ShoppingCart className="w-5 h-5 mr-2" />
              Add to Cart
            </Button>

            <Button
                variant="outline"
                size="lg"
                onClick={handleWishlist}
                className={isWishlisted ? "text-red-600 border-red-600" : ""}
            >
              <Heart className={`w-5 h-5 ${isWishlisted ? "fill-current" : ""}`} />
            </Button>

            <Button variant="outline" size="lg">
              <Share2 className="w-5 h-5" />
            </Button>
          </div>

          {/* Shipping Info */}
          <Card>
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Truck className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-medium">Free Shipping</p>
                    <p className="text-sm text-gray-600">Delivery in {product.shipping?.estimatedDays || "3-5 business days"}</p>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-medium">2 Year Warranty</p>
                    <p className="text-sm text-gray-600">Full manufacturer warranty</p>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center gap-3">
                  <RotateCcw className="w-5 h-5 text-orange-600" />
                  <div>
                    <p className="font-medium">30-Day Returns</p>
                    <p className="text-sm text-gray-600">Easy returns and exchanges</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Product Details Tabs */}
          <Tabs defaultValue="features" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="specifications">Specifications</TabsTrigger>
              <TabsTrigger value="shipping">Shipping</TabsTrigger>
            </TabsList>

            <TabsContent value="features" className="mt-4">
              <Card>
                <CardContent className="p-4">
                  <ul className="space-y-2">
                    {product.features.map((feature: string, index: number) => (
                        <li key={index} className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-green-600" />
                          <span>{feature}</span>
                        </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="specifications" className="mt-4">
              <Card>
                <CardContent className="p-4">
                  <dl className="space-y-3">
                    {Object.entries(product.specifications).map(([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <dt className="font-medium text-gray-900">{key}</dt>
                          <dd className="text-gray-600">{value as string}</dd>
                        </div>
                    ))}
                  </dl>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="shipping" className="mt-4">
              <Card>
                <CardContent className="p-4">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Shipping Options</h4>
                      <ul className="space-y-2 text-sm text-gray-600">
                        <li>• Standard Shipping: 5-7 business days</li>
                        <li>• Express Shipping: 2-3 business days</li>
                        <li>• Next Day Delivery: Order before 2 PM</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Return Policy</h4>
                      <p className="text-sm text-gray-600">
                        30-day return policy. Items must be in original condition with all packaging.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
  )
}