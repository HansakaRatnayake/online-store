import express, { Request, Response } from "express";
import connectToDatabase from "@/utils/mongodb";
import { User } from "@/models/User";

const router = express.Router();

// GET /api/users - Get all users
router.get("/", async (req: Request, res: Response) => {
    try {
        await connectToDatabase();

        const users = await User.find().lean();
        res.json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// GET /api/users/customers - Get all users with role 'customer'
router.get("/customers", async (req: Request, res: Response) => {
    try {
        await connectToDatabase();

        const customers = await User.find({ role: "customer" }).lean();
        res.json(customers);
    } catch (error) {
        console.error("Error fetching customers:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// PATCH /api/users/:id/status - Update user status
router.patch("/:id/status", async (req: Request, res: Response) => {
    try {
        await connectToDatabase();

        const { status } = req.body;

        if (!["Active", "Inactive", "Blocked"].includes(status)) {
            return res.status(400).json({ error: "Invalid status value" });
        }

        const user = await User.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        ).lean();

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json(user);
    } catch (error) {
        console.error("Error updating user status:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// PUT /api/users/:id - Update user details
router.put("/:id", async (req: Request, res: Response) => {
    try {
        await connectToDatabase();

        const {
            name,
            email,
            password,
            role,
            avatar,
            mobileNo,
            country,
            dob,
        } = req.body;

        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        user.name = name || user.name;
        user.email = email || user.email;
        user.password = password || user.password; // Note: should hash in real app!
        user.role = role || user.role;
        user.avatar = avatar || user.avatar;
        user.mobileNo = mobileNo || user.mobileNo;
        user.country = country || user.country;
        user.dob = dob || user.dob;

        await user.save();

        res.json(user);
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

export default router;