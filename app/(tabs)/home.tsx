import { useUser } from "@clerk/expo";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { images } from "@/constants/images";
import { languages } from "@/data/languages";
import { lessons } from "@/data/lessons";
import { units } from "@/data/units";
import { useLanguageStore } from "@/store/language-store";
import type { LanguageId, Lesson } from "@/types/learning";

const DAILY_XP_GOAL = 20;
const greetings: Record<LanguageId, string> = {
  spanish: "Hola",
  french: "Bonjour",
  japanese: "こんにちは",
};

type PlanItem = {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ComponentProps<typeof Ionicons>["name"];
  color: string;
  completed: boolean;
};

function getFirstName(
  firstName: string | null | undefined,
  username: string | null | undefined,
) {
  return firstName ?? username ?? "Learner";
}

function getCurrentLesson(languageId: LanguageId): Lesson | undefined {
  return lessons
    .filter((lesson) => lesson.languageId === languageId)
    .sort((a, b) => a.order - b.order)[0];
}

export default function HomeScreen() {
  const { user } = useUser();
  const selectedLanguageId = useLanguageStore(
    (state) => state.selectedLanguageId,
  );

  const language =
    languages.find((item) => item.id === selectedLanguageId) ?? languages[0];
  const currentUnit = units
    .filter((unit) => unit.languageId === language.id)
    .sort((a, b) => a.order - b.order)[0];
  const currentLesson = getCurrentLesson(language.id);
  const firstName = getFirstName(user?.firstName, user?.username);
  const dailyXp = currentLesson?.xpReward ?? 0;
  const progress = Math.min(dailyXp / DAILY_XP_GOAL, 1);
  const wordCount = currentLesson?.vocabulary.length ?? 0;

  const planItems: PlanItem[] = [
    {
      id: "lesson",
      title: "Lesson",
      subtitle: currentLesson?.title ?? "Start learning",
      icon: "book",
      color: "#694bf6",
      completed: true,
    },
    {
      id: "conversation",
      title: "AI Conversation",
      subtitle: "Talk about your day",
      icon: "headset",
      color: "#694bf6",
      completed: false,
    },
    {
      id: "words",
      title: "New words",
      subtitle: `${wordCount} ${wordCount === 1 ? "word" : "words"}`,
      icon: "game-controller",
      color: "#ff5b63",
      completed: false,
    },
  ];

  return (
    <SafeAreaView edges={["top"]} style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.content}
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-row items-center px-7 pb-6 pt-5">
          <Image
            source={language.flag}
            contentFit="cover"
            style={styles.flag}
          />
          <Text
            className="flex-1 pl-4 font-poppins-semibold text-[18px] leading-7 text-text-primary"
            numberOfLines={1}
          >
            {greetings[language.id]}, {firstName}! 👋
          </Text>
          <View className="flex-row items-center gap-3">
            <Image
              source={images.streakFire}
              contentFit="contain"
              style={styles.fire}
            />
            <Text className="font-poppins-medium text-[18px] text-[#4e5678]">
              12
            </Text>
            <Pressable
              accessibilityLabel="Notifications"
              className="h-11 w-11 items-center justify-center"
            >
              <Ionicons
                name="notifications-outline"
                size={28}
                color="#293253"
              />
            </Pressable>
          </View>
        </View>

        <View className="mx-6 h-34.5 flex-row overflow-hidden rounded-[24px] bg-[#fff8ef] px-6 py-5">
          <View className="flex-1">
            <Text className="font-poppins-medium text-[16px] text-[#293253]">
              Daily goal
            </Text>
            <View className="mt-1 flex-row items-baseline gap-2">
              <Text className="font-poppins-semibold text-[29px] leading-10 text-text-primary">
                {dailyXp}
              </Text>
              <Text className="font-poppins-medium text-[16px] text-[#67708f]">
                / {DAILY_XP_GOAL} XP
              </Text>
            </View>
            <View className="mt-3 h-2.25 overflow-hidden rounded-full bg-[#ffe4c8]">
              <View
                className="h-full rounded-full bg-[#ff7417]"
                style={{ width: `${progress * 100}%` }}
              />
            </View>
          </View>
          <Image
            source={images.treasure}
            contentFit="contain"
            style={styles.treasure}
          />
        </View>

        <Pressable
          className="mx-6 mt-6 h-48 overflow-hidden rounded-[24px] bg-lingua-deep-purple px-6 py-6"
          onPress={() => router.push("/(tabs)/learn")}
          style={styles.learningCard}
        >
          <View className="z-10 flex-1">
            <Text className="font-poppins-medium text-[16px] text-[#ded8ff]">
              Continue learning
            </Text>
            <Text className="mt-2 font-poppins-semibold text-[25px] leading-8 text-white">
              {language.name}
            </Text>
            <Text className="font-poppins-medium text-[17px] leading-7 text-white">
              A1 · Unit {currentUnit?.order ?? 1}
            </Text>
            <View className="mt-auto h-12 w-30 items-center justify-center rounded-[15px] bg-white">
              <Text className="font-poppins-semibold text-[16px] text-lingua-deep-purple">
                Continue
              </Text>
            </View>
          </View>
          <View style={styles.hillBack} />
          <View style={styles.hillFront} />
          <Image
            source={images.palace}
            contentFit="contain"
            style={styles.palace}
          />
        </Pressable>

        <View className="flex-row items-center justify-between px-6 pb-3 pt-7">
          <Text className="font-poppins-semibold text-[18px] text-text-primary">
            Today&apos;s plan
          </Text>
          <Pressable onPress={() => router.push("/(tabs)/learn")}>
            <Text className="font-poppins-semibold text-[16px] text-lingua-deep-purple">
              View all
            </Text>
          </Pressable>
        </View>

        <View className="gap-1 px-6">
          {planItems.map((item) => (
            <Pressable
              className="h-18.5 flex-row items-center"
              key={item.id}
              onPress={() =>
                router.push(
                  item.id === "conversation"
                    ? "/(tabs)/ai-teacher"
                    : "/(tabs)/learn",
                )
              }
            >
              <View
                className="h-13 w-13 items-center justify-center rounded-[14px]"
                style={{ backgroundColor: item.color }}
              >
                <Ionicons name={item.icon} size={27} color="#ffffff" />
              </View>
              <View className="flex-1 pl-5">
                <Text className="font-poppins-medium text-[16px] leading-6 text-text-primary">
                  {item.title}
                </Text>
                <Text className="font-poppins text-[14px] leading-6 text-[#757d9c]">
                  {item.subtitle}
                </Text>
              </View>
              <View
                className={`h-7 w-7 items-center justify-center rounded-full border-2 ${
                  item.completed
                    ? "border-lingua-purple bg-lingua-purple"
                    : "border-[#8992af] bg-white"
                }`}
              >
                {item.completed && (
                  <Ionicons name="checkmark" size={17} color="#ffffff" />
                )}
              </View>
            </Pressable>
          ))}
        </View>

        <Pressable
          className="mx-6 mt-5 h-32 flex-row items-center overflow-hidden rounded-[24px] bg-[#f4faeb] px-6"
          onPress={() => router.push("/(tabs)/ai-teacher")}
        >
          <View className="flex-1">
            <Text className="font-poppins text-[14px] text-[#67708f]">
              Next up
            </Text>
            <Text className="mt-1 font-poppins-semibold text-[18px] text-text-primary">
              AI Video Call
            </Text>
            <Text className="font-poppins text-[14px] text-[#67708f]">
              Practice speaking
            </Text>
          </View>
          <Image
            source={images.aiTeacher}
            contentFit="cover"
            style={styles.teacher}
          />
          <View className="ml-3 h-13 w-13 items-center justify-center rounded-full bg-[#45c713]">
            <Ionicons name="videocam" size={27} color="#ffffff" />
          </View>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  content: {
    paddingBottom: 24,
  },
  flag: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1,
    borderColor: "#edf0f5",
  },
  fire: {
    width: 29,
    height: 35,
  },
  treasure: {
    width: 112,
    height: 112,
    marginLeft: 10,
    marginTop: -6,
  },
  learningCard: {
    boxShadow: "0 8px 18px rgba(91, 59, 246, 0.16)",
  },
  hillBack: {
    position: "absolute",
    right: 14,
    bottom: -30,
    width: 180,
    height: 105,
    borderRadius: 90,
    backgroundColor: "#5140d1",
    transform: [{ rotate: "-10deg" }],
  },
  hillFront: {
    position: "absolute",
    right: -48,
    bottom: -65,
    width: 255,
    height: 130,
    borderRadius: 130,
    backgroundColor: "#4434b8",
  },
  palace: {
    position: "absolute",
    right: -12,
    bottom: -2,
    width: 190,
    height: 190,
  },
  teacher: {
    width: 82,
    height: 82,
    borderRadius: 41,
    borderWidth: 6,
    borderColor: "#ffffff",
  },
});
