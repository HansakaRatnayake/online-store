// ecommerce-backend/src/routes/product.ts
import express, { Request, Response } from "express";
import connectToDatabase from "@/utils/mongodb";
import { Product } from "@/models/Product";

const router = express.Router();

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

export default router;