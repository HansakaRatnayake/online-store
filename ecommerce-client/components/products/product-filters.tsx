"use client"

import { useState, useEffect } from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"

const categories = [
  { id: "electronics", name: "Electronics", count: 1250 },
  { id: "fashion", name: "Fashion", count: 2100 },
  { id: "home", name: "Home & Garden", count: 890 },
  { id: "beauty", name: "Beauty", count: 650 },
  { id: "sports", name: "Sports", count: 780 },
  { id: "books", name: "Books", count: 1500 },
]

const brands = [
  { id: "apple", name: "Apple", count: 45 },
  { id: "samsung", name: "Samsung", count: 38 },
  { id: "nike", name: "Nike", count: 67 },
  { id: "adidas", name: "Adidas", count: 52 },
  { id: "sony", name: "Sony", count: 29 },
]

const colors = [
  { id: "black", name: "Black", hex: "#000000" },
  { id: "white", name: "White", hex: "#FFFFFF" },
  { id: "red", name: "Red", hex: "#EF4444" },
  { id: "blue", name: "Blue", hex: "#3B82F6" },
  { id: "green", name: "Green", hex: "#10B981" },
]
interface Category {
  id: string
  name: string
  count: number
}

interface ProductFiltersProps {
  filters: {
    categories: string[]
    brands: string[]
    colors: string[]
    priceRange: [number, number]
    rating: [number]
  }
  setFilters: (filters: ProductFiltersProps["filters"]) => void
}

export default function ProductFilters({ filters, setFilters }: ProductFiltersProps) {
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories`)
        if (!res.ok) throw new Error("Failed to fetch categories")
        const data = await res.json()
        // Aggregate counts
        const counts = await Promise.all(
            data.map(async (cat: { name: string }) => {
              const countRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/customer/products?categories=${cat.name}`)
              const countData = await countRes.json()
              return { id: cat.name.toLowerCase(), name: cat.name, count: countData.total }
            })
        )
        setCategories(counts)
      } catch (err) {
        console.error(err)
      }
    }
    fetchCategories()
  }, [])
  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    setFilters({
      ...filters,
      categories: checked
          ? [...filters.categories, categoryId]
          : filters.categories.filter((id) => id !== categoryId),
    })
  }

  const handleBrandChange = (brandId: string, checked: boolean) => {
    setFilters({
      ...filters,
      brands: checked
          ? [...filters.brands, brandId]
          : filters.brands.filter((id) => id !== brandId),
    })
  }

  const handleColorChange = (colorId: string, checked: boolean) => {
    setFilters({
      ...filters,
      colors: checked
          ? [...filters.colors, colorId]
          : filters.colors.filter((id) => id !== colorId),
    })
  }

  const handlePriceRangeChange = (value: number[]) => {
    setFilters({ ...filters, priceRange: [value[0], value[1]] })
  }

  const handleRatingChange = (value: number[]) => {
    setFilters({ ...filters, rating: [value[0]] })
  }

  const clearAllFilters = () => {
    setFilters({
      categories: [],
      brands: [],
      colors: [],
      priceRange: [0, 1000],
      rating: [0],
    })
  }

  const activeFiltersCount = filters.categories.length + filters.brands.length + filters.colors.length

  return (
      <div className="space-y-6">
        {/* Active Filters */}
        {activeFiltersCount > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">Active Filters</CardTitle>
                  <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                    Clear All
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex flex-wrap gap-2">
                  {filters.categories.map((categoryId) => {
                    const category = categories.find((c) => c.id === categoryId)
                    return (
                        <Badge key={categoryId} variant="secondary" className="flex items-center gap-1">
                          {category?.name}
                          <X className="w-3 h-3 cursor-pointer" onClick={() => handleCategoryChange(categoryId, false)} />
                        </Badge>
                    )
                  })}
                  {filters.brands.map((brandId) => {
                    const brand = brands.find((b) => b.id === brandId)
                    return (
                        <Badge key={brandId} variant="secondary" className="flex items-center gap-1">
                          {brand?.name}
                          <X className="w-3 h-3 cursor-pointer" onClick={() => handleBrandChange(brandId, false)} />
                        </Badge>
                    )
                  })}
                  {filters.colors.map((colorId) => {
                    const color = colors.find((c) => c.id === colorId)
                    return (
                        <Badge key={colorId} variant="secondary" className="flex items-center gap-1">
                          {color?.name}
                          <X className="w-3 h-3 cursor-pointer" onClick={() => handleColorChange(colorId, false)} />
                        </Badge>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
        )}

        {/* Categories */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {categories.map((category) => (
                  <div key={category.id} className="flex items-center space-x-2">
                    <Checkbox
                        id={category.id}
                        checked={filters.categories.includes(category.id)}
                        onCheckedChange={(checked) => handleCategoryChange(category.id, checked as boolean)}
                    />
                    <Label htmlFor={category.id} className="flex-1 text-sm cursor-pointer">
                      {category.name}
                    </Label>
                    <span className="text-xs text-gray-500">({category.count})</span>
                  </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Price Range */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Price Range</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Slider
                  value={filters.priceRange}
                  onValueChange={handlePriceRangeChange}
                  max={1000}
                  step={10}
                  className="w-full"
              />
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>${filters.priceRange[0]}</span>
                <span>${filters.priceRange[1]}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Brands */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Brands</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {brands.map((brand) => (
                  <div key={brand.id} className="flex items-center space-x-2">
                    <Checkbox
                        id={brand.id}
                        checked={filters.brands.includes(brand.id)}
                        onCheckedChange={(checked) => handleBrandChange(brand.id, checked as boolean)}
                    />
                    <Label htmlFor={brand.id} className="flex-1 text-sm cursor-pointer">
                      {brand.name}
                    </Label>
                    <span className="text-xs text-gray-500">({brand.count})</span>
                  </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Colors */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Colors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {colors.map((color) => (
                  <div key={color.id} className="flex items-center space-x-2">
                    <Checkbox
                        id={color.id}
                        checked={filters.colors.includes(color.id)}
                        onCheckedChange={(checked) => handleColorChange(color.id, checked as boolean)}
                    />
                    <div className="w-4 h-4 rounded-full border border-gray-300" style={{ backgroundColor: color.hex }} />
                    <Label htmlFor={color.id} className="flex-1 text-sm cursor-pointer">
                      {color.name}
                    </Label>
                  </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Rating */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Minimum Rating</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Slider
                  value={filters.rating}
                  onValueChange={handleRatingChange}
                  max={5}
                  step={1}
                  className="w-full"
              />
              <div className="text-sm text-gray-600">{filters.rating[0]} stars and above</div>
            </div>
          </CardContent>
        </Card>
      </div>
  )
}