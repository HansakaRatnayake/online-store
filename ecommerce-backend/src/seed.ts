// ecommerce-backend/src/seed.ts
import connectToDatabase from "./utils/mongodb"; // Use relative import for consistency
import { Product } from "./models/Product";
import mongoose from "mongoose";
import dotenv from "dotenv";
import {Category} from "@/models/Category";
import {User} from "@/models/User";
import bcrypt from "bcryptjs";

dotenv.config();

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
            DriverSize: "40mm",
            FrequencyResponse: "4Hz-40kHz",
            BatteryLife: "30 hours",
            Weight: "254g",
        },
        slug: "premium-wireless-headphones", // Unique slug
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
        slug: "designer-leather-jacket", // Unique slug
    },
];

const categories = [
    {
        id: 1,
        name: "Electronics",
        description: "Latest gadgets, smartphones, laptops & tech accessories",
        image: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?q=80&w=1201&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        productCount: 1250,
        trending: true,
        subcategories: ["Smartphones", "Laptops", "Headphones", "Cameras", "Gaming"],
        href: "/products?category=electronics",
    },
    {
        id: 2,
        name: "Fashion",
        description: "Trendy clothing, shoes, and accessories for all styles",
        image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        productCount: 2100,
        trending: true,
        subcategories: ["Men's Clothing", "Women's Clothing", "Shoes", "Accessories", "Jewelry"],
        href: "/products?category=fashion",
    },
    {
        id: 3,
        name: "Home & Garden",
        description: "Everything you need for your home and outdoor spaces",
        image: "https://images.unsplash.com/photo-1484154218962-a197022b5858?q=80&w=1174&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        productCount: 890,
        trending: false,
        subcategories: ["Furniture", "Decor", "Kitchen", "Garden", "Tools"],
        href: "/products?category=home-garden",
    },
    {
        id: 4,
        name: "Beauty & Personal Care",
        description: "Skincare, cosmetics, and personal care essentials",
        image: "https://plus.unsplash.com/premium_photo-1684407616442-8d5a1b7c978e?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        productCount: 650,
        trending: true,
        subcategories: ["Skincare", "Makeup", "Hair Care", "Fragrances", "Personal Care"],
        href: "/products?category=beauty",
    },
    {
        id: 5,
        name: "Sports & Outdoors",
        description: "Fitness equipment, outdoor gear, and sports accessories",
        image: "https://images.unsplash.com/photo-1744729220863-1ebe7ff737a5?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        productCount: 780,
        trending: false,
        subcategories: ["Fitness", "Outdoor", "Sports Equipment", "Activewear", "Camping"],
        href: "/products?category=sports",
    },
    {
        id: 6,
        name: "Books & Media",
        description: "Books, e-books, audiobooks, and educational materials",
        image: "https://images.unsplash.com/photo-1607473129014-0afb7ed09c3a?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        productCount: 1500,
        trending: false,
        subcategories: ["Fiction", "Non-Fiction", "Educational", "Children's Books", "E-books"],
        href: "/products?category=books",
    },
    {
        id: 7,
        name: "Automotive",
        description: "Car accessories, parts, and automotive essentials",
        image: "https://images.unsplash.com/photo-1627913434632-b4717be3485a?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        productCount: 420,
        trending: false,
        subcategories: ["Car Parts", "Accessories", "Tools", "Electronics", "Care Products"],
        href: "/products?category=automotive",
    },
    {
        id: 8,
        name: "Baby & Kids",
        description: "Everything for babies, toddlers, and children",
        image: "https://plus.unsplash.com/premium_photo-1683134043877-dea4b88c9730?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        productCount: 680,
        trending: true,
        subcategories: ["Baby Gear", "Toys", "Clothing", "Feeding", "Safety"],
        href: "/products?category=baby-kids",
    },
];


const seedAdmin = async () => {
    try {

        const adminEmail = 'admin@example.com';
        const existingAdmin = await User.findOne({email: adminEmail});
        if (existingAdmin) {
            console.log('Admin user already exists:', adminEmail);
            await mongoose.connection.close();
            return;
        }

        const adminPassword = 'admin123'; // Change this in production
        const hashedPassword = await bcrypt.hash(adminPassword, 10);

        const adminUser = new User({
            name: 'System Admin',
            email: adminEmail,
            password: hashedPassword,
            role: 'admin',
            avatar: '/placeholder.svg?height=40&width=40',
            createdAt: new Date(),
        });

        await adminUser.save();
        console.log('Admin user created successfully:', adminEmail);
    }catch(error){
        console.error('Seeding error:', error);
        process.exit(1);
    }
}

async function seed() {
    try {
        await connectToDatabase();
        await seedAdmin();
        await Product.deleteMany({});
        await Product.insertMany(products);
        console.log("Product seeded successfully");

        await Category.deleteMany({});
        await Category.insertMany(categories);
        console.log("Categories seeded successfully");

        mongoose.connection.close();
    } catch (error) {
        console.error("Error seeding database:", error);
    }
}

seed();