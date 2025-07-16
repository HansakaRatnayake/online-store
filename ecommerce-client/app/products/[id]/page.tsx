import { Suspense } from "react"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import ProductDetails from "@/components/products/product-details"
import RelatedProducts from "@/components/products/related-products"
import ProductReviews from "@/components/products/product-reviews"
import LoadingSpinner from "@/components/ui/loading-spinner"

interface ProductPageProps {
  params: {
    id: string
  }
}

export default function ProductPage({ params }: ProductPageProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Suspense fallback={<LoadingSpinner />}>
          <ProductDetails productId={params.id} />
        </Suspense>

        <div className="mt-16">
          <Suspense fallback={<LoadingSpinner />}>
            <ProductReviews productId={params.id} />
          </Suspense>
        </div>

        <div className="mt-16">
          <Suspense fallback={<LoadingSpinner />}>
            <RelatedProducts productId={params.id} />
          </Suspense>
        </div>
      </main>
      <Footer />
    </div>
  )
}
