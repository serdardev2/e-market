import React, { useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Product } from '../../../types/product';
import { useCartStore } from '@/src/store/useCardStore';
import { useTranslation } from 'react-i18next';
import { Colors } from '@/src/constants/Colors';

export default function Basket() {
  const { cartItems, isLoading, error, loadCartFromStorage, removeFromCart } =
    useCartStore();
  const { t } = useTranslation();

  useEffect(() => {
    loadCartFromStorage();
  }, []);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Sepet yükleniyor...</Text>
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

  const renderItem = ({ item }: { item: Product }) => (
    <View style={styles.cartItem}>
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
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => removeFromCart(item.id)}
      >
        <Text style={styles.removeButtonText}>{t('basket.remove')}</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>
        {t('basket.title')}{' '}
        <Text style={styles.titleLength}>({cartItems.length})</Text>
      </Text>

      {cartItems.length === 0 ? (
        <View style={styles.emptyCart}>
          <Text style={styles.emptyCartText}>
            {t('basket.emptyCartMessage')}
          </Text>
        </View>
      ) : (
        <FlatList
          data={cartItems}
          renderItem={renderItem}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          contentContainerStyle={styles.list}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 32,
  },
  titleLength: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.common.priamry,
  },
  cartItem: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  productImage: {
    width: 60,
    height: 60,
    marginRight: 12,
  },
  productDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
  },
  productBrand: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 4,
  },
  removeButton: {
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  removeButtonText: {
    color: 'red',
    fontWeight: '600',
  },
  list: {
    paddingBottom: 16,
  },
  emptyCart: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyCartText: {
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 16,
  },
});
