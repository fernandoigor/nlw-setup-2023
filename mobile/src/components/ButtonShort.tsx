import { ReactNode } from "react";
import { TouchableOpacity, Text } from "react-native";

import colors from "tailwindcss/colors";

interface Props {
  children: ReactNode;
  bg: string;
  onPress?: () => {};
}

export function ButtonShort({ onPress, bg, children }: Props) {
  return (
    <TouchableOpacity
      className="w-14 h-14 mx-2 flex-col items-center justify-center rounded-md mt-2 "
      activeOpacity={0.7}
      onPress={onPress}
      style={{ backgroundColor: bg }}
    >
      {children}
    </TouchableOpacity>
  );
}
