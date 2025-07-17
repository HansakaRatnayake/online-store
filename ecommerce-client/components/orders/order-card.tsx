"use client";

import type React from "react";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/components/providers/auth-provider"; // Import from AuthProvider
import { useCart } from "@/components/providers/cart-provider"; // Import from CartProvider
import { Eye, RotateCcw, X, Download, Calendar, DollarSign } from "lucide-react";

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
}

interface OrderCardProps {
    order: Order;
    onViewDetails: (order: Order) => void;
    getStatusIcon: (status: string) => React.ReactNode;
    getStatusColor: (status: string) => string;
    onOrderUpdate: () => void;
}

export default function OrderCard({
                                      order,
                                      onViewDetails,
                                      getStatusIcon,
                                      getStatusColor,
                                      onOrderUpdate,
                                  }: OrderCardProps) {
    const { token } = useAuth();
    const { addToCart } = useCart();
    const [isLoading, setIsLoading] = useState(false);

    const handleReorder = async () => {
        setIsLoading(true);
        try {
            for (const item of order.items) {
                await addToCart(
                    {
                        id: item.id,
                        name: item.name,
                        price: item.price,
                        image: item.image,
                        category: "General", // Matches updated CartItem interface
                    },
                    item.quantity
                );
            }
            alert("Items added to cart successfully!");
        } catch (error) {
            console.error("Error reordering:", error);
            alert("Failed to add items to cart");
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancelOrder = async () => {
        if (!confirm("Are you sure you want to cancel this order?")) return;

        setIsLoading(true);
        try {
            const response = await fetch(`/api/orders/${order.id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ status: "cancelled" }),
            });

            if (response.ok) {
                alert("Order cancelled successfully");
                onOrderUpdate();
            } else {
                alert("Failed to cancel order");
            }
        } catch (error) {
            console.error("Error cancelling order:", error);
            alert("Failed to cancel order");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDownloadInvoice = () => {
        const invoiceData = {
            orderNumber: order.orderNumber,
            date: order.date,
            status: order.status,
            items: order.items,
            total: order.total,
            shippingAddress: order.shippingAddress,
        };
        const dataStr = JSON.stringify(invoiceData, null, 2);
        const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
        const exportFileDefaultName = `invoice-${order.orderNumber}.json`;
        const linkElement = document.createElement("a");
        linkElement.setAttribute("href", dataUri);
        linkElement.setAttribute("download", exportFileDefaultName);
        linkElement.click();
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        }).format(price);
    };

    return (
        <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                            <h3 className="font-semibold text-lg">Order #{order.orderNumber}</h3>
                            <Badge className={`${getStatusColor(order.status)} border`}>
                                {getStatusIcon(order.status)}
                                <span className="ml-1 capitalize">{order.status}</span>
                            </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                            <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                <span>{formatDate(order.date)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <DollarSign className="h-4 w-4" />
                                <span className="font-medium">{formatPrice(order.total)}</span>
                            </div>
                            <div>
                <span>
                  {order.items.length} item{order.items.length > 1 ? "s" : ""}
                </span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 mb-4">
                            {order.items.slice(0, 3).map((item, index) => (
                                <div key={item.id} className="relative">
                                    <img
                                        src={item.image || "/placeholder.svg?height=48&width=48"}
                                        alt={item.name}
                                        className="w-12 h-12 object-cover rounded border"
                                    />
                                    {item.quantity > 1 && (
                                        <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {item.quantity}
                    </span>
                                    )}
                                </div>
                            ))}
                            {order.items.length > 3 && (
                                <div className="w-12 h-12 bg-gray-100 rounded border flex items-center justify-center text-xs text-gray-600">
                                    +{order.items.length - 3}
                                </div>
                            )}
                        </div>
                        {order.trackingNumber && (
                            <div className="text-sm">
                                <span className="text-gray-600">Tracking: </span>
                                <span className="font-mono font-medium">{order.trackingNumber}</span>
                            </div>
                        )}
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 lg:flex-col">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onViewDetails(order)}
                            className="flex items-center gap-2"
                        >
                            <Eye className="h-4 w-4" />
                            View Details
                        </Button>
                        {order.status === "delivered" && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleReorder}
                                disabled={isLoading}
                                className="flex items-center gap-2 bg-transparent"
                            >
                                <RotateCcw className="h-4 w-4" />
                                Reorder
                            </Button>
                        )}
                        {(order.status === "pending" || order.status === "processing") && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleCancelOrder}
                                disabled={isLoading}
                                className="flex items-center gap-2 text-red-600 hover:text-red-700 bg-transparent"
                            >
                                <X className="h-4 w-4" />
                                Cancel
                            </Button>
                        )}
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleDownloadInvoice}
                            className="flex items-center gap-2 bg-transparent"
                        >
                            <Download className="h-4 w-4" />
                            Invoice
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}