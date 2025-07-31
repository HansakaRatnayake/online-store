import express, { Request, Response } from "express";
import connectToDatabase from "@/utils/mongodb";
import { Product } from "@/models/Product";
import multer from "multer";

const router = express.Router();

// Configure Multer for in-memory storage
const upload = multer({
    storage: multer.memoryStorage(),
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|gif/;
        const mimetype = filetypes.test(file.mimetype);
        if (mimetype) {
            cb(null, true);
        } else {
            cb(new Error("Only images (jpeg, jpg, png, gif) are allowed") as any, false);
        }
    },
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit per file
});

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

        const {
            category,
            search,
            brands,
            colors,
            minPrice,
            minRating,
            page = "1",
            limit = "10",
        } = req.query;

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

        const totalCount = await Product.countDocuments(query);
        const totalPages = Math.ceil(totalCount / limitNum);

        const products = await Product.find(query)
            .sort({ createdAt: -1 })
            .skip((pageNum - 1) * limitNum)
            .limit(limitNum)
            .lean();

        // Convert images to base64 for frontend
        const productsWithBase64 = products.map((product) => ({
            ...product,
            image: product.image?.data
                ? `data:${product.image.contentType};base64,${product.image.data.toString("base64")}`
                : "/placeholder.svg",
            images: product.images?.map((img : any) =>
                img.data ? `data:${img.contentType};base64,${img.data.toString("base64")}` : "/placeholder.svg"
            ) || ["/placeholder.svg"],
        }));

        res.json({
            products: productsWithBase64,
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

        // Convert images to base64
        const productsWithBase64 = products.map((product) => ({
            ...product,
            image: product.image?.data
                ? `data:${product.image.contentType};base64,${product.image.data.toString("base64")}`
                : "/placeholder.svg",
            images: product.images?.map((img : any) =>
                img.data ? `data:${img.contentType};base64,${img.data.toString("base64")}` : "/placeholder.svg"
            ) || ["/placeholder.svg"],
        }));

        res.json(productsWithBase64);
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
            badge: { $in: featuredBadges },
        })
            .limit(4)
            .lean();

        // Convert images to base64
        const productsWithBase64 = products.map((product) => ({
            ...product,
            image: product.image?.data
                ? `data:${product.image.contentType};base64,${product.image.data.toString("base64")}`
                : "/placeholder.svg",
            images: product.images?.map((img  : any) =>
                img.data ? `data:${img.contentType};base64,${img.data.toString("base64")}` : "/placeholder.svg"
            ) || ["/placeholder.svg"],
        }));

        res.json(productsWithBase64);
    } catch (error) {
        console.error("Error fetching featured products:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// POST /api/products - Create a new product with file uploads
router.post("/", upload.array("images", 5), async (req: Request, res: Response) => {
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
            status,
            sales = 0,
        } = req.body;

        if (!name || !price || !category || !brand || !stockCount) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        // Process uploaded files
        const files = req.files as Express.Multer.File[];
        const imageDocs = files
            ? files.map((file) => ({
                data: file.buffer,
                contentType: file.mimetype,
            }))
            : [{ data: null, contentType: "image/png" }]; // Fallback placeholder

        // Parse array fields
        const parsedFeatures = features ? JSON.parse(features) : [];
        const parsedColors = colors ? JSON.parse(colors) : [];
        const parsedSizes = sizes ? JSON.parse(sizes) : [];
        const parsedSpecifications = specifications ? JSON.parse(specifications) : {};
        const parsedShipping = shipping ? JSON.parse(shipping) : { free: true, estimatedDays: "3-5 business days" };

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
            image: imageDocs[0] || { data: null, contentType: "image/png" },
            images: imageDocs,
            badge: badge || undefined,
            category,
            brand,
            inStock: Number(stockCount) > 0,
            stockCount: Number(stockCount),
            description,
            features: parsedFeatures,
            specifications: parsedSpecifications,
            colors: parsedColors,
            sizes: parsedSizes,
            shipping: parsedShipping,
            sales: Number(sales),
            status: status || "active",
            createdAt: new Date(),
        });

        await product.save();

        // Return product with base64 images
        const productWithBase64 = {
            ...product.toObject(),
            image: product.image?.data
                ? `data:${product.image.contentType};base64,${product.image.data.toString("base64")}`
                : "/placeholder.svg",
            images: product.images?.map((img : any) =>
                img.data ? `data:${img.contentType};base64,${img.data.toString("base64")}` : "/placeholder.svg"
            ) || ["/placeholder.svg"],
        };

        res.status(201).json(productWithBase64);
    } catch (error) {
        console.error("Error creating product:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// PUT /api/products/:id - Update a product with file uploads
router.put("/:id", upload.array("images", 5), async (req: Request, res: Response) => {
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
            status,
            sales,
        } = req.body;

        const product = await Product.findOne({ id: parseInt(req.params.id) });
        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }

        // Process uploaded files
        const files = req.files as Express.Multer.File[];
        const imageDocs = files
            ? files.map((file) => ({
                data: file.buffer,
                contentType: file.mimetype,
            }))
            : product.images;

        // Parse array fields
        const parsedFeatures = features ? JSON.parse(features) : product.features;
        const parsedColors = colors ? JSON.parse(colors) : product.colors;
        const parsedSizes = sizes ? JSON.parse(sizes) : product.sizes;
        const parsedSpecifications = specifications ? JSON.parse(specifications) : product.specifications;
        const parsedShipping = shipping ? JSON.parse(shipping) : product.shipping;

        product.name = name || product.name;
        product.price = Number(price) || product.price;
        product.originalPrice = Number(originalPrice) || product.originalPrice;
        product.category = category || product.category;
        product.brand = brand || product.brand;
        product.stockCount = Number(stockCount) || product.stockCount;
        product.inStock = Number(stockCount) > 0;
        product.description = description || product.description;
        product.features = parsedFeatures;
        product.specifications = parsedSpecifications;
        product.colors = parsedColors;
        product.sizes = parsedSizes;
        product.shipping = parsedShipping;
        product.badge = badge || product.badge;
        product.images = imageDocs;
        product.image = imageDocs[0] || product.image;
        product.status = status || product.status;
        product.sales = Number(sales) || product.sales;

        await product.save();

        // Return product with base64 images
        const productWithBase64 = {
            ...product.toObject(),
            image: product.image?.data
                ? `data:${product.image.contentType};base64,${product.image.data.toString("base64")}`
                : "/placeholder.svg",
            images: product.images?.map((img : any) =>
                img.data ? `data:${img.contentType};base64,${img.data.toString("base64")}` : "/placeholder.svg"
            ) || ["/placeholder.svg"],
        };

        res.json(productWithBase64);
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

        product.status = product.status === "active" ? "inactive" : "active";
        await product.save();

        // Return product with base64 images
        const productWithBase64 = {
            ...product.toObject(),
            image: product.image?.data
                ? `data:${product.image.contentType};base64,${product.image.data.toString("base64")}`
                : "/placeholder.svg",
            images: product.images?.map((img : any) =>
                img.data ? `data:${img.contentType};base64,${img.data.toString("base64")}` : "/placeholder.svg"
            ) || ["/placeholder.svg"],
        };

        res.json(productWithBase64);
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

        // Convert images to base64
        const productWithBase64 = {
            ...product,
            image: product.image?.data
                ? `data:${product.image.contentType};base64,${product.image.data.toString("base64")}`
                : "/placeholder.svg",
            images: product.images?.map((img : any) =>
                img.data ? `data:${img.contentType};base64,${img.data.toString("base64")}` : "/placeholder.svg"
            ) || ["/placeholder.svg"],
        };

        res.json(productWithBase64);
    } catch (error) {
        console.error("Error fetching product:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

export default router;