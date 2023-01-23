import React, { useContext, useState } from "react";
import { Text, View, ScrollView, TextInput, Alert } from "react-native";
import { Register as RegisterUser } from "../contexts/AuthContext";

import Logo from "../assets/logo.svg";
import colors from "tailwindcss/colors";
import { ButtonPrimary } from "../components/ButtonPrimary";
import { useNavigation } from "@react-navigation/native";
import { BackButton } from "../components/BackButton";
import useLoadingScreen from "../hooks/useLoadingScreen";
import { AxiosError } from "axios";

export function Register() {
  const [registerData, setRegisterData] = useState({
    username: "",
    email: "",
    password: "",
    passwordRepeat: "",
  });

  const [Loading, setLoading] = useLoadingScreen({ state: false });

  const { navigate } = useNavigation();

  const handleChangeInputs = (
    value: string,
    inputName: "username" | "email" | "password" | "passwordRepeat"
  ) => {
    const newData = { ...registerData, [inputName]: value };
    setRegisterData(newData);
  };

  const handleRegister = async () => {
    console.log("touch register tela registrar");
    console.log(registerData);
    // if (registerData.password !== registerData.passwordRepeat) {
    //   Alert.alert("Ops", "Senhas diferentes");
    //   return;
    // }
    setLoading(true, "Registrando...");
    try {
      await RegisterUser({
        email: "Rocket@email.com",
        password: "12345678",
        username: "RocketSeat",
      });
      Alert.alert("Registrado", "Faça login utilizando email e senha");
      navigate("login");
    } catch (err: AxiosError) {
      if (err.response?.status === 409) {
        Alert.alert("Ops", "Email ja cadastrado!");
      } else {
        Alert.alert("Ops", "Não foi possível registrar");
      }
      console.log(err.response?.status);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 items-center justify-around bg-background px-8 pt-16">
      <View className="mr-auto">
        <BackButton />
      </View>
      <Logo />
      <Text className="mt-2 text-white font-semibold text-xl">
        Novo usuário
      </Text>
      <ScrollView
        className="w-full mt-8"
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="w-full">
          <Text className="mt-2 text-white font-semibold text-xs">
            Usuário:
          </Text>
          <TextInput
            className="h-12 w-full pl-4 rounded-lg mt-2 bg-zinc-900 text-white border-2 border-zinc-800 focus:border-green-600"
            placeholder="Usuário"
            placeholderTextColor={colors.zinc[400]}
            onChangeText={(value) => {
              handleChangeInputs(value, "username");
            }}
          />
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
          <Text className="mt-2 text-white font-semibold text-xs">
            Repetir Senha:
          </Text>
          <TextInput
            className="h-12 mb-4 w-full pl-4 rounded-lg mt-2 bg-zinc-900 text-white border-2 border-zinc-800 focus:border-green-600"
            placeholder="Senha"
            placeholderTextColor={colors.zinc[400]}
            onChangeText={(value) => {
              handleChangeInputs(value, "passwordRepeat");
            }}
            secureTextEntry
          />
          <ButtonPrimary onPress={() => handleRegister()}>
            <Text className="font-semibold text-base text-white ml-2">
              Registrar
            </Text>
          </ButtonPrimary>
        </View>
      </ScrollView>
      {Loading}
    </View>
  );
}
