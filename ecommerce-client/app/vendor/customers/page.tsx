import AdminLayout from "@/components/admin/admin-layout"
import CustomersManagement from "@/components/admin/customers-management"

export default function AdminCustomersPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Customers Management</h1>
          <p className="text-gray-600 mt-2">Manage customer accounts, view purchase history, and handle support</p>
        </div>
        <CustomersManagement />
      </div>
    </AdminLayout>
  )
}
