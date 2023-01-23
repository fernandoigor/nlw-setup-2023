import "./src/lib/dayjs";
import * as dotenv from "dotenv";

import { StatusBar } from "react-native";
import { AuthContextProvider } from "./src/contexts/AuthContext";
import {
  useFonts,
  Inter_400Regular,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
} from "@expo-google-fonts/inter";

import { Hello } from "./src/screens/Hello";
import { Routes } from "./src/routes";
import { useEffect, useState } from "react";

export default function App() {
  const [hello, setHello] = useState(true);
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
  });

  // if (!fontsLoaded) {
  //   return <Hello />;
  // }
  useEffect(() => {
    setTimeout(() => {
      setHello(false);
    }, 1200);
  }, []);

  return hello || !fontsLoaded ? (
    <Hello />
  ) : (
    <AuthContextProvider>
      <Routes />
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
    </AuthContextProvider>
  );
}
