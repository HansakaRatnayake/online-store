import mongoose, { Schema } from "mongoose"

const orderSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    orderNumber: { type: String, required: true, unique: true },
    date: { type: Date, required: true, default: Date.now },
    status: {
        type: String,
        enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
        default: "pending",
    },
    total: { type: Number, required: true },
    items: [
        {
            id: { type: String, required: true },
            name: { type: String, required: true },
            price: { type: Number, required: true },
            quantity: { type: Number, required: true },
            image: { type: String },
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
    trackingNumber: { type: String },
    trackingUpdates: [
        {
            status: { type: String, required: true },
            date: { type: Date, required: true, default: Date.now },
            location: { type: String },
        },
    ],
})

export const Order = mongoose.models.Order || mongoose.model("Order", orderSchema)