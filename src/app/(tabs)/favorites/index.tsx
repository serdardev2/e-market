import React, { useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFavoritesStore } from '../../../store/useFavoritesStore';
import { Product } from '../../../types/product';
import { IconSymbol } from '@/src/components/ui/IconSymbol';
import { useTranslation } from 'react-i18next';
import { useCartStore } from '@/src/store/useCardStore';
import styles from './styles';
import { Colors } from '@/src/constants/Colors';

export default function Favorites() {
  const { favorites, error, removeFromFavorites } = useFavoritesStore();
  const { addToCart, removeFromCart, cartItems } = useCartStore();
  const { t } = useTranslation();

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </SafeAreaView>
    );
  }

  const isInCart = (productId: string) => {
    if (!cartItems || cartItems.length === 0) return false;

    const firstItem = cartItems[0];

    if (firstItem.product) {
      return cartItems.some((item) => item.product.id === productId);
    } else if (firstItem.id) {
      return cartItems.some((item) => item.id === productId);
    }

    return false;
  };

  const handleCartAction = async (product: Product) => {
    try {
      if (isInCart(product.id)) {
        await removeFromCart(product.id);
      } else {
        await addToCart(product);
      }
    } catch (error) {
      Alert.alert(
        t('common.error'),
        isInCart(product.id)
          ? t('cart.errorRemovingFromCart')
          : t('cart.errorAddingToCart'),
      );
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
          style={[
            styles.cartButton,
            isInCart(item.id) ? styles.removeCartButton : styles.addCartButton,
          ]}
          onPress={() => handleCartAction(item)}
        >
          <IconSymbol size={20} name={'cart.fill'} color="white" />
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
          <IconSymbol
            size={20}
            name="star.slash.fill"
            color={Colors.common.red}
          />
          <Text style={styles.removeButtonText}>{t('favorites.remove')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {t('favorites.title')}{' '}
          <Text style={styles.titleCount}>({favorites.length})</Text>
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
          bounces={false}
          style={styles.listContainer}
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
