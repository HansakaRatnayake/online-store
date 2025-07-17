"use client";

import type React from "react";
import { createContext, useContext, useState, useEffect } from "react";

interface CartItem {
  id: string; // Changed to string to match OrderCard.tsx
  name: string;
  price: number;
  image: string;
  quantity: number;
  category: string; // Added to match OrderCard.tsx
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, "quantity">, quantity: number) => void; // Updated signature
  removeItem: (id: string) => void; // Updated id type
  updateQuantity: (id: string, quantity: number) => void; // Updated id type
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      setItems(JSON.parse(storedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items));
  }, [items]);

  const addToCart = (newItem: Omit<CartItem, "quantity">, quantity: number) => {
    setItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.id === newItem.id);
      if (existingItem) {
        return currentItems.map((item) =>
            item.id === newItem.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...currentItems, { ...newItem, quantity }];
    });
  };

  const removeItem = (id: string) => {
    setItems((currentItems) => currentItems.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    setItems((currentItems) =>
        currentItems.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  return (
      <CartContext.Provider
          value={{
            items,
            addToCart,
            removeItem,
            updateQuantity,
            clearCart,
            getTotalItems,
            getTotalPrice,
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