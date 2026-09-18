import React, { createContext, useContext, useState } from 'react';
import { ServiceItem, Booking } from '../types';

export interface CartItem {
  service: ServiceItem;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (service: ServiceItem) => void;
  removeFromCart: (serviceId: number) => void;
  updateQuantity: (serviceId: number, delta: number) => void;
  clearCart: () => void;
  totalAmount: number;
  totalItems: number;
  selectedCity: string;
  setSelectedCity: (city: string) => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  activeBooking: Booking | null;
  setActiveBooking: (booking: Booking | null) => void;
  activeView: 'home' | 'raw_material' | 'building_calculator' | 'partner_hub' | 'admin' | 'my_bookings';
  setActiveView: (view: 'home' | 'raw_material' | 'building_calculator' | 'partner_hub' | 'admin' | 'my_bookings') => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCity, setSelectedCity] = useState<string>('Delhi NCR');
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [activeBooking, setActiveBooking] = useState<Booking | null>(null);
  const [activeView, setActiveView] = useState<'home' | 'raw_material' | 'building_calculator' | 'partner_hub' | 'admin' | 'my_bookings'>('home');

  const addToCart = (service: ServiceItem) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.service.id === service.id);
      if (existing) {
        return prev.map((item) =>
          item.service.id === service.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { service, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (serviceId: number) => {
    setCart((prev) => prev.filter((item) => item.service.id !== serviceId));
  };

  const updateQuantity = (serviceId: number, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.service.id === serviceId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const clearCart = () => setCart([]);

  const totalAmount = cart.reduce((sum, item) => sum + item.service.price * item.quantity, 0);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalAmount,
        totalItems,
        selectedCity,
        setSelectedCity,
        isCartOpen,
        setIsCartOpen,
        activeBooking,
        setActiveBooking,
        activeView,
        setActiveView
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};
