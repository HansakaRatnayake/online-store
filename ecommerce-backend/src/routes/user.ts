import express, { Request, Response } from "express";
import connectToDatabase from "@/utils/mongodb";
import { User } from "@/models/User";
import { Order } from "@/models/Order";
import { authenticate, isAdmin } from "@/middleware/auth";
import bcrypt from "bcryptjs";
import { sendEmail } from "@/utils/emailservice";
import { generatePasswordResetEmail } from "@/utils/templates/passwordResetEmail";
import multer from "multer";

const router = express.Router();

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/png', 'image/jpeg', 'image/gif'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only PNG, JPEG, and GIF are allowed.') as any, false);
        }
    },
});

// GET /api/users/profile - Get authenticated user's profile
router.get("/profile", authenticate, async (req: Request, res: Response) => {
    try {
        await connectToDatabase();
        const user = await User.findById(req.user!.userId).lean();
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json({
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
            avatar: user.avatar ? `data:image/jpeg;base64,${user.avatar.toString('base64')}` : null,
            mobileNo: user.mobileNo || "",
            country: user.country || "",
            dob: user.dob || null,
            address: user.address || "",
            status: user.status,
            notificationPreferences: user.notificationPreferences || {
                emailNotifications: true,
                smsNotifications: false,
                marketingEmails: true,
                orderUpdates: true,
            },
            createdAt: user.createdAt,
        });
    } catch (error) {
        console.error("Error fetching user profile:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// POST /api/users/upload-avatar - Upload avatar image
router.post("/upload-avatar", authenticate, upload.single('avatar'), async (req: Request, res: Response) => {
    try {
        await connectToDatabase();
        const user = await User.findById(req.user!.userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        user.avatar = req.file.buffer;
        await user.save();

        res.json({
            message: "Avatar uploaded successfully",
            avatar: `data:image/${req.file.mimetype.split('/')[1]};base64,${req.file.buffer.toString('base64')}`,
        });
    } catch (error: any) {
        console.error("Error uploading avatar:", error);
        res.status(500).json({ error: error.message || "Internal Server Error" });
    }
});

// PUT /api/users/:id - Update user details (admin or self)
router.put("/:id", authenticate, async (req: Request, res: Response) => {
    try {
        await connectToDatabase();

        const { name, email, mobileNo, country, dob, address, notificationPreferences } = req.body;
        const userId = req.params.id;

        if (req.user!.userId !== userId && req.user!.role !== "admin") {
            return res.status(403).json({ error: "Access denied" });
        }

        const user :any= await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Validate email format
        if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).json({ error: "Invalid email format" });
        }

        user.name = name || user.name;
        user.email = email || user.email;
        user.mobileNo = mobileNo || user.mobileNo;
        user.country = country || user.country;
        user.dob = dob ? new Date(dob) : user.dob;
        user.address = address || user.address;
        if (notificationPreferences) {
            user.notificationPreferences = {
                emailNotifications: notificationPreferences.emailNotifications ?? user.notificationPreferences.emailNotifications,
                smsNotifications: notificationPreferences.smsNotifications ?? user.notificationPreferences.smsNotifications,
                marketingEmails: notificationPreferences.marketingEmails ?? user.notificationPreferences.marketingEmails,
                orderUpdates: notificationPreferences.orderUpdates ?? user.notificationPreferences.orderUpdates,
            };
        }

        await user.save();

        res.json({
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
            avatar: user.avatar ? `data:image/jpeg;base64,${user.avatar.toString('base64')}` : null,
            mobileNo: user.mobileNo || "",
            country: user.country || "",
            dob: user.dob || null,
            address: user.address || "",
            status: user.status,
            notificationPreferences: user.notificationPreferences,
            createdAt: user.createdAt,
        });
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// POST /api/users/change-password - Change authenticated user's password
router.post("/change-password", authenticate, async (req: Request, res: Response) => {
    try {
        await connectToDatabase();

        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ error: "Current and new passwords are required" });
        }

        if (newPassword.length < 8) {
            return res.status(400).json({ error: "New password must be at least 8 characters long" });
        }

        const user = await User.findById(req.user!.userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Current password is incorrect" });
        }

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        res.json({ message: "Password updated successfully" });
    } catch (error) {
        console.error("Error changing password:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// GET /api/users - Get all users (admin only)
router.get("/", authenticate, isAdmin, async (req: Request, res: Response) => {
    try {
        await connectToDatabase();

        const { page = "1", limit = "10" } = req.query;

        let query: any = {};

        const pageNum = parseInt(page as string, 10);
        const limitNum = parseInt(limit as string, 10);

        const totalCount = await User.countDocuments(query);
        const totalPages = Math.ceil(totalCount / limitNum);

        const users = await User.find(query)
            .sort({ createdAt: -1 })
            .skip((pageNum - 1) * limitNum)
            .limit(limitNum)
            .lean();

        res.json({
            users: users.map(user => ({
                id: user._id.toString(),
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar ? `data:image/jpeg;base64,${user.avatar.toString('base64')}` : null,
                mobileNo: user.mobileNo || "",
                country: user.country || "",
                dob: user.dob || null,
                address: user.address || "",
                status: user.status,
                notificationPreferences: user.notificationPreferences,
                createdAt: user.createdAt,
            })),
            currentPage: pageNum,
            totalPages,
            totalCount,
        });
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// GET /api/users/customers - Get all customers with search, status filter, and pagination
router.get("/customers", authenticate, isAdmin, async (req: Request, res: Response) => {
    try {
        await connectToDatabase();

        const { page = "1", limit = "10", search = "", status = "all" } = req.query;

        let query: any = { role: "customer" };

        if (search) {
            query.$or = [
                { name: { $regex: search as string, $options: "i" } },
                { email: { $regex: search as string, $options: "i" } },
            ];
        }

        if (status !== "all") {
            query.status = status as string;
        }

        const pageNum = parseInt(page as string, 10);
        const limitNum = parseInt(limit as string, 10);


        const totalCount = await User.countDocuments(query);

        const totalPages = Math.ceil(totalCount / limitNum);

        const customers = await User.find(query)
            .sort({ createdAt: -1 })
            .skip((pageNum - 1) * limitNum)
            .limit(limitNum)
            .lean();

        const enrichedCustomers = await Promise.all(
            customers.map(async (customer) => {
                const orders = await Order.find({ userId: customer._id })
                    .select("orderNumber total status createdAt")
                    .lean();
                const totalOrders = orders.length;
                const totalSpent = orders.reduce((sum, order) => sum + order.total, 0);
                const lastOrder = orders.length > 0 ? orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0].createdAt : null;

                return {
                    id: customer._id.toString(),
                    name: customer.name,
                    email: customer.email,
                    phone: customer.mobileNo || "",
                    avatar: customer.avatar ? `data:image/jpeg;base64,${customer.avatar.toString('base64')}` : null,
                    status: customer.status.toLowerCase(),
                    joinDate: customer.createdAt,
                    lastOrder,
                    totalOrders,
                    totalSpent,
                    address: customer.address || "",
                    orders: orders.map(order => ({
                        id: order.orderNumber,
                        date: order.createdAt,
                        total: order.total,
                        status: order.status,
                    })),
                };
            })
        );

        res.json({
            users: enrichedCustomers,
            currentPage: pageNum,
            totalPages,
            totalCount,
        });
    } catch (error) {
        console.error("Error fetching customers:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// GET /api/users/customers/stats - Get customer statistics
router.get("/customers/stats", authenticate, isAdmin, async (req: Request, res: Response) => {
    try {
        await connectToDatabase();

        const customers = await User.find({ role: "customer" }).lean();
        const orders = await Order.find({ userId: { $in: customers.map(c => c._id) } }).lean();

        const stats = {
            total: customers.length,
            active: customers.filter(c => c.status.toLowerCase() === "active").length,
            inactive: customers.filter(c => c.status.toLowerCase() === "inactive").length,
            blocked: customers.filter(c => c.status.toLowerCase() === "blocked").length,
            totalRevenue: orders.reduce((sum, order) => sum + order.total, 0),
        };

        res.json(stats);
    } catch (error) {
        console.error("Error fetching customer stats:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// PATCH /api/users/:id/status - Update user status
router.patch("/:id/status", authenticate, isAdmin, async (req: Request, res: Response) => {
    try {
        await connectToDatabase();

        const { status } = req.body;

        if (!["active", "inactive", "blocked"].includes(status.toLowerCase())) {
            return res.status(400).json({ error: "Invalid status value" });
        }

        const user = await User.findByIdAndUpdate(
            req.params.id,
            { status: status.toLowerCase() },
            { new: true }
        ).lean();

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json({
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            phone: user.mobileNo || "",
            avatar: user.avatar ? `data:image/jpeg;base64,${user.avatar.toString('base64')}` : null,
            status: user.status,
            joinDate: user.createdAt,
            address: user.address || "",
        });
    } catch (error) {
        console.error("Error updating user status:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// POST /api/users/:id/send-email - Send email to customer
router.post("/:id/send-email", authenticate, isAdmin, async (req: Request, res: Response) => {
    try {
        await connectToDatabase();

        const { subject, message } = req.body;
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        if (!subject || !message) {
            return res.status(400).json({ error: "Subject and message are required" });
        }

        await sendEmail(user.email, subject, message, message);

        res.json({ message: "Email sent successfully" });
    } catch (error) {
        console.error("Error sending email:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// POST /api/users/:id/reset-password - Reset customer password
router.post("/:id/reset-password", authenticate, isAdmin, async (req: Request, res: Response) => {
    try {
        await connectToDatabase();

        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const tempPassword = Math.random().toString(36).slice(-8);
        user.password = await bcrypt.hash(tempPassword, 10);
        await user.save();

        await sendEmail(
            user.email,
            "Password Reset",
            "",
            generatePasswordResetEmail(user.name, tempPassword)
        );

        res.json({ message: "Password reset email sent" });
    } catch (error) {
        console.error("Error resetting password:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// GET /api/users/status-count
router.get("/status-count", async (req: Request, res: Response) => {
    try {
        await connectToDatabase();

        const result = await User.aggregate([
            {
                $match: { role: "customer" }
            },
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 }
                }
            }
        ]);

        // Format response as { Active: 3, Inactive: 2, Blocked: 1 }
        const counts = result.reduce((acc, item) => {
            acc[item._id] = item.count;
            return acc;
        }, {} as Record<string, number>);

        res.json(counts);
    } catch (error) {
        console.error("Error getting status count:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


export default router;