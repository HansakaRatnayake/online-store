"use client"

import { useState, useEffect } from "react"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import ProductFilters from "@/components/products/product-filters"
import ProductGrid from "@/components/products/product-grid"
import LoadingSpinner from "@/components/ui/loading-spinner"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filters, setFilters] = useState({
    categories: [] as string[],
    brands: [] as string[],
    colors: [] as string[],
    priceRange: [0, 1000] as [number, number],
    rating: [0] as [number],
  })
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {

    async function fetchProducts() {
      try {
        setIsLoading(true)
        const query = new URLSearchParams({
          search: searchTerm,
          categories: filters.categories.join(","),
          brands: filters.brands.join(","),
          colors: filters.colors.join(","),
          minPrice: filters.priceRange[0].toString(),
          //maxPrice: filters.priceRange[1].toString(),
          minRating: filters.rating[0].toString(),
          page: page.toString(),
          limit: "10",
        }).toString()

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/customer/products?${query}`, {
          cache: "no-store",
        })
        if (!res.ok) {
          throw new Error("Failed to fetch products")
        }
        const data = await res.json()
        console.log(data)
        setProducts(data.products)
        setTotalPages(data.totalPages)
        setIsLoading(false)
      } catch (err) {
        setError("Error fetching products")
        setIsLoading(false)
        console.error(err)
      }
    }

    const debounce = setTimeout(fetchProducts, 500) // Debounce search input
    return () => clearTimeout(debounce)
  }, [searchTerm, filters, page])

  if (isLoading) {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <LoadingSpinner />
        </div>
    )
  }

  if (error) {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <p className="text-red-600">{error}</p>
        </div>
    )
  }

  return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">All Products</h1>
            <p className="text-gray-600">Discover our complete collection of premium products</p>
          </div>

          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full sm:w-1/2"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <aside className="lg:col-span-1">
              <ProductFilters filters={filters} setFilters={setFilters} />
            </aside>
            <div className="lg:col-span-3">
              <ProductGrid products={products} page={page} setPage={setPage} totalPages={totalPages} />
            </div>
          </div>
        </main>
        <Footer />
      </div>
  )
}