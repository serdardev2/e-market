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
  removeFromCart: (productId: string) => void;
  increaseQuantity: (productId: string) => void;
  decreaseQuantity: (productId: string) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
}

const saveCartToStorage = (cart: CartItem[]) => {
  AsyncStorage.setItem('cart', JSON.stringify(cart)).catch(() => {});
};

const compareAndLog = (a: any, b: any, path = 'root'): boolean => {
  if (a === b) return true;

  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) {
      return false;
    }

    for (let i = 0; i < a.length; i++) {
      if (!compareAndLog(a[i], b[i], `${path}[${i}]`)) {
        return false;
      }
    }
    return true;
  }

  if (
    typeof a === 'object' &&
    a !== null &&
    typeof b === 'object' &&
    b !== null
  ) {
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);

    if (keysA.length !== keysB.length) {
      return false;
    }

    for (const key of keysA) {
      if (!compareAndLog(a[key], b[key], `${path}.${key}`)) {
        return false;
      }
    }
    return true;
  }

  return false;
};

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
      saveCartToStorage(updatedCart);

      return { success: true, message: i18next.t('cart.addedToCart') };
    } catch (error) {
      set({ error: i18next.t('cart.errorAddingToCart') });
      return { success: false, message: i18next.t('cart.errorAddingToCart') };
    }
  },

  removeFromCart: (productId: string) => {
    const currentCart = [...get().cartItems];
    const updatedCart = currentCart.filter(
      (item) => item.product.id !== productId,
    );

    set({ cartItems: updatedCart });
    saveCartToStorage(updatedCart);
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
      saveCartToStorage(updatedCart);
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
        saveCartToStorage(updatedCart);
      } else {
        const filteredCart = currentCart.filter(
          (item) => item.product.id !== productId,
        );
        set({ cartItems: filteredCart });
        saveCartToStorage(filteredCart);
      }
    }
  },

  clearCart: () => {
    set({ cartItems: [] });
    AsyncStorage.removeItem('cart').catch(() => {});
  },

  getTotalPrice: () => {
    return get().cartItems.reduce((total, item) => {
      return total + Number(item.product.price) * item.quantity;
    }, 0);
  },
}));
