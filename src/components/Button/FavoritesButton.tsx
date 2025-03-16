import React, { useState, useEffect } from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { IconSymbol } from '@/src/components/ui/IconSymbol';
import { useFavoritesStore } from '@/src/store/useFavoritesStore';
import { Product } from '@/src/types/product';
import { Colors } from '@/src/constants/Colors';

interface FavoriteButtonProps {
  product: Product;
}

export const FavoriteButton: React.FC<FavoriteButtonProps> = ({ product }) => {
  const { favorites, addToFavorites, removeFromFavorites } =
    useFavoritesStore();
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const productInFavorites = favorites.some((item) => item.id === product.id);
    setIsFavorite(productInFavorites);
  }, [favorites, product.id]);

  const toggleFavorite = () => {
    if (isFavorite) {
      removeFromFavorites(product.id);
    } else {
      addToFavorites(product);
    }
  };

  return (
    <TouchableOpacity style={styles.favoriteButton} onPress={toggleFavorite}>
      <IconSymbol
        size={24}
        name={isFavorite ? 'star.fill' : 'star'}
        color={isFavorite ? Colors.common.yellow : Colors.common.grey}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  favoriteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
});
