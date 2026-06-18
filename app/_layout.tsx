import "@/global.css";
import { LanguageProvider } from "@/lib/LanguageContext";
import { NotificationProvider, useNotification } from "@/lib/NotificationContext";
import { useApi } from "@/lib/api";
import i18n from "@/lib/i18n";
import { ClerkProvider, useAuth } from '@clerk/expo';
import { tokenCache } from '@clerk/expo/token-cache';
import * as Linking from 'expo-linking';
import * as Notifications from "expo-notifications";
import { Slot, router, useSegments } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Modal, Pressable, Text, View } from 'react-native';

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
  const { expoPushToken, permissionDenied } = useNotification()
  const api = useApi()
  const [showNotifModal, setShowNotifModal] = useState(false)

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
    if (!isLoaded || !isSignedIn || !expoPushToken) return
    const timeout = setTimeout(() => {
      api.updateMe({ pushToken: expoPushToken })
        .then(() => console.log("✅ Push token saved"))
        .catch(err => console.log("Push token save skipped:", err.message))
    }, 2000)
    return () => clearTimeout(timeout)
  }, [isLoaded, isSignedIn, expoPushToken])

  // show notification permission modal once if denied
  useEffect(() => {
    if (isSignedIn && permissionDenied) {
      setShowNotifModal(true)
    }
  }, [isSignedIn, permissionDenied])

  if (!isLoaded) {
    return (
      <View className="flex-1 bg-black justify-center items-center">
        <ActivityIndicator size="large" color="#1DB954" />
      </View>
    )
  }

  return (
    <>
      <Slot />

      {/* Notification Permission Modal */}
      <Modal
        visible={showNotifModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowNotifModal(false)}
      >
        <View className="flex-1 bg-black/70 justify-center items-center px-8">
          <View className="bg-[#111] border border-[#282828] rounded-3xl p-6 w-full">
            <Text className="text-4xl text-center mb-4">🔔</Text>
            <Text className="text-white text-xl font-bold text-center mb-2">
              {i18n.t("enableNotifications")}
            </Text>
            <Text className="text-[#888] text-sm text-center mb-6">
              {i18n.t("enableNotificationsDesc")}
            </Text>

            <Pressable
              className="bg-[#1DB954] rounded-full py-4 items-center mb-3"
              onPress={() => {
                setShowNotifModal(false)
                Linking.openSettings()
              }}
            >
              <Text className="text-black font-bold text-base">
                {i18n.t("enableInSettings")}
              </Text>
            </Pressable>

            <Pressable
              className="border border-[#282828] rounded-full py-4 items-center"
              onPress={() => setShowNotifModal(false)}
            >
              <Text className="text-[#888] text-sm">
                {i18n.t("notNow")}
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </>
  )
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