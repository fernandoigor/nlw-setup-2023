import { View, Text, Dimensions } from "react-native";
import { LoadingHabits } from "./LoadingHabits";
const MARGIN_LEFT = (Dimensions.get("screen").width - 32 - 32 * 6) / 4;
export function Loading() {
  return (
    <View className="flex-1 items-start justify-center bg-background px-8 pt-16">
      <View
        style={{
          marginLeft: MARGIN_LEFT,
        }}
      >
        <LoadingHabits />
      </View>

      <Text className="mt-2 mx-auto text-white">Loading...</Text>
    </View>
  );
}
