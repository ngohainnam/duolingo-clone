import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { LessonCard, type LessonStatus } from "@/components/lesson-card";
import { fallbackLessonImage, lessonImages } from "@/constants/images";
import { lessons } from "@/data/lessons";
import { units } from "@/data/units";
import { useLanguageStore } from "@/store/language-store";

type LearnSection = "lessons" | "practice";

export default function LearnScreen() {
  const selectedLanguageId = useLanguageStore(
    (state) => state.selectedLanguageId,
  );
  const [section, setSection] = useState<LearnSection>("lessons");

  const languageLessons = useMemo(
    () =>
      lessons
        .filter((lesson) => lesson.languageId === selectedLanguageId)
        .sort((a, b) => a.order - b.order),
    [selectedLanguageId],
  );
  const currentUnit = units.find(
    (unit) => unit.languageId === selectedLanguageId,
  );
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
  const selectedLesson =
    languageLessons.find((lesson) => lesson.id === selectedLessonId) ??
    languageLessons[2] ??
    languageLessons[0];

  const getStatus = (order: number): LessonStatus => {
    if (order < (selectedLesson?.order ?? 1)) {
      return "completed";
    }

    if (order === selectedLesson?.order) {
      return "in-progress";
    }

    return "upcoming";
  };

  const openLesson = (lessonId: string) => {
    setSelectedLessonId(lessonId);
    router.push({
      pathname: "/lesson/[lessonId]",
      params: { lessonId },
    });
  };

  if (!selectedLesson) {
    return null;
  }

  return (
    <SafeAreaView edges={["top"]} style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.content}
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-row items-center px-5 pb-4 pt-3">
          <Pressable
            accessibilityLabel="Go back"
            className="h-11 w-11 items-start justify-center"
            onPress={() => router.back()}
          >
            <Ionicons name="chevron-back" size={31} color="#0d132b" />
          </Pressable>
          <View className="flex-1 pl-2">
            <Text
              className="font-poppins-semibold text-[20px] leading-7 text-text-primary"
              numberOfLines={1}
            >
              {selectedLesson.title}
            </Text>
            <Text className="font-poppins text-[14px] leading-6 text-[#687290]">
              Unit {currentUnit?.order ?? 1} · {selectedLesson.order} /{" "}
              {languageLessons.length} lessons
            </Text>
          </View>
          <Pressable
            accessibilityLabel="Save lesson"
            className="h-11 w-11 items-center justify-center"
          >
            <Ionicons name="bookmark-outline" size={28} color="#694bf6" />
          </Pressable>
        </View>

        <Image
          source={lessonImages[selectedLesson.id] ?? fallbackLessonImage}
          contentFit="cover"
          style={styles.hero}
          transition={250}
        />

        <View className="-mt-5 mx-4 h-19 flex-row rounded-[22px] bg-white p-1.5" style={styles.segment}>
          {(["lessons", "practice"] as const).map((item) => {
            const isActive = section === item;

            return (
              <Pressable
                accessibilityRole="tab"
                accessibilityState={{ selected: isActive }}
                className="flex-1 items-center justify-center rounded-[17px]"
                key={item}
                onPress={() => setSection(item)}
              >
                <Text
                  className={`font-poppins-medium text-[16px] capitalize ${
                    isActive ? "text-lingua-deep-purple" : "text-[#67708f]"
                  }`}
                >
                  {item}
                </Text>
                {isActive && (
                  <View className="absolute -bottom-1.5 h-0.75 w-full rounded-full bg-lingua-deep-purple" />
                )}
              </Pressable>
            );
          })}
        </View>

        {section === "lessons" ? (
          <View className="gap-3 px-5 pb-6 pt-7">
            {languageLessons.map((lesson) => (
              <LessonCard
                key={lesson.id}
                lesson={lesson}
                onPress={() => openLesson(lesson.id)}
                status={getStatus(lesson.order)}
              />
            ))}
          </View>
        ) : (
          <View className="mx-5 mt-7 items-center rounded-[24px] border border-[#eef0f6] bg-white px-8 py-12">
            <View className="h-16 w-16 items-center justify-center rounded-full bg-[#eeeaff]">
              <Ionicons name="sparkles" size={30} color="#694bf6" />
            </View>
            <Text className="pt-5 font-poppins-semibold text-[19px] text-text-primary">
              Practice this unit
            </Text>
            <Text className="pt-2 text-center font-poppins text-[14px] leading-6 text-[#67708f]">
              Revisit words and phrases from your completed lessons.
            </Text>
          </View>
        )}
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
    paddingBottom: 18,
  },
  hero: {
    width: "100%",
    height: 260,
    backgroundColor: "#eef5ff",
  },
  segment: {
    borderCurve: "continuous",
    boxShadow: "0 7px 18px rgba(13, 19, 43, 0.10)",
  },
});
