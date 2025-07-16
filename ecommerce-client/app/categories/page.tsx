import { Suspense } from "react"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import CategoriesGrid from "@/components/categories/categories-grid"
import LoadingSpinner from "@/components/ui/loading-spinner"

export default function CategoriesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Shop by Category</h1>
          <p className="text-gray-600">Explore our wide range of product categories</p>
        </div>

        <Suspense fallback={<LoadingSpinner />}>
          <CategoriesGrid />
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}
