"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Star, Heart, ShoppingCart, Grid, List } from "lucide-react";
import { useCart } from "@/components/providers/cart-provider";
import { useToast } from "@/hooks/use-toast";
import {useWishlist} from "@/components/providers/wishlist-provider";

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviews: number;
  image: string;
  badge?: string;
  category: string;
  brand: string;
  inStock: boolean;
  description?: string;
  shipping: { free: boolean; estimatedDays: string }; // Add shipping
}

interface ProductGridProps {
  products: Product[];
  page: number;
  setPage: (page: number) => void;
  totalPages: number;
}

export default function ProductGrid({ products, page, setPage, totalPages }: ProductGridProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("featured");
  const { addToCart } = useCart(); // Use addToCart instead of addItem
  const { addToWishlist } = useWishlist(); // Use addToCart instead of addItem
  const { toast } = useToast();

  const handleAddToCart = (product: Product) => {
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

  const handleAddToWishlist = (product: Product) => {
    addToWishlist(
        {
          id: product.id.toString(),
          name: product.name,
          price: product.price,
          rating: product.rating,
          image: product.image,
          category: product.category,
          brand: product.brand,
          inStock: product.inStock,
        },
    );
    toast({
      title: "Added to wishlist",
      description: `${product.name} has been added to your wishlist.`,
    })
  };

  const sortedProducts = [...products].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "rating":
        return b.rating - a.rating;
      case "newest":
        return b.id - a.id;
      default:
        return 0;
    }
  });

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

        {/* No Products Message */}
        {products.length === 0 && (
            <div className="text-center py-8 text-gray-600">No products found matching your filters.</div>
        )}

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
                          <Button size="icon" variant="secondary" className="rounded-full" onClick={() => handleAddToWishlist(product)}>
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

        {/* Pagination Controls */}
        {products.length > 0 && (
            <div className="flex justify-center items-center gap-4 mt-6">
              <Button
                  variant="outline"
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
              >
                Previous
              </Button>
              <span className="text-gray-600">
            Page {page} of {totalPages}
          </span>
              <Button
                  variant="outline"
                  disabled={page === totalPages}
                  onClick={() => setPage(page + 1)}
              >
                Next
              </Button>
            </div>
        )}
      </div>
  );
}