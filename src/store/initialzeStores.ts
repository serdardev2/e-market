import { useProductStore } from './useProductStore';

export const initializeStores = async (): Promise<void> => {
  try {
    await useProductStore.getState().fetchProducts();
    return Promise.resolve();
  } catch (error) {
    return Promise.reject(error);
  }
};
