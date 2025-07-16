import AdminLayout from "@/components/admin/admin-layout"
import ProductsManagement from "@/components/admin/products-management"

export default function AdminProductsPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Products Management</h1>
          <p className="text-gray-600 mt-2">Manage your product catalog, inventory, and pricing</p>
        </div>
        <ProductsManagement />
      </div>
    </AdminLayout>
  )
}
