import React, { useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useCartStore } from '@/src/store/useCardStore';
import { IconSymbol } from '@/src/components/ui/IconSymbol';
import styles from './styles';

type CartItem = {
  product: {
    id: string;
    name: string;
    brand: string;
    model: string;
    price: string | number;
    image: string;
  };
  quantity: number;
};

export default function Basket() {
  const {
    cartItems,
    error,
    loadCartFromStorage,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    getTotalPrice,
  } = useCartStore();
  const isIos = Platform.OS === 'ios';
  const insets = useSafeAreaInsets();

  const { t } = useTranslation();

  useEffect(() => {
    loadCartFromStorage();
  }, []);

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </SafeAreaView>
    );
  }

  const renderItem = ({ item }: { item: CartItem }) => (
    <View style={styles.cartItem}>
      <Image
        source={{ uri: item.product.image }}
        style={styles.productImage}
        resizeMode="contain"
      />
      <View style={styles.productDetails}>
        <Text style={styles.productName}>{item.product.name}</Text>
        <Text style={styles.productBrand}>
          {item.product.brand} - {item.product.model}
        </Text>
        <Text style={styles.productPrice}>{item.product.price} TL</Text>

        <View style={styles.quantityContainer}>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => decreaseQuantity(item.product.id)}
          >
            <Text style={styles.quantityButtonText}>-</Text>
          </TouchableOpacity>

          <Text style={styles.quantityText}>{item.quantity}</Text>

          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => increaseQuantity(item.product.id)}
          >
            <Text style={styles.quantityButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => removeFromCart(item.product.id)}
      >
        <IconSymbol size={24} name={'trash'} color={'red'} />
      </TouchableOpacity>
    </View>
  );

  const totalPrice = getTotalPrice();
  const totalItems = cartItems.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  return (
    <SafeAreaView style={styles.containerWithFooter}>
      <View style={styles.contentContainer}>
        <Text style={styles.title}>
          {t('basket.title')}{' '}
          <Text style={styles.titleLength}>({totalItems})</Text>
        </Text>

        {cartItems.length === 0 ? (
          <View style={styles.emptyCart}>
            <Text style={styles.emptyCartText}>
              {t('basket.emptyCartMessage')}
            </Text>
          </View>
        ) : (
          <FlatList
            showsVerticalScrollIndicator={false}
            data={cartItems}
            renderItem={renderItem}
            keyExtractor={(item) => item.product.id}
            contentContainerStyle={styles.list}
          />
        )}
      </View>

      {cartItems.length > 0 && (
        <View
          style={[
            styles.footer,
            isIos && { paddingBottom: insets.bottom + 40 },
          ]}
        >
          <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>{t('basket.totalPrice')}</Text>
            <Text style={styles.totalPrice}>{totalPrice.toFixed(2)} TL</Text>
          </View>

          <TouchableOpacity style={styles.checkoutButton}>
            <Text style={styles.checkoutButtonText}>
              {t('basket.checkout')}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}
