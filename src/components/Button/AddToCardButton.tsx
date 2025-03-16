import React, { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { Product } from '../../types/product';
import { useTranslation } from 'react-i18next';
import { useCartStore } from '@/src/store/useCardStore';
import { MainButton } from './MainButton';

interface AddToCartButtonProps {
  product: Product;
}

export const AddToCartButton: React.FC<AddToCartButtonProps> = ({
  product,
}) => {
  const { addToCart, removeFromCart, cartItems } = useCartStore();
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
      if (isInCart) {
        await removeFromCart(product.id);
        setIsInCart(false);
      } else {
        await addToCart(product);
        setIsInCart(true);
      }
    } catch (error) {
      Alert.alert(
        t('common.error'),
        isInCart
          ? t('cart.errorRemovingFromCart')
          : t('cart.errorAddingToCart'),
      );
    }
  };

  return (
    <MainButton
      title={isInCart ? t('home.inCart') : t('home.addToCart')}
      onPress={handleAddToCart}
      variant={isInCart ? 'success' : 'primary'}
      name={'cart.fill'}
    />
  );
};
