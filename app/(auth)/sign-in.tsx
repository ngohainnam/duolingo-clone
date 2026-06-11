import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AuthInput } from "@/components/AuthInput";
import { VerificationModal } from "@/components/VerificationModal";
import { images } from "@/constants/images";

export default function SignInScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [showVerification, setShowVerification] = useState(false);

  return (
    <SafeAreaView style={styles.screen}>
      <View className="flex-1 px-6 pb-8 pt-4">
        {/* Back button */}
        <Pressable onPress={() => router.back()} className="self-start p-1">
          <Ionicons name="chevron-back" size={28} color="#0D132B" />
        </Pressable>

        {/* Title */}
        <View className="mt-6">
          <Text className="font-poppins-bold text-[30px] leading-9.5 text-text-primary">
            Welcome back
          </Text>
          <Text className="mt-1 font-poppins text-[16px] text-text-secondary">
            Sign in to continue your journey ✨
          </Text>
        </View>

        {/* Mascot */}
        <Image
          source={images.mascotAuth}
          contentFit="contain"
          style={styles.mascot}
        />

        {/* Email input only — no password for sign in */}
        <View className="gap-3">
          <AuthInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="e.g. alex@gmail.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        {/* Sign In button */}
        <Pressable
          className="mt-6 h-15 w-full items-center justify-center rounded-button bg-lingua-deep-purple"
          onPress={() => setShowVerification(true)}
        >
          <Text className="font-poppins-bold text-[18px] text-white">
            Sign In
          </Text>
        </Pressable>

        {/* Divider */}
        <View className="my-6 flex-row items-center gap-3">
          <View className="h-px flex-1 bg-border" />
          <Text className="font-poppins text-[14px] text-text-secondary">
            or continue with
          </Text>
          <View className="h-px flex-1 bg-border" />
        </View>

        {/* Social buttons */}
        <View className="gap-3">
          <Pressable className="h-13.5 flex-row items-center justify-center gap-3 rounded-2xl border border-border bg-white">
            <Ionicons name="logo-google" size={22} color="#4285F4" />
            <Text className="font-poppins-medium text-[16px] text-text-primary">
              Continue with Google
            </Text>
          </Pressable>

          <Pressable className="h-13.5 flex-row items-center justify-center gap-3 rounded-2xl border border-border bg-white">
            <Ionicons name="logo-facebook" size={22} color="#1877F2" />
            <Text className="font-poppins-medium text-[16px] text-text-primary">
              Continue with Facebook
            </Text>
          </Pressable>

          <Pressable className="h-13.5 flex-row items-center justify-center gap-3 rounded-2xl border border-border bg-white">
            <Ionicons name="logo-apple" size={22} color="#000000" />
            <Text className="font-poppins-medium text-[16px] text-text-primary">
              Continue with Apple
            </Text>
          </Pressable>
        </View>

        {/* Bottom link */}
        <View className="mt-auto flex-row items-center justify-center gap-1">
          <Text className="font-poppins text-[15px] text-text-secondary">
            Don&apos;t have an account?
          </Text>
          <Pressable onPress={() => router.replace("/sign-up")}>
            <Text className="font-poppins-semibold text-[15px] text-lingua-deep-purple">
              Sign up
            </Text>
          </Pressable>
        </View>
      </View>

      <VerificationModal
        visible={showVerification}
        onClose={() => setShowVerification(false)}
        email={email}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  mascot: {
    width: 180,
    height: 160,
    alignSelf: "center",
    marginTop: 16,
    marginBottom: 0,
  },
});
