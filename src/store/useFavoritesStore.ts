import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Product } from '../types/product';

interface FavoritesState {
  favorites: Product[];
  isLoading: boolean;
  error: string | null;
  addToFavorites: (product: Product) => Promise<void>;
  removeFromFavorites: (productId: string) => Promise<void>;
  clearFavorites: () => Promise<void>;
  loadFavoritesFromStorage: () => Promise<void>;
}

export const useFavoritesStore = create<FavoritesState>((set, get) => ({
  favorites: [],
  isLoading: false,
  error: null,

  addToFavorites: async (product: Product) => {
    try {
      const currentFavorites = [...get().favorites];

      const isProductInFavorites = currentFavorites.some(
        (item) => item.id === product.id,
      );

      if (isProductInFavorites) {
        return;
      }

      const updatedFavorites = [...currentFavorites, product];

      set({ favorites: updatedFavorites });

      await AsyncStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    } catch (error) {
      set({ error: 'Favorilere eklenirken bir hata oluştu' });
    }
  },

  removeFromFavorites: async (productId: string) => {
    try {
      const currentFavorites = [...get().favorites];
      const updatedFavorites = currentFavorites.filter(
        (item) => item.id !== productId,
      );

      set({ favorites: updatedFavorites });

      await AsyncStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    } catch (error) {
      set({ error: 'Ürün favorilerden çıkarılırken bir hata oluştu' });
    }
  },

  clearFavorites: async () => {
    try {
      set({ favorites: [] });

      await AsyncStorage.removeItem('favorites');
    } catch (error) {
      set({ error: 'Favoriler temizlenirken bir hata oluştu' });
    }
  },

  loadFavoritesFromStorage: async () => {
    try {
      set({ isLoading: true });

      const storedFavorites = await AsyncStorage.getItem('favorites');

      if (storedFavorites) {
        set({ favorites: JSON.parse(storedFavorites), isLoading: false });
      } else {
        set({ favorites: [], isLoading: false });
      }
    } catch (error) {
      set({ error: 'Favoriler yüklenirken bir hata oluştu', isLoading: false });
    }
  },
}));
