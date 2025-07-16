import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import UserProfile from "@/components/profile/user-profile"

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
          <p className="text-gray-600">Manage your account settings and preferences</p>
        </div>
        <UserProfile />
      </main>
      <Footer />
    </div>
  )
}
