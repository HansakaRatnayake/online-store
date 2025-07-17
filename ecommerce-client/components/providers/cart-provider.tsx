"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "@/components/providers/auth-provider";
import { useToast } from "@/hooks/use-toast";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  category: string;
  brand: string;
  shipping: { free: boolean; estimatedDays: string };
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, "quantity">, quantity: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
  clearCart: () => void;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user, token } = useAuth();
  const { toast } = useToast();
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    if (user && token) {
      // Fetch cart from backend for authenticated users
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      })
          .then((res) => res.json())
          .then((data) => {
            const normalizedItems = (data.items || []).map((item: any) => ({
              ...item,
              id: item.id.toString(),
              shipping: item.shipping || { free: false, estimatedDays: "5-7" }, // Default shipping
            }));
            setItems(normalizedItems);
          })
          .catch((error) => {
            console.error("Error fetching cart:", error);
            toast({
              title: "Error",
              description: "Failed to load cart.",
              variant: "destructive",
            });
          });
    } else {
      // Load cart from localStorage for unauthenticated users
      const storedCart = localStorage.getItem("cart");
      if (storedCart) {
        const parsedItems = JSON.parse(storedCart);
        const normalizedItems = parsedItems.map((item: any) => ({
          ...item,
          id: item.id.toString(),
          shipping: item.shipping || { free: false, estimatedDays: "5-7" }, // Default shipping
        }));
        setItems(normalizedItems);
      }
    }
  }, [user, token, toast]);

  const saveToBackend = async (updatedItems: CartItem[]) => {
    if (!user || !token) return;
    try {
      setItems(updatedItems);
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedItems[updatedItems.length - 1]), // Send last added item
      });
    } catch (error) {
      console.error("Error saving cart:", error);
      toast({
        title: "Error",
        description: "Failed to save cart.",
        variant: "destructive",
      });
    }
  };

  const addToCart = async (item: Omit<CartItem, "quantity">, quantity: number) => {
    const existingItem = items.find((i) => i.id === item.id);
    let updatedItems: CartItem[];
    if (existingItem) {
      updatedItems = items.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + quantity } : i
      );
    } else {
      updatedItems = [...items, { ...item, quantity }];
    }
    setItems(updatedItems);
    if (user && token) {
      await saveToBackend(updatedItems);
    } else {
      localStorage.setItem("cart", JSON.stringify(updatedItems));
    }
  };

  const removeItem = async (id: string) => {
    const updatedItems = items.filter((item) => item.id !== id);
    setItems(updatedItems);
    if (user && token) {
      try {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cart/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch (error) {
        console.error("Error removing item:", error);
        toast({
          title: "Error",
          description: "Failed to remove item from cart.",
          variant: "destructive",
        });
      }
    } else {
      localStorage.setItem("cart", JSON.stringify(updatedItems));
    }
  };

  const updateQuantity = async (id: string, quantity: number) => {
    if (quantity < 1) return;
    const updatedItems = items.map((item) =>
        item.id === id ? { ...item, quantity } : item
    );
    setItems(updatedItems);
    if (user && token) {
      try {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cart/${id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ quantity }),
        });
      } catch (error) {
        console.error("Error updating quantity:", error);
        toast({
          title: "Error",
          description: "Failed to update cart quantity.",
          variant: "destructive",
        });
      }
    } else {
      localStorage.setItem("cart", JSON.stringify(updatedItems));
    }
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const clearCart = async () => {
    setItems([]);
    if (user && token) {
      try {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cart`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch (error) {
        console.error("Error clearing cart:", error);
        toast({
          title: "Error",
          description: "Failed to clear cart.",
          variant: "destructive",
        });
      }
    } else {
      localStorage.removeItem("cart");
    }
  };

  return (
      <CartContext.Provider
          value={{
            items,
            addToCart,
            removeItem,
            updateQuantity,
            getTotalPrice,
            getTotalItems,
            clearCart,
          }}
      >
        {children}
      </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}