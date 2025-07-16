import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"

// Mock user database - in real app, use MongoDB
const users = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@example.com",
    password: "$2a$10$TVgO8zyEigLIuRbPq7gamubPq1SmXKSwEBmxEcWoiWW5Uog6jsGfq", // password
    role: "admin",
  },
  {
    id: "2",
    name: "John Doe",
    email: "john@example.com",
    password: "$2a$10$TVgO8zyEigLIuRbPq7gamubPq1SmXKSwEBmxEcWoiWW5Uog6jsGfq", // password
    role: "customer",
  },
]

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Validate input
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    // Find user
    const user = users.find((u) => u.email === email)
    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "7d" },
    )

    // Return user data and token
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json({
      user: userWithoutPassword,
      token,
      message: "Login successful",
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
