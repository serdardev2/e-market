import { View, Text, Image, ScrollView } from 'react-native';
import styles from './styles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { AddToCartButton } from '@/src/components/Button/AddToCardButton';
import { FavoriteButton } from '@/src/components/Button/FavoritesButton';
import { Product } from '@/src/types/product';
import { useTranslation } from 'react-i18next';
import { MainHeader } from '@/src/components/Header/MainHeader';

export default function ProductDetail() {
  const params = useLocalSearchParams();
  const { t } = useTranslation();

  const product: Product = {
    id: params.id as string,
    name: params.name as string,
    image: params.image as string,
    price: params.price as string,
    description: params.description as string,
    model: params.model as string,
    brand: params.brand as string,
    createdAt: params.createdAt as string,
  };

  const handleGoBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <MainHeader title={t('productDetail.title')} onBack={handleGoBack} />

      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: product.image }}
            style={styles.productImage}
            resizeMode="contain"
          />
          <View style={styles.favoriteButtonContainer}>
            <FavoriteButton product={product} />
          </View>
        </View>

        <View style={styles.detailsContainer}>
          <Text style={styles.productBrand}>
            {product.brand} - {product.model}
          </Text>
          <Text style={styles.productName}>{product.name}</Text>
          <Text style={styles.productPrice}>{product.price} TL</Text>

          <View style={styles.actionContainer}>
            <AddToCartButton product={product} />
          </View>

          <View style={styles.descriptionContainer}>
            <Text style={styles.descriptionTitle}>
              {t('productDetail.description')}
            </Text>
            <Text style={styles.descriptionText}>{product.description}</Text>
          </View>

          <View style={styles.specificationContainer}>
            <Text style={styles.specificationTitle}>
              {t('productDetail.specification')}
            </Text>
            <View style={styles.specificationRow}>
              <Text style={styles.specLabel}>{t('productDetail.brand')}:</Text>
              <Text style={styles.specValue}>{product.brand}</Text>
            </View>
            <View style={styles.specificationRow}>
              <Text style={styles.specLabel}>{t('productDetail.model')}:</Text>
              <Text style={styles.specValue}>{product.model}</Text>
            </View>
            <View style={styles.specificationRow}>
              <Text style={styles.specLabel}>
                {t('productDetail.createdAt')}:
              </Text>
              <Text style={styles.specValue}>
                {new Date(product.createdAt).toLocaleDateString('tr-TR')}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
