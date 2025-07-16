import express, { Request, Response } from "express";
import connectToDatabase from "@/utils/mongodb";
import { Review } from "@/models/Review";

const router = express.Router();

// GET /api/reviews/:productId - Get reviews for a specific product
router.get("/:productId", async (req: Request, res: Response) => {
    try {
        await connectToDatabase();
        const reviews = await Review.find({ productId: parseInt(req.params.productId) }).lean();
        res.json(reviews);
    } catch (error) {
        console.error("Error fetching reviews:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// POST /api/reviews - Submit a new review
router.post("/", async (req: Request, res: Response) => {
    try {
        await connectToDatabase();
        const { productId, user, rating, title, comment } = req.body;
        if (!productId || !user || !rating || !title || !comment) {
            return res.status(400).json({ error: "Missing required fields" });
        }
        const review = new Review({
            productId,
            user,
            rating,
            date: new Date().toISOString().split("T")[0],
            title,
            comment,
            helpful: 0,
            verified: true, // Assume verified for simplicity; adjust based on auth logic
        });
        await review.save();
        res.status(201).json(review);
    } catch (error) {
        console.error("Error submitting review:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

export default router;