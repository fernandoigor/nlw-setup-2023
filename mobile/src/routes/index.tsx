import { NavigationContainer } from "@react-navigation/native";
import { useContext } from "react";
import { View } from "react-native";
import { AuthContext } from "../contexts/AuthContext";
import { Login } from "../screens/Login";

import { AppRoutes } from "./app.routes";
import { AuthRoutes } from "./auth.routes";

export function Routes() {
  const authContext = useContext(AuthContext);
  return (
    <View className="flex-1 bg-background">
      <NavigationContainer>
        {/* <AppRoutes /> */}
        {!authContext?.user?.username?.length ? <AuthRoutes /> : <AppRoutes />}
      </NavigationContainer>
    </View>
  );
}
