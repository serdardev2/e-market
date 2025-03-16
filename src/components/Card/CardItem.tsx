import React, { memo } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { IconSymbol } from '@/src/components/ui/IconSymbol';
import styles from './styles';

export type CartItem = {
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

type CartItemProps = {
  item: CartItem;
  onDecrease: (id: string) => void;
  onIncrease: (id: string) => void;
  onRemove: (id: string) => void;
};

const CartItemComp = memo(
  ({ item, onDecrease, onIncrease, onRemove }: CartItemProps) => {
    return (
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
              onPress={() => onDecrease(item.product.id)}
            >
              <Text style={styles.quantityButtonText}>-</Text>
            </TouchableOpacity>

            <Text style={styles.quantityText}>{item.quantity}</Text>

            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => onIncrease(item.product.id)}
            >
              <Text style={styles.quantityButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => onRemove(item.product.id)}
        >
          <IconSymbol size={24} name={'trash'} color={'red'} />
        </TouchableOpacity>
      </View>
    );
  },
);

export default CartItemComp;
