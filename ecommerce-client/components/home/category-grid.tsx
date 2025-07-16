"use client"

import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { useEffect, useState } from "react"

interface Category {
  id: number
  name: string
  description: string
  image: string
  productCount: number
  href: string
}

export default function CategoryGrid() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response =await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories`)
        if (!response.ok) {
          throw new Error("Failed to fetch categories")
        }
        const data = await response.json()
        // Limit to first 6 categories
        setCategories(data.slice(0, 6))
        setIsLoading(false)
      } catch (err) {
        setError("Error fetching categories")
        setIsLoading(false)
        console.error(err)
      }
    }

    fetchCategories()
  }, [])

  if (isLoading) {
    return (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Shop by Category</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Loading categories...
              </p>
            </div>
          </div>
        </section>
    )
  }

  if (error) {
    return (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Shop by Category</h2>
              <p className="text-lg text-red-600 max-w-2xl mx-auto">
                {error}
              </p>
            </div>
          </div>
        </section>
    )
  }

  return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Shop by Category</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore our wide range of categories to find exactly what you're looking for
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
                <Card key={category.id} className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
                  <Link href={category.href}>
                    <CardContent className="p-0">
                      <div className="relative overflow-hidden">
                        <Image
                            src={category.image || "/placeholder.svg"}
                            alt={category.name}
                            width={300}
                            height={200}
                            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                        <div className="absolute bottom-4 left-4 text-white">
                          <h3 className="text-xl font-bold mb-1">{category.name}</h3>
                          <p className="text-sm opacity-90">{category.description}</p>
                          <p className="text-xs opacity-75 mt-1">{category.productCount.toLocaleString()} products</p>
                        </div>
                      </div>
                    </CardContent>
                  </Link>
                </Card>
            ))}
          </div>
        </div>
      </section>
  )
}