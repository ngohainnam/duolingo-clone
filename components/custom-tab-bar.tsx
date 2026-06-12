import { Ionicons } from "@expo/vector-icons";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { colors, fontFamily } from "@/theme";

type TabIconName = React.ComponentProps<typeof Ionicons>["name"];

const tabIcons: Record<string, { active: TabIconName; inactive: TabIconName }> =
  {
    home: { active: "home", inactive: "home-outline" },
    learn: { active: "book", inactive: "book-outline" },
    "ai-teacher": { active: "headset", inactive: "headset-outline" },
    chat: { active: "chatbubble", inactive: "chatbubble-outline" },
    profile: { active: "person", inactive: "person-outline" },
  };

const ACTIVE_CIRCLE_SIZE = 54;

export function CustomTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const [tabBarWidth, setTabBarWidth] = useState(0);
  const activeIndex = useSharedValue(state.index);
  const itemWidth = tabBarWidth / state.routes.length;

  useEffect(() => {
    activeIndex.value = withSpring(state.index, {
      damping: 18,
      stiffness: 180,
      mass: 0.7,
    });
  }, [activeIndex, state.index]);

  const activeCircleStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX:
          activeIndex.value * itemWidth +
          (itemWidth - ACTIVE_CIRCLE_SIZE) / 2,
      },
    ],
  }));

  return (
    <View
      className="bg-white px-3 pt-3"
      onLayout={(event) => setTabBarWidth(event.nativeEvent.layout.width - 24)}
      style={[styles.tabBar, { paddingBottom: Math.max(insets.bottom, 10) }]}
    >
      <View className="h-[68px] flex-row">
        {tabBarWidth > 0 && (
          <Animated.View
            pointerEvents="none"
            style={[styles.activeCircle, activeCircleStyle]}
          />
        )}

        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label =
            typeof options.tabBarLabel === "string"
              ? options.tabBarLabel
              : options.title ?? route.name;
          const isFocused = state.index === index;
          const icons = tabIcons[route.name];

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: "tabLongPress",
              target: route.key,
            });
          };

          return (
            <Pressable
              accessibilityLabel={options.tabBarAccessibilityLabel}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              key={route.key}
              onLongPress={onLongPress}
              onPress={onPress}
              style={styles.tabItem}
            >
              <Ionicons
                color={isFocused ? "#ffffff" : "#67708f"}
                name={isFocused ? icons.active : icons.inactive}
                size={isFocused ? 27 : 26}
              />
              {!isFocused && (
                <Text numberOfLines={1} style={styles.label}>
                  {label}
                </Text>
              )}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    boxShadow: "0 -6px 24px rgba(13, 19, 43, 0.08)",
  },
  activeCircle: {
    position: "absolute",
    top: 7,
    left: 0,
    width: ACTIVE_CIRCLE_SIZE,
    height: ACTIVE_CIRCLE_SIZE,
    borderRadius: ACTIVE_CIRCLE_SIZE / 2,
    backgroundColor: colors.brand.deepPurple,
  },
  tabItem: {
    flex: 1,
    height: 68,
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
  },
  label: {
    color: "#67708f",
    fontFamily: fontFamily.medium,
    fontSize: 11,
    lineHeight: 16,
  },
});
