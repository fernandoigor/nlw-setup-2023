import { View, TouchableOpacity, Text, TextInput, Image } from "react-native";
import { Feather } from "@expo/vector-icons";
import colors from "tailwindcss/colors";
import { useNavigation } from "@react-navigation/native";

import Logo from "../assets/logo.svg";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

export function Header() {
  const { navigate } = useNavigation();

  const authContext = useContext(AuthContext);

  const handleLogout = () => {
    authContext.logout();
  };
  console.log(authContext?.user?.avatar);
  return (
    <View className="w-full flex-col items-center justify-between">
      <View className="flex-row w-full items-center justify-between mb-4">
        <View className="flex-row items-center gap-4">
          <View className="border-2 border-violet-500 rounded-full">
            <Image
              className="bg-red-500 w-12 h-12 rounded-full mx-0 m-1"
              source={{
                uri: authContext?.user?.avatar ?? "",
              }}
            />
          </View>
          <Text className="text-white text-xl ml-0">
            Olá, {authContext?.user?.username}
          </Text>
        </View>
        <TouchableOpacity activeOpacity={0.7} onPress={handleLogout}>
          <Feather name="log-out" color={colors.white} size={20} />
        </TouchableOpacity>
      </View>

      <View className="w-full mt-4 flex-row items-center justify-between">
        <Logo />

        <TouchableOpacity
          activeOpacity={0.7}
          className="flex-row h-11 px-4 border border-violet-500 rounded-lg items-center"
          onPress={() => navigate("new")}
        >
          <Feather name="plus" color={colors.violet[500]} size={20} />

          <Text className="text-white ml-3 font-semibold text-base">Novo</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
