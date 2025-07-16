import express, { Request, Response } from "express";
import connectToDatabase from "@/utils/mongodb";
import { Product } from "@/models/Product";

const router = express.Router();

// GET /api/products - Get all products with optional filtering
router.get("/", async (req: Request, res: Response) => {
    try {
        await connectToDatabase();

        const { category, search, page = "1", limit = "10" } = req.query;

        let query: any = {};
        if (category) {
            query.category = { $regex: category as string, $options: "i" };
        }
        if (search) {
            query.$or = [
                { name: { $regex: search as string, $options: "i" } },
                { description: { $regex: search as string, $options: "i" } },
            ];
        }

        const pageNum = parseInt(page as string, 10);
        const limitNum = parseInt(limit as string, 10);

        const products = await Product.find(query)
            .skip((pageNum - 1) * limitNum)
            .limit(limitNum)
            .lean();

        res.json(products);
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// GET /api/products/featured - Get featured products
router.get("/featured", async (req: Request, res: Response) => {
    try {
        await connectToDatabase();

        const featuredBadges = ["Best Seller", "New Arrival", "Limited", "Trending"];
        const products = await Product.find({
            badge: { $in: featuredBadges }
        })
            .limit(4)
            .lean();

        res.json(products);
    } catch (error) {
        console.error("Error fetching featured products:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// GET /api/products/:id - Get a single product by ID
router.get("/:id", async (req: Request, res: Response) => {
    try {
        await connectToDatabase();
        const product = await Product.findOne({ id: parseInt(req.params.id) }).lean();
        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }
        res.json(product);
    } catch (error) {
        console.error("Error fetching product:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// GET /api/products/related/:category - Get related products by category
router.get("/related/:category", async (req: Request, res: Response) => {
    try {
        await connectToDatabase();
        const products = await Product.find({
            category: { $regex: req.params.category, $options: "i" },
        })
            .limit(4)
            .lean();
        res.json(products);
    } catch (error) {
        console.error("Error fetching related products:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

export default router;