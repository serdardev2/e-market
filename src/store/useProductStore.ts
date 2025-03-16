import { create } from 'zustand';
import { Product } from '../types/product';
import { ProductService } from '../services/product';

interface ProductState {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  fetchProducts: () => Promise<void>;
}

export const useProductStore = create<ProductState>((set) => ({
  products: [],
  isLoading: false,
  error: null,
  fetchProducts: async () => {
    try {
      set({ isLoading: true, error: null });
      const products = await ProductService.getProducts();
      set({ products, isLoading: false });
    } catch (error) {
      set({ error: 'Ürünler yüklenirken bir hata oluştu', isLoading: false });
    }
  },
}));
