import { useState, createContext, ReactNode } from "react";
import { View, Text, Modal, Dimensions } from "react-native";
import { LoadingHabits } from "../components/LoadingHabits";

const PADDING_LEFT = (Dimensions.get("screen").width - 32 - 32 * 6) / 2;

interface Props {
  state?: boolean;
  text?: string;
}

const useLoadingScreen = ({ state = false, text = "Loading" }: Props) => {
  const [loading, setLoading] = useState<Props>({ state, text });

  return [
    <Modal transparent={true} visible={loading.state}>
      <View className="fixed w-screen h-screen bg-black/80 flex items-center justify-center">
        <View className="mr-auto" style={{ paddingLeft: PADDING_LEFT }}>
          <LoadingHabits />
        </View>
        <Text className="text-white mt-4">{loading.text}</Text>
      </View>
    </Modal>,
    (state: boolean, text = "") => setLoading({ state, text }),
  ] as const;
};

export default useLoadingScreen;
