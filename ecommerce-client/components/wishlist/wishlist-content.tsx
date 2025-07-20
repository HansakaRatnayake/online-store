"use client"

import {useEffect, useState} from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, ShoppingCart, Trash2, Share2, Star } from "lucide-react"
import { useWishlist } from "@/components/providers/wishlist-provider"
import { useAuth } from "@/components/providers/auth-provider"
import { useToast } from "@/hooks/use-toast"
import {useCart} from "@/components/providers/cart-provider";


export default function WishlistContent() {
  // const [wishlistItems, setWishlistItems] = useState(mockWishlistItems)
  const { addToCart } = useCart();
  const { items, removeItem } = useWishlist();
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Just for smooth UX loading
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const handleRemoveFromWishlist = (id: string, name: string) => {
    removeItem(id);
    toast({
      title: "Removed from wishlist",
      description: `${name} has been removed from your wishlist.`,
    });
  }

  const handleAddToCart = (product: any) => {
    addToCart(
        {
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          brand: product.brand || "",
          category: product.category,
          shipping: {
            free: true,
            estimatedDays: "5-7",
          },
        },
        1 // default quantity
    );
    toast({
      title: "Added to wishlist",
      description: `${product.name} has been added to your wishlist.`,
    })
  }

  const handleAddAllToCart = () => {
    const inStockItems = items.filter((item) => item.inStock)
    inStockItems.forEach((item) => {
        addToCart(
            {
                id: item.id,
                name: item.name,
                price: item.price,
                image: item.image,
                brand: item.brand || "",
                category: item.category,
                shipping: {
                    free: true,
                    estimatedDays: "5-7",
                },
            },
            1 // default quantity
        );
        toast({
            title: "Added to cart",
            description: `${inStockItems.length} items have been added to your cart.`,
        })
    });
  }

  const handleShare = (product: any) => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Check out this ${product.name} on SmartCart`,
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

  if (items.length === 0) {
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

  const inStockCount = items.filter((item) => item.inStock).length

  return (
    <div className="space-y-6">
      {/* Wishlist Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-lg shadow-sm">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            {items.length} {items.length === 1 ? "Item" : "Items"} in Wishlist
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
        {items.map((item) => (
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
                  <span className="text-sm text-gray-500 ml-2">({item.rating})</span>
                </div>

                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-bold text-gray-900">${item.price}</span>
                    {item.price > item.price && (
                      <span className="text-sm text-gray-500 line-through">${item.price}</span>
                    )}
                  </div>
                  {item.price > item.price && (
                    <Badge variant="secondary" className="text-green-600">
                      {Math.round(((item.price - item.price) / item.price) * 100)}% OFF
                    </Badge>
                  )}
                </div>

                <div className="text-xs text-gray-500 mb-3">Added on 2025.07.07</div>

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
