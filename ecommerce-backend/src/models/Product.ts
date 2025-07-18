import mongoose, { Schema } from "mongoose";

const productSchema = new Schema({
    id: Number,
    name: String,
    price: Number,
    originalPrice: Number,
    rating: Number,
    reviews: Number,
    image: String,
    images: [String],
    badge: String,
    category: String,
    brand: String,
    inStock: Boolean,
    stockCount: Number,
    description: String,
    features: [String],
    specifications: Object,
    colors: [String],
    sizes: [String],
    shipping: {
        free: Boolean,
        estimatedDays: String,
    },
    sales: Number,
    status: { type: String, enum: ["active", "inactive"], default: "active" },
    createdAt: { type: Date, default: Date.now },
});

export const Product = mongoose.models.Product || mongoose.model("Product", productSchema);