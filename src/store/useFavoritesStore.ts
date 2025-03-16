import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Product } from '../types/product';
import i18next from 'i18next';

interface FavoritesState {
  favorites: Product[];
  isLoading: boolean;
  error: string | null;
  addToFavorites: (
    product: Product,
  ) => Promise<{ success: boolean; message: string }>;
  removeFromFavorites: (
    productId: string,
  ) => Promise<{ success: boolean; message: string }>;
  clearFavorites: () => Promise<void>;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
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
            return {
              success: false,
              message: i18next.t('home.alreadyAddedToFavorites'),
            };
          }

          const updatedFavorites = [...currentFavorites, product];

          set({ favorites: updatedFavorites });

          return {
            success: true,
            message: i18next.t('favorites.addedToFavorites'),
          };
        } catch (error) {
          set({ error: i18next.t('favorites.errorAddingToFavorites') });
          return {
            success: false,
            message: i18next.t('favorites.errorAddingToFavorites'),
          };
        }
      },

      removeFromFavorites: async (productId: string) => {
        try {
          const currentFavorites = [...get().favorites];
          const updatedFavorites = currentFavorites.filter(
            (item) => item.id !== productId,
          );

          set({ favorites: updatedFavorites });

          return {
            success: true,
            message: i18next.t('favorites.removedFromFavorites'),
          };
        } catch (error) {
          set({ error: i18next.t('favorites.errorRemovingFromFavorites') });
          return {
            success: false,
            message: i18next.t('favorites.errorRemovingFromFavorites'),
          };
        }
      },

      clearFavorites: async () => {
        try {
          set({ favorites: [] });
        } catch (error) {
          set({ error: i18next.t('favorites.errorClearingFavorites') });
        }
      },
    }),
    {
      name: 'favorites-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ favorites: state.favorites }),
    },
  ),
);
