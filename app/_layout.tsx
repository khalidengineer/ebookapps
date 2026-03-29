import { Stack, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useURL } from 'expo-linking';
import { usePreventScreenCapture } from 'expo-screen-capture';
import UpdatePopup from '../src/components/UpdatePopup';
import { isOnboardingCompleted } from '../src/services/storage';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  usePreventScreenCapture();
  const [loaded] = [true]; // Set to true since we're using system fonts for now
  const [appIsReady, setAppIsReady] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function prepare() {
      try {
        const completed = await isOnboardingCompleted();
        if (!completed) {
          // Use a small timeout to ensure the router is ready
          setTimeout(() => {
            router.replace('/onboarding');
          }, 100);
        }
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
        SplashScreen.hideAsync();
      }
    }
    prepare();
  }, [loaded]);

  if (!appIsReady) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="product/[id]" options={{ presentation: 'modal' }} />
        <Stack.Screen name="pdf-viewer" options={{ presentation: 'fullScreenModal' }} />
      </Stack>
      <UpdatePopup />
    </GestureHandlerRootView>
  );
}
