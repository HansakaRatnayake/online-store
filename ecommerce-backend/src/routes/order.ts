import express, { Request, Response, NextFunction } from "express";
import connectToDatabase from "@/utils/mongodb";
import { Order } from "@/models/Order";
import { Product } from "@/models/Product";
import { User } from "@/models/User";
import {authenticate, isAdmin, isCustomer} from "@/middleware/auth";

const router = express.Router();

// GET /api/admin/stats - Get dashboard statistics (admin only)
router.get("/stats", authenticate, isAdmin, async (req: Request, res: Response) => {
    try {
        await connectToDatabase();

        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

        // Total Revenue (delivered orders)
        const currentRevenue = await Order.aggregate([
            { $match: { status: "delivered", createdAt: { $gte: startOfMonth } } },
            { $group: { _id: null, total: { $sum: "$total" } } },
        ]);
        const lastMonthRevenue = await Order.aggregate([
            { $match: { status: "delivered", createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth } } },
            { $group: { _id: null, total: { $sum: "$total" } } },
        ]);

        // Orders
        const currentOrders = await Order.countDocuments({ createdAt: { $gte: startOfMonth } });
        const lastMonthOrders = await Order.countDocuments({
            createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth },
        });

        // Customers
        const totalCustomers = await User.countDocuments({ role: "customer" });
        const newCustomers = await User.countDocuments({
            role: "customer",
            createdAt: { $gte: startOfMonth },
        });
        const lastMonthNewCustomers = await User.countDocuments({
            role: "customer",
            createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth },
        });

        // Products
        const totalProducts = await Product.countDocuments({ status: "active" });
        const newProducts = await Product.countDocuments({
            status: "active",
            createdAt: { $gte: startOfMonth },
        });
        const lastMonthNewProducts = await Product.countDocuments({
            status: "active",
            createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth },
        });

        const stats = [
            {
                title: "Total Revenue",
                value: `$${(currentRevenue[0]?.total || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
                change: lastMonthRevenue[0]?.total
                    ? (((currentRevenue[0]?.total || 0) - lastMonthRevenue[0].total) / lastMonthRevenue[0].total * 100).toFixed(1) + "%"
                    : "0.0%",
                trend: lastMonthRevenue[0]?.total ? (currentRevenue[0]?.total >= lastMonthRevenue[0].total ? "up" : "down") : "up",
                icon: "DollarSign",
                description: "from last month",
            },
            {
                title: "Orders",
                value: currentOrders.toLocaleString(),
                change: lastMonthOrders
                    ? ((currentOrders - lastMonthOrders) / lastMonthOrders * 100).toFixed(1) + "%"
                    : "0.0%",
                trend: lastMonthOrders ? (currentOrders >= lastMonthOrders ? "up" : "down") : "up",
                icon: "ShoppingCart",
                description: "from last month",
            },
            {
                title: "Customers",
                value: totalCustomers.toLocaleString(),
                change: lastMonthNewCustomers
                    ? ((newCustomers - lastMonthNewCustomers) / lastMonthNewCustomers * 100).toFixed(1) + "%"
                    : "0.0%",
                trend: lastMonthNewCustomers ? (newCustomers >= lastMonthNewCustomers ? "up" : "down") : "up",
                icon: "Users",
                description: "from last month",
            },
            {
                title: "Products",
                value: totalProducts.toLocaleString(),
                change: lastMonthNewProducts
                    ? ((newProducts - lastMonthNewProducts) / lastMonthNewProducts * 100).toFixed(1) + "%"
                    : "0.0%",
                trend: lastMonthNewProducts ? (newProducts >= lastMonthNewProducts ? "up" : "down") : "up",
                icon: "Package",
                description: "from last month",
            },
        ];

        res.json(stats);
    } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// GET /api/admin/sales - Get sales data for the last 6 months (admin only)
router.get("/sales", authenticate, isAdmin, async (req: Request, res: Response) => {
    try {
        await connectToDatabase();

        const now = new Date();
        const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

        const salesData = await Order.aggregate([
            {
                $match: {
                    status: "delivered",
                    createdAt: { $gte: sixMonthsAgo },
                },
            },
            {
                $group: {
                    _id: {
                        year: { $year: "$createdAt" },
                        month: { $month: "$createdAt" },
                    },
                    sales: { $sum: "$total" },
                    orders: { $sum: 1 },
                },
            },
            {
                $sort: { "_id.year": 1, "_id.month": 1 },
            },
            {
                $project: {
                    month: {
                        $arrayElemAt: [
                            ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
                            { $subtract: ["$_id.month", 1] },
                        ],
                    },
                    sales: 1,
                    orders: 1,
                },
            },
        ]);

        res.json(salesData);
    } catch (error) {
        console.error("Error fetching sales data:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// POST /api/orders - Place a new order after payment
router.post("/", authenticate, isCustomer, async (req: Request, res: Response) => {
    try {
        await connectToDatabase();

        const { items, shippingAddress, discount = 0 } = req.body;
        const userId = req.user!.userId;

        if (!items || !shippingAddress) {
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

        const subtotal = enrichedItems.reduce((sum, item) => sum + item.quantity * item.price, 0);
        const shipping = subtotal > 100 || enrichedItems.some(item => item.shipping?.free) ? 0 : 9.99;
        const tax = (subtotal - discount) * 0.08;
        const total = subtotal - discount + shipping + tax;

        if ([subtotal, tax, total].some(val => isNaN(val))) {
            return res.status(400).json({ error: "Invalid pricing calculation" });
        }

        const order = await Order.create({
            userId,
            orderNumber: generateOrderNumber(),
            items: enrichedItems,
            shippingAddress,
            subtotal,
            discount,
            shipping,
            tax,
            total,
            status: "pending",
            trackingUpdates: [{ status: "pending", date: new Date() }],
        });

        for (const item of items) {
            await Product.updateOne(
                { id: parseInt(item.id) },
                { $inc: { stockCount: -item.quantity }, $set: { inStock: item.quantity > 0 } }
            );
        }

        res.status(201).json({
            order: {
                _id: order._id.toString(),
                orderNumber: order.orderNumber,
                userId: order.userId,
                items: order.items,
                total: order.total,
                status: order.status,
                createdAt: order.createdAt,
                shippingAddress: order.shippingAddress,
                trackingNumber: order.trackingNumber,
            },
        });
    } catch (error) {
        console.error("Error creating order:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// GET /api/orders/my-orders - Get customer's orders with pagination
router.get("/my-orders", authenticate, isCustomer, async (req: Request, res: Response) => {
    try {
        await connectToDatabase();
        const { page = "1", limit = "10", search = "", status = "all" } = req.query;
        const pageNum = parseInt(page as string, 10);
        const limitNum = parseInt(limit as string, 10);

        let query: any = { userId: req.user!.userId };
        if (search) {
            query.orderNumber = { $regex: search as string, $options: "i" };
        }
        if (status !== "all") {
            query.status = status as string;
        }

        const orders = await Order.find(query)
            .select("+trackingUpdates")
            .sort({ createdAt: -1 })
            .skip((pageNum - 1) * limitNum)
            .limit(limitNum)
            .lean();

        const total = await Order.countDocuments(query);

        const ordersWithBase64Images:any = orders.map((odr) => ({
            ...odr,
            items: odr.items.map((itm:any) => ({
                ...itm,
                image: itm.image?.data ? `data:${itm.image.contentType};base64,${itm.image.data.toString("base64")}`: "/placeholder.svg",
            }))
        }));

        res.json({
            orders: ordersWithBase64Images.map((order:any) => ({
                _id: order._id.toString(),
                orderNumber: order.orderNumber,
                userId: order.userId,
                items: order.items,
                total: order.total,
                status: order.status,
                createdAt: order.createdAt,
                shippingAddress: order.shippingAddress,
                trackingNumber: order.trackingNumber,
            })),
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
router.patch("/:id", authenticate, async (req: Request, res: Response) => {
    try {
        await connectToDatabase();
        const { status } = req.body;
        const orderId = req.params.id;

        if (!status || !["pending", "processing", "shipped", "delivered", "cancelled"].includes(status)) {
            return res.status(400).json({ error: "Invalid status update" });
        }

        let order;
        if (req.user?.role == 'customer') {
            order = await Order.findOne({ _id: orderId, userId: req.user!.userId });
        }

        if (req.user?.role == 'admin') {
            order = await Order.findOne({ _id: orderId });
        }

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
                await Product.updateOne(
                    { id: item.id },
                    { $inc: { stockCount: item.quantity }, inStock: true }
                );
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

// GET /api/orders - Get all orders with pagination and filters (admin only)
router.get("/", authenticate, isAdmin, async (req: Request, res: Response) => {
    try {
        await connectToDatabase();
        const { page = "1", limit = "10", search = "", status = "all" } = req.query;
        const pageNum = parseInt(page as string, 10);
        const limitNum = parseInt(limit as string, 10);

        let query: any = {};
        if (search) {
            query.$or = [
                { orderNumber: { $regex: search as string, $options: "i" } },
                { userId: { $regex: search as string, $options: "i" } },
            ];
        }
        if (status !== "all") {
            query.status = status as string;
        }

        const orders = await Order.find(query)
            .sort({ createdAt: -1 })
            .skip((pageNum - 1) * limitNum)
            .limit(limitNum)
            .lean();

        const total = await Order.countDocuments(query);

        res.json({
            orders: orders.map(order => ({
                _id: order._id.toString(),
                orderNumber: order.orderNumber,
                userId: order.userId,
                items: order.items,
                total: order.total,
                status: order.status,
                createdAt: order.createdAt,
                shippingAddress: order.shippingAddress,
                trackingNumber: order.trackingNumber,
            })),
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

// GET /api/orders/customer - Get orders for the authenticated customer
router.get("/customer", authenticate, async (req: Request, res: Response) => {
    try {
        await connectToDatabase();

        const { page = "1", limit = "10", search = "", status = "all" } = req.query;

        let query: any = { userId: req.user!.userId };
        if (search) {
            query.orderNumber = { $regex: search as string, $options: "i" };
        }
        if (status !== "all") {
            query.status = status as string;
        }

        const pageNum = parseInt(page as string, 10);
        const limitNum = parseInt(limit as string, 10);

        const totalCount = await Order.countDocuments(query);
        const totalPages = Math.ceil(totalCount / limitNum);

        const orders = await Order.find(query)
            .sort({ createdAt: -1 })
            .skip((pageNum - 1) * limitNum)
            .limit(limitNum)
            .lean();

        res.json({
            orders: orders.map((order) => ({
                _id: order._id.toString(),
                orderNumber: order.orderNumber,
                userId: order.userId,
                items: order.items,
                total: order.total,
                status: order.status,
                createdAt: order.createdAt,
                shippingAddress: order.shippingAddress,
                trackingNumber: order.trackingNumber,
            })),
            currentPage: pageNum,
            totalPages,
            totalCount,
        });
    } catch (error) {
        console.error("Error fetching customer orders:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

const generateOrderNumber = () => {
    const now = Date.now();
    const random = Math.floor(1000 + Math.random() * 9000);
    return `ORD-${now}-${random}`;
};

// GET /api/orders/count - Get total number of orders (admin only)
router.get("/count", authenticate, isAdmin, async (req: Request, res: Response) => {
    try {
        await connectToDatabase();
        const totalOrders = await Order.countDocuments();
        res.json({ totalOrders });
    } catch (error) {
        console.error("Error fetching order count:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

export default router;