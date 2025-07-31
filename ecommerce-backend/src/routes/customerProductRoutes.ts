import express, { Request, Response } from "express";
import connectToDatabase from "@/utils/mongodb";
import { Product } from "@/models/Product";

const router = express.Router();

// GET /api/customer/products - Get active products with filtering, searching, and pagination
router.get("/", async (req: Request, res: Response) => {
    try {
        await connectToDatabase();

        const {
            search,
            categories,
            brands,
            colors,
            minPrice,
            maxPrice,
            minRating,
            page = "1",
            limit = "9",
        } = req.query;

        const query: any = { status: "active" }; // Only fetch active products

        // Search by name, description, or brand
        if (search) {
            query.$or = [
                { name: { $regex: search as string, $options: "i" } },
                { description: { $regex: search as string, $options: "i" } },
                { brand: { $regex: search as string, $options: "i" } },
            ];
        }

        // Filter by categories (case-insensitive)
        if (categories) {
            const categoryArray = (categories as string).split(",").map((c) => c.trim()).filter((c) => c);
            if (categoryArray.length > 0) {
                query.category = { $in: categoryArray.map((cat) => new RegExp(`^${cat}$`, "i")) };
            }
        }

        // Filter by brands
        if (brands) {
            const brandArray = (brands as string).split(",").map((b) => b.trim()).filter((b) => b);
            if (brandArray.length > 0) {
                query.brand = { $in: brandArray };
            }
        }

        // Filter by colors
        if (colors) {
            const colorArray = (colors as string).split(",").map((c) => c.trim()).filter((c) => c);
            if (colorArray.length > 0) {
                query.colors = { $in: colorArray };
            }
        }

        // Filter by price range
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }

        // Filter by minimum rating
        if (minRating && Number.parseInt(minRating as string) > 0) {
            query.rating = { $gte: Number(minRating) };
        }

        const pageNum = parseInt(page as string, 10);
        const limitNum = parseInt(limit as string, 10);

        const products = await Product.find(query)
            .sort({ createdAt: -1 }) // Newest to Oldest
            .skip((pageNum - 1) * limitNum)
            .limit(limitNum)
            .lean();

        // Convert images to base64
        const productsWithBase64 = products.map((product) => ({
            ...product,
            image: product.image?.data
                ? `data:${product.image.contentType};base64,${product.image.data.toString("base64")}`
                : "/placeholder.svg",
            images: product.images?.map((img) =>
                img.data ? `data:${img.contentType};base64,${img.data.toString("base64")}` : "/placeholder.svg"
            ) || ["/placeholder.svg"],
        }));

        const total = await Product.countDocuments(query);

        res.json({
            products: productsWithBase64,
            total,
            page: pageNum,
            limit: limitNum,
            totalPages: Math.ceil(total / limitNum),
        });
    } catch (error) {
        console.error("Error fetching customer products:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

export default router;