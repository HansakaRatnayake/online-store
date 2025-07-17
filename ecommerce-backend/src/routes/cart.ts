import express, { Request, Response, NextFunction } from "express";
import connectToDatabase from "@/utils/mongodb";
import { Cart } from "@/models/Cart";
import { AuthUser } from "@/types/auth";
import { authenticate, isCustomer } from "@/middleware/auth";

const router = express.Router();

// GET /api/cart - Get user's cart
router.get("/", authenticate, isCustomer, async (req: Request, res: Response) => {
    try {
        await connectToDatabase();
        const cart = await Cart.findOne({ userId: (req.user as AuthUser).userId }).lean();
        const normalizedItems = (cart?.items || []).map((item: any) => ({
            ...item,
            id: item.id.toString(),
            shipping: item.shipping || { free: false, estimatedDays: "5-7" }, // Default shipping
        }));
        res.json({ items: normalizedItems });
    } catch (error) {
        console.error("Error fetching cart:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// POST /api/cart - Add item to cart
router.post("/", authenticate, isCustomer, async (req: Request, res: Response) => {
    try {
        await connectToDatabase();
        const { id, name, price, image, category, brand, shipping = { free: false, estimatedDays: "5-7" }, quantity } = req.body;
        const userId = (req.user as AuthUser).userId;

        if (!id || !name || !price || !quantity) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        let cart = await Cart.findOne({ userId });
        if (!cart) {
            cart = new Cart({ userId, items: [] });
        }

        const existingItem = cart.items.find((item) => item.id === parseInt(id));
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.items.push({ id: parseInt(id), name, price, quantity, image, category, brand, shipping });
        }
        cart.updatedAt = new Date();
        await cart.save();

        const normalizedItems = cart.items.map((item: any) => ({
            ...item,
            id: item.id.toString(),
            shipping: item.shipping || { free: false, estimatedDays: "5-7" },
        }));
        res.json({ items: normalizedItems });
    } catch (error) {
        console.error("Error adding to cart:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// PATCH /api/cart/:id - Update item quantity
router.patch("/:id", authenticate, isCustomer, async (req: Request, res: Response) => {
    try {
        await connectToDatabase();
        const { quantity } = req.body;
        const userId = (req.user as AuthUser).userId;
        const itemId = parseInt(req.params.id);

        if (!quantity || quantity < 1) {
            return res.status(400).json({ error: "Invalid quantity" });
        }

        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ error: "Cart not found" });
        }

        const item = cart.items.find((item) => item.id === itemId);
        if (!item) {
            return res.status(404).json({ error: "Item not found in cart" });
        }

        item.quantity = quantity;
        cart.updatedAt = new Date();
        await cart.save();

        const normalizedItems = cart.items.map((item: any) => ({
            ...item,
            id: item.id.toString(),
            shipping: item.shipping || { free: false, estimatedDays: "5-7" },
        }));
        res.json({ items: normalizedItems });
    } catch (error) {
        console.error("Error updating cart:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// DELETE /api/cart/:id - Remove item from cart
router.delete("/:id", authenticate, isCustomer, async (req: Request, res: Response) => {
    try {
        await connectToDatabase();
        const userId = (req.user as AuthUser).userId;
        const itemId = parseInt(req.params.id);

        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ error: "Cart not found" });
        }

        cart.items = cart.items.filter((item) => item.id !== itemId);
        cart.updatedAt = new Date();
        await cart.save();

        const normalizedItems = cart.items.map((item: any) => ({
            ...item,
            id: item.id.toString(),
            shipping: item.shipping || { free: false, estimatedDays: "5-7" },
        }));
        res.json({ items: normalizedItems });
    } catch (error) {
        console.error("Error removing from cart:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// DELETE /api/cart - Clear cart
router.delete("/", authenticate, isCustomer, async (req: Request, res: Response) => {
    try {
        await connectToDatabase();
        const userId = (req.user as AuthUser).userId;
        await Cart.deleteOne({ userId });
        res.json({ items: [] });
    } catch (error) {
        console.error("Error clearing cart:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

export default router;