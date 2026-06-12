import { useAuth } from "@clerk/expo";
import { Redirect } from "expo-router";
import { Pressable, Text, View } from "react-native";

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
      <Pressable
        className="h-16 w-full max-w-80 items-center justify-center rounded-button bg-lingua-purple"
        onPress={() => signOut()}
      >
        <Text className="font-poppins-bold text-lg text-white">Sign out</Text>
      </Pressable>
    </View>
  );
}
