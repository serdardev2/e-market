import { View, Text, FlatList, Image, ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useProductStore } from '../../../store/useProductStore';
import { useEffect } from 'react';
import { Product } from '../../../types/product';
import { styles } from './styles';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Home() {
  const { t } = useTranslation();
  const { products, isLoading, error, fetchProducts } = useProductStore();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

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
      <Image
        resizeMode="contain"
        source={{ uri: item.image }}
        style={styles.productImage}
      />
      <View style={styles.productInfo}>
        <Text style={styles.productPrice}>{item.price} TL</Text>

        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productBrand}>
          {item.brand} - {item.model}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerView}>
        <Text style={styles.subtitle}>{t('home.e_market')}</Text>
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
