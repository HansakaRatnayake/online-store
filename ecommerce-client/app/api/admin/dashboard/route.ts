import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"

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

    // Mock dashboard data
    const dashboardData = {
      stats: {
        totalRevenue: 45231.89,
        revenueGrowth: 20.1,
        totalOrders: 2350,
        ordersGrowth: 15.3,
        totalCustomers: 1429,
        customersGrowth: 8.2,
        totalProducts: 573,
        productsGrowth: -2.4,
      },
      recentOrders: [
        {
          id: "#ORD-001",
          customer: "John Doe",
          email: "john@example.com",
          total: 299.99,
          status: "processing",
          date: "2024-01-15",
          items: 2,
        },
        {
          id: "#ORD-002",
          customer: "Sarah Smith",
          email: "sarah@example.com",
          total: 159.99,
          status: "shipped",
          date: "2024-01-14",
          items: 1,
        },
      ],
      salesData: [
        { month: "Jan", sales: 12000, orders: 145 },
        { month: "Feb", sales: 15000, orders: 178 },
        { month: "Mar", sales: 18000, orders: 210 },
        { month: "Apr", sales: 22000, orders: 245 },
        { month: "May", sales: 19000, orders: 198 },
        { month: "Jun", sales: 25000, orders: 289 },
      ],
      lowStockProducts: [
        { id: 1, name: "Premium Headphones", stock: 3 },
        { id: 2, name: "Smart Watch", stock: 1 },
      ],
    }

    return NextResponse.json(dashboardData)
  } catch (error) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
}
