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
import { FavoriteButton } from '@/src/components/Button/FavoritesButton';
import { Colors } from '@/src/constants/Colors';
import { router } from 'expo-router';
import { MainInput } from '@/src/components/Input/MainInput';
import { IconSymbol } from '@/src/components/ui/IconSymbol';
import { FilterModal, FilterOptions } from '@/src/components/Modal/filterModal';

export default function Home() {
  const { t } = useTranslation();
  const { products, isLoading, error, fetchProducts } = useProductStore();
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [activeFilters, setActiveFilters] = useState<FilterOptions | null>(
    null,
  );
  const ITEMS_PER_PAGE = 12;

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    let filtered = [...products];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.brand.toLowerCase().includes(query) ||
          product.model.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query),
      );
    }

    if (activeFilters) {
      if (activeFilters.brands.length > 0) {
        filtered = filtered.filter((product) =>
          activeFilters.brands.includes(product.brand),
        );
      }

      if (activeFilters.models.length > 0) {
        filtered = filtered.filter((product) =>
          activeFilters.models.includes(product.model),
        );
      }

      if (activeFilters.priceRange.min !== null) {
        filtered = filtered.filter(
          (product) =>
            parseFloat(product.price) >= activeFilters.priceRange.min!,
        );
      }

      if (activeFilters.priceRange.max !== null) {
        filtered = filtered.filter(
          (product) =>
            parseFloat(product.price) <= activeFilters.priceRange.max!,
        );
      }
    }

    setFilteredProducts(filtered);
    setDisplayedProducts(filtered.slice(0, ITEMS_PER_PAGE));
    setCurrentPage(1);
  }, [searchQuery, products, activeFilters]);

  useEffect(() => {
    const productsToDisplay = filteredProducts;
    setDisplayedProducts(
      productsToDisplay.slice(0, currentPage * ITEMS_PER_PAGE),
    );
  }, [currentPage, filteredProducts]);

  const loadMoreProducts = () => {
    if (displayedProducts.length < filteredProducts.length && !isLoadingMore) {
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

  const handleApplyFilters = (filters: FilterOptions) => {
    setActiveFilters(filters);
  };

  const clearFilters = () => {
    setActiveFilters(null);
  };

  const isFiltersActive = () => {
    if (!activeFilters) return false;
    return (
      activeFilters.brands.length > 0 ||
      activeFilters.models.length > 0 ||
      activeFilters.priceRange.min !== null ||
      activeFilters.priceRange.max !== null
    );
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
    if (!isLoadingMore && displayedProducts.length >= filteredProducts.length)
      return null;

    return (
      <View style={styles.footer}>
        <ActivityIndicator size="large" color={Colors.common.primary} />
      </View>
    );
  };

  const renderEmptyResult = () => {
    if (filteredProducts.length === 0) {
      return (
        <View style={styles.emptySearchContainer}>
          <IconSymbol name="magnifyingglass" size={60} color="#CCCCCC" />
          <Text style={styles.emptySearchText}>
            {searchQuery.trim()
              ? t('home.noSearchResults', { query: searchQuery })
              : t('home.noFilterResults')}
          </Text>
          <View style={styles.emptyActionButtons}>
            {searchQuery.trim() && (
              <TouchableOpacity
                style={styles.clearButton}
                onPress={clearSearch}
              >
                <Text style={styles.clearButtonText}>
                  {t('home.clearSearch')}
                </Text>
              </TouchableOpacity>
            )}
            {isFiltersActive() && (
              <TouchableOpacity
                style={styles.clearButton}
                onPress={clearFilters}
              >
                <Text style={styles.clearButtonText}>
                  {t('filter.clearFilters')}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      );
    }
    return null;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerView}>
        <Text style={styles.subtitle}>{t('home.eMarket')}</Text>
      </View>
      <View style={styles.inlineContainer}>
        <View style={styles.searchRow}>
          <View style={styles.searchContainer}>
            <MainInput
              value={searchQuery}
              onChangeText={handleSearch}
              placeholder={t('home.searchProducts')}
              onClear={clearSearch}
            />
          </View>
          <TouchableOpacity
            style={[
              styles.filterButton,
              isFiltersActive() && styles.filterButtonActive,
            ]}
            onPress={() => setFilterModalVisible(true)}
          >
            <IconSymbol
              name="line.3.horizontal.decrease"
              size={20}
              color={isFiltersActive() ? '#fff' : '#000'}
            />
          </TouchableOpacity>
        </View>

        {isFiltersActive() && (
          <View style={styles.activeFiltersBar}>
            <Text style={styles.activeFiltersText}>
              {t('filter.activeFilters')}:
              {activeFilters?.brands.length
                ? ` ${activeFilters.brands.length} ${t('filter.brands')}`
                : ''}
              {activeFilters?.models.length
                ? ` ${activeFilters.models.length} ${t('filter.models')}`
                : ''}
              {activeFilters?.priceRange.min !== null ||
              activeFilters?.priceRange.max !== null
                ? ` ${t('filter.priceRange')}`
                : ''}
            </Text>
            <TouchableOpacity onPress={clearFilters}>
              <Text style={styles.clearFiltersText}>{t('filter.clear')}</Text>
            </TouchableOpacity>
          </View>
        )}

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
          ListEmptyComponent={renderEmptyResult}
        />

        <FilterModal
          visible={filterModalVisible}
          onClose={() => setFilterModalVisible(false)}
          onApplyFilters={handleApplyFilters}
          products={products}
          activeFilters={activeFilters}
        />
      </View>
    </SafeAreaView>
  );
}
