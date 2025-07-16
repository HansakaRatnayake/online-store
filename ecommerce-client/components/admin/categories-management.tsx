"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Switch } from "@/components/ui/switch"
import { Plus, Search, Edit, Trash2, Package, TrendingUp } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const mockCategories = [
  {
    id: 1,
    name: "Electronics",
    description: "Latest gadgets, smartphones, laptops & tech accessories",
    image: "/placeholder.svg?height=100&width=100",
    productCount: 1250,
    isActive: true,
    isFeatured: true,
    createdAt: "2024-01-01",
    subcategories: ["Smartphones", "Laptops", "Headphones", "Cameras", "Gaming"],
  },
  {
    id: 2,
    name: "Fashion",
    description: "Trendy clothing, shoes, and accessories for all styles",
    image: "/placeholder.svg?height=100&width=100",
    productCount: 2100,
    isActive: true,
    isFeatured: true,
    createdAt: "2024-01-01",
    subcategories: ["Men's Clothing", "Women's Clothing", "Shoes", "Accessories", "Jewelry"],
  },
  {
    id: 3,
    name: "Home & Garden",
    description: "Everything you need for your home and outdoor spaces",
    image: "/placeholder.svg?height=100&width=100",
    productCount: 890,
    isActive: true,
    isFeatured: false,
    createdAt: "2024-01-01",
    subcategories: ["Furniture", "Decor", "Kitchen", "Garden", "Tools"],
  },
  {
    id: 4,
    name: "Beauty & Personal Care",
    description: "Skincare, cosmetics, and personal care essentials",
    image: "/placeholder.svg?height=100&width=100",
    productCount: 650,
    isActive: true,
    isFeatured: true,
    createdAt: "2024-01-01",
    subcategories: ["Skincare", "Makeup", "Hair Care", "Fragrances", "Personal Care"],
  },
  {
    id: 5,
    name: "Sports & Outdoors",
    description: "Fitness equipment, outdoor gear, and sports accessories",
    image: "/placeholder.svg?height=100&width=100",
    productCount: 780,
    isActive: false,
    isFeatured: false,
    createdAt: "2024-01-01",
    subcategories: ["Fitness", "Outdoor", "Sports Equipment", "Activewear", "Camping"],
  },
]

export default function CategoriesManagement() {
  const [categories, setCategories] = useState(mockCategories)
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<any>(null)
  const { toast } = useToast()

  const [newCategory, setNewCategory] = useState({
    name: "",
    description: "",
    subcategories: "",
    isActive: true,
    isFeatured: false,
  })

  const filteredCategories = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddCategory = () => {
    const category = {
      id: Date.now(),
      ...newCategory,
      subcategories: newCategory.subcategories
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s),
      image: "/placeholder.svg?height=100&width=100",
      productCount: 0,
      createdAt: new Date().toISOString().split("T")[0],
    }

    setCategories([...categories, category])
    setNewCategory({
      name: "",
      description: "",
      subcategories: "",
      isActive: true,
      isFeatured: false,
    })
    setIsAddDialogOpen(false)
    toast({
      title: "Category added",
      description: "New category has been added successfully.",
    })
  }

  const handleEditCategory = (category: any) => {
    setEditingCategory(category)
    setNewCategory({
      name: category.name,
      description: category.description,
      subcategories: category.subcategories.join(", "),
      isActive: category.isActive,
      isFeatured: category.isFeatured,
    })
  }

  const handleUpdateCategory = () => {
    const updatedCategories = categories.map((c) =>
      c.id === editingCategory.id
        ? {
            ...c,
            ...newCategory,
            subcategories: newCategory.subcategories
              .split(",")
              .map((s) => s.trim())
              .filter((s) => s),
          }
        : c,
    )

    setCategories(updatedCategories)
    setEditingCategory(null)
    setNewCategory({
      name: "",
      description: "",
      subcategories: "",
      isActive: true,
      isFeatured: false,
    })
    toast({
      title: "Category updated",
      description: "Category has been updated successfully.",
    })
  }

  const handleDeleteCategory = (id: number) => {
    setCategories(categories.filter((c) => c.id !== id))
    toast({
      title: "Category deleted",
      description: "Category has been deleted successfully.",
    })
  }

  const handleToggleActive = (id: number) => {
    setCategories(categories.map((c) => (c.id === id ? { ...c, isActive: !c.isActive } : c)))
    toast({
      title: "Category status updated",
      description: "Category status has been updated.",
    })
  }

  const handleToggleFeatured = (id: number) => {
    setCategories(categories.map((c) => (c.id === id ? { ...c, isFeatured: !c.isFeatured } : c)))
    toast({
      title: "Featured status updated",
      description: "Category featured status has been updated.",
    })
  }

  const categoryStats = {
    total: categories.length,
    active: categories.filter((c) => c.isActive).length,
    featured: categories.filter((c) => c.isFeatured).length,
    totalProducts: categories.reduce((sum, c) => sum + c.productCount, 0),
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Categories</p>
                <p className="text-2xl font-bold text-gray-900">{categoryStats.total}</p>
              </div>
              <Package className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Categories</p>
                <p className="text-2xl font-bold text-gray-900">{categoryStats.active}</p>
              </div>
              <Package className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Featured Categories</p>
                <p className="text-2xl font-bold text-gray-900">{categoryStats.featured}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Products</p>
                <p className="text-2xl font-bold text-gray-900">{categoryStats.totalProducts}</p>
              </div>
              <Package className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Categories Management */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle>Categories</CardTitle>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Category
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add New Category</DialogTitle>
                  <DialogDescription>Create a new product category for your store.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Category Name</Label>
                    <Input
                      id="name"
                      value={newCategory.name}
                      onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                      placeholder="Enter category name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={newCategory.description}
                      onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                      placeholder="Enter category description"
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subcategories">Subcategories (comma-separated)</Label>
                    <Input
                      id="subcategories"
                      value={newCategory.subcategories}
                      onChange={(e) => setNewCategory({ ...newCategory, subcategories: e.target.value })}
                      placeholder="e.g., Smartphones, Laptops, Tablets"
                    />
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="active"
                        checked={newCategory.isActive}
                        onCheckedChange={(checked) => setNewCategory({ ...newCategory, isActive: checked })}
                      />
                      <Label htmlFor="active">Active</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="featured"
                        checked={newCategory.isFeatured}
                        onCheckedChange={(checked) => setNewCategory({ ...newCategory, isFeatured: checked })}
                      />
                      <Label htmlFor="featured">Featured</Label>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddCategory}>Add Category</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Categories Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category</TableHead>
                  <TableHead>Products</TableHead>
                  <TableHead>Subcategories</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Featured</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCategories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Image
                          src={category.image || "/placeholder.svg"}
                          alt={category.name}
                          width={50}
                          height={50}
                          className="rounded-lg object-cover"
                        />
                        <div>
                          <p className="font-medium">{category.name}</p>
                          <p className="text-sm text-gray-500 line-clamp-1">{category.description}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{category.productCount}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {category.subcategories.slice(0, 2).map((sub) => (
                          <Badge key={sub} variant="outline" className="text-xs">
                            {sub}
                          </Badge>
                        ))}
                        {category.subcategories.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{category.subcategories.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Switch checked={category.isActive} onCheckedChange={() => handleToggleActive(category.id)} />
                        <Badge variant={category.isActive ? "default" : "secondary"}>
                          {category.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Switch checked={category.isFeatured} onCheckedChange={() => handleToggleFeatured(category.id)} />
                    </TableCell>
                    <TableCell>{new Date(category.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEditCategory(category)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteCategory(category.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
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

      {/* Edit Category Dialog */}
      <Dialog open={!!editingCategory} onOpenChange={() => setEditingCategory(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
            <DialogDescription>Update the category details.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Category Name</Label>
              <Input
                id="edit-name"
                value={newCategory.name}
                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                placeholder="Enter category name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={newCategory.description}
                onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                placeholder="Enter category description"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-subcategories">Subcategories (comma-separated)</Label>
              <Input
                id="edit-subcategories"
                value={newCategory.subcategories}
                onChange={(e) => setNewCategory({ ...newCategory, subcategories: e.target.value })}
                placeholder="e.g., Smartphones, Laptops, Tablets"
              />
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="edit-active"
                  checked={newCategory.isActive}
                  onCheckedChange={(checked) => setNewCategory({ ...newCategory, isActive: checked })}
                />
                <Label htmlFor="edit-active">Active</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="edit-featured"
                  checked={newCategory.isFeatured}
                  onCheckedChange={(checked) => setNewCategory({ ...newCategory, isFeatured: checked })}
                />
                <Label htmlFor="edit-featured">Featured</Label>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setEditingCategory(null)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateCategory}>Update Category</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
