import express, { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import connectToDatabase from "@/utils/mongodb";
import { Order } from "@/models/Order";
import { Product } from "@/models/Product";
import { Cart } from "@/models/Cart";
import { Payment } from "@/models/Payment";
import { authenticate, isCustomer } from "@/middleware/auth";
import {AuthUser} from "@/types/auth"; // Assume middleware is in a separate file


const router = express.Router();



// POST /api/orders - Place a new order after payment
router.post("/", authenticate, isCustomer, async (req: Request, res: Response) => {
    try {
        await connectToDatabase();

        const { items, shippingAddress, discount=0 } = req.body;
        const userId = (req.user as AuthUser).userId;

        if (!items || !shippingAddress ) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const enrichedItems = [];

        for (const item of items) {
            const product = await Product.findOne({ id: parseInt(item.id) });

            if (!product || !product.inStock || product.stockCount < item.quantity) {
                return res.status(400).json({ error: `Product ${item.id} is out of stock or has insufficient quantity` });
            }

            enrichedItems.push({
                id: product.id,
                quantity: item.quantity,
                price: product.price,
                name: product.name,
                image: product.image,
                category: product.category,
                brand: product.brand,
                shipping: product.shipping || { free: false, estimatedDays: "5-7" },
            });
        }

        // Pricing calculations
        const subtotal = enrichedItems.reduce((sum, item) => sum + item.quantity * item.price, 0);
        const shipping = subtotal > 100 || enrichedItems.some(item => item.shipping?.free) ? 0 : 9.99;
        const tax = (subtotal - discount) * 0.08;
        const total = subtotal - discount + shipping + tax;

        // Validation before saving
        if ([subtotal, tax, total].some(val => isNaN(val))) {
            return res.status(400).json({ error: "Invalid pricing calculation" });
        }

        // Create the order
        const order = await Order.create({
            userId,
            orderNumber: generateOrderNumber,
            items: enrichedItems,
            shippingAddress,
            subtotal,
            discount,
            shipping,
            tax,
            total,
            status: "pending",
        });

        // Update stock
        for (const item of items) {
            await Product.updateOne(
                { id: parseInt(item.id) },
                { $inc: { stockCount: -item.quantity }, $set: { inStock: item.quantity > 0 } }
            );
        }

        // Clear cart
        await Cart.deleteOne({ userId });

        res.status(201).json({ success: true, order });

    } catch (error) {
        console.error("Error creating order:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

const generateOrderNumber = () => {
    const now = Date.now(); // milliseconds
    const random = Math.floor(1000 + Math.random() * 9000); // 4-digit random number
    return `ORD-${now}-${random}`; // e.g., "ORD-1721454361534-8432"
};

// GET /api/orders/my-orders - Get customer's orders with pagination
router.get("/my-orders", authenticate, isCustomer, async (req: Request, res: Response) => {
    try {
        await connectToDatabase();
        const { page = "1", limit = "10" } = req.query;
        const pageNum = parseInt(page as string, 10);
        const limitNum = parseInt(limit as string, 10);

        const query = { userId: req.user!.userId };
        const orders = await Order.find(query)
            .select("+trackingUpdates")
            .skip((pageNum - 1) * limitNum)
            .limit(limitNum)
            .lean();

        const total = await Order.countDocuments(query);

        res.json({
            orders,
            total,
            page: pageNum,
            limit: limitNum,
            totalPages: Math.ceil(total / limitNum),
        });
    } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// PATCH /api/orders/:id - Update order status (e.g., cancel)
router.patch("/:id", authenticate, isCustomer, async (req: Request, res: Response) => {
    try {
        await connectToDatabase();
        const { status } = req.body;
        const orderId = req.params.id;

        if (!status || !["cancelled"].includes(status)) {
            return res.status(400).json({ error: "Invalid status update" });
        }

        const order = await Order.findOne({ _id: orderId, userId: req.user!.userId });
        if (!order) {
            return res.status(404).json({ error: "Order not found" });
        }

        if (!["pending", "processing"].includes(order.status)) {
            return res.status(400).json({ error: "Order cannot be cancelled" });
        }

        order.status = status;
        order.trackingUpdates.push({ status, date: new Date() });
        await order.save();

        if (status === "cancelled") {
            for (const item of order.items) {
                await Product.updateOne({ id: item.id }, { $inc: { stockCount: item.quantity }, inStock: true });
            }
        }

        res.json({ order });
    } catch (error) {
        console.error("Error updating order:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// GET /api/orders/:id/tracking - Get tracking updates for an order
router.get("/:id/tracking", authenticate, isCustomer, async (req: Request, res: Response) => {
    try {
        await connectToDatabase();
        const order = await Order.findOne({ _id: req.params.id, userId: req.user!.userId }).lean();
        if (!order) {
            return res.status(404).json({ error: "Order not found" });
        }
        res.json({ trackingUpdates: order.trackingUpdates || [] });
    } catch (error) {
        console.error("Error fetching tracking updates:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Admin route: GET /api/orders - Get all orders (for admin dashboard)
router.get("/", authenticate, async (req: Request, res: Response) => {
    if (req.user?.role !== "admin") {
        return res.status(403).json({ error: "Admin access required" });
    }

    try {
        await connectToDatabase();
        const { page = "1", limit = "10" } = req.query;
        const pageNum = parseInt(page as string, 10);
        const limitNum = parseInt(limit as string, 10);

        const orders = await Order.find()
            .skip((pageNum - 1) * limitNum)
            .limit(limitNum)
            .lean();
        const total = await Order.countDocuments();

        res.json({
            orders,
            total,
            page: pageNum,
            limit: limitNum,
            totalPages: Math.ceil(total / limitNum),
        });
    } catch (error) {
        console.error("Error fetching all orders:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Admin route: PATCH /api/orders/:id/admin - Update order status (admin)
router.patch("/:id/admin", authenticate, async (req: Request, res: Response) => {
    if (req.user?.role !== "admin") {
        return res.status(403).json({ error: "Admin access required" });
    }
    try {
        await connectToDatabase();
        const { status, trackingNumber, trackingUpdate } = req.body;
        const orderId = req.params.id;

        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ error: "Order not found" });
        }

        if (status && ["pending", "processing", "shipped", "delivered", "cancelled"].includes(status)) {
            order.status = status;
            order.trackingUpdates.push({ status, date: new Date(), location: trackingUpdate?.location });
        }
        if (trackingNumber) {
            order.trackingNumber = trackingNumber;
        }
        await order.save();

        res.json({ order });
    } catch (error) {
        console.error("Error updating order:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

export default router;