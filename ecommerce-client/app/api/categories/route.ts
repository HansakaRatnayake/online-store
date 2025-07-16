import { type NextRequest, NextResponse } from "next/server"

const categories = [
  {
    id: 1,
    name: "Electronics",
    description: "Latest gadgets, smartphones, laptops & tech accessories",
    image: "/placeholder.svg?height=300&width=400",
    productCount: 1250,
    trending: true,
    subcategories: ["Smartphones", "Laptops", "Headphones", "Cameras", "Gaming"],
  },
  {
    id: 2,
    name: "Fashion",
    description: "Trendy clothing, shoes, and accessories for all styles",
    image: "/placeholder.svg?height=300&width=400",
    productCount: 2100,
    trending: true,
    subcategories: ["Men's Clothing", "Women's Clothing", "Shoes", "Accessories", "Jewelry"],
  },
  {
    id: 3,
    name: "Home & Garden",
    description: "Everything you need for your home and outdoor spaces",
    image: "/placeholder.svg?height=300&width=400",
    productCount: 890,
    trending: false,
    subcategories: ["Furniture", "Decor", "Kitchen", "Garden", "Tools"],
  },
  {
    id: 4,
    name: "Beauty & Personal Care",
    description: "Skincare, cosmetics, and personal care essentials",
    image: "/placeholder.svg?height=300&width=400",
    productCount: 650,
    trending: true,
    subcategories: ["Skincare", "Makeup", "Hair Care", "Fragrances", "Personal Care"],
  },
  {
    id: 5,
    name: "Sports & Outdoors",
    description: "Fitness equipment, outdoor gear, and sports accessories",
    image: "/placeholder.svg?height=300&width=400",
    productCount: 780,
    trending: false,
    subcategories: ["Fitness", "Outdoor", "Sports Equipment", "Activewear", "Camping"],
  },
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const trending = searchParams.get("trending")

    let filteredCategories = [...categories]

    if (trending === "true") {
      filteredCategories = filteredCategories.filter((c) => c.trending)
    }

    return NextResponse.json({
      categories: filteredCategories,
      total: filteredCategories.length,
    })
  } catch (error) {
    console.error("Error fetching categories:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
