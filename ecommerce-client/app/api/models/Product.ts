// models/Product.ts
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
});

export const Product =
    mongoose.models.Product || mongoose.model("Product", productSchema);