"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "@/components/providers/auth-provider";
import { useToast } from "@/hooks/use-toast";

interface WishlistItem {
    id: string;
    name: string;
    price: number;
    rating: number;
    image: string;
    category: string;
    brand: string;
    inStock: boolean;
}

interface WishlistContextType {
    items: WishlistItem[];
    addToWishlist: (item: WishlistItem) => void;
    removeItem: (id: string) => void;
    getTotalItems: () => number;
    clearWishlist: () => void;
    isInWishlist: (id: string) => boolean;
}

export const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
    const { user, token } = useAuth();
    const { toast } = useToast();
    const [items, setItems] = useState<WishlistItem[]>([]);

    useEffect(() => {

        if (user && token) {
            // Fetch wishlist from backend for authenticated users
            fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/wishlist`, {
                headers: { Authorization: `Bearer ${token}` },
            })
                .then((res) => res.json())
                .then((data) => {
                    const normalizedItems = (data.items || []).map((item: any) => ({
                        ...item,
                        id: item.id.toString(),
                    }));
                    setItems(normalizedItems);
                })
                .catch((error) => {
                    console.error("Error fetching wishlist:", error);
                    toast({
                        title: "Error",
                        description: "Failed to load wishlist.",
                        variant: "destructive",
                    });
                });
        } else {
            // Load wishlist from localStorage for unauthenticated users
            const storedWishlist = localStorage.getItem("wishlist");
            if (storedWishlist) {
                const parsedItems = JSON.parse(storedWishlist);
                const normalizedItems = parsedItems.map((item: any) => ({
                    ...item,
                    id: item.id.toString(),
                }));
                setItems(normalizedItems);
            }
        }
    }, [user, token, toast]);

    const saveToBackend = async (updatedItems: WishlistItem[]) => {
        if (!user || !token) return;
        try {
            setItems(updatedItems);
            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/wishlist`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(updatedItems[updatedItems.length - 1]), // Send last added item
            });
        } catch (error) {
            console.error("Error saving wishlist:", error);
            toast({
                title: "Error",
                description: "Failed to save wishlist.",
                variant: "destructive",
            });
        }
    };

    const addToWishlist = async (item: WishlistItem) => {
        const existingItem = items.find((i) => i.id === item.id);
        let updatedItems: WishlistItem[];
        if (existingItem) {
            return;
        } else {
            updatedItems = [...items, item];
        }
        setItems(updatedItems);
        if (user && token) {
            await saveToBackend(updatedItems);
        } else {
            localStorage.setItem("wishlist", JSON.stringify(updatedItems));
        }
    };

    const removeItem = async (id: string) => {
        const updatedItems = items.filter((item) => item.id !== id);
        setItems(updatedItems);
        if (user && token) {
            try {
                await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/wishlist/${id}`, {
                    method: "DELETE",
                    headers: { Authorization: `Bearer ${token}` },
                });
            } catch (error) {
                console.error("Error removing item:", error);
                toast({
                    title: "Error",
                    description: "Failed to remove item from wishlist.",
                    variant: "destructive",
                });
            }
        } else {
            localStorage.setItem("wishlist", JSON.stringify(updatedItems));
        }
    };

    const getTotalItems = () => {
        return items.length;
    };

    const isInWishlist = (id: string) => items.some((item) => item.id === id);

    const clearWishlist = async () => {
        setItems([]);
        if (user && token) {
            try {
                await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/wishlist`, {
                    method: "DELETE",
                    headers: { Authorization: `Bearer ${token}` },
                });
            } catch (error) {
                console.error("Error clearing cart:", error);
                toast({
                    title: "Error",
                    description: "Failed to clear wishlist.",
                    variant: "destructive",
                });
            }
        } else {
            localStorage.removeItem("wishlist");
        }
    };

    return (
        <WishlistContext.Provider
            value={{
                items,
                addToWishlist,
                removeItem,
                getTotalItems,
                clearWishlist,
                isInWishlist,
            }}
        >
            {children}
        </WishlistContext.Provider>
    );
}

export function useWishlist() {
    const context = useContext(WishlistContext);
    if (context === undefined) {
        throw new Error("useWishlist must be used within a WishlistProvider");
    }
    return context;
}