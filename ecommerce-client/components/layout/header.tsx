"use client";

import {useState} from "react";
import Link from "next/link";
import {Search, ShoppingCart, User, Menu, X, Heart} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Badge} from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {useAuth} from "@/components/providers/auth-provider";
import {useCart} from "@/components/providers/cart-provider";
import LogoutDialog from "@/components/ui/logout-dialog";

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const {user, logout} = useAuth();
    const {items, getTotalItems} = useCart();
    const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
        }
    };

    return (
        <header className="bg-white shadow-sm border-b sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <Link href="/" className="flex items-center space-x-2">
                        <div
                            className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">SC</span>
                        </div>
                        <span className="text-xl font-bold text-gray-900">SmartCart</span>
                    </Link>

                    <div className="hidden md:flex flex-1 max-w-lg mx-8">
                        <form onSubmit={handleSearch} className="w-full">
                            <div className="relative">
                                <Search
                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"/>
                                <Input
                                    type="text"
                                    placeholder="Search products..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10 pr-4 w-full"
                                />
                            </div>
                        </form>
                    </div>

                    <nav className="hidden md:flex items-center space-x-6">
                        <Link href="/products" className="text-gray-700 hover:text-blue-600 transition-colors">
                            Products
                        </Link>
                        <Link href="/categories" className="text-gray-700 hover:text-blue-600 transition-colors">
                            Categories
                        </Link>
                        {/*<Link href="/deals" className="text-gray-700 hover:text-blue-600 transition-colors">*/}
                        {/*    Deals*/}
                        {/*</Link>*/}
                    </nav>

                    <div className="flex items-center space-x-4">
                        <Button variant="ghost" size="icon" asChild>
                            <Link href="/wishlist">
                                <Heart className="w-5 h-5"/>
                            </Link>
                        </Button>

                        <Button variant="ghost" size="icon" className="relative" asChild>
                            <Link href="/cart">
                                <ShoppingCart className="w-5 h-5"/>
                                {getTotalItems() > 0 && (
                                    <Badge
                                        className="absolute -top-2 -right-2 w-5 h-5 rounded-full p-0 flex items-center justify-center text-xs">
                                        {getTotalItems()}
                                    </Badge>
                                )}
                            </Link>
                        </Button>

                        {user ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="flex items-center space-x-2">
                                        <User className="w-5 h-5"/>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-48">
                                    {(user.role === 'customer') &&
                                        <DropdownMenuItem asChild>
                                            <Link href="/profile">Profile</Link>
                                        </DropdownMenuItem>
                                    }
                                    <DropdownMenuItem asChild>
                                        <Link
                                            href={user.role === "admin" || user.role === "seller" ? "/admin/orders" : "/orders"}>My
                                            Orders</Link>
                                    </DropdownMenuItem>
                                    {(user.role === 'customer') &&
                                        <DropdownMenuItem asChild>
                                            <Link href="/wishlist">Wishlist</Link>
                                        </DropdownMenuItem>
                                    }

                                    {(user.role === "admin" || user.role === "seller") && (
                                        <>
                                            <DropdownMenuSeparator/>
                                            <DropdownMenuItem asChild>
                                                <Link href="/admin">Admin Dashboard</Link>
                                            </DropdownMenuItem>
                                        </>
                                    )}
                                    <DropdownMenuSeparator/>
                                    <DropdownMenuItem
                                        onClick={() => setIsLogoutDialogOpen(true)}>Logout</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <div className="flex items-center space-x-2">
                                <Button variant="ghost" asChild>
                                    <Link href="/login">Login</Link>
                                </Button>
                                <Button asChild>
                                    <Link href="/register">Sign Up</Link>
                                </Button>
                            </div>
                        )}

                        <Button variant="ghost" size="icon" className="md:hidden"
                                onClick={() => setIsMenuOpen(!isMenuOpen)}>
                            {isMenuOpen ? <X className="w-5 h-5"/> : <Menu className="w-5 h-5"/>}
                        </Button>
                    </div>
                </div>

                {isMenuOpen && (
                    <div className="md:hidden border-t bg-white">
                        <div className="px-2 pt-2 pb-3 space-y-1">
                            <form onSubmit={handleSearch} className="mb-4">
                                <div className="relative">
                                    <Search
                                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"/>
                                    <Input
                                        type="text"
                                        placeholder="Search products..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-10 pr-4 w-full"
                                    />
                                </div>
                            </form>
                            <Link
                                href="/products"
                                className="block px-3 py-2 text-gray-700 hover:text-blue-600"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Products
                            </Link>
                            <Link
                                href="/categories"
                                className="block px-3 py-2 text-gray-700 hover:text-blue-600"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Categories
                            </Link>
                            <Link
                                href="/deals"
                                className="block px-3 py-2 text-gray-700 hover:text-blue-600"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Deals
                            </Link>
                            {user && (
                                <>
                                    <Link
                                        href={user.role === "admin" || user.role === "seller" ? "/admin/orders" : "/orders"}
                                        className="block px-3 py-2 text-gray-700 hover:text-blue-600"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        My Orders
                                    </Link>
                                    <Link
                                        href="/wishlist"
                                        className="block px-3 py-2 text-gray-700 hover:text-blue-600"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Wishlist
                                    </Link>
                                    {(user.role === "admin" || user.role === "seller") && (
                                        <Link
                                            href="/admin"
                                            className="block px-3 py-2 text-gray-700 hover:text-blue-600"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            Admin Dashboard
                                        </Link>
                                    )}
                                    <button
                                        className="block px-3 py-2 text-gray-700 hover:text-blue-600 w-full text-left"
                                        onClick={() => {
                                            setIsLogoutDialogOpen(true);
                                            setIsMenuOpen(false);
                                        }}
                                    >
                                        Logout
                                    </button>
                                </>
                            )}
                            {!user && (
                                <>
                                    <Link
                                        href="/login"
                                        className="block px-3 py-2 text-gray-700 hover:text-blue-600"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        href="/register"
                                        className="block px-3 py-2 text-gray-700 hover:text-blue-600"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Sign Up
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
            <LogoutDialog isOpen={isLogoutDialogOpen} onOpenChange={setIsLogoutDialogOpen} onLogout={logout}
                          onClose={() => setIsLogoutDialogOpen(false)}/>
        </header>
    );
}