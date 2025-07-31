"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Heart, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/components/providers/cart-provider"
import { useToast } from "@/hooks/use-toast"

interface RelatedProductsProps {
  productId: string
}

export default function RelatedProducts({ productId }: RelatedProductsProps) {
  const [relatedProducts, setRelatedProducts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { addToCart } = useCart()
  const { toast } = useToast()

  useEffect(() => {
    async function fetchRelatedProducts() {
      try {
        // First, fetch the current product to get its category
        const productResponse = await fetch(`http://localhost:5000/api/products/${productId}`);
        if (!productResponse.ok) {
          throw new Error("Failed to fetch product");
        }
        const product = await productResponse.json();

        // Fetch related products by category
        const response = await fetch(`http://localhost:5000/api/products/related/${encodeURIComponent(product.category)}`);
        if (!response.ok) {
          throw new Error("Failed to fetch related products");
        }
        const data = await response.json();
        // Exclude the current product from related products
        setRelatedProducts(data.filter((p: any) => p.id !== parseInt(productId)));
        setIsLoading(false);
      } catch (err) {
        setError("Error fetching related products");
        setIsLoading(false);
        console.error(err);
      }
    }

    fetchRelatedProducts();
  }, [productId]);

  const handleAddToCart = (product: any) => {
    addToCart(
        {
          id: product.id.toString(), // Cast number to string to match CartItem
          name: product.name,
          price: product.price,
          image: product.image,
          category: product.category,
          brand: product.brand,
          shipping: product.shipping,
        },
        1 // Pass quantity as second argument
    );
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading related products...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-600">{error}</div>;
  }

  if (relatedProducts.length === 0) {
    return <div className="text-center py-8">No related products found</div>;
  }

  return (
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {relatedProducts.map((product) => (
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
      </div>
  );
}