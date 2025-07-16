import AdminLayout from "@/components/admin/admin-layout"
import OrdersManagement from "@/components/admin/orders-management"

export default function AdminOrdersPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Orders Management</h1>
          <p className="text-gray-600 mt-2">Manage customer orders, track shipments, and process refunds</p>
        </div>
        <OrdersManagement />
      </div>
    </AdminLayout>
  )
}
