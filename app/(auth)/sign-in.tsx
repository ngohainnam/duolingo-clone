import { Ionicons } from "@expo/vector-icons";
import { useSignIn } from "@clerk/expo";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AuthInput } from "@/components/AuthInput";
import { VerificationModal } from "@/components/VerificationModal";
import { images } from "@/constants/images";
import { useGoogleAuth } from "@/hooks/useGoogleAuth";

export default function SignInScreen() {
  const router = useRouter();
  const { signIn, fetchStatus } = useSignIn();
  const { signInWithGoogle } = useGoogleAuth();
  const [email, setEmail] = useState("");
  const [showVerification, setShowVerification] = useState(false);

  const handleSignIn = async () => {
    const emailAddress = email.trim();

    if (!emailAddress) {
      Alert.alert("Enter your email", "Please enter your email address.");
      return;
    }

    const { error } = await signIn.emailCode.sendCode({ emailAddress });

    if (error) {
      Alert.alert("Could not sign in", error.longMessage ?? error.message);
      return;
    }

    setEmail(emailAddress);
    setShowVerification(true);
  };

  const handleVerify = useCallback(
    async (code: string) => {
      const { error } = await signIn.emailCode.verifyCode({ code });

      if (error) {
        Alert.alert("Invalid code", error.longMessage ?? error.message);
        return false;
      }

      if (signIn.status !== "complete") {
        Alert.alert(
          "Could not sign in",
          "Your sign-in needs an additional verification step.",
        );
        return false;
      }

      await signIn.finalize({
        navigate: () => router.replace("/"),
      });

      return true;
    },
    [router, signIn],
  );

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
          disabled={fetchStatus === "fetching"}
          onPress={handleSignIn}
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

        {/* Google sign in */}
        <View>
          <Pressable
            className="h-13.5 flex-row items-center justify-center gap-3 rounded-2xl border border-border bg-white"
            onPress={signInWithGoogle}
          >
            <Ionicons name="logo-google" size={22} color="#4285F4" />
            <Text className="font-poppins-medium text-[16px] text-text-primary">
              Continue with Google
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
        onVerify={handleVerify}
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
