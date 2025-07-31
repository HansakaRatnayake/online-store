// ecommerce-backend/src/seed.ts
import connectToDatabase from "./utils/mongodb"; // Use relative import for consistency
import { Product } from "./models/Product";
import mongoose from "mongoose";
import dotenv from "dotenv";
import {Category} from "@/models/Category";
import {User} from "@/models/User";
import bcrypt from "bcryptjs";
import {Review} from "@/models/Review";

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
        image: "https://images.unsplash.com/photo-1625245488600-f03fef636a3c?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        images: [
            "https://images.unsplash.com/photo-1590658268034-6bfcd1dada7e?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3",
            "https://images.unsplash.com/photo-1610797181395-669b1b3a3f8c?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3",
            "https://images.unsplash.com/photo-1590658002805-c9eb92cc0985?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3",
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
            "Charging Time": "3 hours",
            Weight: "254g",
            Connectivity: "Bluetooth 5.0, 3.5mm jack",
        },
        colors: ["Black", "Silver", "Blue"],
        sizes: [],
        shipping: {
            free: true,
            estimatedDays: "2-3 business days",
        },
        sales: 45,
        status: "active",
        createdAt: new Date("2024-01-15"),
    },
    {
        id: 2,
        name: "Designer Leather Jacket",
        price: 199.99,
        originalPrice: 299.99,
        rating: 4.9,
        reviews: 89,
        image: "https://images.unsplash.com/photo-1620867286243-c5fe394733b6?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        images: [
            "https://images.unsplash.com/photo-1601924994987-1a03b1c2c40e?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3",
        ],
        badge: "New Arrival",
        category: "Fashion",
        brand: "Nike",
        inStock: true,
        stockCount: 8,
        description: "Stylish leather jacket perfect for any occasion.",
        features: ["Genuine leather", "Multiple pockets", "Comfortable fit"],
        specifications: {
            Material: "100% Leather",
            Weight: "1.2kg",
            "Care Instructions": "Dry clean only",
        },
        colors: ["Black", "Brown"],
        sizes: ["S", "M", "L", "XL"],
        shipping: {
            free: true,
            estimatedDays: "3-5 business days",
        },
        sales: 23,
        status: "active",
        createdAt: new Date("2024-01-10"),
    },
    {
        id: 3,
        name: "Smart LED TV 55-Inch",
        price: 599.99,
        originalPrice: 799.99,
        rating: 4.7,
        reviews: 210,
        image: "https://plus.unsplash.com/premium_photo-1661497674898-69b88d8f49e1?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        images: [
            "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3",
            "https://images.unsplash.com/photo-1593784991095-2076e0bc5261?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3",
        ],
        badge: "Trending",
        category: "Electronics",
        brand: "Samsung",
        inStock: true,
        stockCount: 12,
        description: "Immerse yourself in stunning visuals with this 55-inch 4K Smart LED TV.",
        features: ["4K Ultra HD", "Smart TV apps", "Voice control", "HDR support"],
        specifications: {
            "Display Size": "1.4 inches",
            "Battery Life": "18 hours",
            Connectivity: "Bluetooth 5.0, Wi-Fi",
        },
        colors: ["Black", "White", "Red"],
        sizes: ["40mm", "44mm"],
        shipping: {
            free: true,
            estimatedDays: "2-3 business days",
        },
        sales: 67,
        status: "inactive",
        createdAt: new Date("2024-01-05"),
    },
    {
        id: 4,
        name: "Luxury Perfume Set",
        price: 129.99,
        originalPrice: 179.99,
        rating: 4.9,
        reviews: 150,
        image: "https://plus.unsplash.com/premium_photo-1732197903912-4503b9c25172?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        images: [
            "https://images.unsplash.com/photo-1587019830110-8db267ebb355?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3",
        ],
        badge: "Limited",
        category: "Beauty & Personal Care",
        brand: "Chanel",
        inStock: true,
        stockCount: 20,
        description: "A luxurious set of fragrances for day and night wear.",
        features: ["Long-lasting scent", "Elegant packaging", "Multiple fragrances"],
        specifications: {
            Volume: "3x30ml",
            ScentType: "Floral",
            Longevity: "8 hours",
        },
        slug: "luxury-perfume-set",
    },
    {
        id: 5,
        name: "Outdoor Camping Tent",
        price: 149.99,
        originalPrice: 199.99,
        rating: 4.6,
        reviews: 95,
        image: "https://images.unsplash.com/photo-1698731030142-92765f29f98d?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        images: [
            "https://images.unsplash.com/photo-1504280390367-5f1a7a8e9f6c?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3",
        ],
        badge: "Best Seller",
        category: "Sports & Outdoors",
        brand: "North Face",
        inStock: true,
        stockCount: 10,
        description: "Durable and weather-resistant tent for outdoor adventures.",
        features: ["Waterproof", "Easy setup", "Ventilation system"],
        specifications: {
            Capacity: "4 persons",
            Material: "Polyester",
            Weight: "5kg",
        },
        slug: "outdoor-camping-tent",
    },
    {
        id: 6,
        name: "Hardcover Novel Collection",
        price: 79.99,
        originalPrice: 99.99,
        rating: 4.8,
        reviews: 180,
        image: "https://plus.unsplash.com/premium_photo-1750360904781-0ca292f05fe5?q=80&w=1160&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        images: [
            "https://images.unsplash.com/photo-1544716278-ca5e3f4ebf0c?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3",
        ],
        badge: "Trending",
        category: "Books & Media",
        brand: "Penguin",
        inStock: true,
        stockCount: 25,
        description: "A collection of bestselling hardcover novels for avid readers.",
        features: ["Hardcover binding", "Multiple genres", "Collector’s edition"],
        specifications: {
            Pages: "1200 total",
            Format: "Hardcover",
            Language: "English",
        },
        slug: "hardcover-novel-collection",
    },
    {
        id: 7,
        name: "Modern Sofa Set",
        price: 899.99,
        originalPrice: 1199.99,
        rating: 4.7,
        reviews: 130,
        image: "https://plus.unsplash.com/premium_photo-1669324450657-1dbd23d8c6d4?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        images: [
            "https://images.unsplash.com/photo-1555041469-a586c61ea9ec?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3",
        ],
        badge: "New Arrival",
        category: "Home & Garden",
        brand: "IKEA",
        inStock: true,
        stockCount: 5,
        description: "Comfortable and stylish sofa set for modern living spaces.",
        features: ["Removable covers", "Ergonomic design", "Durable fabric"],
        specifications: {
            Dimensions: "220x90x80cm",
            Material: "Fabric",
            Color: "Grey",
        },
        slug: "modern-sofa-set",
    },
    {
        id: 8,
        name: "Car Cleaning Kit",
        price: 49.99,
        originalPrice: 69.99,
        rating: 4.5,
        reviews: 75,
        image: "https://plus.unsplash.com/premium_photo-1661697732242-b502c58ead54?q=80&w=1310&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        images: [
            "https://images.unsplash.com/photo-1616431212737-3513e6d4e24e?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3",
        ],
        badge: "Limited",
        category: "Automotive",
        brand: "Meguiar’s",
        inStock: true,
        stockCount: 30,
        description: "Complete car cleaning kit for a spotless shine.",
        features: ["Wax", "Polishes", "Microfiber cloths"],
        specifications: {
            Items: "6 products",
            Usage: "Exterior and interior",
        },
        slug: "car-cleaning-kit",
    },
    {
        id: 9,
        name: "Baby Stroller",
        price: 249.99,
        originalPrice: 349.99,
        rating: 4.9,
        reviews: 110,
        image: "https://images.unsplash.com/photo-1458731909820-5850bdcaee0b?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        images: [
            "https://images.unsplash.com/photo-1620573170930-8d5f5d3e9b36?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3",
        ],
        badge: "Best Seller",
        category: "Baby & Kids",
        brand: "Graco",
        inStock: true,
        stockCount: 15,
        description: "Lightweight and foldable stroller for easy travel with your baby.",
        features: ["Adjustable seat", "Storage basket", "Safety harness"],
        specifications: {
            Weight: "7kg",
            FoldedDimensions: "80x50x30cm",
            AgeRange: "0-3 years",
        },
        slug: "baby-stroller",
    },
    {
        id: 10,
        name: "Running Shoes",
        price: 99.99,
        originalPrice: 129.99,
        rating: 4.6,
        reviews: 85,
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.0.3",
        images: [
            "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3",
        ],
        badge: "New Arrival",
        category: "Sports & Outdoors",
        brand: "Adidas",
        inStock: true,
        stockCount: 20,
        description: "High-performance running shoes for ultimate comfort and speed.",
        features: ["Breathable mesh", "Cushioned sole", "Lightweight"],
        specifications: {
            Material: "Synthetic/Mesh",
            Sizes: "US 7-11",
            Weight: "300g",
        },
        slug: "running-shoes",
    },
    {
        id: 11,
        name: "Smartphone 128GB",
        price: 699.99,
        originalPrice: 899.99,
        rating: 4.8,
        reviews: 250,
        image: "https://images.unsplash.com/photo-1598965402089-897ce52e8355?q=80&w=1636&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        images: [
            "https://images.unsplash.com/photo-1511707171634-5f897206b2e9?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3",
        ],
        badge: "Trending",
        category: "Electronics",
        brand: "Apple",
        inStock: true,
        stockCount: 10,
        description: "Latest smartphone with advanced camera and performance features.",
        features: ["5G connectivity", "Triple camera system", "A15 Bionic chip"],
        specifications: {
            Storage: "128GB",
            ScreenSize: "6.1 inches",
            BatteryLife: "20 hours",
        },
        slug: "smartphone-128gb",
    },
    {
        id: 12,
        name: "Organic Skincare Set",
        price: 89.99,
        originalPrice: 129.99,
        rating: 4.9,
        reviews: 203,
        image: "https://plus.unsplash.com/premium_photo-1681364365147-66aedd028205?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        images: [
            "https://images.unsplash.com/photo-1598440947619-2c35fc9eb261?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3",
        ],
        badge: "Trending",
        category: "Beauty & Personal Care",
        brand: "L’Occitane",
        inStock: true,
        stockCount: 18,
        description: "Natural skincare set for radiant and hydrated skin.",
        features: ["Organic ingredients", "Cruelty-free", "Hydrating formula"],
        specifications: {
            Volume: "3x50ml",
            SkinType: "All",
            Ingredients: "Shea butter, Aloe vera",
        },
        slug: "organic-skincare-set",
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

const reviews = [
    {
        productId: 1,
        user: "John D.",
        rating: 5,
        date: "2024-01-15",
        title: "Excellent quality!",
        comment: "These headphones exceeded my expectations. The sound quality is amazing and the noise cancellation works perfectly.",
        helpful: 12,
        verified: true,
    },
    {
        productId: 1,
        user: "Sarah M.",
        rating: 4,
        date: "2024-01-10",
        title: "Great value for money",
        comment: "Really good headphones for the price. Battery life is as advertised and they're very comfortable.",
        helpful: 8,
        verified: true,
    },
    {
        productId: 1,
        user: "Mike R.",
        rating: 5,
        date: "2024-01-05",
        title: "Perfect for work from home",
        comment: "The noise cancellation is a game changer for video calls. Highly recommend!",
        helpful: 15,
        verified: false,
    },
    {
        productId: 2,
        user: "Emily K.",
        rating: 4,
        date: "2024-02-01",
        title: "Stylish and durable",
        comment: "Love the look of this jacket. Fits well and feels high quality.",
        helpful: 10,
        verified: true,
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
        // await Product.deleteMany({});
        // await Product.insertMany(products);
        // console.log("Product seeded successfully");

        await Category.deleteMany({});
        await Category.insertMany(categories);
        console.log("Categories seeded successfully");

        await Review.deleteMany({});
        await Review.insertMany(reviews);
        console.log("Reviews seeded successfully");

        mongoose.connection.close();
    } catch (error) {
        console.error("Error seeding database:", error);
    }
}

seed();