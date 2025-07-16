import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import CartContent from "@/components/cart/cart-content"

export default function CartPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Shopping Cart</h1>
          <p className="text-gray-600">Review your items and proceed to checkout</p>
        </div>
        <CartContent />
      </main>
      <Footer />
    </div>
  )
}
