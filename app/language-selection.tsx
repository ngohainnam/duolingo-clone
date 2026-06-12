import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { images } from "@/constants/images";
import { languages } from "@/data/languages";
import type { LanguageId } from "@/types/learning";

const learnerCounts: Record<LanguageId, string> = {
  spanish: "28.4M learners",
  french: "19.4M learners",
  japanese: "12.7M learners",
};

export default function LanguageSelectionScreen() {
  const { width } = useWindowDimensions();
  const [query, setQuery] = useState("");
  const [selectedLanguageId, setSelectedLanguageId] =
    useState<LanguageId>("spanish");

  const filteredLanguages = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return languages;
    }

    return languages.filter(
      (language) =>
        language.name.toLowerCase().includes(normalizedQuery) ||
        language.nativeName.toLowerCase().includes(normalizedQuery),
    );
  }, [query]);

  const handleClose = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace("/");
  };

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.content}
        contentInsetAdjustmentBehavior="automatic"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-row items-center justify-between px-7 pt-4">
          <Pressable
            accessibilityLabel="Go back"
            className="h-12 w-12 items-start justify-center"
            onPress={handleClose}
          >
            <Ionicons name="chevron-back" size={32} color="#0d132b" />
          </Pressable>
          <Text className="font-poppins-semibold text-[24px] leading-8 text-text-primary">
            Choose a language
          </Text>
          <View className="h-12 w-12" />
        </View>

        <View className="mx-9 mt-5 h-17 flex-row items-center gap-4 rounded-full border border-border bg-[#fafaff] px-6">
          <Ionicons name="search-outline" size={28} color="#67708f" />
          <TextInput
            accessibilityLabel="Search languages"
            className="flex-1 font-poppins text-[17px] text-text-primary"
            onChangeText={setQuery}
            placeholder="Search languages"
            placeholderTextColor="#67708f"
            returnKeyType="search"
            value={query}
          />
        </View>

        <View className="px-9 pt-8">
          <Text className="font-poppins-semibold text-[18px] leading-6 text-text-primary">
            Popular
          </Text>

          <View className="mt-5 gap-2">
            {filteredLanguages.map((language) => {
              const isSelected = language.id === selectedLanguageId;

              return (
                <Pressable
                  accessibilityRole="radio"
                  accessibilityState={{ selected: isSelected }}
                  className={`h-28 flex-row items-center rounded-[26px] border px-5 ${
                    isSelected
                      ? "border-lingua-purple bg-[#f8f7ff]"
                      : "border-[#f1f2f7] bg-white"
                  }`}
                  key={language.id}
                  onPress={() => setSelectedLanguageId(language.id)}
                >
                  <Image
                    source={language.flag}
                    contentFit="cover"
                    style={styles.flag}
                  />

                  <View className="flex-1 pl-6">
                    <Text className="font-poppins-medium text-[19px] leading-7 text-text-primary">
                      {language.name}
                    </Text>
                    <Text className="font-poppins text-[15px] leading-6 text-[#67708f]">
                      {learnerCounts[language.id]}
                    </Text>
                  </View>

                  {isSelected ? (
                    <View className="h-10 w-10 items-center justify-center rounded-full bg-lingua-deep-purple">
                      <Ionicons name="checkmark" size={28} color="#ffffff" />
                    </View>
                  ) : (
                    <Ionicons
                      name="chevron-forward"
                      size={27}
                      color="#67708f"
                    />
                  )}
                </Pressable>
              );
            })}

            {filteredLanguages.length === 0 && (
              <View className="items-center rounded-[26px] border border-[#f1f2f7] bg-white px-6 py-10">
                <Text className="font-poppins-medium text-[17px] text-text-primary">
                  No languages found
                </Text>
                <Text className="mt-1 font-poppins text-[14px] text-text-secondary">
                  Try a different search.
                </Text>
              </View>
            )}
          </View>
        </View>

        <View className="mt-auto px-9 pt-8">
          <Pressable
            className="h-17 w-full items-center justify-center rounded-button bg-lingua-deep-purple shadow-soft"
            onPress={handleClose}
          >
            <Text className="font-poppins-bold text-[18px] leading-6 text-white">
              Confirm language
            </Text>
          </Pressable>
        </View>

        <Image
          source={images.earth}
          contentFit="contain"
          style={[styles.earth, { width: width - 24, height: width - 24 }]}
        />
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
    flexGrow: 1,
    paddingBottom: 0,
  },
  flag: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 1,
    borderColor: "#edf0f5",
  },
  earth: {
    alignSelf: "center",
    marginTop: -20,
    marginBottom: -68,
  },
});
