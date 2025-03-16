import {
  View,
  Text,
  FlatList,
  Image,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useProductStore } from '../../../store/useProductStore';
import { useEffect, useState } from 'react';
import { Product } from '../../../types/product';
import styles from './styles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AddToCartButton } from '@/src/components/Button/AddToCardButton';
import { useFavoritesStore } from '../../../store/useFavoritesStore';
import { FavoriteButton } from '@/src/components/Button/FavoritesButton';
import { Colors } from '@/src/constants/Colors';
import { router } from 'expo-router';
import { MainInput } from '@/src/components/Input/MainInput';
import { IconSymbol } from '@/src/components/ui/IconSymbol';

export default function Home() {
  const { t } = useTranslation();
  const { products, isLoading, error, fetchProducts } = useProductStore();
  const { loadFavoritesFromStorage } = useFavoritesStore();
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const ITEMS_PER_PAGE = 12;

  useEffect(() => {
    fetchProducts();
    loadFavoritesFromStorage();
  }, [fetchProducts]);

  useEffect(() => {
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const filtered = products.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.brand.toLowerCase().includes(query) ||
          product.model.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query),
      );
      setFilteredProducts(filtered);
      setDisplayedProducts(filtered.slice(0, ITEMS_PER_PAGE));
      setCurrentPage(1);
    } else {
      setFilteredProducts(products);
      setDisplayedProducts(products.slice(0, currentPage * ITEMS_PER_PAGE));
    }
  }, [searchQuery, products]);

  useEffect(() => {
    const productsToDisplay = searchQuery.trim() ? filteredProducts : products;
    setDisplayedProducts(
      productsToDisplay.slice(0, currentPage * ITEMS_PER_PAGE),
    );
  }, [currentPage, filteredProducts, products]);

  const loadMoreProducts = () => {
    const productsToDisplay = searchQuery.trim() ? filteredProducts : products;

    if (displayedProducts.length < productsToDisplay.length && !isLoadingMore) {
      setIsLoadingMore(true);

      setTimeout(() => {
        setCurrentPage(currentPage + 1);
        setIsLoadingMore(false);
      }, 500);
    }
  };

  const handleSearch = (text: string) => {
    setSearchQuery(text);
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  if (isLoading && displayedProducts.length === 0) {
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
    <TouchableOpacity
      onPress={() => navigateProductDetail(item)}
      style={styles.productCard}
    >
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
    </TouchableOpacity>
  );

  const navigateProductDetail = (product: Product) => {
    router.push({
      pathname: '/(tabs)/home/productDetail',
      params: {
        id: product.id,
        name: product.name,
        image: product.image,
        price: product.price,
        description: product.description,
        model: product.model,
        brand: product.brand,
        createdAt: product.createdAt,
      },
    });
  };

  const renderFooter = () => {
    const productsToDisplay = searchQuery.trim() ? filteredProducts : products;

    if (!isLoadingMore && displayedProducts.length >= productsToDisplay.length)
      return null;

    return (
      <View style={styles.footer}>
        <ActivityIndicator size="large" color={Colors.common.primary} />
      </View>
    );
  };

  const renderEmptyResult = () => {
    if (searchQuery.trim() && displayedProducts.length === 0) {
      return (
        <View style={styles.emptySearchContainer}>
          <IconSymbol name="magnifyingglass" size={60} color="#CCCCCC" />
          <Text style={styles.emptySearchText}>
            {t('home.noSearchResults', { query: searchQuery })}
          </Text>
          <TouchableOpacity
            style={styles.clearSearchButton}
            onPress={clearSearch}
          >
            <Text style={styles.clearSearchButtonText}>
              {t('home.clearSearch')}
            </Text>
          </TouchableOpacity>
        </View>
      );
    }
    return null;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerView}>
        <Text style={styles.subtitle}>{t('home.eMarket')}</Text>
        <View style={styles.searchContainer}>
          <MainInput
            value={searchQuery}
            onChangeText={handleSearch}
            placeholder={t('home.searchProducts')}
            onClear={clearSearch}
          />
        </View>
      </View>

      {renderEmptyResult() || (
        <FlatList
          style={styles.list}
          showsVerticalScrollIndicator={false}
          data={displayedProducts}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          numColumns={2}
          columnWrapperStyle={styles.row}
          onEndReached={loadMoreProducts}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
        />
      )}
    </SafeAreaView>
  );
}
