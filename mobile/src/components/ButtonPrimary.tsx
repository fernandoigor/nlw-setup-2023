import { ReactNode } from "react";
import { TouchableOpacity, Text } from "react-native";

import colors from "tailwindcss/colors";

interface Props {
  children: ReactNode;
  onPress?: () => {};
}

export function ButtonPrimary({ onPress, children }: Props) {
  return (
    <TouchableOpacity
      className="w-full h-14 flex-row items-center justify-center bg-green-600 rounded-md mt-2"
      activeOpacity={0.7}
      onPress={onPress}
    >
      {children}
    </TouchableOpacity>
  );
}
