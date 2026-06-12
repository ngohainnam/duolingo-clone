import "../global.css";

import { ClerkProvider } from "@clerk/expo";
import { tokenCache } from "@clerk/expo/token-cache";
import { useEffect } from "react";

import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";

import { colors, fontAssets, fontFamily } from "@/theme";

SplashScreen.preventAutoHideAsync();

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY ?? "";

if (!publishableKey) {
  throw new Error("Add EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY to the .env file.");
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts(fontAssets);

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <Stack
        screenOptions={{
          contentStyle: { backgroundColor: colors.neutral.background },
          headerShadowVisible: false,
          headerTintColor: colors.neutral.textPrimary,
          headerTitleStyle: {
            color: colors.neutral.textPrimary,
            fontFamily: fontFamily.semiBold,
          },
        }}
      >
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="dark" />
    </ClerkProvider>
  );
}
