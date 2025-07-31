import mongoose, { Schema, Document } from "mongoose";

export interface IOrder extends Document {
    userId: string;
    orderNumber: string;
    subtotal: number;
    discount: number;
    shipping: number;
    tax: number;
    total: number;
    items: {
        id: number;
        name: string;
        price: number;
        quantity: number;
        image: string;
        category: string;
        brand: string;
        shipping: { free: boolean; estimatedDays: string };
    }[];
    shippingAddress: {
        name: string;
        street: string;
        city: string;
        state: string;
        zipCode: string;
        country: string;
    };
    status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
    trackingUpdates: { status: string; date: Date; location?: string }[];
    trackingNumber?: string;
    // paymentIntentId: string;
    createdAt: Date;
}

const OrderSchema: Schema = new Schema({
    userId: { type: String, required: true },
    orderNumber: { type: String, required: true, unique: true },
    subtotal: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    shipping: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    total: { type: Number, required: true },
    items: [
        {
            id: { type: Number, required: true },
            name: { type: String, required: true },
            price: { type: Number, required: true },
            quantity: { type: Number, required: true },
            image: { type: { data: Buffer, contentType: String } },
            category: { type: String, default: "General" },
            brand: { type: String, default: "Generic" },
            shipping: {
                free: { type: Boolean, default: false },
                estimatedDays: { type: String, default: "5-7" },
            },
        },
    ],
    shippingAddress: {
        name: { type: String, required: true },
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        zipCode: { type: String, required: true },
        country: { type: String, required: true },
    },
    status: {
        type: String,
        enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
        default: "pending",
    },
    trackingUpdates: [
        {
            status: { type: String, required: true },
            date: { type: Date, required: true },
            location: { type: String },
        },
    ],
    trackingNumber: { type: String },
    // paymentIntentId: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

export const Order = mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema);