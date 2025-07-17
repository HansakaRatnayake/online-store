"use client";

import type React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { X, MapPin, Package, Truck, CheckCircle, Clock } from "lucide-react";

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

interface OrderDetailsProps {
    order: Order;
    onClose: () => void;
    getStatusIcon: (status: string) => React.ReactNode;
    getStatusColor: (status: string) => string;
}

export default function OrderDetails({ order, onClose, getStatusIcon, getStatusColor }: OrderDetailsProps) {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        }).format(price);
    };

    const getStatusSteps = () => {
        const steps = [
            { key: "pending", label: "Order Placed", icon: Clock },
            { key: "processing", label: "Processing", icon: Package },
            { key: "shipped", label: "Shipped", icon: Truck },
            { key: "delivered", label: "Delivered", icon: CheckCircle },
        ];

        if (order.status === "cancelled") {
            return [
                { key: "pending", label: "Order Placed", icon: Clock },
                { key: "cancelled", label: "Cancelled", icon: X },
            ];
        }

        return steps;
    };

    const getCurrentStepIndex = () => {
        const statusOrder = ["pending", "processing", "shipped", "delivered"];
        return statusOrder.indexOf(order.status);
    };

    const subtotal = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = 10.0;
    const tax = subtotal * 0.08;

    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center justify-between">
                        <span>Order Details - #{order.orderNumber}</span>
                        <Badge className={`${getStatusColor(order.status)} border`}>
                            {getStatusIcon(order.status)}
                            <span className="ml-1 capitalize">{order.status}</span>
                        </Badge>
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="font-semibold mb-4">Order Status</h3>
                        <div className="flex items-center justify-between">
                            {getStatusSteps().map((step, index) => {
                                const StepIcon = step.icon;
                                const isActive = getCurrentStepIndex() >= index || order.status === step.key;
                                const isCompleted = getCurrentStepIndex() > index;
                                const isCancelled = order.status === "cancelled" && step.key === "cancelled";

                                return (
                                    <div key={step.key} className="flex flex-col items-center flex-1">
                                        <div
                                            className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                                                isActive || isCancelled
                                                    ? isCancelled
                                                        ? "bg-red-500 text-white"
                                                        : isCompleted
                                                            ? "bg-green-500 text-white"
                                                            : "bg-blue-500 text-white"
                                                    : "bg-gray-200 text-gray-400"
                                            }`}
                                        >
                                            <StepIcon className="h-5 w-5" />
                                        </div>
                                        <span
                                            className={`text-sm text-center ${
                                                isActive || isCancelled ? "text-gray-900 font-medium" : "text-gray-400"
                                            }`}
                                        >
                      {step.label}
                    </span>
                                        {index < getStatusSteps().length - 1 && (
                                            <div className={`h-1 w-full mt-2 ${isCompleted ? "bg-green-500" : "bg-gray-200"}`} />
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {order.trackingUpdates && order.trackingUpdates.length > 0 && (
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="font-semibold mb-4">Tracking Updates</h3>
                            <div className="space-y-4">
                                {order.trackingUpdates.map((update, index) => (
                                    <div key={index} className="flex items-start gap-4">
                                        <div className="flex-shrink-0">
                                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                                                {getStatusIcon(update.status)}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="font-medium capitalize">{update.status}</div>
                                            <div className="text-sm text-gray-600">{formatDate(update.date)}</div>
                                            {update.location && (
                                                <div className="text-sm text-gray-500">Location: {update.location}</div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {order.trackingNumber && (
                                <Button
                                    variant="outline"
                                    className="mt-4"
                                    onClick={() =>
                                        window.open(`https://example.com/track/${order.trackingNumber}`, "_blank")
                                    }
                                >
                                    Track Package
                                </Button>
                            )}
                        </div>
                    )}

                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="font-semibold mb-3">Order Information</h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Order Number:</span>
                                    <span className="font-medium">#{order.orderNumber}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Order Date:</span>
                                    <span>{formatDate(order.date)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Status:</span>
                                    <span className="capitalize font-medium">{order.status}</span>
                                </div>
                                {order.trackingNumber && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Tracking Number:</span>
                                        <span className="font-mono">{order.trackingNumber}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div>
                            <h3 className="font-semibold mb-3 flex items-center gap-2">
                                <MapPin className="h-4 w-4" />
                                Shipping Address
                            </h3>
                            <div className="text-sm space-y-1">
                                <div className="font-medium">{order.shippingAddress.name}</div>
                                <div>{order.shippingAddress.street}</div>
                                <div>
                                    {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                                </div>
                                <div>{order.shippingAddress.country}</div>
                            </div>
                        </div>
                    </div>

                    <Separator />

                    <div>
                        <h3 className="font-semibold mb-4">Order Items</h3>
                        <div className="space-y-4">
                            {order.items.map((item) => (
                                <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg">
                                    <img
                                        src={item.image || "/placeholder.svg?height=64&width=64"}
                                        alt={item.name}
                                        className="w-16 h-16 object-cover rounded"
                                    />
                                    <div className="flex-1">
                                        <h4 className="font-medium">{item.name}</h4>
                                        <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-medium">{formatPrice(item.price)}</div>
                                        <div className="text-sm text-gray-600">each</div>
                                    </div>
                                    <div className="text-right font-medium">{formatPrice(item.price * item.quantity)}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <Separator />

                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="font-semibold mb-4">Order Summary</h3>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span>Subtotal:</span>
                                <span>{formatPrice(subtotal)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Shipping:</span>
                                <span>{formatPrice(shipping)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Tax:</span>
                                <span>{formatPrice(tax)}</span>
                            </div>
                            <Separator />
                            <div className="flex justify-between font-semibold text-lg">
                                <span>Total:</span>
                                <span>{formatPrice(order.total)}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={onClose}>
                            Close
                        </Button>
                        {order.status === "delivered" && <Button>Leave Review</Button>}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}