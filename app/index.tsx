import { Link } from "expo-router";
import { Pressable, Text, View } from "react-native";

export default function Index() {
  return (
    <View className="flex-1 items-center justify-center gap-8 bg-white px-8">
      <Text className="h1 text-center text-text-primary">
        Welcome to lingua
      </Text>
      <Link href="/onboarding" asChild>
        <Pressable className="h-16 w-full max-w-80 items-center justify-center rounded-button bg-lingua-purple">
          <Text className="font-poppins-bold text-lg text-white">
            Open onboarding
          </Text>
        </Pressable>
      </Link>
    </View>
  );
}
