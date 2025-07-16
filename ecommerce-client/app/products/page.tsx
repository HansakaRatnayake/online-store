import { Suspense } from "react"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import ProductFilters from "@/components/products/product-filters"
import ProductGrid from "@/components/products/product-grid"
import LoadingSpinner from "@/components/ui/loading-spinner"


async function fetchProducts() {
  const res = await fetch(`http://localhost:5000/api/products`, {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }
  return res.json();
}

export default async function ProductsPage() {
  const products = await fetchProducts();
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">All Products</h1>
          <p className="text-gray-600">Discover our complete collection of premium products</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <aside className="lg:col-span-1">
            <ProductFilters />
          </aside>
          <div className="lg:col-span-3">
            <Suspense fallback={<LoadingSpinner />}>
              <ProductGrid products={products} />
            </Suspense>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
