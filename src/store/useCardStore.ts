import { create } from 'zustand';
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
  removeFromCart: (productId: string) => Promise<void>;
  increaseQuantity: (productId: string) => Promise<void>;
  decreaseQuantity: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  loadCartFromStorage: () => Promise<void>;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  cartItems: [],
  isLoading: false,
  error: null,

  addToCart: async (product: Product) => {
    try {
      const currentCart = [...get().cartItems];

      const existingItemIndex = currentCart.findIndex(
        (item) => item.product.id === product.id,
      );

      if (existingItemIndex !== -1) {
        currentCart[existingItemIndex].quantity += 1;
        set({ cartItems: currentCart });
        await AsyncStorage.setItem('cart', JSON.stringify(currentCart));
        return { success: true, message: i18next.t('cart.quantityIncreased') };
      }

      const updatedCart = [
        ...currentCart,
        { id: product.id, product, quantity: 1 },
      ];
      set({ cartItems: updatedCart });
      await AsyncStorage.setItem('cart', JSON.stringify(updatedCart));
      return { success: true, message: i18next.t('cart.addedToCart') };
    } catch (error) {
      set({ error: i18next.t('cart.errorAddingToCart') });
      return { success: false, message: i18next.t('cart.errorAddingToCart') };
    }
  },

  removeFromCart: async (productId: string) => {
    try {
      const currentCart = [...get().cartItems];
      const updatedCart = currentCart.filter(
        (item) => item.product.id !== productId,
      );

      set({ cartItems: updatedCart });
      await AsyncStorage.setItem('cart', JSON.stringify(updatedCart));
    } catch (error) {
      set({ error: i18next.t('cart.errorRemovingFromCart') });
    }
  },

  increaseQuantity: async (productId: string) => {
    try {
      const currentCart = [...get().cartItems];
      const itemIndex = currentCart.findIndex(
        (item) => item.product.id === productId,
      );

      if (itemIndex !== -1) {
        currentCart[itemIndex].quantity += 1;
        set({ cartItems: currentCart });
        await AsyncStorage.setItem('cart', JSON.stringify(currentCart));
      }
    } catch (error) {
      set({ error: i18next.t('cart.errorIncreasingQuantity') });
    }
  },

  decreaseQuantity: async (productId: string) => {
    try {
      const currentCart = [...get().cartItems];
      const itemIndex = currentCart.findIndex(
        (item) => item.product.id === productId,
      );

      if (itemIndex !== -1) {
        if (currentCart[itemIndex].quantity > 1) {
          currentCart[itemIndex].quantity -= 1;
          set({ cartItems: currentCart });
        } else {
          const filteredCart = currentCart.filter(
            (item) => item.product.id !== productId,
          );
          set({ cartItems: filteredCart });
        }

        await AsyncStorage.setItem('cart', JSON.stringify(get().cartItems));
      }
    } catch (error) {
      set({ error: i18next.t('cart.errorDecreasingQuantity') });
    }
  },

  clearCart: async () => {
    try {
      set({ cartItems: [] });
      await AsyncStorage.removeItem('cart');
    } catch (error) {
      set({ error: i18next.t('cart.errorClearingCart') });
    }
  },

  loadCartFromStorage: async () => {
    try {
      set({ isLoading: true });

      const storedCart = await AsyncStorage.getItem('cart');

      if (storedCart) {
        try {
          const parsedCart = JSON.parse(storedCart);

          if (parsedCart.length > 0) {
            if (parsedCart[0] && !parsedCart[0].product && parsedCart[0].id) {
              const convertedCart = parsedCart.map((item: CartItem) => ({
                product: item,
                quantity: 1,
              }));
              set({ cartItems: convertedCart, isLoading: false });
              await AsyncStorage.setItem('cart', JSON.stringify(convertedCart));
              return;
            }
          }

          set({ cartItems: parsedCart, isLoading: false });
        } catch (parseError) {
          set({
            cartItems: [],
            isLoading: false,
            error: i18next.t('cart.errorParsingCartData'),
          });
        }
      } else {
        set({ cartItems: [], isLoading: false });
      }
    } catch (error) {
      set({ error: i18next.t('cart.errorLoadingCart'), isLoading: false });
    }
  },

  getTotalPrice: () => {
    return get().cartItems.reduce((total, item) => {
      return total + Number(item.product.price) * item.quantity;
    }, 0);
  },
}));
