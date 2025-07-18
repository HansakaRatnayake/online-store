"use client"

import {useState, useEffect} from "react"
import Image from "next/image"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {Textarea} from "@/components/ui/textarea"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {Badge} from "@/components/ui/badge"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {Switch} from "@/components/ui/switch"
import {Plus, Search, Edit, Trash2, Eye, Package, AlertTriangle} from "lucide-react"
import {useToast} from "@/hooks/use-toast"

export default function ProductsManagement() {
    const [products, setProducts] = useState<any[]>([])
    const [categories, setCategories] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedCategory, setSelectedCategory] = useState("all")
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const [editingProduct, setEditingProduct] = useState<any>(null)
    const {toast} = useToast()

    const [newProduct, setNewProduct] = useState({
        name: "",
        price: "",
        originalPrice: "",
        category: "",
        brand: "",
        stockCount: "",
        description: "",
        features: "",
        specifications: "",
        colors: "",
        sizes: "",
        shippingFree: true,
        shippingDays: "3-5 business days",
        badge: "",
        images: "",
        status: "active",
    })

    useEffect(() => {
        async function fetchData() {
            try {
                // Fetch products
                const productResponse = await fetch("http://localhost:5000/api/products");
                if (!productResponse.ok) {
                    throw new Error("Failed to fetch products");
                }
                const productData = await productResponse.json();
                setProducts(productData);

                // Fetch categories
                const categoryResponse = await fetch("http://localhost:5000/api/categories");
                if (!categoryResponse.ok) {
                    throw new Error("Failed to fetch categories");
                }
                const categoryData = await categoryResponse.json();
                setCategories(categoryData);
                setIsLoading(false);
            } catch (err) {
                setError("Error fetching data");
                setIsLoading(false);
                console.error(err);
            }
        }

        fetchData();
    }, []);

    const filteredProducts = products.filter((product) => {
        const matchesSearch =
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.brand.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory =
            selectedCategory === "all" || product.category.toLowerCase() === selectedCategory.toLowerCase();
        return matchesSearch && matchesCategory;
    });

    const handleAddProduct = async () => {
        try {
            // Validate required fields
            if (!newProduct.name || !newProduct.price || !newProduct.category || !newProduct.brand || !newProduct.stockCount) {
                toast({
                    title: "Missing Required Fields",
                    description: "Please fill in all required fields (Name, Price, Category, Brand, Stock Quantity).",
                    variant: "destructive",
                });
                return;
            }

            // Validate specifications JSON
            let specifications = {};
            if (newProduct.specifications) {
                try {
                    specifications = JSON.parse(newProduct.specifications);
                } catch (err) {
                    toast({
                        title: "Invalid Specifications",
                        description: "Specifications must be valid JSON.",
                        variant: "destructive",
                    });
                    return;
                }
            }

            const features = newProduct.features ? newProduct.features.split(",").map((f: string) => f.trim()) : [];
            const colors = newProduct.colors ? newProduct.colors.split(",").map((c: string) => c.trim()) : [];
            const sizes = newProduct.sizes ? newProduct.sizes.split(",").map((s: string) => s.trim()) : [];
            const images = newProduct.images ? newProduct.images.split(",").map((i: string) => i.trim()) : ["/placeholder.svg"];
            const badge = newProduct.badge === "none" ? undefined : newProduct.badge;

            const response = await fetch("http://localhost:5000/api/products", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    name: newProduct.name,
                    price: newProduct.price,
                    originalPrice: newProduct.originalPrice,
                    category: newProduct.category,
                    brand: newProduct.brand,
                    stockCount: newProduct.stockCount,
                    description: newProduct.description,
                    features,
                    specifications,
                    colors,
                    sizes,
                    shipping: {
                        free: newProduct.shippingFree,
                        estimatedDays: newProduct.shippingDays,
                    },
                    badge,
                    images,
                    status: newProduct.status,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to add product");
            }

            const newProductData = await response.json();
            setProducts([...products, newProductData]);
            setNewProduct({
                name: "",
                price: "",
                originalPrice: "",
                category: "",
                brand: "",
                stockCount: "",
                description: "",
                features: "",
                specifications: "",
                colors: "",
                sizes: "",
                shippingFree: true,
                shippingDays: "3-5 business days",
                badge: "",
                images: "",
                status: "active",
            });
            setIsAddDialogOpen(false);
            toast({
                title: "Product added",
                description: "New product has been added successfully.",
            });
        } catch (err) {
            toast({
                title: "Error",
                description: "Failed to add product. Please try again.",
                variant: "destructive",
            });
            console.error(err);
        }
    };

    const handleEditProduct = (product: any) => {
        setEditingProduct(product);
        setNewProduct({
            name: product.name,
            price: product.price.toString(),
            originalPrice: product.originalPrice.toString(),
            category: product.category,
            brand: product.brand,
            stockCount: product.stockCount.toString(),
            description: product.description || "",
            features: product.features?.join(", ") || "",
            specifications: JSON.stringify(product.specifications, null, 2) || "",
            colors: product.colors?.join(", ") || "",
            sizes: product.sizes?.join(", ") || "",
            shippingFree: product.shipping?.free || true,
            shippingDays: product.shipping?.estimatedDays || "3-5 business days",
            badge: product.badge || "none",
            images: product.images?.join(", ") || "/placeholder.svg",
            status: product.status,
        });
    };

    const handleUpdateProduct = async () => {
        try {
            // Validate required fields
            if (!newProduct.name || !newProduct.price || !newProduct.category || !newProduct.brand || !newProduct.stockCount) {
                toast({
                    title: "Missing Required Fields",
                    description: "Please fill in all required fields (Name, Price, Category, Brand, Stock Quantity).",
                    variant: "destructive",
                });
                return;
            }

            // Validate specifications JSON
            let specifications = {};
            if (newProduct.specifications) {
                try {
                    specifications = JSON.parse(newProduct.specifications);
                } catch (err) {
                    toast({
                        title: "Invalid Specifications",
                        description: "Specifications must be valid JSON.",
                        variant: "destructive",
                    });
                    return;
                }
            }

            const features = newProduct.features ? newProduct.features.split(",").map((f: string) => f.trim()) : [];
            const colors = newProduct.colors ? newProduct.colors.split(",").map((c: string) => c.trim()) : [];
            const sizes = newProduct.sizes ? newProduct.sizes.split(",").map((s: string) => s.trim()) : [];
            const images = newProduct.images ? newProduct.images.split(",").map((i: string) => i.trim()) : ["/placeholder.svg"];
            const badge = newProduct.badge === "none" ? undefined : newProduct.badge;

            const response = await fetch(`http://localhost:5000/api/products/${editingProduct.id}`, {
                method: "PUT",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    name: newProduct.name,
                    price: newProduct.price,
                    originalPrice: newProduct.originalPrice,
                    category: newProduct.category,
                    brand: newProduct.brand,
                    stockCount: newProduct.stockCount,
                    description: newProduct.description,
                    features,
                    specifications,
                    colors,
                    sizes,
                    shipping: {
                        free: newProduct.shippingFree,
                        estimatedDays: newProduct.shippingDays,
                    },
                    badge,
                    images,
                    status: newProduct.status,
                    sales: editingProduct.sales,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to update product");
            }

            const updatedProduct = await response.json();
            setProducts(products.map((p) => (p.id === editingProduct.id ? updatedProduct : p)));
            setEditingProduct(null);
            setNewProduct({
                name: "",
                price: "",
                originalPrice: "",
                category: "",
                brand: "",
                stockCount: "",
                description: "",
                features: "",
                specifications: "",
                colors: "",
                sizes: "",
                shippingFree: true,
                shippingDays: "3-5 business days",
                badge: "",
                images: "",
                status: "active",
            });
            toast({
                title: "Product updated",
                description: "Product has been updated successfully.",
            });
        } catch (err) {
            toast({
                title: "Error",
                description: "Failed to update product. Please try again.",
                variant: "destructive",
            });
            console.error(err);
        }
    };

    const handleDeleteProduct = async (id: number) => {
        try {
            const response = await fetch(`http://localhost:5000/api/products/${id}`, {
                method: "DELETE",
            });
            if (!response.ok) {
                throw new Error("Failed to delete product");
            }
            setProducts(products.filter((p) => p.id !== id));
            toast({
                title: "Product deleted",
                description: "Product has been deleted successfully.",
            });
        } catch (err) {
            toast({
                title: "Error",
                description: "Failed to delete product. Please try again.",
                variant: "destructive",
            });
            console.error(err);
        }
    };

    const handleToggleStatus = async (id: number) => {
        try {
            const response = await fetch(`http://localhost:5000/api/products/${id}/status`, {
                method: "PATCH",
            });

            if (!response.ok) {
                throw new Error("Failed to update status");
            }

            const updatedProduct = await response.json();
            setProducts((prev) =>
                prev.map((p) => (p.id === id ? updatedProduct : p))
            );

            toast({
                title: "Status updated",
                description: "Product status has been updated.",
            });
        } catch (err) {
            toast({
                title: "Error",
                description: "Failed to update status. Please try again.",
                variant: "destructive",
            });
            console.error(err);
        }
    };


    const lowStockProducts = products.filter((p) => p.stockCount <= 5);
    const totalProducts = products.length;
    const activeProducts = products.filter((p) => p.status === "active").length;
    const totalValue = products.reduce((sum, p) => sum + p.price * p.stockCount, 0);

    if (isLoading) {
        return <div className="text-center py-8">Loading products...</div>;
    }

    if (error) {
        return <div className="text-center py-8 text-red-600">{error}</div>;
    }

    return (
        <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Products</p>
                                <p className="text-2xl font-bold text-gray-900">{totalProducts}</p>
                            </div>
                            <Package className="w-8 h-8 text-blue-600"/>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Active Products</p>
                                <p className="text-2xl font-bold text-gray-900">{activeProducts}</p>
                            </div>
                            <Eye className="w-8 h-8 text-green-600"/>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Low Stock</p>
                                <p className="text-2xl font-bold text-gray-900">{lowStockProducts.length}</p>
                            </div>
                            <AlertTriangle className="w-8 h-8 text-orange-600"/>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Inventory Value</p>
                                <p className="text-2xl font-bold text-gray-900">${totalValue.toFixed(2)}</p>
                            </div>
                            <Package className="w-8 h-8 text-purple-600"/>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Low Stock Alert */}
            {lowStockProducts.length > 0 && (
                <Card className="border-orange-200 bg-orange-50">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-orange-800">
                            <AlertTriangle className="w-5 h-5"/>
                            Low Stock Alert
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-orange-700 mb-3">{lowStockProducts.length} products are running low on
                            stock:</p>
                        <div className="flex flex-wrap gap-2">
                            {lowStockProducts.map((product) => (
                                <Badge key={product.id} variant="outline" className="border-orange-300 text-orange-800">
                                    {product.name} ({product.stockCount} left)
                                </Badge>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Products Management */}
            <Card>
                <CardHeader>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <CardTitle>Products</CardTitle>
                        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                            <DialogTrigger asChild>
                                <Button>
                                    <Plus className="w-4 h-4 mr-2"/>
                                    Add Product
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto p-6">
                                <DialogHeader>
                                    <DialogTitle>Add New Product</DialogTitle>
                                    <DialogDescription>Fill in the product details to add it to your
                                        catalog.</DialogDescription>
                                </DialogHeader>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Product Name</Label>
                                        <Input
                                            id="name"
                                            value={newProduct.name}
                                            onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                                            placeholder="Enter product name"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="brand">Brand</Label>
                                        <Input
                                            id="brand"
                                            value={newProduct.brand}
                                            onChange={(e) => setNewProduct({...newProduct, brand: e.target.value})}
                                            placeholder="Enter brand name"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="category">Category</Label>
                                        <Select
                                            value={newProduct.category}
                                            onValueChange={(value) => setNewProduct({...newProduct, category: value})}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select category"/>
                                            </SelectTrigger>
                                            <SelectContent>
                                                {categories.map((category) => (
                                                    <SelectItem key={category.id} value={category.name}>
                                                        {category.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="stock">Stock Quantity</Label>
                                        <Input
                                            id="stock"
                                            type="number"
                                            value={newProduct.stockCount}
                                            onChange={(e) => setNewProduct({...newProduct, stockCount: e.target.value})}
                                            placeholder="Enter stock quantity"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="price">Price ($)</Label>
                                        <Input
                                            id="price"
                                            type="number"
                                            step="0.01"
                                            value={newProduct.price}
                                            onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                                            placeholder="Enter price"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="originalPrice">Original Price ($)</Label>
                                        <Input
                                            id="originalPrice"
                                            type="number"
                                            step="0.01"
                                            value={newProduct.originalPrice}
                                            onChange={(e) => setNewProduct({
                                                ...newProduct,
                                                originalPrice: e.target.value
                                            })}
                                            placeholder="Enter original price"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="badge">Badge</Label>
                                        <Select
                                            value={newProduct.badge}
                                            onValueChange={(value) => setNewProduct({...newProduct, badge: value})}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select badge"/>
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="none">None</SelectItem>
                                                <SelectItem value="Best Seller">Best Seller</SelectItem>
                                                <SelectItem value="New Arrival">New Arrival</SelectItem>
                                                <SelectItem value="Limited">Limited</SelectItem>
                                                <SelectItem value="Trending">Trending</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="status">Status</Label>
                                        <Select
                                            value={newProduct.status}
                                            onValueChange={(value) => setNewProduct({...newProduct, status: value})}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select status"/>
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="active">Active</SelectItem>
                                                <SelectItem value="inactive">Inactive</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="col-span-2 space-y-2">
                                        <Label htmlFor="description">Description</Label>
                                        <Textarea
                                            id="description"
                                            value={newProduct.description}
                                            onChange={(e) => setNewProduct({
                                                ...newProduct,
                                                description: e.target.value
                                            })}
                                            placeholder="Enter product description"
                                            rows={3}
                                        />
                                    </div>
                                    <div className="col-span-2 space-y-2">
                                        <Label htmlFor="features">Features (comma-separated)</Label>
                                        <Textarea
                                            id="features"
                                            value={newProduct.features}
                                            onChange={(e) => setNewProduct({...newProduct, features: e.target.value})}
                                            placeholder="e.g., Waterproof, Lightweight, Durable"
                                            rows={3}
                                        />
                                    </div>
                                    <div className="col-span-2 space-y-2">
                                        <Label htmlFor="specifications">Specifications (JSON format)</Label>
                                        <Textarea
                                            id="specifications"
                                            value={newProduct.specifications}
                                            onChange={(e) => setNewProduct({
                                                ...newProduct,
                                                specifications: e.target.value
                                            })}
                                            placeholder='e.g., {"Material": "Leather", "Weight": "1.2kg"}'
                                            rows={3}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="colors">Colors (comma-separated)</Label>
                                        <Input
                                            id="colors"
                                            value={newProduct.colors}
                                            onChange={(e) => setNewProduct({...newProduct, colors: e.target.value})}
                                            placeholder="e.g., Black, Blue, Red"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="sizes">Sizes (comma-separated)</Label>
                                        <Input
                                            id="sizes"
                                            value={newProduct.sizes}
                                            onChange={(e) => setNewProduct({...newProduct, sizes: e.target.value})}
                                            placeholder="e.g., S, M, L"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="images">Images (comma-separated URLs)</Label>
                                        <Input
                                            id="images"
                                            value={newProduct.images}
                                            onChange={(e) => setNewProduct({...newProduct, images: e.target.value})}
                                            placeholder="e.g., /image1.jpg, /image2.jpg"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="shippingDays">Shipping Days</Label>
                                        <Input
                                            id="shippingDays"
                                            value={newProduct.shippingDays}
                                            onChange={(e) => setNewProduct({
                                                ...newProduct,
                                                shippingDays: e.target.value
                                            })}
                                            placeholder="e.g., 3-5 business days"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="shippingFree">Free Shipping</Label>
                                        <Switch
                                            id="shippingFree"
                                            checked={newProduct.shippingFree}
                                            onCheckedChange={(checked) => setNewProduct({
                                                ...newProduct,
                                                shippingFree: checked
                                            })}
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-end gap-2 mt-4">
                                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                                        Cancel
                                    </Button>
                                    <Button onClick={handleAddProduct}>Add Product</Button>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                </CardHeader>
                <CardContent>
                    {/* Filters */}
                    <div className="flex flex-col sm:flex-row gap-4 mb-6">
                        <div className="relative flex-1">
                            <Search
                                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"/>
                            <Input
                                placeholder="Search products..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                            <SelectTrigger className="w-48">
                                <SelectValue placeholder="Filter by category"/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Categories</SelectItem>
                                {categories.map((category) => (
                                    <SelectItem key={category.id} value={category.name.toLowerCase()}>
                                        {category.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Products Table */}
                    <div className="border rounded-lg">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Product</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead>Price</TableHead>
                                    <TableHead>Stock</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Sales</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredProducts.map((product) => (
                                    <TableRow key={product.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Image
                                                    src={product.image || "/placeholder.svg"}
                                                    alt={product.name}
                                                    width={50}
                                                    height={50}
                                                    className="rounded-lg object-cover"
                                                />
                                                <div>
                                                    <p className="font-medium">{product.name}</p>
                                                    <p className="text-sm text-gray-500">{product.brand}</p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>{product.category}</TableCell>
                                        <TableCell>
                                            <div>
                                                <p className="font-medium">${product.price}</p>
                                                {product.originalPrice > product.price && (
                                                    <p className="text-sm text-gray-500 line-through">${product.originalPrice}</p>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={product.stockCount <= 5 ? "destructive" : "secondary"}>
                                                {product.stockCount}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Switch
                                                    checked={product.status === "active"}
                                                    onCheckedChange={() => handleToggleStatus(product.id)}
                                                />
                                                <Badge variant={product.status === "active" ? "default" : "secondary"}>
                                                    {product.status}
                                                </Badge>
                                            </div>
                                        </TableCell>
                                        <TableCell>{product.sales}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Button variant="ghost" size="icon"
                                                        onClick={() => handleEditProduct(product)}>
                                                    <Edit className="w-4 h-4"/>
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleDeleteProduct(product.id)}
                                                    className="text-red-600 hover:text-red-700"
                                                >
                                                    <Trash2 className="w-4 h-4"/>
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            {/* Edit Product Dialog */}
            <Dialog open={!!editingProduct} onOpenChange={() => setEditingProduct(null)}>
                <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto p-6">
                    <DialogHeader>
                        <DialogTitle>Edit Product</DialogTitle>
                        <DialogDescription>Update the product details.</DialogDescription>
                    </DialogHeader>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-name">Product Name</Label>
                            <Input
                                id="edit-name"
                                value={newProduct.name}
                                onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                                placeholder="Enter product name"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-brand">Brand</Label>
                            <Input
                                id="edit-brand"
                                value={newProduct.brand}
                                onChange={(e) => setNewProduct({...newProduct, brand: e.target.value})}
                                placeholder="Enter brand name"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-category">Category</Label>
                            <Select
                                value={newProduct.category}
                                onValueChange={(value) => setNewProduct({...newProduct, category: value})}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select category"/>
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map((category) => (
                                        <SelectItem key={category.id} value={category.name}>
                                            {category.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-stock">Stock Quantity</Label>
                            <Input
                                id="edit-stock"
                                type="number"
                                value={newProduct.stockCount}
                                onChange={(e) => setNewProduct({...newProduct, stockCount: e.target.value})}
                                placeholder="Enter stock quantity"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-price">Price ($)</Label>
                            <Input
                                id="edit-price"
                                type="number"
                                step="0.01"
                                value={newProduct.price}
                                onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                                placeholder="Enter price"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-originalPrice">Original Price ($)</Label>
                            <Input
                                id="edit-originalPrice"
                                type="number"
                                step="0.01"
                                value={newProduct.originalPrice}
                                onChange={(e) => setNewProduct({...newProduct, originalPrice: e.target.value})}
                                placeholder="Enter original price"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-badge">Badge</Label>
                            <Select
                                value={newProduct.badge}
                                onValueChange={(value) => setNewProduct({...newProduct, badge: value})}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select badge"/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">None</SelectItem>
                                    <SelectItem value="Best Seller">Best Seller</SelectItem>
                                    <SelectItem value="New Arrival">New Arrival</SelectItem>
                                    <SelectItem value="Limited">Limited</SelectItem>
                                    <SelectItem value="Trending">Trending</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-status">Status</Label>
                            <Select
                                value={newProduct.status}
                                onValueChange={(value) => setNewProduct({...newProduct, status: value})}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select status"/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="inactive">Inactive</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="col-span-2 space-y-2">
                            <Label htmlFor="edit-description">Description</Label>
                            <Textarea
                                id="edit-description"
                                value={newProduct.description}
                                onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                                placeholder="Enter product description"
                                rows={3}
                            />
                        </div>
                        <div className="col-span-2 space-y-2">
                            <Label htmlFor="edit-features">Features (comma-separated)</Label>
                            <Textarea
                                id="edit-features"
                                value={newProduct.features}
                                onChange={(e) => setNewProduct({...newProduct, features: e.target.value})}
                                placeholder="e.g., Waterproof, Lightweight, Durable"
                                rows={3}
                            />
                        </div>
                        <div className="col-span-2 space-y-2">
                            <Label htmlFor="edit-specifications">Specifications (JSON format)</Label>
                            <Textarea
                                id="edit-specifications"
                                value={newProduct.specifications}
                                onChange={(e) => setNewProduct({...newProduct, specifications: e.target.value})}
                                placeholder='e.g., {"Material": "Leather", "Weight": "1.2kg"}'
                                rows={3}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-colors">Colors (comma-separated)</Label>
                            <Input
                                id="edit-colors"
                                value={newProduct.colors}
                                onChange={(e) => setNewProduct({...newProduct, colors: e.target.value})}
                                placeholder="e.g., Black, Blue, Red"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-sizes">Sizes (comma-separated)</Label>
                            <Input
                                id="edit-sizes"
                                value={newProduct.sizes}
                                onChange={(e) => setNewProduct({...newProduct, sizes: e.target.value})}
                                placeholder="e.g., S, M, L"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-images">Images (comma-separated URLs)</Label>
                            <Input
                                id="edit-images"
                                value={newProduct.images}
                                onChange={(e) => setNewProduct({...newProduct, images: e.target.value})}
                                placeholder="e.g., /image1.jpg, /image2.jpg"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-shippingDays">Shipping Days</Label>
                            <Input
                                id="edit-shippingDays"
                                value={newProduct.shippingDays}
                                onChange={(e) => setNewProduct({...newProduct, shippingDays: e.target.value})}
                                placeholder="e.g., 3-5 business days"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-shippingFree">Free Shipping</Label>
                            <Switch
                                id="edit-shippingFree"
                                checked={newProduct.shippingFree}
                                onCheckedChange={(checked) => setNewProduct({...newProduct, shippingFree: checked})}
                            />
                        </div>
                    </div>
                    <div className="flex justify-end gap-2 mt-4">
                        <Button variant="outline" onClick={() => setEditingProduct(null)}>
                            Cancel
                        </Button>
                        <Button onClick={handleUpdateProduct}>Update Product</Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>)
}