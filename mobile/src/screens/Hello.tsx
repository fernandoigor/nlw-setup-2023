import React, { useEffect } from "react";
import { Dimensions, Text, View } from "react-native";
import { LoadingHabits } from "../components/LoadingHabits";

const MARGIN_LEFT = (Dimensions.get("screen").width - 32 - 32 * 6) / 4;
export function Hello() {
  return (
    <View className="flex-1 items-start justify-center bg-background px-8 pt-16">
      <View
        style={{
          marginLeft: MARGIN_LEFT,
        }}
      >
        <LoadingHabits loop={false} />
      </View>

      <Text className="mt-2 mx-auto text-white">One step every day...</Text>
    </View>
  );
}
