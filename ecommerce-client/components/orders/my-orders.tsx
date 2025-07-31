"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/components/providers/auth-provider";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import LoadingSpinner from "@/components/ui/loading-spinner";
import OrderCard from "./order-card";
import OrderDetails from "./order-details";
import { Search, Filter, Package, Truck, CheckCircle, XCircle, Clock } from "lucide-react";

interface Order {
    id: string;
    orderNumber: string;
    date: string;
    status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
    total: number;
    items: Array<{
        id: string;
        name: string;
        price: number;
        quantity: number;
        image: string;
    }>;
    shippingAddress: {
        name: string;
        street: string;
        city: string;
        state: string;
        zipCode: string;
        country: string;
    };
    trackingNumber?: string;
    trackingUpdates?: Array<{
        status: string;
        date: string;
        location?: string;
    }>;
}

export default function MyOrders() {
    const { user, token } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const limit = 10;

    useEffect(() => {
        if (user && token) {
            fetchOrders();
        } else {
            setLoading(false);
        }
    }, [user, token, page]);

    const fetchOrders = async () => {
        try {
            const query = new URLSearchParams({
                page: page.toString(),
                limit: limit.toString(),
            }).toString();

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders/my-orders?${query}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setOrders(data.orders || []);
                setTotalPages(data.totalPages || 1);
            } else {
                console.error("Failed to fetch orders");
                setOrders([]);
                setTotalPages(1);
            }
        } catch (error) {
            console.error("Error fetching orders:", error);
            setOrders([]);
            setTotalPages(1);
        } finally {
            setLoading(false);
        }
    };

    const filteredOrders = orders.filter((order) => {
        const matchesSearch =
            order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.items.some((item) => item.name.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesStatus = statusFilter === "all" || order.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "pending":
                return <Clock className="h-4 w-4" />;
            case "processing":
                return <Package className="h-4 w-4" />;
            case "shipped":
                return <Truck className="h-4 w-4" />;
            case "delivered":
                return <CheckCircle className="h-4 w-4" />;
            case "cancelled":
                return <XCircle className="h-4 w-4" />;
            default:
                return <Package className="h-4 w-4" />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "pending":
                return "bg-yellow-100 text-yellow-800 border-yellow-200";
            case "processing":
                return "bg-blue-100 text-blue-800 border-blue-200";
            case "shipped":
                return "bg-purple-100 text-purple-800 border-purple-200";
            case "delivered":
                return "bg-green-100 text-green-800 border-green-200";
            case "cancelled":
                return "bg-red-100 text-red-800 border-red-200";
            default:
                return "bg-gray-100 text-gray-800 border-gray-200";
        }
    };

    const ordersByStatus = {
        all: orders.length,
        pending: orders.filter((o) => o.status === "pending").length,
        processing: orders.filter((o) => o.status === "processing").length,
        shipped: orders.filter((o) => o.status === "shipped").length,
        delivered: orders.filter((o) => o.status === "delivered").length,
        cancelled: orders.filter((o) => o.status === "cancelled").length,
    };

    if (!user || user.role !== "customer") {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Card className="w-full max-w-md">
                    <CardContent className="text-center py-8">
                        <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Access restricted</h3>
                        <p className="text-gray-600 mb-4">Only customers can view their orders</p>
                        {user ? (
                            <Button onClick={() => (window.location.href = "/")}>Go to Home</Button>
                        ) : (
                            <Button onClick={() => (window.location.href = "/login")}>Log In</Button>
                        )}
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <LoadingSpinner />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                <Card>
                    <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-gray-900">{ordersByStatus.all}</div>
                        <div className="text-sm text-gray-600">Total Orders</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-yellow-600">{ordersByStatus.pending}</div>
                        <div className="text-sm text-gray-600">Pending</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-blue-600">{ordersByStatus.processing}</div>
                        <div className="text-sm text-gray-600">Processing</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-purple-600">{ordersByStatus.shipped}</div>
                        <div className="text-sm text-gray-600">Shipped</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-green-600">{ordersByStatus.delivered}</div>
                        <div className="text-sm text-gray-600">Delivered</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-red-600">{ordersByStatus.cancelled}</div>
                        <div className="text-sm text-gray-600">Cancelled</div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <Input
                                placeholder="Search orders by number or product name..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-full md:w-48">
                                <Filter className="h-4 w-4 mr-2" />
                                <SelectValue placeholder="Filter by status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Orders</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="processing">Processing</SelectItem>
                                <SelectItem value="shipped">Shipped</SelectItem>
                                <SelectItem value="delivered">Delivered</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {filteredOrders.length === 0 ? (
                <Card>
                    <CardContent className="text-center py-12">
                        <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            {searchTerm || statusFilter !== "all" ? "No orders found" : "No orders yet"}
                        </h3>
                        <p className="text-gray-600 mb-4">
                            {searchTerm || statusFilter !== "all"
                                ? "Try adjusting your search or filter criteria"
                                : "You haven't placed any orders yet. Start shopping to see your orders here."}
                        </p>
                        {!searchTerm && statusFilter === "all" && (
                            <Button onClick={() => (window.location.href = "/products")}>Start Shopping</Button>
                        )}
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-4">
                    {filteredOrders.map((order) => (
                        <OrderCard
                            key={order.id + Math.random()}
                            order={order}
                            onViewDetails={setSelectedOrder}
                            getStatusIcon={getStatusIcon}
                            getStatusColor={getStatusColor}
                            onOrderUpdate={fetchOrders}
                        />
                    ))}
                    <div className="flex justify-center items-center gap-4 mt-6">
                        <Button
                            variant="outline"
                            disabled={page === 1}
                            onClick={() => setPage(page - 1)}
                        >
                            Previous
                        </Button>
                        <span className="text-gray-600">
              Page {page} of {totalPages}
            </span>
                        <Button
                            variant="outline"
                            disabled={page === totalPages}
                            onClick={() => setPage(page + 1)}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            )}

            {selectedOrder && (
                <OrderDetails
                    order={selectedOrder}
                    onClose={() => setSelectedOrder(null)}
                    getStatusIcon={getStatusIcon}
                    getStatusColor={getStatusColor}
                />
            )}
        </div>
    );
}