import api from '../api';
import { Product } from '../../types/product';

export const ProductService = {
  getProducts: async (): Promise<Product[]> => {
    const response = await api.get('/products');
    return response.data;
  },
};
