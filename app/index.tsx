import { useAuth } from "@clerk/expo";
import { Link, Redirect } from "expo-router";
import type { Href } from "expo-router";
import { Pressable, Text, View } from "react-native";

const languageSelectionHref = "/language-selection" as Href;

export default function Index() {
  const { isLoaded, isSignedIn, signOut } = useAuth();

  if (!isLoaded) {
    return null;
  }

  if (!isSignedIn) {
    return <Redirect href="/onboarding" />;
  }

  return (
    <View className="flex-1 items-center justify-center gap-8 bg-white px-8">
      <Text className="h1 text-center text-text-primary">
        Welcome to lingua
      </Text>
      <Link href={languageSelectionHref} asChild>
        <Pressable className="h-16 w-full max-w-80 items-center justify-center rounded-button bg-lingua-purple">
          <Text className="font-poppins-bold text-lg text-white">
            Choose a language
          </Text>
        </Pressable>
      </Link>
      <Pressable
        className="h-16 w-full max-w-80 items-center justify-center rounded-button border border-border bg-white"
        onPress={() => signOut()}
      >
        <Text className="font-poppins-bold text-lg text-text-primary">
          Sign out
        </Text>
      </Pressable>
    </View>
  );
}
