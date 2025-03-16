import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCartStore } from './useCardStore';
import { useFavoritesStore } from './useFavoritesStore';
import { useProductStore } from './useProductStore';

export const initializeStores = async (): Promise<void> => {
  try {
    await Promise.all([initializeCart(), initializeFavorites()]);

    await useProductStore.getState().fetchProducts();

    return Promise.resolve();
  } catch (error) {
    return Promise.reject(error);
  }
};

const initializeCart = async (): Promise<void> => {
  try {
    const storedCart = await AsyncStorage.getItem('cart');

    if (storedCart) {
      try {
        const parsedCart = JSON.parse(storedCart);

        let normalizedCart = parsedCart;

        if (
          parsedCart.length > 0 &&
          parsedCart[0] &&
          !parsedCart[0].product &&
          parsedCart[0].id
        ) {
          normalizedCart = parsedCart.map((item: any) => ({
            product: item,
            quantity: 1,
            id: item.id,
          }));

          AsyncStorage.setItem('cart', JSON.stringify(normalizedCart)).catch(
            () => {},
          );
        }

        useCartStore.setState({
          cartItems: normalizedCart,
          isLoading: false,
        });
      } catch (error) {
        useCartStore.setState({
          cartItems: [],
          isLoading: false,
        });
      }
    } else {
      useCartStore.setState({
        cartItems: [],
        isLoading: false,
      });
    }
  } catch (error) {
    useCartStore.setState({
      isLoading: false,
    });
  }
};

const initializeFavorites = async (): Promise<void> => {
  try {
    const storedFavorites = await AsyncStorage.getItem('favorites');

    if (storedFavorites) {
      try {
        const parsedFavorites = JSON.parse(storedFavorites);
        useFavoritesStore.setState({
          favorites: parsedFavorites,
          isLoading: false,
        });
      } catch (error) {
        useFavoritesStore.setState({
          favorites: [],
          isLoading: false,
        });
      }
    } else {
      useFavoritesStore.setState({
        favorites: [],
        isLoading: false,
      });
    }
  } catch (error) {
    useFavoritesStore.setState({
      isLoading: false,
    });
  }
};
