import React, { useState, useEffect } from 'react';
import { TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import { Product } from '../../types/product';
import { useTranslation } from 'react-i18next';
import { useCartStore } from '@/src/store/useCardStore';
import { Colors } from '@/src/constants/Colors';
import { MainButton } from './MainButton';

interface AddToCartButtonProps {
  product: Product;
}

export const AddToCartButton: React.FC<AddToCartButtonProps> = ({
  product,
}) => {
  const { addToCart, cartItems } = useCartStore();
  const [isInCart, setIsInCart] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const checkIfInCart = () => {
      if (cartItems && cartItems.length > 0) {
        const firstItem = cartItems[0];

        if (firstItem.product) {
          const productInCart = cartItems.some(
            (item) => item.product.id === product.id,
          );
          setIsInCart(productInCart);
        } else if (firstItem.id) {
          const productInCart = cartItems.some(
            (item) => item.id === product.id,
          );
          setIsInCart(productInCart);
        }
      } else {
        setIsInCart(false);
      }
    };

    checkIfInCart();
  }, [cartItems, product.id]);

  const handleAddToCart = async () => {
    try {
      const result = await addToCart(product);
      if (result && result.success) {
        setIsInCart(true);
      } else if (result && !result.success) {
        Alert.alert(t('common.info'), t(result.message));
      }
    } catch (error) {
      Alert.alert(t('common.error'), t('cart.errorAddingToCart'));
    }
  };

  return (
    <MainButton
      title={isInCart ? t('home.inCart') : t('home.addToCart')}
      onPress={handleAddToCart}
      variant={isInCart ? 'success' : 'primary'}
      disabled={isInCart}
      name="cart.fill"
    />
  );
};
