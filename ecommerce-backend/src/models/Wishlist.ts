import mongoose, { Schema, Document } from "mongoose";

export interface IWishlist extends Document {
    userId: string;
    items: {
        id: number; // Matches Product.id
        name: string;
        price: number;
        rating: number;
        image: string;
        inStock: boolean;
        category: string;
        brand: string;
        shipping: { free: boolean; estimatedDays: string };
    }[];
    updatedAt: Date;
}

const WishlistSchema: Schema = new Schema({
    userId: { type: String, required: true, unique: true },
    items: [
        {
            id: { type: Number, required: true },
            name: { type: String, required: true },
            price: { type: Number, required: true },
            rating: { type: Number, required: true },
            image: { type: String },
            category: { type: String, default: "General" },
            brand: { type: String, default: "Generic" },
            inStock: { type: String, default: "true" },
            shipping: {
                free: { type: Boolean, default: false },
                estimatedDays: { type: String, default: "5-7" },
            },
        },
    ],
    updatedAt: { type: Date, default: Date.now },
});

export const Wishlist = mongoose.models.Wishlist || mongoose.model<IWishlist>("Wishlist", WishlistSchema);