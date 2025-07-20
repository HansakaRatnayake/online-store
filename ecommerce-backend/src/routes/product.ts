import express, { Request, Response } from "express";
import connectToDatabase from "@/utils/mongodb";
import { Product } from "@/models/Product";

const router = express.Router();

// Get /api/products/count - Get Product Count
router.get("/count", async (req: Request, res: Response) => {
    try {
        await connectToDatabase();

        const total = await Product.countDocuments({});
        res.json({ total });
    } catch (error) {
        console.error("Error counting products:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// GET /api/products - Get all products with optional filtering
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
                { brand: { $regex: search as string, $options: "i" } },
            ];
        }

        const pageNum = parseInt(page as string, 10);
        const limitNum = parseInt(limit as string, 10);

        const totalCount = await Product.countDocuments(query); // 👈 count total results
        const totalPages = Math.ceil(totalCount / limitNum);

        const products = await Product.find(query)
            .sort({ createdAt: -1 }) // ✅ Newest to Oldest
            .skip((pageNum - 1) * limitNum)
            .limit(limitNum)
            .lean();

        res.json({
            products,
            currentPage: pageNum,
            totalPages,
            totalCount,
        });
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


// GET /api/products/related/:category - Get related products by category
router.get("/related/:category", async (req: Request, res: Response) => {
    try {
        await connectToDatabase();
        const products = await Product.find({
            category: { $regex: req.params.category, $options: "i" },
        })
            .limit(4)
            .lean();
        res.json(products);
    } catch (error) {
        console.error("Error fetching related products:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// GET /api/products/featured - Get featured products
router.get("/featured", async (req: Request, res: Response) => {
    try {
        await connectToDatabase();

        const featuredBadges = ["Best Seller", "New Arrival", "Limited", "Trending"];
        const products = await Product.find({
            badge: { $in: featuredBadges }
        })
            .limit(4)
            .lean();

        res.json(products);
    } catch (error) {
        console.error("Error fetching featured products:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// POST /api/products - Create a new product
router.post("/", async (req: Request, res: Response) => {
    try {
        await connectToDatabase();
        const {
            name,
            price,
            originalPrice,
            category,
            brand,
            stockCount,
            description,
            features,
            specifications,
            colors,
            sizes,
            shipping,
            badge,
            images,
            status,
            sales = 0,
        } = req.body;

        if (!name || !price || !category || !brand || !stockCount) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        // Generate a unique id
        const lastProduct = await Product.findOne().sort({ id: -1 }).lean();
        const newId = lastProduct ? lastProduct.id + 1 : 1;

        const product = new Product({
            id: newId,
            name,
            price: Number(price),
            originalPrice: Number(originalPrice) || Number(price),
            rating: 0,
            reviews: 0,
            image: images?.[0] || "/placeholder.svg",
            images: images || ["/placeholder.svg"],
            badge,
            category,
            brand,
            inStock: stockCount > 0,
            stockCount: Number(stockCount),
            description,
            features: features || [],
            specifications: specifications || {},
            colors: colors || [],
            sizes: sizes || [],
            shipping: shipping || { free: true, estimatedDays: "3-5 business days" },
            sales: Number(sales),
            status: status || "active",
            createdAt: new Date(),
        });

        await product.save();
        res.status(201).json(product);
    } catch (error) {
        console.error("Error creating product:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// PUT /api/products/:id - Update a product
router.put("/:id", async (req: Request, res: Response) => {
    try {
        await connectToDatabase();
        const {
            name,
            price,
            originalPrice,
            category,
            brand,
            stockCount,
            description,
            features,
            specifications,
            colors,
            sizes,
            shipping,
            badge,
            images,
            status,
            sales,
        } = req.body;

        const product = await Product.findOne({ id: parseInt(req.params.id) });
        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }

        product.name = name || product.name;
        product.price = Number(price) || product.price;
        product.originalPrice = Number(originalPrice) || product.originalPrice;
        product.category = category || product.category;
        product.brand = brand || product.brand;
        product.stockCount = Number(stockCount) || product.stockCount;
        product.inStock = Number(stockCount) > 0;
        product.description = description || product.description;
        product.features = features || product.features;
        product.specifications = specifications || product.specifications;
        product.colors = colors || product.colors;
        product.sizes = sizes || product.sizes;
        product.shipping = shipping || product.shipping;
        product.badge = badge || product.badge;
        product.images = images || product.images;
        product.image = images?.[0] || product.image;
        product.status = status || product.status;
        product.sales = Number(sales) || product.sales;

        await product.save();
        res.json(product);
    } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// DELETE /api/products/:id - Delete a product
router.delete("/:id", async (req: Request, res: Response) => {
    try {
        await connectToDatabase();
        const result = await Product.deleteOne({ id: parseInt(req.params.id) });
        if (result.deletedCount === 0) {
            return res.status(404).json({ error: "Product not found" });
        }
        res.status(204).send();
    } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


// PATCH /api/products/:id/status - Toggle product status
router.patch("/:id/status", async (req: Request, res: Response) => {
    try {
        await connectToDatabase();

        const product = await Product.findOne({ id: parseInt(req.params.id) });
        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }

        // Toggle the status
        product.status = product.status === "active" ? "inactive" : "active";
        await product.save();

        res.json(product);
    } catch (error) {
        console.error("Error toggling product status:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// GET /api/products/:id - Get a single product by ID
router.get("/:id", async (req: Request, res: Response) => {
    try {
        await connectToDatabase();
        const product = await Product.findOne({ id: parseInt(req.params.id) }).lean();
        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }
        res.json(product);
    } catch (error) {
        console.error("Error fetching product:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


export default router;