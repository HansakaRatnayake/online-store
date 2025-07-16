import mongoose, { Schema } from "mongoose";

const reviewSchema = new Schema({
    productId: Number,
    user: String,
    rating: Number,
    date: String,
    title: String,
    comment: String,
    helpful: Number,
    verified: Boolean,
});

export const Review =
    mongoose.models.Review || mongoose.model("Review", reviewSchema);