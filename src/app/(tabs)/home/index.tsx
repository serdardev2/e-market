import { View, Text, FlatList, Image, ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useProductStore } from '../../../store/useProductStore';
import { useEffect } from 'react';
import { Product } from '../../../types/product';
import { styles } from './styles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AddToCartButton } from '@/src/components/Button/AddToCardButton';
import { useFavoritesStore } from '../../../store/useFavoritesStore';
import { FavoriteButton } from '@/src/components/Button/FavoritesButton';

export default function Home() {
  const { t } = useTranslation();
  const { products, isLoading, error, fetchProducts } = useProductStore();
  const { loadFavoritesFromStorage } = useFavoritesStore();

  useEffect(() => {
    fetchProducts();
    loadFavoritesFromStorage();
  }, [fetchProducts, loadFavoritesFromStorage]);

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  const renderItem = ({ item }: { item: Product }) => (
    <View style={styles.productCard}>
      <FavoriteButton product={item} />
      <Image
        resizeMode="contain"
        source={{ uri: item.image }}
        style={styles.productImage}
      />
      <View style={styles.productInfo}>
        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          style={styles.productPrice}
        >
          {item.price} TL
        </Text>
        <Text numberOfLines={1} ellipsizeMode="tail" style={styles.productName}>
          {item.name}
        </Text>
        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          style={styles.productBrand}
        >
          {item.brand} - {item.model}
        </Text>
        <AddToCartButton product={item} />
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerView}>
        <Text style={styles.subtitle}>{t('home.eMarket')}</Text>
      </View>

      <FlatList
        style={styles.list}
        showsVerticalScrollIndicator={false}
        data={products}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        numColumns={2}
        columnWrapperStyle={styles.row}
      />
    </SafeAreaView>
  );
}
