import mongoose, { Schema, Document } from "mongoose";

export interface IPayment extends Document {
    userId: string | null;
    paymentIntentId: string;
    orderId?: string;
    amount: number;
    currency: string;
    status: string;
    createdAt: Date;
}

const PaymentSchema: Schema = new Schema({
    userId: { type: String, default: null },
    paymentIntentId: { type: String, required: true, unique: true },
    orderId: { type: String },
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
    status: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

export const Payment = mongoose.model<IPayment>("Payment", PaymentSchema);