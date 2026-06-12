import { Ionicons } from "@expo/vector-icons";
import { useSignUp } from "@clerk/expo";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AuthInput } from "@/components/AuthInput";
import { VerificationModal } from "@/components/VerificationModal";
import { images } from "@/constants/images";
import { useGoogleAuth } from "@/hooks/useGoogleAuth";

export default function SignUpScreen() {
  const router = useRouter();
  const { signUp, fetchStatus } = useSignUp();
  const { signInWithGoogle } = useGoogleAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showVerification, setShowVerification] = useState(false);

  const handleSignUp = async () => {
    const emailAddress = email.trim();

    if (!emailAddress || !password) {
      Alert.alert(
        "Complete your details",
        "Please enter your email address and password.",
      );
      return;
    }

    const { error } = await signUp.password({ emailAddress, password });

    if (error) {
      Alert.alert("Could not sign up", error.longMessage ?? error.message);
      return;
    }

    const { error: verificationError } =
      await signUp.verifications.sendEmailCode();

    if (verificationError) {
      Alert.alert(
        "Could not send code",
        verificationError.longMessage ?? verificationError.message,
      );
      return;
    }

    setEmail(emailAddress);
    setShowVerification(true);
  };

  const handleVerify = useCallback(
    async (code: string) => {
      const { error } = await signUp.verifications.verifyEmailCode({ code });

      if (error) {
        Alert.alert("Invalid code", error.longMessage ?? error.message);
        return false;
      }

      if (signUp.status !== "complete") {
        Alert.alert(
          "Could not sign up",
          "Your account needs additional information before it can be created.",
        );
        return false;
      }

      await signUp.finalize({
        navigate: () => router.replace("/"),
      });

      return true;
    },
    [router, signUp],
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
            Create your account
          </Text>
          <Text className="mt-1 font-poppins text-[16px] text-text-secondary">
            Start your language journey today ✨
          </Text>
        </View>

        {/* Mascot */}
        <Image
          source={images.mascotAuth}
          contentFit="contain"
          style={styles.mascot}
        />

        {/* Inputs */}
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
          <AuthInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            placeholder="Enter your password"
            isPassword
          />
        </View>

        {/* Sign Up button */}
        <Pressable
          className="mt-6 h-15 w-full items-center justify-center rounded-button bg-lingua-deep-purple"
          disabled={fetchStatus === "fetching"}
          onPress={handleSignUp}
        >
          <Text className="font-poppins-bold text-[18px] text-white">
            Sign Up
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

        {/* Google sign up */}
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
            Already have an account?
          </Text>
          <Pressable onPress={() => router.replace("/sign-in")}>
            <Text className="font-poppins-semibold text-[15px] text-lingua-deep-purple">
              Log in
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

      <View nativeID="clerk-captcha" />
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
