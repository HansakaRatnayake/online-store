"use client"

import { useState } from "react"
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

export default function ProductFilters() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [selectedColors, setSelectedColors] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState([0, 1000])
  const [rating, setRating] = useState([0])

  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    if (checked) {
      setSelectedCategories([...selectedCategories, categoryId])
    } else {
      setSelectedCategories(selectedCategories.filter((id) => id !== categoryId))
    }
  }

  const handleBrandChange = (brandId: string, checked: boolean) => {
    if (checked) {
      setSelectedBrands([...selectedBrands, brandId])
    } else {
      setSelectedBrands(selectedBrands.filter((id) => id !== brandId))
    }
  }

  const handleColorChange = (colorId: string, checked: boolean) => {
    if (checked) {
      setSelectedColors([...selectedColors, colorId])
    } else {
      setSelectedColors(selectedColors.filter((id) => id !== colorId))
    }
  }

  const clearAllFilters = () => {
    setSelectedCategories([])
    setSelectedBrands([])
    setSelectedColors([])
    setPriceRange([0, 1000])
    setRating([0])
  }

  const activeFiltersCount = selectedCategories.length + selectedBrands.length + selectedColors.length

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
              {selectedCategories.map((categoryId) => {
                const category = categories.find((c) => c.id === categoryId)
                return (
                  <Badge key={categoryId} variant="secondary" className="flex items-center gap-1">
                    {category?.name}
                    <X className="w-3 h-3 cursor-pointer" onClick={() => handleCategoryChange(categoryId, false)} />
                  </Badge>
                )
              })}
              {selectedBrands.map((brandId) => {
                const brand = brands.find((b) => b.id === brandId)
                return (
                  <Badge key={brandId} variant="secondary" className="flex items-center gap-1">
                    {brand?.name}
                    <X className="w-3 h-3 cursor-pointer" onClick={() => handleBrandChange(brandId, false)} />
                  </Badge>
                )
              })}
              {selectedColors.map((colorId) => {
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
                  checked={selectedCategories.includes(category.id)}
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
            <Slider value={priceRange} onValueChange={setPriceRange} max={1000} step={10} className="w-full" />
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>${priceRange[0]}</span>
              <span>${priceRange[1]}</span>
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
                  checked={selectedBrands.includes(brand.id)}
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
                  checked={selectedColors.includes(color.id)}
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
            <Slider value={rating} onValueChange={setRating} max={5} step={1} className="w-full" />
            <div className="text-sm text-gray-600">{rating[0]} stars and above</div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
