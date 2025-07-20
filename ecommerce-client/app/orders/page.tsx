import { Suspense } from "react";
import MyOrders from "@/components/orders/my-orders";
import LoadingSpinner from "@/components/ui/loading-spinner";
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer";

export default function OrdersPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">My Orders</h1>
                    <p className="text-gray-600">Track and manage your order history</p>
                </div>
                <Suspense fallback={<LoadingSpinner />}>
                    <MyOrders />
                </Suspense>
            </main>
            <Footer />
        </div>
    );
}