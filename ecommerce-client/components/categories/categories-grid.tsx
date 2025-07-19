"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, TrendingUp, Package } from "lucide-react";

interface Category {
  id: number;
  name: string;
  description: string;
  image: string;
  productCount: number;
  trending: boolean;
  subcategories: string[];
  href: string;
}

export default function CategoriesGrid() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories`, {
          cache: "no-store",
        });
        if (!res.ok) {
          throw new Error("Failed to fetch categories");
        }

        const data = await res.json();
        console.log(data);
        setCategories(data);
        setFilteredCategories(data);
        setLoading(false);
      } catch (err) {
        setError("Unable to load categories. Please try again later.");
        setLoading(false);
      }
    }
    fetchCategories();
  }, []);

  useEffect(() => {
    const filtered = categories.filter(
        (category) =>
            category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            category.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            category.subcategories.some((sub) => sub.toLowerCase().includes(searchTerm.toLowerCase())),
    );
    setFilteredCategories(filtered);
  }, [searchTerm, categories]);

  if (loading) {
    return (
        <div className="flex justify-center items-center h-64">
          <Package className="w-12 h-12 text-gray-400 animate-spin" />
        </div>
    );
  }

  if (error) {
    return (
        <div className="text-center py-12">
          <Package className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error</h3>
          <p className="text-gray-600">{error}</p>
        </div>
    );
  }

  return (
      <div className="space-y-8">
        {/* Search */}
        <div className="max-w-md mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
                type="text"
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
            />
          </div>
        </div>

        {/* Trending Categories */}
        <div>
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-5 h-5 text-orange-500" />
            <h2 className="text-xl font-semibold text-gray-900">Trending Categories</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {filteredCategories
                .filter((cat) => cat.trending)
                .map((category) => (
                    <Card key={category.id} className="group hover:shadow-lg transition-all duration-300">
                      <Link href={category.href}>
                        <CardContent className="p-0">
                          <div className="relative overflow-hidden rounded-t-lg">
                            <Image
                                src={category.image || "/placeholder.svg"}
                                alt={category.name}
                                width={400}
                                height={200}
                                className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <Badge className="absolute top-2 right-2 bg-orange-500">Trending</Badge>
                          </div>
                          <div className="p-4">
                            <h3 className="font-semibold text-gray-900 mb-1">{category.name}</h3>
                            <p className="text-xs text-gray-600 mb-2 line-clamp-2">{category.description}</p>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-500">{category.productCount.toLocaleString()} items</span>
                              <Package className="w-4 h-4 text-gray-400" />
                            </div>
                          </div>
                        </CardContent>
                      </Link>
                    </Card>
                ))}
          </div>
        </div>

        {/* All Categories */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-6">All Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCategories.map((category) => (
                <Card key={category.id} className="group hover:shadow-lg transition-all duration-300">
                  <Link href={category.href}>
                    <CardContent className="p-0">
                      <div className="flex">
                        <div className="relative w-32 h-32 flex-shrink-0">
                          <Image
                              src={category.image || "/placeholder.svg"}
                              alt={category.name}
                              width={128}
                              height={128}
                              className="w-full h-full object-cover rounded-l-lg group-hover:scale-105 transition-transform duration-300"
                          />
                          {category.trending && <Badge className="absolute top-2 left-2 bg-orange-500 text-xs">Hot</Badge>}
                        </div>
                        <div className="flex-1 p-4">
                          <h3 className="font-semibold text-gray-900 mb-2">{category.name}</h3>
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{category.description}</p>
                          <div className="mb-3">
                            <div className="flex flex-wrap gap-1">
                              {category.subcategories.slice(0, 3).map((sub) => (
                                  <Badge key={sub} variant="secondary" className="text-xs">
                                    {sub}
                                  </Badge>
                              ))}
                              {category.subcategories.length > 3 && (
                                  <Badge variant="secondary" className="text-xs">
                                    +{category.subcategories.length - 3}
                                  </Badge>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500 font-medium">
                          {category.productCount.toLocaleString()} products
                        </span>
                            <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 p-0">
                              Explore →
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Link>
                </Card>
            ))}
          </div>
        </div>

        {filteredCategories.length === 0 && (
            <div className="text-center py-12">
              <Package className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No categories found</h3>
              <p className="text-gray-600">Try adjusting your search terms</p>
            </div>
        )}
      </div>
  );
}