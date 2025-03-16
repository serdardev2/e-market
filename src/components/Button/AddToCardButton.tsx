import React, { useState, useEffect } from 'react';
import { TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import { Product } from '../../types/product';
import { useTranslation } from 'react-i18next';
import { useCartStore } from '@/src/store/useCardStore';
import { Colors } from '@/src/constants/Colors';

interface AddToCartButtonProps {
  product: Product;
}

export const AddToCartButton: React.FC<AddToCartButtonProps> = ({
  product,
}) => {
  const { addToCart, cartItems, loadCartFromStorage } = useCartStore();
  const [isInCart, setIsInCart] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    loadCartFromStorage();
  }, []);

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
    <TouchableOpacity
      style={[styles.button, isInCart && styles.inCartButton]}
      onPress={handleAddToCart}
    >
      <Text style={styles.buttonText}>
        {isInCart ? t('home.inCart') : t('home.addToCart')}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.common.primary,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
    alignItems: 'center',
    marginTop: 8,
    width: '100%',
  },
  inCartButton: {
    backgroundColor: '#28a745',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
  },
});
