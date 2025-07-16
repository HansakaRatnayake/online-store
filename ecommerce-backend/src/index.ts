import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import productRoutes from "@/routes/product";
import categoryRoutes from "@/routes/category";
import authRoutes from "@/routes/auth";
import reviewRoutes from "@/routes/review";
import connectToDatabase from "@/utils/mongodb";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/reviews", reviewRoutes);

connectToDatabase();

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});