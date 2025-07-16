import { Suspense } from "react"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import DealsGrid from "@/components/deals/deals-grid"
import DealsHero from "@/components/deals/deals-hero"
import LoadingSpinner from "@/components/ui/loading-spinner"

export default function DealsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <DealsHero />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Suspense fallback={<LoadingSpinner />}>
          <DealsGrid />
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}
