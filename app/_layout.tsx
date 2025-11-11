import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { CartProvider } from '@/contexts/CartContext';
import { FilterProvider } from '@/contexts/FilterContext';
import { WishlistProvider } from '@/contexts/WishlistContext';
import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  initialRouteName: '(auth)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <CartProvider>
      <WishlistProvider>
        <FilterProvider>
          <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <Stack>
              <Stack.Screen name="(auth)" options={{ headerShown: false }} />
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="discover" options={{ headerShown: false }} />
              <Stack.Screen name="product" options={{ headerShown: false }} />
              <Stack.Screen name="products" options={{ headerShown: false }} />
              <Stack.Screen name="checkout" options={{ headerShown: false }} />
              <Stack.Screen name="orders" options={{ headerShown: false }} />
              <Stack.Screen name="wishlist" options={{ headerShown: false }} />
              <Stack.Screen name="profile-setting" options={{ headerShown: false }} />
              <Stack.Screen name="setting" options={{ headerShown: false }} />
              <Stack.Screen name="notification-setting" options={{ headerShown: false }} />
              <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
            </Stack>
            <StatusBar style="auto" />
          </ThemeProvider>
        </FilterProvider>
      </WishlistProvider>
    </CartProvider>
  );
}
