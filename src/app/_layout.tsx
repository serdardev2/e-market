import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import 'react-native-reanimated';
import { useColorScheme } from '../hooks/useColorScheme';
import '../i18n';
import { initializeStores } from '../store/initialzeStores';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [storesInitialized, setStoresInitialized] = useState(false);
  const [loaded] = useFonts({
    SpaceMono: require('../../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    async function initialize() {
      try {
        await initializeStores();
        setStoresInitialized(true);
      } catch (error) {
        setStoresInitialized(true);
      }
    }

    initialize();
  }, []);

  useEffect(() => {
    if (loaded && storesInitialized) {
      SplashScreen.hideAsync();
    }
  }, [loaded, storesInitialized]);

  if (!loaded || !storesInitialized) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
