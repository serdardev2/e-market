import { StyleSheet, View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { styles } from './styles';

export default function Home() {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('home.welcome')}</Text>
      <Text style={styles.subtitle}>{t('home.featured_products')}</Text>
    </View>
  );
}
