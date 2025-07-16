import mongoose, { Schema } from "mongoose";

const categorySchema = new Schema({
    id: Number,
    name: String,
    description: String,
    image: String,
    productCount: Number,
    trending: Boolean,
    subcategories: [String],
    href: String,
});

export const Category =
    mongoose.models.Category || mongoose.model("Category", categorySchema);