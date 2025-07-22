"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    BarChart3,
    Package,
    Users,
    ShoppingCart,
    Settings,
    Menu,
    X,
    Bell,
    User,
    LogOut,
    Home,
    Tag,
    TrendingUp,
} from "lucide-react"
import { useAuth } from "@/components/providers/auth-provider"

const navigation = [
    { name: "Dashboard", href: "/admin", icon: BarChart3 },
    { name: "Products", href: "/admin/products", icon: Package },
    { name: "Orders", href: "/admin/orders", icon: ShoppingCart, badge: "12" },
    { name: "Customers", href: "/admin/customers", icon: Users },
    { name: "Analytics", href: "/admin/analytics", icon: TrendingUp },
    { name: "Settings", href: "/admin/settings", icon: Settings },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const pathname = usePathname()
    const { user, logout } = useAuth()

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Mobile sidebar */}
            {sidebarOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
                    <div className="fixed inset-y-0 left-0 flex w-64 flex-col bg-white">
                        <div className="flex h-16 items-center justify-between px-4 border-b">
                            <div className="flex items-center space-x-2">
                                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                                    <span className="text-white font-bold text-sm">SC</span>
                                </div>
                                <span className="text-xl font-bold text-gray-900">Vendor</span>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)}>
                                <X className="w-5 h-5" />
                            </Button>
                        </div>
                        <nav className="flex-1 px-4 py-4 space-y-1">
                            {navigation.map((item) => {
                                const isActive = pathname === item.href
                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                            isActive ? "bg-blue-100 text-blue-700" : "text-gray-700 hover:bg-gray-100"
                                        }`}
                                        onClick={() => setSidebarOpen(false)}
                                    >
                                        <item.icon className="w-5 h-5 mr-3" />
                                        {item.name}
                                        {item.badge && <Badge className="ml-auto bg-red-500 text-white">{item.badge}</Badge>}
                                    </Link>
                                )
                            })}
                        </nav>
                    </div>
                </div>
            )}

            {/* Desktop sidebar */}
            <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
                <div className="flex flex-col flex-grow bg-white border-r">
                    <div className="flex h-16 items-center px-4 border-b">
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-sm">SC</span>
                            </div>
                            <span className="text-xl font-bold text-gray-900">Vendor</span>
                        </div>
                    </div>
                    <nav className="flex-1 px-4 py-4 space-y-1">
                        {navigation.map((item) => {
                            const isActive = pathname === item.href
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                        isActive ? "bg-blue-100 text-blue-700" : "text-gray-700 hover:bg-gray-100"
                                    }`}
                                >
                                    <item.icon className="w-5 h-5 mr-3" />
                                    {item.name}
                                    {item.badge && <Badge className="ml-auto bg-red-500 text-white">{item.badge}</Badge>}
                                </Link>
                            )
                        })}
                    </nav>
                </div>
            </div>

            {/* Main content */}
            <div className="lg:pl-64">
                {/* Top bar */}
                <div className="sticky top-0 z-40 bg-white border-b">
                    <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
                        <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
                            <Menu className="w-5 h-5" />
                        </Button>

                        <div className="flex items-center space-x-4 ml-auto">
                            <Button variant="ghost" size="icon" asChild>
                                <Link href="/">
                                    <Home className="w-5 h-5" />
                                </Link>
                            </Button>

                            <Button variant="ghost" size="icon" className="relative">
                                <Bell className="w-5 h-5" />
                                <Badge className="absolute -top-1 -right-1 w-5 h-5 rounded-full p-0 flex items-center justify-center text-xs">
                                    3
                                </Badge>
                            </Button>

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="flex items-center space-x-2">
                                        <User className="w-5 h-5" />
                                        <span className="hidden sm:block">{user?.name || "Admin"}</span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-48">
                                    <DropdownMenuItem asChild>
                                        <Link href="/admin/profile">Profile Settings</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link href="/admin/settings">Admin Settings</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={logout}>
                                        <LogOut className="w-4 h-4 mr-2" />
                                        Logout
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </div>

                {/* Page content */}
                <main className="p-4 sm:p-6 lg:p-8">{children}</main>
            </div>
        </div>
    )
}
