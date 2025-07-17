import mongoose, { Schema, Document } from "mongoose";

export interface ICart extends Document {
    userId: string;
    items: {
        id: number; // Matches Product.id
        name: string;
        price: number;
        quantity: number;
        image: string;
        category: string;
        brand: string;
        shipping: { free: boolean; estimatedDays: string };
    }[];
    updatedAt: Date;
}

const CartSchema: Schema = new Schema({
    userId: { type: String, required: true, unique: true },
    items: [
        {
            id: { type: Number, required: true },
            name: { type: String, required: true },
            price: { type: Number, required: true },
            quantity: { type: Number, required: true },
            image: { type: String },
            category: { type: String, default: "General" },
            brand: { type: String, default: "Generic" },
            shipping: {
                free: { type: Boolean, default: false },
                estimatedDays: { type: String, default: "5-7" },
            },
        },
    ],
    updatedAt: { type: Date, default: Date.now },
});

export const Cart = mongoose.models.Cart || mongoose.model<ICart>("Cart", CartSchema);