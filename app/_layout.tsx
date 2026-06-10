import "@/global.css";
import { LanguageProvider } from "@/lib/LanguageContext";
import { NotificationProvider, useNotification } from "@/lib/NotificationContext";
import { useApi } from "@/lib/api";
import { ClerkProvider, useAuth } from '@clerk/expo';
import { tokenCache } from '@clerk/expo/token-cache';
import * as Notifications from "expo-notifications";
import { Slot, router, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!

if (!publishableKey) {
  throw new Error('Add your Clerk Publishable Key to the .env file')
}

function InitialLayout() {
  const { isSignedIn, isLoaded } = useAuth()
  const segments = useSegments()
  const { expoPushToken } = useNotification()
  const api = useApi()

  // auth redirect
  useEffect(() => {
    if (!isLoaded) return
    const inAuthGroup = segments[0] === '(auth)'
    if (isSignedIn && inAuthGroup) {
      router.replace('/(tabs)')
    } else if (!isSignedIn && !inAuthGroup) {
      router.replace('/(auth)/sign-in' as any)
    }
  }, [isSignedIn, isLoaded, segments])

  // save push token to backend when signed in
  useEffect(() => {
    if (!isSignedIn || !expoPushToken) return
    api.updateMe({ pushToken: expoPushToken })
      .then(() => console.log("✅ Push token saved"))
      .catch(err => console.error("❌ Failed to save push token:", err))
  }, [isSignedIn, expoPushToken])

  if (!isLoaded) {
    return (
      <View className="flex-1 bg-black justify-center items-center">
        <ActivityIndicator size="large" color="#1DB954" />
      </View>
    )
  }

  return <Slot />
}

export default function RootLayout() {
  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <NotificationProvider>
        <LanguageProvider>
          <InitialLayout />
        </LanguageProvider>
      </NotificationProvider>
    </ClerkProvider>
  )
}