import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    TextInputProps,
    View,
} from "react-native";

interface AuthInputProps extends TextInputProps {
  label: string;
  isPassword?: boolean;
}

export function AuthInput({ label, isPassword, ...props }: AuthInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View className="rounded-2xl border border-border bg-white px-4 pb-4 pt-3">
      <Text className="font-poppins text-xs text-text-secondary">{label}</Text>
      <View className="flex-row items-center">
        <TextInput
          {...props}
          secureTextEntry={isPassword && !showPassword}
          style={styles.input}
          placeholderTextColor="#9CA3AF"
        />
        {isPassword && (
          <Pressable onPress={() => setShowPassword((v) => !v)}>
            <Ionicons
              name={showPassword ? "eye-off-outline" : "eye-outline"}
              size={22}
              color="#6B7280"
            />
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    flex: 1,
    fontFamily: "Poppins-Regular",
    fontSize: 16,
    color: "#0D132B",
    paddingTop: 6,
    padding: 0,
  },
});
