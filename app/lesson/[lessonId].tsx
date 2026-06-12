import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  fallbackLessonImage,
  images,
  lessonImages,
} from "@/constants/images";
import { languages } from "@/data/languages";
import { lessons } from "@/data/lessons";

type SessionPanel = "phrase" | "subtitles";
type IconName = React.ComponentProps<typeof Ionicons>["name"];

const feedback = [
  { label: "Speaking", value: "Excellent", color: "#18c92c" },
  { label: "Pronunciation", value: "Great", color: "#1479ff" },
  { label: "Grammar", value: "Good", color: "#6338ff" },
] as const;

export default function AudioLessonScreen() {
  const { lessonId } = useLocalSearchParams<{ lessonId: string }>();
  const { height } = useWindowDimensions();
  const lesson = lessons.find((item) => item.id === lessonId);
  const language = languages.find((item) => item.id === lesson?.languageId);
  const [isMuted, setIsMuted] = useState(false);
  const [activePanel, setActivePanel] = useState<SessionPanel>("phrase");
  const [phraseIndex, setPhraseIndex] = useState(0);

  if (!lesson) {
    return (
      <SafeAreaView style={styles.screen}>
        <View className="flex-1 items-center justify-center px-8">
          <Text className="font-poppins-semibold text-[20px] text-text-primary">
            Lesson not found
          </Text>
          <Pressable
            className="mt-5 rounded-button bg-lingua-deep-purple px-7 py-4"
            onPress={() => router.back()}
          >
            <Text className="font-poppins-semibold text-white">Go back</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const phrase = lesson.phrases[phraseIndex] ?? lesson.phrases[0];
  const compact = height < 760;

  const showNextPhrase = () => {
    setActivePanel("phrase");
    if (lesson.phrases.length > 0) {
      setPhraseIndex((current) => (current + 1) % lesson.phrases.length);
    }
  };

  return (
    <SafeAreaView edges={["top"]} style={styles.screen}>
      <View className="flex-row items-center px-5 pb-4 pt-2">
        <Pressable
          accessibilityLabel="Leave audio lesson"
          className="h-12 w-12 items-start justify-center"
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={31} color="#0d132b" />
        </Pressable>

        <View className="flex-1 pl-1">
          <Text
            className="font-poppins-semibold text-[20px] leading-7 text-text-primary"
            numberOfLines={1}
          >
            AI Teacher
          </Text>
          <View className="flex-row items-center gap-2">
            <View className="h-3 w-3 rounded-full bg-[#20c718]" />
            <Text
              className="font-poppins text-[13px] leading-5 text-[#67708f]"
              numberOfLines={1}
            >
              Online · {language?.name} · {lesson.title}
            </Text>
          </View>
        </View>

        <View className="h-11 w-11 items-center justify-center rounded-full border border-[#e6e9f1] bg-white">
          <Ionicons name="headset-outline" size={24} color="#0d132b" />
        </View>
        <View className="ml-2 h-11 min-w-11 items-center justify-center rounded-full border border-[#e6e9f1] bg-white px-2">
          <Text className="font-poppins-medium text-[16px] text-text-primary">
            {lesson.estimatedMinutes}
          </Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View
          className="mx-3 overflow-hidden rounded-[25px] bg-[#d7d1cc]"
          style={[styles.stage, compact && styles.compactStage]}
        >
          <Image
            source={lessonImages[lesson.id] ?? fallbackLessonImage}
            blurRadius={8}
            contentFit="cover"
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.stageTint} />

          <View className="absolute left-4 top-4 max-w-[72%] rounded-full bg-white/95 px-4 py-2">
            <Text
              className="font-poppins-medium text-[12px] text-[#4e5678]"
              numberOfLines={1}
            >
              Goal: {lesson.goals[0]?.description}
            </Text>
          </View>

          <Image
            source={images.mascotAuth}
            contentFit="contain"
            style={[styles.mascot, compact && styles.compactMascot]}
          />

          <View className="absolute bottom-4 left-4 right-4 rounded-[22px] bg-white px-5 py-4" style={styles.responseBubble}>
            {activePanel === "phrase" ? (
              <>
                <Text
                  className="font-poppins-medium text-[16px] leading-6 text-text-primary"
                  numberOfLines={2}
                >
                  {phrase?.text ?? lesson.aiTeacherPrompt.openingMessage}
                </Text>
                <Text
                  className="pt-1 font-poppins text-[14px] leading-6 text-[#536080]"
                  numberOfLines={2}
                >
                  {phrase?.translation ?? lesson.aiTeacherPrompt.openingMessage}
                </Text>
              </>
            ) : (
              <>
                <Text
                  className="font-poppins-medium text-[14px] leading-6 text-text-primary"
                  numberOfLines={2}
                >
                  {lesson.aiTeacherPrompt.openingMessage}
                </Text>
                <Text
                  className="pt-1 font-poppins text-[12px] leading-5 text-[#67708f]"
                  numberOfLines={2}
                >
                  {lesson.aiTeacherPrompt.coachingNotes[0]}
                </Text>
              </>
            )}
            <Ionicons
              name="volume-high"
              size={25}
              color="#6338ff"
              style={styles.responseAudio}
            />
          </View>
        </View>

        <View className="flex-row justify-between px-5 pb-7 pt-9">
          <SessionControl
            icon="chatbubbles"
            label="Phrases"
            onPress={showNextPhrase}
          />
          <SessionControl
            active={isMuted}
            icon={isMuted ? "mic-off" : "mic"}
            label={isMuted ? "Muted" : "Mic"}
            onPress={() => setIsMuted((value) => !value)}
          />
          <SessionControl
            active={activePanel === "subtitles"}
            icon="language"
            label="Subtitles"
            onPress={() =>
              setActivePanel((panel) =>
                panel === "subtitles" ? "phrase" : "subtitles",
              )
            }
          />
          <SessionControl
            danger
            icon="call"
            label="End Call"
            onPress={() => router.back()}
          />
        </View>

        <View className="mx-5 flex-row rounded-[22px] bg-white px-1 py-6" style={styles.feedbackCard}>
          {feedback.map((item, index) => (
            <View
              className={`flex-1 items-center px-1 ${
                index > 0 ? "border-l border-[#e9ebf2]" : ""
              }`}
              key={item.label}
            >
              <Text
                className="font-poppins-medium text-[13px] text-text-primary"
                numberOfLines={1}
              >
                {item.label}
              </Text>
              <Text
                className="pt-2 font-poppins-medium text-[14px]"
                style={{ color: item.color }}
              >
                {item.value}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>

    </SafeAreaView>
  );
}

type SessionControlProps = {
  active?: boolean;
  danger?: boolean;
  icon: IconName;
  label: string;
  onPress: () => void;
};

function SessionControl({
  active = false,
  danger = false,
  icon,
  label,
  onPress,
}: SessionControlProps) {
  const backgroundColor = danger ? "#ff4048" : active ? "#eeeaff" : "#ffffff";
  const iconColor = danger ? "#ffffff" : active ? "#6338ff" : "#12204b";

  return (
    <Pressable
      accessibilityLabel={label}
      className="items-center"
      onPress={onPress}
      style={styles.controlPressable}
    >
      <View
        className="h-[72px] w-[72px] items-center justify-center rounded-full"
        style={[styles.controlButton, { backgroundColor }]}
      >
        <Ionicons
          name={icon}
          size={danger ? 35 : 31}
          color={iconColor}
          style={danger ? styles.hangupIcon : undefined}
        />
      </View>
      <Text
        className="pt-3 font-poppins-medium text-[12px] text-[#67708f]"
        numberOfLines={1}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#f8f8fb",
  },
  content: {
    paddingBottom: 34,
  },
  stage: {
    height: 465,
    borderCurve: "continuous",
  },
  compactStage: {
    height: 395,
  },
  stageTint: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(88, 72, 60, 0.18)",
  },
  mascot: {
    position: "absolute",
    left: 5,
    right: 5,
    bottom: 64,
    height: 340,
  },
  compactMascot: {
    height: 280,
    bottom: 58,
  },
  responseBubble: {
    borderCurve: "continuous",
    boxShadow: "0 6px 16px rgba(13, 19, 43, 0.16)",
  },
  responseAudio: {
    position: "absolute",
    right: 18,
    top: 25,
  },
  controlPressable: {
    width: 80,
  },
  controlButton: {
    boxShadow: "0 3px 9px rgba(13, 19, 43, 0.10)",
  },
  hangupIcon: {
    transform: [{ rotate: "135deg" }],
  },
  feedbackCard: {
    borderCurve: "continuous",
    boxShadow: "0 4px 15px rgba(13, 19, 43, 0.06)",
  },
});
