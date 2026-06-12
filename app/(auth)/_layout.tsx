import { useAuth } from "@clerk/expo";
import { Redirect, Stack } from "expo-router";

import { useLanguageStore } from "@/store/language-store";

export default function AuthLayout() {
  const { isLoaded, isSignedIn } = useAuth();
  const selectedLanguageId = useLanguageStore(
    (state) => state.selectedLanguageId,
  );
  const hasHydrated = useLanguageStore((state) => state.hasHydrated);

  if (!isLoaded || !hasHydrated) {
    return null;
  }

  if (isSignedIn) {
    return (
      <Redirect href={selectedLanguageId ? "/" : "/language-selection"} />
    );
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
