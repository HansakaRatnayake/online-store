import { Suspense } from "react"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import HeroSection from "@/components/home/hero-section"
import FeaturedProducts from "@/components/home/featured-products"
import CategoryGrid from "@/components/home/category-grid"
import NewsletterSection from "@/components/home/newsletter-section"
import LoadingSpinner from "@/components/ui/loading-spinner"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main>
        <HeroSection />
        <Suspense fallback={<LoadingSpinner />}>
          <CategoryGrid />
        </Suspense>
        <Suspense fallback={<LoadingSpinner />}>
          <FeaturedProducts />
        </Suspense>
        <NewsletterSection />
      </main>
      <Footer />
    </div>
  )
}
