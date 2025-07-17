import express, { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import connectToDatabase from "@/utils/mongodb";
import { Order } from "@/models/Order";
import { Product } from "@/models/Product";
import { AuthUser } from "../types/auth";

const router = express.Router();

// Middleware to verify JWT and extract user
const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ error: "Authentication required" });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as AuthUser;
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ error: "Invalid token" });
    }
};

// Middleware to restrict to customers
const isCustomer = (req: Request, res: Response, next: NextFunction) => {
    if (req.user?.role !== "customer") {
        return res.status(403).json({ error: "Customer access required" });
    }
    next();
};

// POST /api/orders - Place a new order
router.post("/", authenticate, isCustomer, async (req: Request, res: Response) => {
    try {
        await connectToDatabase();
        const { items, shippingAddress } = req.body;

        if (!items || !Array.isArray(items) || items.length === 0 || !shippingAddress) {
            return res.status(400).json({ error: "Items and shipping address are required" });
        }

        let total = 0;
        const orderItems = [];
        for (const item of items) {
            const product = await Product.findById(item.id).lean();
            if (!product || product.status !== "active") {
                return res.status(400).json({ error: `Product ${item.id} not found or inactive` });
            }
            if (product.stockCount < item.quantity) {
                return res.status(400).json({ error: `Insufficient stock for ${product.name}` });
            }
            total += product.price * item.quantity;
            orderItems.push({
                id: product._id,
                name: product.name,
                price: product.price,
                quantity: item.quantity,
                image: product.image,
            });
        }

        const shipping = 10.0;
        const tax = total * 0.08;
        total += shipping + tax;

        const orderCount = await Order.countDocuments();
        const orderNumber = `ORD-${(orderCount + 1).toString().padStart(6, "0")}`;

        const order = new Order({
            userId: req.user!.userId,
            orderNumber,
            total,
            items: orderItems,
            shippingAddress,
            status: "pending",
            trackingUpdates: [{ status: "pending", date: new Date() }],
        });

        await order.save();

        for (const item of items) {
            await Product.updateOne({ _id: item.id }, { $inc: { stockCount: -item.quantity } });
        }

        res.status(201).json({ order });
    } catch (error) {
        console.error("Error placing order:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

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
                await Product.updateOne({ _id: item.id }, { $inc: { stockCount: item.quantity } });
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