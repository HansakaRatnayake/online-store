import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import productRoutes from "@/routes/product";
import categoryRoutes from "@/routes/category";
import authRoutes from "@/routes/auth";
import reviewRoutes from "@/routes/review";
import customerProductRoutes from "@/routes/customerProductRoutes"
import orderRoutes from "@/routes/order"
import paymentRoutes from "./routes/payment";
import cartRoutes from "./routes/cart";
import wishlistRoutes from "./routes/wishlist";
import userRoutes from "./routes/user";
import connectToDatabase from "@/utils/mongodb";


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());

connectToDatabase();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/customer/products", customerProductRoutes)
app.use("/api/reviews", reviewRoutes);
app.use("/api/orders", orderRoutes)
app.use("/api/cart", cartRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/users", userRoutes);


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});