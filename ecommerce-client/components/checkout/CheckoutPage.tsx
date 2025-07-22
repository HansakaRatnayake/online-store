"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "@/components/providers/cart-provider";
import { useAuth } from "@/components/providers/auth-provider";
import { useToast } from "@/hooks/use-toast";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import Link from "next/link";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface CheckoutFormProps {
    items: any[];
    getTotalPrice: () => number;
    getTotalItems: () => number;
    clearCart: () => void;
    user: any;
    token: string | null;
}

function CheckoutForm({ items, getTotalPrice, getTotalItems, clearCart, user, token }: CheckoutFormProps) {
    const stripe = useStripe();
    const elements = useElements();
    const { toast } = useToast();
    const router = useRouter();
    const [promoCode, setPromoCode] = useState("");
    const [discount, setDiscount] = useState(0);
    const [shippingAddress, setShippingAddress] = useState({
        name: "",
        street: "",
        city: "",
        state: "",
        zipCode: "",
        country: "",
    });
    const [clientSecret, setClientSecret] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);

    const subtotal = getTotalPrice();
    const shipping = subtotal > 100 || items.some((item) => item.shipping?.free) ? 0 : 9.99;
    const discountAmount = subtotal * discount;
    const tax = (subtotal - discountAmount) * 0.08;
    const total = subtotal - discountAmount + shipping + tax;

    const handleApplyPromo = () => {
        if (promoCode.toLowerCase() === "save10") {
            setDiscount(0.1);
            toast({
                title: "Promo code applied!",
                description: "You saved 10% on your order.",
            });
        } else if (promoCode.toLowerCase() === "welcome20") {
            setDiscount(0.2);
            toast({
                title: "Promo code applied!",
                description: "You saved 20% on your order.",
            });
        } else {
            setDiscount(0);
            toast({
                title: "Invalid promo code",
                description: "Please check your promo code and try again.",
                variant: "destructive",
            });
        }
    };

    useEffect(() => {
        if (!user || !token) return;
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/payments/create-payment-intent`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ amount: Math.round(total * 100) }),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.clientSecret) {
                    setClientSecret(data.clientSecret);
                } else {
                    toast({
                        title: "Payment error",
                        description: "Unable to initialize payment. Please try again.",
                        variant: "destructive",
                    });
                }
            })
            .catch((error) => {
                console.error("Error fetching client secret:", error);
                toast({
                    title: "Payment error",
                    description: "Unable to initialize payment. Please try again.",
                    variant: "destructive",
                });
            });
    }, [user, token, total, toast]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!stripe || !elements || !clientSecret) return;
        setIsProcessing(true);

        const cardElement = elements.getElement(CardElement);
        if (!cardElement) return;

        try {
        //     const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
        //         payment_method: {
        //             card: cardElement,
        //             billing_details: {
        //                 name: shippingAddress.name,
        //                 address: {
        //                     line1: shippingAddress.street,
        //                     city: shippingAddress.city,
        //                     state: shippingAddress.state,
        //                     postal_code: shippingAddress.zipCode,
        //                     country: shippingAddress.country,
        //                 },
        //             },
        //         },
        //     });
        //
        //     if (error) {
        //         toast({
        //             title: "Payment failed",
        //             description: error.message,
        //             variant: "destructive",
        //         });
        //         setIsProcessing(false);
        //         return;
        //     }

                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        items: items.map((item) => ({
                            id: item.id,
                            quantity: item.quantity,
                        })),
                        shippingAddress,
                        // paymentIntentId: paymentIntent.id,
                        discount: discountAmount,
                    }),
                });

                if (response.ok) {
                    clearCart();
                    toast({
                        title: "Order placed successfully!",
                        description: "Your order has been confirmed.",
                    });
                    router.push("/orders");
                } else {
                    const errorData = await response.json();
                    toast({
                        title: "Order failed",
                        description: errorData.error || "Unable to place order. Please try again.",
                        variant: "destructive",
                    });
                }
        } catch (error) {
            console.error("Checkout error:", error);
            toast({
                title: "Checkout error",
                description: "An error occurred during checkout. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Order Summary ({getTotalItems()} items)</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {items.map((item, index) => (
                                        <div key={item.id}>
                                            <div className="flex items-center space-x-4">
                                                <div className="relative w-16 h-16 flex-shrink-0">
                                                    <Image
                                                        src={item.image || "/placeholder.svg"}
                                                        alt={item.name}
                                                        width={64}
                                                        height={64}
                                                        className="w-full h-full object-cover rounded-lg"
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-medium text-gray-900 truncate">{item.name}</h3>
                                                    <p className="text-sm text-gray-500">
                                                        {item.category} | {item.brand} |{" "}
                                                        {item.shipping
                                                            ? item.shipping.free
                                                                ? "Free Shipping"
                                                                : `Est. ${item.shipping.estimatedDays} days`
                                                            : "Standard Shipping"}
                                                    </p>
                                                    <p className="text-lg font-semibold text-gray-900">${item.price.toFixed(2)}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-semibold text-gray-900">Quantity: {item.quantity}</p>
                                                    <p className="font-semibold text-gray-900">
                                                        ${(item.price * item.quantity).toFixed(2)}
                                                    </p>
                                                </div>
                                            </div>
                                            {index < items.length - 1 && <Separator className="mt-4" />}
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="mt-6">
                            <CardHeader>
                                <CardTitle>Shipping Address</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form className="space-y-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Full Name</label>
                                            <Input
                                                value={shippingAddress.name}
                                                onChange={(e) => setShippingAddress({ ...shippingAddress, name: e.target.value })}
                                                placeholder="John Doe"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Street Address</label>
                                            <Input
                                                value={shippingAddress.street}
                                                onChange={(e) => setShippingAddress({ ...shippingAddress, street: e.target.value })}
                                                placeholder="123 Main St"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">City</label>
                                            <Input
                                                value={shippingAddress.city}
                                                onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                                                placeholder="New York"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">State</label>
                                            <Input
                                                value={shippingAddress.state}
                                                onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                                                placeholder="NY"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Zip Code</label>
                                            <Input
                                                value={shippingAddress.zipCode}
                                                onChange={(e) => setShippingAddress({ ...shippingAddress, zipCode: e.target.value })}
                                                placeholder="10001"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Country</label>
                                            <Input
                                                value={shippingAddress.country}
                                                onChange={(e) => setShippingAddress({ ...shippingAddress, country: e.target.value })}
                                                placeholder="USA"
                                                required
                                            />
                                        </div>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>

                        <Card className="mt-6">
                            <CardHeader>
                                <CardTitle>Promo Code</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex space-x-2">
                                    <Input
                                        placeholder="Enter code"
                                        value={promoCode}
                                        onChange={(e) => setPromoCode(e.target.value)}
                                    />
                                    <Button variant="outline" onClick={handleApplyPromo}>
                                        Apply
                                    </Button>
                                </div>
                                {discount > 0 && (
                                    <p className="mt-2 text-green-600">{discount * 100}% discount applied!</p>
                                )}
                            </CardContent>
                        </Card>

                        <Card className="mt-6">
                            <CardHeader>
                                <CardTitle>Payment Details</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardElement
                                    options={{
                                        style: {
                                            base: {
                                                fontSize: "16px",
                                                color: "#1f2937",
                                                "::placeholder": { color: "#6b7280" },
                                            },
                                        },
                                    }}
                                />
                            </CardContent>
                        </Card>
                    </div>

                    <div className="lg:col-span-1">
                        <Card className="sticky top-4">
                            <CardHeader>
                                <CardTitle>Order Total</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span>Subtotal</span>
                                        <span>${subtotal.toFixed(2)}</span>
                                    </div>
                                    {discount > 0 && (
                                        <div className="flex justify-between text-green-600">
                                            <span>Discount ({discount * 100}%)</span>
                                            <span>-${discountAmount.toFixed(2)}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between">
                                        <span>Shipping</span>
                                        <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Tax</span>
                                        <span>${tax.toFixed(2)}</span>
                                    </div>
                                    <Separator />
                                    <div className="flex justify-between text-lg font-semibold">
                                        <span>Total</span>
                                        <span>${total.toFixed(2)}</span>
                                    </div>
                                </div>
                                {shipping > 0 && (
                                    <div className="bg-blue-50 p-3 rounded-lg">
                                        <p className="text-sm text-blue-800">
                                            Add ${(100 - subtotal).toFixed(2)} more for free shipping!
                                        </p>
                                    </div>
                                )}
                                <Button
                                    className="w-full"
                                    size="lg"
                                    onClick={handleSubmit}
                                    // disabled={isProcessing || !stripe || !clientSecret}
                                >
                                    {isProcessing ? "Processing..." : "Place Order"}
                                    <ArrowRight className="ml-2 w-4 h-4" />
                                </Button>
                                <Button variant="outline" className="w-full bg-transparent" asChild>
                                    <Link href="/cart">Back to Cart</Link>
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}

export default function CheckoutPage() {
    const { user, token } = useAuth();
    const { items, getTotalPrice, getTotalItems, clearCart } = useCart();
    const { toast } = useToast();
    const router = useRouter();

    if (!user || items.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header />
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
                    <ShoppingBag className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                    <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                        {items.length === 0 ? "Your cart is empty" : "Please log in"}
                    </h2>
                    <p className="text-gray-600 mb-6">
                        {items.length === 0
                            ? "Add items to your cart to proceed to checkout."
                            : "Log in as a customer to complete your purchase."}
                    </p>
                    <Button asChild>
                        <Link href={items.length === 0 ? "/products" : "/login"}>
                            {items.length === 0 ? "Continue Shopping" : "Log In"}
                            <ArrowRight className="ml-2 w-4 h-4" />
                        </Link>
                    </Button>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <Elements stripe={stripePromise}>
            <CheckoutForm
                items={items}
                getTotalPrice={getTotalPrice}
                getTotalItems={getTotalItems}
                clearCart={clearCart}
                user={user}
                token={token}
            />
        </Elements>
    );
}