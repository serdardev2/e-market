import React, { useState, useEffect } from 'react';
import { TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import { Product } from '../../types/product';
import { useCartStore } from '@/src/store/useCardStore';
import { useTranslation } from 'react-i18next';

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
    const productInCart = cartItems.some((item) => item.id === product.id);
    setIsInCart(productInCart);
  }, [cartItems, product.id]);

  const handleAddToCart = async () => {
    if (isInCart) {
      Alert.alert(t('home.alreadyAddedToCart'));
      return;
    }
    addToCart(product);
    setIsInCart(true);
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
    backgroundColor: '#007bff',
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
