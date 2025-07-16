import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"

// Mock products database
const products = [
  {
    id: 1,
    name: "Premium Wireless Headphones",
    price: 299.99,
    originalPrice: 399.99,
    category: "Electronics",
    brand: "Sony",
    stock: 15,
    status: "active",
    image: "/placeholder.svg?height=100&width=100",
    description: "High-quality wireless headphones with noise cancellation",
    createdAt: "2024-01-15",
    sales: 45,
  },
  {
    id: 2,
    name: "Designer Leather Jacket",
    price: 199.99,
    originalPrice: 299.99,
    category: "Fashion",
    brand: "Nike",
    stock: 8,
    status: "active",
    image: "/placeholder.svg?height=100&width=100",
    description: "Stylish leather jacket perfect for any occasion",
    createdAt: "2024-01-10",
    sales: 23,
  },
]

function verifyAdminToken(request: NextRequest) {
  const authHeader = request.headers.get("authorization")
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("No token provided")
  }

  const token = authHeader.substring(7)
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key") as any
    if (decoded.role !== "admin") {
      throw new Error("Admin access required")
    }
    return decoded.userId
  } catch (error) {
    throw new Error("Invalid token or insufficient permissions")
  }
}

export async function GET(request: NextRequest) {
  try {
    verifyAdminToken(request)

    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const status = searchParams.get("status")
    const search = searchParams.get("search")

    let filteredProducts = [...products]

    if (category && category !== "all") {
      filteredProducts = filteredProducts.filter((p) => p.category.toLowerCase() === category.toLowerCase())
    }

    if (status) {
      filteredProducts = filteredProducts.filter((p) => p.status === status)
    }

    if (search) {
      filteredProducts = filteredProducts.filter(
        (p) =>
          p.name.toLowerCase().includes(search.toLowerCase()) || p.brand.toLowerCase().includes(search.toLowerCase()),
      )
    }

    return NextResponse.json({
      products: filteredProducts,
      total: filteredProducts.length,
      stats: {
        totalProducts: products.length,
        activeProducts: products.filter((p) => p.status === "active").length,
        lowStockProducts: products.filter((p) => p.stock <= 5).length,
        totalValue: products.reduce((sum, p) => sum + p.price * p.stock, 0),
      },
    })
  } catch (error) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
}

export async function POST(request: NextRequest) {
  try {
    verifyAdminToken(request)

    const productData = await request.json()
    const newProduct = {
      id: Date.now(),
      ...productData,
      createdAt: new Date().toISOString().split("T")[0],
      sales: 0,
      image: "/placeholder.svg?height=100&width=100",
    }

    products.push(newProduct)

    return NextResponse.json({
      message: "Product created successfully",
      product: newProduct,
    })
  } catch (error) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    verifyAdminToken(request)

    const { id, ...updateData } = await request.json()
    const productIndex = products.findIndex((p) => p.id === id)

    if (productIndex === -1) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    products[productIndex] = { ...products[productIndex], ...updateData }

    return NextResponse.json({
      message: "Product updated successfully",
      product: products[productIndex],
    })
  } catch (error) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    verifyAdminToken(request)

    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Product ID required" }, { status: 400 })
    }

    const productIndex = products.findIndex((p) => p.id === Number.parseInt(id))
    if (productIndex === -1) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    products.splice(productIndex, 1)

    return NextResponse.json({ message: "Product deleted successfully" })
  } catch (error) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
}
