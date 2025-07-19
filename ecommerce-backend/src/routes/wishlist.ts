import express, { Request, Response, NextFunction } from "express";
import connectToDatabase from "@/utils/mongodb";
import { Wishlist } from "@/models/Wishlist";
import { AuthUser } from "@/types/auth";
import { authenticate, isCustomer } from "@/middleware/auth";

const router = express.Router();

// GET /api/wishlist - Get user's wishlist
router.get("/", authenticate, isCustomer, async (req: Request, res: Response) => {
    try {
        await connectToDatabase();
        const wishlist = await Wishlist.findOne({ userId: (req.user as AuthUser).userId }).lean();
        const normalizedItems = (wishlist?.items || []).map((item: any) => ({
            ...item,
            id: item.id.toString(),
        }));
        res.json({ items: normalizedItems });
    } catch (error) {
        console.error("Error fetching cart:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// POST /api/wishlist - Add item to wishlist
router.post("/", authenticate, isCustomer, async (req: Request, res: Response) => {
    try {
        await connectToDatabase();
        const { id, name, price, image, category, brand, rating, inStock } = req.body;
        const userId = (req.user as AuthUser).userId;

        if (!id || !name || !price ) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        let wishlist = await Wishlist.findOne({ userId });
        if (!wishlist) {
            wishlist = new Wishlist({ userId, items: [] });
        }

        const existingItem = wishlist.items.find((item) => item.id === parseInt(id));
        if (existingItem) {
            console.log("This Item is Already Existed in Wishlist! ");
        } else {
            wishlist.items.push({ id: parseInt(id), name, price, rating, image, category, brand, inStock });
        }
        wishlist.updatedAt = new Date();
        await wishlist.save();

        const normalizedItems = wishlist.items.map((item: any) => ({
            ...item,
            id: item.id.toString(),
        }));
        res.json({ items: normalizedItems });
    } catch (error) {
        console.error("Error adding to wishlist:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


// DELETE /api/wishlist/:id - Remove item from wishlist
router.delete("/:id", authenticate, isCustomer, async (req: Request, res: Response) => {
    try {
        await connectToDatabase();
        const userId = (req.user as AuthUser).userId;
        const itemId = parseInt(req.params.id);

        const wishlist = await Wishlist.findOne({ userId });
        if (!wishlist) {
            return res.status(404).json({ error: "Wishlist not found" });
        }

        wishlist.items = wishlist.items.filter((item) => item.id !== itemId);
        wishlist.updatedAt = new Date();
        await wishlist.save();

        const normalizedItems = wishlist.items.map((item: any) => ({
            ...item,
            id: item.id.toString(),
        }));
        res.json({ items: normalizedItems });
    } catch (error) {
        console.error("Error removing from wishlist:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// DELETE /api/wishlist - Clear wishlist
router.delete("/", authenticate, isCustomer, async (req: Request, res: Response) => {
    try {
        await connectToDatabase();
        const userId = (req.user as AuthUser).userId;
        await Wishlist.deleteOne({ userId });
        res.json({ items: [] });
    } catch (error) {
        console.error("Error clearing wishlist:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

export default router;