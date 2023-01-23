import { createNativeStackNavigator } from "@react-navigation/native-stack";

const { Navigator, Screen } = createNativeStackNavigator();

import { Login } from "../screens/Login";
import { Register } from "../screens/Register";

export function AuthRoutes() {
  return (
    <Navigator screenOptions={{ headerShown: false }}>
      <Screen name="login" component={Login} />
      <Screen name="register" component={Register} />
    </Navigator>
  );
}
