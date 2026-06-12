import { Ionicons } from "@expo/vector-icons";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { fontFamily } from "@/theme";

type TabIconName = React.ComponentProps<typeof Ionicons>["name"];

const tabIcons: Record<string, { active: TabIconName; inactive: TabIconName }> =
  {
    home: { active: "home", inactive: "home-outline" },
    learn: { active: "book", inactive: "book-outline" },
    "ai-teacher": { active: "headset", inactive: "headset-outline" },
    chat: { active: "chatbubble", inactive: "chatbubble-outline" },
    profile: { active: "person", inactive: "person-outline" },
  };

export function CustomTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      className="bg-white px-3 pt-2"
      style={[styles.tabBar, { paddingBottom: Math.max(insets.bottom, 8) }]}
    >
      <View className="h-[72px] flex-row">
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
                color={isFocused ? "#694bf6" : "#67708f"}
                name={isFocused ? icons.active : icons.inactive}
                size={27}
              />
              <Text
                numberOfLines={1}
                style={[styles.label, isFocused && styles.activeLabel]}
              >
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    boxShadow: "0 -4px 18px rgba(13, 19, 43, 0.07)",
  },
  tabItem: {
    flex: 1,
    height: 72,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  label: {
    color: "#67708f",
    fontFamily: fontFamily.medium,
    fontSize: 11,
    lineHeight: 16,
  },
  activeLabel: {
    color: "#694bf6",
    fontFamily: fontFamily.semiBold,
  },
});
