import AdminLayout from "@/components/admin/admin-layout"
import AdminSettings from "@/components/admin/admin-settings"

export default function AdminSettingsPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-2">Manage your store settings, preferences, and configurations</p>
        </div>
        <AdminSettings />
      </div>
    </AdminLayout>
  )
}
