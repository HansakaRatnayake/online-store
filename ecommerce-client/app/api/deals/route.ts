import { type NextRequest, NextResponse } from "next/server"

const deals = [
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
    type: "flash",
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
    type: "flash",
  },
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
    type: "daily",
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
    type: "daily",
  },
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type") // flash, daily, weekly
    const category = searchParams.get("category")

    let filteredDeals = [...deals]

    if (type) {
      filteredDeals = filteredDeals.filter((d) => d.type === type)
    }

    if (category) {
      filteredDeals = filteredDeals.filter((d) => d.category.toLowerCase() === category.toLowerCase())
    }

    return NextResponse.json({
      deals: filteredDeals,
      total: filteredDeals.length,
    })
  } catch (error) {
    console.error("Error fetching deals:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
