import type React from "react"
import type {Metadata} from "next"
import {Inter} from "next/font/google"
import "./globals.css"
import {AuthProvider} from "@/components/providers/auth-provider"
import {CartProvider} from "@/components/providers/cart-provider"
import {Toaster} from "@/components/ui/toaster"
import {WishlistProvider} from "@/components/providers/wishlist-provider";

const inter = Inter({subsets: ["latin"]})

export const metadata: Metadata = {
    title: "EliteStore - Premium E-Commerce Platform",
    description: "Discover premium products with secure shopping experience",
    keywords: "ecommerce, shopping, premium products, online store",
    generator: 'v0.dev'
}

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
        <body className={inter.className}>
        <AuthProvider>
            <CartProvider>
                <WishlistProvider>
                    {children}
                </WishlistProvider>
                <Toaster/>
            </CartProvider>
        </AuthProvider>
        </body>
        </html>
    )
}
