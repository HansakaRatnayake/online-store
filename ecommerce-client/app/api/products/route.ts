import { type NextRequest, NextResponse } from "next/server"
import connectToDatabase from "@/app/api/lib/mongodb";
import { Product } from "@/app/api/models/Product";

// Mock products database
const products = [
  {
    id: 1,
    name: "Premium Wireless Headphones",
    price: 299.99,
    originalPrice: 399.99,
    rating: 4.8,
    reviews: 124,
    image: "/placeholder.svg?height=300&width=300",
    images: [
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
    ],
    badge: "Best Seller",
    category: "Electronics",
    brand: "Sony",
    inStock: true,
    stockCount: 15,
    description: "Experience premium sound quality with these wireless headphones featuring active noise cancellation.",
    features: [
      "Active Noise Cancellation",
      "30-hour battery life",
      "Quick charge - 10 min for 5 hours",
      "Premium comfort design",
    ],
    specifications: {
      "Driver Size": "40mm",
      "Frequency Response": "4Hz-40kHz",
      "Battery Life": "30 hours",
      Weight: "254g",
    },
  },
  {
    id: 2,
    name: "Designer Leather Jacket",
    price: 199.99,
    originalPrice: 299.99,
    rating: 4.9,
    reviews: 89,
    image: "/placeholder.svg?height=300&width=300",
    images: ["/placeholder.svg?height=600&width=600"],
    badge: "New Arrival",
    category: "Fashion",
    brand: "Nike",
    inStock: true,
    stockCount: 8,
    description: "Stylish leather jacket perfect for any occasion",
    features: ["Genuine leather", "Multiple pockets", "Comfortable fit"],
    specifications: {
      Material: "Genuine Leather",
      Lining: "Polyester",
      Care: "Professional clean only",
    },
  },
]

export async function GET(request: NextRequest) {
  try {

    await connectToDatabase();

    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const search = searchParams.get("search")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")

    let query: any = {};
    if (category) {
      query.category = { $regex: category, $options: "i" }; // Case-insensitive match
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // Fetch products with pagination
    const products = await Product.find(query)
        .skip((page - 1) * limit)
        .limit(limit)
        .lean();

    // let filteredProducts = [...products]


    // Filter by category
    // if (category) {
    //   filteredProducts = filteredProducts.filter((p) => p.category.toLowerCase() === category.toLowerCase())
    // }

    // Filter by search term
    // if (search) {
    //   filteredProducts = filteredProducts.filter(
    //     (p) =>
    //       p.name.toLowerCase().includes(search.toLowerCase()) ||
    //       p.description.toLowerCase().includes(search.toLowerCase()),
    //   )
    // }

    // Pagination
    // const startIndex = (page - 1) * limit
    // const endIndex = startIndex + limit
    // const paginatedProducts = filteredProducts.slice(startIndex, endIndex)

    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 }
    );
  }
}
