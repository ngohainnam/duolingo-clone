import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Link } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { images } from "@/constants/images";

export default function OnboardingScreen() {
  return (
    <SafeAreaView style={styles.screen}>
      <View className="flex-1 px-10 pb-8 pt-8">
        <View className="flex-row items-center justify-center gap-4">
          <Image
            source={images.mascotLogo}
            contentFit="contain"
            style={{ width: 56, height: 56 }}
          />
          <Text className="font-poppins-bold text-[40px] leading-11.5 text-text-primary">
            lingua
          </Text>
        </View>

        <View className="mt-20 gap-4">
          <Text className="font-poppins-bold text-[38px] leading-[48px] text-text-primary">
            Your AI language{"\n"}
            <Text className="text-lingua-deep-purple">teacher.</Text>
          </Text>
          <Text className="font-poppins text-[18px] leading-7.75 text-text-secondary">
            Real conversations, personalized{"\n"}
            lessons, anytime, anywhere.
          </Text>
        </View>

        <View className="relative mt-8 h-107.5">
          <View className="absolute left-1 top-8 rounded-[18px] bg-[#edf7ff] px-6 py-4 -rotate-6">
            <Text className="font-poppins-medium text-[24px] leading-7.5 text-text-primary">
              Hello!
            </Text>
            <View style={[styles.tail, styles.helloTail]} />
          </View>

          <View className="absolute right-5 top-0 rounded-[18px] bg-[#f5f3ff] px-6 py-4 rotate-12">
            <Text className="font-poppins-medium text-[24px] italic leading-7.5 text-lingua-deep-purple">
              ¡Hola!
            </Text>
            <View style={[styles.tail, styles.holaTail]} />
          </View>

          <View className="absolute right-0 top-36 rounded-[18px] bg-[#fff4ef] px-6 py-4 rotate-[9deg]">
            <Text className="font-poppins-medium text-[24px] leading-7.5 text-[#ff4d3d]">
              你好!
            </Text>
            <View style={[styles.tail, styles.nihaoTail]} />
          </View>

          <Image
            source={images.mascotWelcome}
            contentFit="contain"
            style={styles.mascotImage}
          />
        </View>

        <Link href="/" asChild>
          <Pressable className="mt-auto h-19 w-full flex-row items-center justify-center rounded-button bg-lingua-deep-purple shadow-soft">
            <Text className="font-poppins-bold text-[22px] leading-[28px] text-white">
              Get Started
            </Text>
            <Ionicons
              name="chevron-forward"
              size={32}
              color="#ffffff"
              style={styles.buttonIcon}
            />
          </Pressable>
        </Link>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  tail: {
    position: "absolute",
    bottom: -15,
    width: 0,
    height: 0,
    borderLeftWidth: 16,
    borderRightWidth: 5,
    borderTopWidth: 18,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
  },
  helloTail: {
    right: 19,
    borderTopColor: "#edf7ff",
    transform: [{ rotate: "-18deg" }],
  },
  holaTail: {
    left: 25,
    borderTopColor: "#f5f3ff",
    transform: [{ rotate: "22deg" }],
  },
  nihaoTail: {
    left: 25,
    borderTopColor: "#fff4ef",
    transform: [{ rotate: "16deg" }],
  },
  mascotImage: {
    position: "absolute",
    bottom: 0,
    width: 330,
    height: 360,
    alignSelf: "center",
  },
  buttonIcon: {
    position: "absolute",
    right: 28,
  },
});
