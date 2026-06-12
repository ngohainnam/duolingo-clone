import { Text, View } from "react-native";

type PlaceholderTabScreenProps = {
  title: string;
};

export function PlaceholderTabScreen({ title }: PlaceholderTabScreenProps) {
  return (
    <View className="flex-1 items-center justify-center bg-white px-8">
      <Text className="font-poppins-semibold text-[24px] text-text-primary">
        {title}
      </Text>
      <Text className="mt-2 text-center font-poppins text-[14px] text-text-secondary">
        This screen is coming soon.
      </Text>
    </View>
  );
}
