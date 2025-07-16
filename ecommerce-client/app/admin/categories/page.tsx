import AdminLayout from "@/components/admin/admin-layout"
import CategoriesManagement from "@/components/admin/categories-management"

export default function AdminCategoriesPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Categories Management</h1>
          <p className="text-gray-600 mt-2">Organize your product catalog with categories and subcategories</p>
        </div>
        <CategoriesManagement />
      </div>
    </AdminLayout>
  )
}
