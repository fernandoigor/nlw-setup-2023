import React, { useContext, useEffect, useState } from "react";
import { Text, View, ScrollView, TextInput, Image, Alert } from "react-native";
import { AuthContext, UserProps } from "../contexts/AuthContext";

import { Feather } from "@expo/vector-icons";

import Logo from "../assets/logo.svg";
import colors from "tailwindcss/colors";
import { ButtonPrimary } from "../components/ButtonPrimary";
import { ButtonSecondary } from "../components/ButtonSecondary";
import { useNavigation } from "@react-navigation/native";
import { Loading } from "../components/Loading";
import useLoadingScreen from "../hooks/useLoadingScreen";
import { api } from "../lib/axios";
import { ButtonShort } from "../components/ButtonShort";
import { AxiosError } from "axios";

export function Login() {
  const authContext = useContext(AuthContext);

  const [userData, setUserData] = useState<UserProps>({
    email: "",
    password: "",
  });

  const [Loading, setLoading] = useLoadingScreen({ state: false });

  const { navigate } = useNavigation();

  const handleChangeInputs = (
    value: string,
    inputName: "email" | "password"
  ) => {
    const newData = { ...userData, [inputName]: value };
    setUserData(newData);
  };

  const handleRegister = () => {
    navigate("register");
  };
  const handleLoginGithub = () => {
    authContext.loginGitHub();
  };
  const handleLoginDiscord = () => {
    authContext.loginDiscord();
  };

  const handleLogin = async () => {
    setLoading(true, "Autenticando...");
    try {
      await authContext.login(userData);
    } catch (error: AxiosError) {
      if (error?.response?.status === 400) {
        Alert.alert("Ops", "Servidor fora do ar");
      } else if (error?.response?.status === 403) {
        Alert.alert("Ops", "Email ou senha incorreto");
      } else {
        Alert.alert("Ops", "Não foi possível autenticar com o servidor");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 items-center justify-around bg-background px-8 pt-16">
      <Logo />
      <View className="w-full">
        <Text className="mt-2 text-white font-semibold text-xs">Email:</Text>
        <TextInput
          className="h-12 w-full pl-4 rounded-lg mt-2 bg-zinc-900 text-white border-2 border-zinc-800 focus:border-green-600"
          placeholder="Email"
          placeholderTextColor={colors.zinc[400]}
          onChangeText={(value) => {
            handleChangeInputs(value, "email");
          }}
        />
        <Text className="mt-2 text-white font-semibold text-xs">Senha:</Text>
        <TextInput
          className="h-12 mb-4 w-full pl-4 rounded-lg mt-2 bg-zinc-900 text-white border-2 border-zinc-800 focus:border-green-600"
          placeholder="Senha"
          placeholderTextColor={colors.zinc[400]}
          onChangeText={(value) => {
            handleChangeInputs(value, "password");
          }}
          secureTextEntry
        />
        <ButtonPrimary onPress={handleLogin}>
          <Text className="font-semibold text-base text-white ml-2">
            Entrar
          </Text>
        </ButtonPrimary>
        <ButtonSecondary onPress={() => handleRegister()}>
          <Text className="font-semibold text-base text-white ml-2">
            Registrar
          </Text>
        </ButtonSecondary>
        <Text className="mt-4 text-white font-semibold text-xs">
          Entrar com:
        </Text>
        <View className="flex-row items-center justify-center">
          <ButtonShort onPress={() => handleLoginGithub()} bg="#FFFFFF">
            <Image
              source={{
                uri: "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png",
              }}
            />
            <Image
              className="w-8 h-8"
              source={{
                uri: "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png",
              }}
            />
            <Text className=" text-black text-xs">Github</Text>
          </ButtonShort>
          {/* <ButtonShort onPress={() => handleLoginDiscord()} bg="#7189d9">
            <Image
              source={{
                uri: "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png",
              }}
            />
            <Image
              className="w-8 h-8"
              source={{
                uri: "https://www.freeiconspng.com/thumbs/discord-icon/discord-metro-style-icon-0.png",
              }}
            />
            <Text className=" text-white text-xs">Discord</Text>
          </ButtonShort> */}
        </View>
      </View>
      {Loading}
    </View>
  );
}
