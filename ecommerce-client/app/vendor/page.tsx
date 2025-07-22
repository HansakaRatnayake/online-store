import { Suspense } from "react"
import VendorLayout from "@/components/vendor/vendor-layout"
import DashboardStats from "@/components/admin/dashboard-stats"
import RecentOrders from "@/components/admin/recent-orders"
import SalesChart from "@/components/admin/sales-chart"
import LoadingSpinner from "@/components/ui/loading-spinner"

export default function AdminDashboard() {
  return (
    <VendorLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back! Here's what's happening with your store.</p>
        </div>

        <Suspense fallback={<LoadingSpinner />}>
          <DashboardStats />
        </Suspense>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Suspense fallback={<LoadingSpinner />}>
            <SalesChart />
          </Suspense>
          <Suspense fallback={<LoadingSpinner />}>
            <RecentOrders />
          </Suspense>
        </div>
      </div>
    </VendorLayout>
  )
}
