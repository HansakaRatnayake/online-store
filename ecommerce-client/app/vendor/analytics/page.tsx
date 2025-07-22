import AdminLayout from "@/components/admin/admin-layout"
import AnalyticsDashboard from "@/components/admin/analytics-dashboard"

export default function AdminAnalyticsPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics & Reports</h1>
          <p className="text-gray-600 mt-2">Track performance, analyze trends, and make data-driven decisions</p>
        </div>
        <AnalyticsDashboard />
      </div>
    </AdminLayout>
  )
}
