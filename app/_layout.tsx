import "@/global.css";
import { LanguageProvider } from "@/lib/LanguageContext";
import { ClerkProvider, useAuth } from '@clerk/expo';
import { tokenCache } from '@clerk/expo/token-cache';
import { Slot, router, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!

if (!publishableKey) {
  throw new Error('Add your Clerk Publishable Key to the .env file')
}

function InitialLayout() {
  const { isSignedIn, isLoaded } = useAuth()
  const segments = useSegments()

  useEffect(() => {
    if (!isLoaded) return
    const inAuthGroup = segments[0] === '(auth)'
    if (isSignedIn && inAuthGroup) {
      router.replace('/(tabs)')
    } else if (!isSignedIn && !inAuthGroup) {
      router.replace('/(auth)/sign-in' as any)
    }
  }, [isSignedIn, isLoaded, segments])

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
      <LanguageProvider>
        <InitialLayout />
      </LanguageProvider>
    </ClerkProvider>
  )
}