import express, { Request, Response } from "express";
import connectToDatabase from "../utils/mongodb";
import { Category } from "@/models/Category";

const router = express.Router();

// GET /api/categories - Get all categories
router.get("/", async (req: Request, res: Response) => {
    try {
        await connectToDatabase();
        const categories = await Category.find().lean();
        res.json(categories);
    } catch (error) {
        console.error("Error fetching categories:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// GET /api/categories/:id - Get a single category by ID
router.get("/:id", async (req: Request, res: Response) => {
    try {
        await connectToDatabase();
        const category = await Category.findOne({ id: parseInt(req.params.id) }).lean();
        if (!category) {
            return res.status(404).json({ error: "Category not found" });
        }
        res.json(category);
    } catch (error) {
        console.error("Error fetching category:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// POST /api/categories - Create a new category
router.post("/", async (req: Request, res: Response) => {
    try {
        await connectToDatabase();
        const { id, name, description, image, productCount, trending, subcategories, href } = req.body;
        if (!id || !name || !description || !image || !href) {
            return res.status(400).json({ error: "Missing required fields" });
        }
        const existingCategory = await Category.findOne({ id });
        if (existingCategory) {
            return res.status(400).json({ error: "Category ID already exists" });
        }
        const category = new Category({
            id,
            name,
            description,
            image,
            productCount,
            trending,
            subcategories,
            href,
        });
        await category.save();
        res.status(201).json(category);
    } catch (error) {
        console.error("Error creating category:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// PUT /api/categories/:id - Update a category
router.put("/:id", async (req: Request, res: Response) => {
    try {
        await connectToDatabase();
        const { name, description, image, productCount, trending, subcategories, href } = req.body;
        const category = await Category.findOneAndUpdate(
            { id: parseInt(req.params.id) },
            { name, description, image, productCount, trending, subcategories, href },
            { new: true, runValidators: true }
        );
        if (!category) {
            return res.status(404).json({ error: "Category not found" });
        }
        res.json(category);
    } catch (error) {
        console.error("Error updating category:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// DELETE /api/categories/:id - Delete a category
router.delete("/:id", async (req: Request, res: Response) => {
    try {
        await connectToDatabase();
        const category = await Category.findOneAndDelete({ id: parseInt(req.params.id) });
        if (!category) {
            return res.status(404).json({ error: "Category not found" });
        }
        res.json({ message: "Category deleted successfully" });
    } catch (error) {
        console.error("Error deleting category:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

export default router;