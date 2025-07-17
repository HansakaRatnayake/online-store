import { Suspense } from "react";
import MyOrders from "@/components/orders/my-orders";
import LoadingSpinner from "@/components/ui/loading-spinner";

export default function OrdersPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
                    <p className="text-gray-600 mt-2">Track and manage your order history</p>
                </div>
                <Suspense fallback={<LoadingSpinner />}>
                    <MyOrders />
                </Suspense>
            </div>
        </div>
    );
}