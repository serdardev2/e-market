import React, { useCallback, useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Platform } from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useCartStore } from '@/src/store/useCardStore';
import styles from './styles';
import CartItemComp, { CartItem } from '@/src/components/Card/CardItem';

const ITEM_HEIGHT = 120;

export default function Basket() {
  const [localCartItems, setLocalCartItems] = useState<CartItem[]>([]);
  const [updateTrigger, setUpdateTrigger] = useState(0);

  const cartItems = useCartStore((state) => state.cartItems);
  const error = useCartStore((state) => state.error);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const increaseQuantity = useCartStore((state) => state.increaseQuantity);
  const decreaseQuantity = useCartStore((state) => state.decreaseQuantity);
  const getTotalPrice = useCartStore((state) => state.getTotalPrice);

  useEffect(() => {
    setLocalCartItems([...cartItems]);
  }, [cartItems]);

  const isIos = Platform.OS === 'ios';
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();

  const handleIncrease = useCallback(
    (id: string) => {
      increaseQuantity(id);
      setUpdateTrigger((prev) => prev + 1);
    },
    [increaseQuantity],
  );

  const handleDecrease = useCallback(
    (id: string) => {
      decreaseQuantity(id);
      setUpdateTrigger((prev) => prev + 1);
    },
    [decreaseQuantity],
  );

  const handleRemove = useCallback(
    (id: string) => {
      removeFromCart(id);
    },
    [removeFromCart],
  );

  const renderItem = useCallback(
    ({ item }: { item: CartItem }) => (
      <CartItemComp
        item={item}
        onDecrease={handleDecrease}
        onIncrease={handleIncrease}
        onRemove={handleRemove}
      />
    ),
    [handleDecrease, handleIncrease, handleRemove],
  );

  const keyExtractor = useCallback((item: CartItem) => item.product.id, []);

  const getItemLayout = useCallback(
    (data: ArrayLike<CartItem> | null | undefined, index: number) => ({
      length: ITEM_HEIGHT,
      offset: ITEM_HEIGHT * index,
      index,
    }),
    [],
  );

  const totalPrice = getTotalPrice();
  const totalItems = localCartItems.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.containerWithFooter}>
      <View style={styles.contentContainer}>
        <Text style={styles.title}>
          {t('basket.title')}{' '}
          <Text style={styles.titleLength}>({totalItems})</Text>
        </Text>

        {localCartItems.length === 0 ? (
          <View style={styles.emptyCart}>
            <Text style={styles.emptyCartText}>
              {t('basket.emptyCartMessage')}
            </Text>
          </View>
        ) : (
          <FlatList
            bounces={false}
            showsVerticalScrollIndicator={false}
            data={localCartItems}
            extraData={updateTrigger}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            getItemLayout={getItemLayout}
            removeClippedSubviews={true}
            maxToRenderPerBatch={5}
            windowSize={5}
            initialNumToRender={8}
            contentContainerStyle={styles.list}
          />
        )}
      </View>

      {localCartItems.length > 0 && (
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
