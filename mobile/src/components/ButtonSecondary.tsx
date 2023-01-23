import { ReactNode } from "react";
import { TouchableOpacity, Text } from "react-native";

import colors from "tailwindcss/colors";

interface Props {
  children: ReactNode;
  onPress?: () => {};
}

export function ButtonSecondary({ onPress, children }: Props) {
  return (
    <TouchableOpacity
      className="w-full h-14 flex-row items-center justify-center rounded-md mt-2 border border-violet-500"
      activeOpacity={0.7}
      onPress={onPress}
    >
      {children}
    </TouchableOpacity>
  );
}
