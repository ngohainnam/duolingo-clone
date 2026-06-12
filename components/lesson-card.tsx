import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import type { Lesson } from "@/types/learning";

export type LessonStatus = "completed" | "in-progress" | "upcoming";

type LessonCardProps = {
  lesson: Lesson;
  status: LessonStatus;
  onPress: () => void;
};

export function LessonCard({ lesson, status, onPress }: LessonCardProps) {
  const isInProgress = status === "in-progress";

  return (
    <Pressable
      accessibilityLabel={`Open lesson ${lesson.order}: ${lesson.title}`}
      className={`min-h-27 flex-row items-center rounded-[20px] border bg-white px-5 py-4 ${
        isInProgress ? "border-lingua-purple" : "border-[#eef0f6]"
      }`}
      onPress={onPress}
      style={[styles.card, isInProgress && styles.activeCard]}
    >
      <View className="flex-1 pr-4">
        <Text
          className={`font-poppins-medium text-[14px] leading-5 ${
            isInProgress ? "text-lingua-purple" : "text-[#77809f]"
          }`}
        >
          Lesson {lesson.order}
        </Text>
        <Text className="pt-1 font-poppins-medium text-[17px] leading-6 text-text-primary">
          {lesson.title}
        </Text>
        {status !== "completed" && (
          <Text
            className={`pt-1 font-poppins text-[13px] leading-5 ${
              isInProgress ? "text-lingua-purple" : "text-[#77809f]"
            }`}
          >
            {isInProgress ? "In progress" : `0 / ${lesson.activities.length} activities`}
          </Text>
        )}
      </View>

      {status === "completed" && (
        <View className="h-8 w-8 items-center justify-center rounded-full bg-[#20c718]">
          <Ionicons name="checkmark" size={22} color="#ffffff" />
        </View>
      )}
      {status === "in-progress" && (
        <View className="h-11 w-11 items-center justify-center rounded-[13px] bg-[#eeeaff]">
          <Ionicons name="cafe" size={26} color="#694bf6" />
        </View>
      )}
      {status === "upcoming" && (
        <Ionicons name="lock-closed-outline" size={25} color="#65708f" />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderCurve: "continuous",
    boxShadow: "0 2px 8px rgba(13, 19, 43, 0.035)",
  },
  activeCard: {
    borderWidth: 2,
    boxShadow: "0 5px 14px rgba(105, 75, 246, 0.11)",
  },
});
