import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

/**
 * Shopping Cart Store
 * Manages event bookings, donations, and other cart items
 * Persisted to localStorage
 */
export const useCartStore = create(
  devtools(
    persist(
      (set, get) => ({
        items: [],

        // Add item to cart
        addItem: (item) =>
          set((state) => {
            const existingItem = state.items.find((i) => i.id === item.id);
            if (existingItem) {
              // Update quantity if item already exists
              return {
                items: state.items.map((i) =>
                  i.id === item.id ? { ...i, quantity: i.quantity + (item.quantity || 1) } : i
                ),
              };
            }
            return { items: [...state.items, { ...item, quantity: item.quantity || 1 }] };
          }),

        // Remove item from cart
        removeItem: (itemId) =>
          set((state) => ({
            items: state.items.filter((item) => item.id !== itemId),
          })),

        // Update item quantity
        updateQuantity: (itemId, quantity) =>
          set((state) => ({
            items: state.items.map((item) =>
              item.id === itemId ? { ...item, quantity: Math.max(0, quantity) } : item
            ).filter((item) => item.quantity > 0),
          })),

        // Clear entire cart
        clearCart: () => set({ items: [] }),

        // Get total items count
        getTotalItems: () => {
          const state = get();
          return state.items.reduce((total, item) => total + item.quantity, 0);
        },

        // Get total price
        getTotalPrice: () => {
          const state = get();
          return state.items.reduce((total, item) => total + item.price * item.quantity, 0);
        },
      }),
      {
        name: 'cart-storage', // localStorage key
      }
    ),
    { name: 'Cart Store' }
  )
);
