import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"

// Mock wishlist database - in real app, use MongoDB
const wishlists: { [userId: string]: any[] } = {}

function verifyToken(request: NextRequest) {
  const authHeader = request.headers.get("authorization")
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("No token provided")
  }

  const token = authHeader.substring(7)
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key") as any
    return decoded.userId
  } catch (error) {
    throw new Error("Invalid token")
  }
}

export async function GET(request: NextRequest) {
  try {
    const userId = verifyToken(request)
    const userWishlist = wishlists[userId] || []

    return NextResponse.json({
      items: userWishlist,
      total: userWishlist.length,
    })
  } catch (error) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = verifyToken(request)
    const { productId, name, price, image, category } = await request.json()

    if (!wishlists[userId]) {
      wishlists[userId] = []
    }

    // Check if item already exists
    const existingItem = wishlists[userId].find((item) => item.productId === productId)
    if (existingItem) {
      return NextResponse.json({ error: "Item already in wishlist" }, { status: 400 })
    }

    const wishlistItem = {
      id: Date.now(),
      productId,
      name,
      price,
      image,
      category,
      addedAt: new Date().toISOString(),
    }

    wishlists[userId].push(wishlistItem)

    return NextResponse.json({
      message: "Item added to wishlist",
      item: wishlistItem,
    })
  } catch (error) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const userId = verifyToken(request)
    const { searchParams } = new URL(request.url)
    const productId = searchParams.get("productId")

    if (!productId) {
      return NextResponse.json({ error: "Product ID required" }, { status: 400 })
    }

    if (!wishlists[userId]) {
      return NextResponse.json({ error: "Wishlist not found" }, { status: 404 })
    }

    wishlists[userId] = wishlists[userId].filter((item) => item.productId !== Number.parseInt(productId))

    return NextResponse.json({ message: "Item removed from wishlist" })
  } catch (error) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
}
