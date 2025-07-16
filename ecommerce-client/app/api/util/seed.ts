import connectToDatabase from "../lib/mongodb"; // Relative path: go up one directory to api/, then into lib/
import { Product } from "../models/Product"; // Relative path: go up one directory to api/, then into models/
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config(); // Load .env.local

console.log("MONGODB_URI:", process.env.MONGODB_URI);

const products = [
    {
        id: 1,
        name: "Premium Wireless Headphones",
        price: 299.99,
        originalPrice: 399.99,
        rating: 4.8,
        reviews: 124,
        image: "/placeholder.svg?height=300&width=300",
        badge: "Best Seller",
        category: "Electronics",
        brand: "Sony",
        inStock: true,
        description: "High-quality wireless headphones with noise cancellation",
    },
    {
        id: 2,
        name: "Designer Leather Jacket",
        price: 199.99,
        originalPrice: 299.99,
        rating: 4.9,
        reviews: 89,
        image: "/placeholder.svg?height=300&width=300",
        badge: "New Arrival",
        category: "Fashion",
        brand: "Nike",
        inStock: true,
        description: "Stylish leather jacket perfect for any occasion",
    },
    {
        id: 3,
        name: "Smart Fitness Watch",
        price: 249.99,
        originalPrice: 349.99,
        rating: 4.7,
        reviews: 156,
        image: "/placeholder.svg?height=300&width=300",
        badge: "Limited",
        category: "Electronics",
        brand: "Apple",
        inStock: false,
        description: "Advanced fitness tracking with heart rate monitoring",
    },
    {
        id: 4,
        name: "Organic Skincare Set",
        price: 89.99,
        originalPrice: 129.99,
        rating: 4.9,
        reviews: 203,
        image: "/placeholder.svg?height=300&width=300",
        badge: "Trending",
        category: "Beauty",
        brand: "Samsung",
        inStock: true,
        description: "Complete organic skincare routine for healthy skin",
    },
    {
        id: 5,
        name: "Professional Camera Lens",
        price: 599.99,
        originalPrice: 799.99,
        rating: 4.6,
        reviews: 67,
        image: "/placeholder.svg?height=300&width=300",
        badge: "Sale",
        category: "Electronics",
        brand: "Sony",
        inStock: true,
        description: "Professional grade camera lens for stunning photography",
    },
    {
        id: 6,
        name: "Comfortable Running Shoes",
        price: 129.99,
        originalPrice: 179.99,
        rating: 4.8,
        reviews: 234,
        image: "/placeholder.svg?height=300&width=300",
        badge: "Popular",
        category: "Sports",
        brand: "Adidas",
        inStock: true,
        description: "Lightweight running shoes with superior comfort",
    },
]

async function seed() {
    try {
        await connectToDatabase();
        await Product.deleteMany({});
        await Product.insertMany(products);
        console.log("Database seeded successfully");
        mongoose.connection.close();
    } catch (error) {
        console.error("Error seeding database:", error);
    }
}

seed();