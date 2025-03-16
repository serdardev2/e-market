import React, { useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFavoritesStore } from '../../../store/useFavoritesStore';
import { Product } from '../../../types/product';
import { IconSymbol } from '@/src/components/ui/IconSymbol';
import { useCartStore } from '@/src/store/useCardStore';
import { styles } from './styles';
import { useTranslation } from 'react-i18next';

export default function Favorites() {
  const {
    favorites,
    isLoading,
    error,
    loadFavoritesFromStorage,
    removeFromFavorites,
  } = useFavoritesStore();
  const { addToCart, cartItems } = useCartStore();
  const { t } = useTranslation();

  useEffect(() => {
    loadFavoritesFromStorage();
  }, []);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.loadingText}>
          {t('favorites.loadingFavorites')}
        </Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </SafeAreaView>
    );
  }

  const isInCart = (productId: string) => {
    return cartItems.some((item) => item.id === productId);
  };

  const handleAddToCart = (product: Product) => {
    if (!isInCart(product.id)) {
      addToCart(product);
    }
  };

  const renderItem = ({ item }: { item: Product }) => (
    <View style={styles.favoriteItem}>
      <View style={styles.favoriteContent}>
        <Image
          source={{ uri: item.image }}
          style={styles.productImage}
          resizeMode="contain"
        />
        <View style={styles.productDetails}>
          <Text style={styles.productName}>{item.name}</Text>
          <Text style={styles.productBrand}>
            {item.brand} - {item.model}
          </Text>
          <Text style={styles.productPrice}>{item.price} TL</Text>
        </View>
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[styles.cartButton, isInCart(item.id) && styles.inCartButton]}
          onPress={() => handleAddToCart(item)}
          disabled={isInCart(item.id)}
        >
          <IconSymbol size={20} name="cart.fill" color="white" />
          <Text style={styles.cartButtonText}>
            {isInCart(item.id)
              ? t('favorites.inCart')
              : t('favorites.addToCart')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => removeFromFavorites(item.id)}
        >
          <IconSymbol size={20} name="star.slash.fill" color="#FF6B6B" />
          <Text style={styles.removeButtonText}>{t('favorites.remove')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {t('favorites.title')} ({favorites.length})
        </Text>
      </View>

      {favorites.length === 0 ? (
        <View style={styles.emptyState}>
          <IconSymbol size={60} name="star" color="#CCCCCC" />
          <Text style={styles.emptyStateText}>
            {t('favorites.emptyFavoritesMessage')}
          </Text>
          <Text style={styles.emptyStateSubText}>
            {t('favorites.emptyFavoritesDescription')}
          </Text>
        </View>
      ) : (
        <FlatList
          data={favorites}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}
