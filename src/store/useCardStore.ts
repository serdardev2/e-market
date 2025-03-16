import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Product } from '../types/product';
import i18next from 'i18next';

interface CartItem {
  id: string;
  product: Product;
  quantity: number;
}

interface CartState {
  cartItems: CartItem[];
  isLoading: boolean;
  error: string | null;
  addToCart: (
    product: Product,
  ) => Promise<{ success: boolean; message: string }>;
  removeFromCart: (productId: string) => void;
  increaseQuantity: (productId: string) => void;
  decreaseQuantity: (productId: string) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cartItems: [],
      isLoading: false,
      error: null,

      addToCart: async (product: Product) => {
        try {
          const currentCart = [...get().cartItems];
          const existingItemIndex = currentCart.findIndex(
            (item) => item.product.id === product.id,
          );

          let updatedCart;
          if (existingItemIndex !== -1) {
            updatedCart = [
              ...currentCart.slice(0, existingItemIndex),
              {
                ...currentCart[existingItemIndex],
                quantity: currentCart[existingItemIndex].quantity + 1,
              },
              ...currentCart.slice(existingItemIndex + 1),
            ];
          } else {
            updatedCart = [
              ...currentCart,
              { id: product.id, product, quantity: 1 },
            ];
          }

          set({ cartItems: updatedCart });

          return { success: true, message: i18next.t('cart.addedToCart') };
        } catch (error) {
          set({ error: i18next.t('cart.errorAddingToCart') });
          return {
            success: false,
            message: i18next.t('cart.errorAddingToCart'),
          };
        }
      },

      removeFromCart: (productId: string) => {
        const currentCart = [...get().cartItems];
        const updatedCart = currentCart.filter(
          (item) => item.product.id !== productId,
        );

        set({ cartItems: updatedCart });
      },

      increaseQuantity: (productId: string) => {
        const currentCart = [...get().cartItems];
        const itemIndex = currentCart.findIndex(
          (item) => item.product.id === productId,
        );

        if (itemIndex !== -1) {
          const updatedCart = [
            ...currentCart.slice(0, itemIndex),
            {
              ...currentCart[itemIndex],
              quantity: currentCart[itemIndex].quantity + 1,
            },
            ...currentCart.slice(itemIndex + 1),
          ];

          set({ cartItems: updatedCart });
        }
      },

      decreaseQuantity: (productId: string) => {
        const currentCart = [...get().cartItems];
        const itemIndex = currentCart.findIndex(
          (item) => item.product.id === productId,
        );

        if (itemIndex !== -1) {
          if (currentCart[itemIndex].quantity > 1) {
            const updatedCart = [
              ...currentCart.slice(0, itemIndex),
              {
                ...currentCart[itemIndex],
                quantity: currentCart[itemIndex].quantity - 1,
              },
              ...currentCart.slice(itemIndex + 1),
            ];
            set({ cartItems: updatedCart });
          } else {
            const filteredCart = currentCart.filter(
              (item) => item.product.id !== productId,
            );
            set({ cartItems: filteredCart });
          }
        }
      },

      clearCart: () => {
        set({ cartItems: [] });
      },

      getTotalPrice: () => {
        return get().cartItems.reduce((total, item) => {
          return total + Number(item.product.price) * item.quantity;
        }, 0);
      },
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ cartItems: state.cartItems }),
    },
  ),
);
