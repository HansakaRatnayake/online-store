import { Suspense } from "react"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import ProductDetails from "@/components/products/product-details"
import RelatedProducts from "@/components/products/related-products"
import ProductReviews from "@/components/products/product-reviews"
import LoadingSpinner from "@/components/ui/loading-spinner"

interface ProductPageProps {
  params: Promise<{ id: string }>
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params; // Await params to resolve the id

  return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Suspense fallback={<LoadingSpinner />}>
            <ProductDetails productId={id} />
          </Suspense>

          <div className="mt-16">
            <Suspense fallback={<LoadingSpinner />}>
              <ProductReviews productId={id} />
            </Suspense>
          </div>

          <div className="mt-16">
            <Suspense fallback={<LoadingSpinner />}>
              <RelatedProducts productId={id} />
            </Suspense>
          </div>
        </main>
        <Footer />
      </div>
  )
}