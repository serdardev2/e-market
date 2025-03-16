// store/useCartStore.ts
import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Product } from '../types/product';

interface CartState {
  cartItems: Product[];
  isLoading: boolean;
  error: string | null;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  loadCartFromStorage: () => Promise<void>;
}

export const useCartStore = create<CartState>((set, get) => ({
  cartItems: [],
  isLoading: false,
  error: null,

  addToCart: async (product: Product) => {
    try {
      const currentCart = [...get().cartItems];

      const isProductInCart = currentCart.some(
        (item) => item.id === product.id,
      );

      if (isProductInCart) {
        return { success: false, message: 'Bu ürün zaten sepetinizde' };
      }

      const updatedCart = [...currentCart, product];

      set({ cartItems: updatedCart });

      await AsyncStorage.setItem('cart', JSON.stringify(updatedCart));
      return { success: true, message: 'Ürün sepete eklendi' };
    } catch (error) {
      set({ error: 'Sepete eklenirken bir hata oluştu' });
      return { success: false, message: 'Sepete eklenirken bir hata oluştu' };
    }
  },

  removeFromCart: async (productId: string) => {
    try {
      const currentCart = [...get().cartItems];
      const updatedCart = currentCart.filter((item) => item.id !== productId);

      set({ cartItems: updatedCart });

      await AsyncStorage.setItem('cart', JSON.stringify(updatedCart));
    } catch (error) {
      set({ error: 'Ürün sepetten çıkarılırken bir hata oluştu' });
    }
  },

  clearCart: async () => {
    try {
      set({ cartItems: [] });

      await AsyncStorage.removeItem('cart');
    } catch (error) {
      set({ error: 'Sepet temizlenirken bir hata oluştu' });
    }
  },

  loadCartFromStorage: async () => {
    try {
      set({ isLoading: true });

      const storedCart = await AsyncStorage.getItem('cart');

      if (storedCart) {
        set({ cartItems: JSON.parse(storedCart), isLoading: false });
      } else {
        set({ cartItems: [], isLoading: false });
      }
    } catch (error) {
      set({ error: 'Sepet yüklenirken bir hata oluştu', isLoading: false });
    }
  },
}));
