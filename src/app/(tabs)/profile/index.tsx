import { Text, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../../hooks/useLanguage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from './styles';

export default function Profile() {
  const { t } = useTranslation();
  const { changeLanguage, isEnglish } = useLanguage();

  const toggleLanguage = () => {
    changeLanguage(isEnglish ? 'tr' : 'en');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>{t('profile.settings')}</Text>

      <TouchableOpacity style={styles.button} onPress={toggleLanguage}>
        <Text style={styles.buttonText}>
          {isEnglish ? "🇹🇷 Türkçe'ye Geç" : '🇬🇧 Switch to English'}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
