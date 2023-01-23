import React, { useCallback, useContext, useState } from "react";
import {
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";

import Logo from "../assets/logo.svg";

import { Loading } from "../components/Loading";
import { HabitDay, DAY_SIZE } from "../components/HabitDay";
import dayjs from "dayjs";
import { AuthContext } from "../contexts/AuthContext";
import { BackButton } from "../components/BackButton";
import { api } from "../lib/axios";

export function Profile() {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({
    totalCompleted: 0,
    totalHabit: 0,
  });

  const { navigate } = useNavigation();

  const authContext = useContext(AuthContext);

  async function fetchData() {
    try {
      setLoading(true);
      const response = await api.get("/habits/me", {
        headers: {
          Authorization: `Bearer ${authContext?.user?.token}`,
        },
      });
      setSummary(response.data);
    } catch (error) {
      Alert.alert("Ops", "Não foi possível carregar o sumário de hábitos.");
    } finally {
      setLoading(false);
    }
  }
  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  const { totalCompleted, totalHabit } = summary;

  if (loading) {
    return <Loading />;
  }

  return (
    <View className="flex-1 bg-background px-8 pt-16">
      <View className="w-full mt-4 flex-row items-start justify-between">
        <BackButton />
        <Logo />
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <View className="mt-8 flex-row items-center justify-center">
          <View className="border-2 border-violet-500 rounded-full">
            <Image
              className="bg-red-500 w-32 h-32 rounded-full mx-0 m-1"
              source={{
                uri: authContext?.user?.avatar ?? "",
              }}
            />
          </View>
        </View>

        <View className="w-full mt-4 flex-row items-center justify-center">
          <Text className="text-white text-xl ml-0">
            {authContext?.user?.username}
          </Text>
        </View>
        <View className="w-full flex-col items-center justify-between">
          <View className="flex-row w-full items-center justify-between mb-4"></View>
        </View>
        <Text className="text-gray-500 mt-4">Summary</Text>
        <View className="mt-4 flex-row mx-8 justify-center border-b-2 border-gray-600/5 pb-4">
          <View className="w-1/2 flex-row justify-end mr-4">
            <Text className="text-violet-500">{totalHabit}</Text>
          </View>
          <Text className="w-1/2 text-gray-300 text-xs">Hábitos criado</Text>
        </View>
        <View className="mt-4 flex-row mx-8 justify-center border-b-2 border-gray-600/5 pb-4">
          <View className="w-1/2 flex-row justify-end mr-4">
            <Text className="text-violet-500">{totalCompleted}</Text>
          </View>
          <Text className="w-1/2 text-gray-300 text-xs">Hábitos Completos</Text>
        </View>
      </ScrollView>
    </View>
  );
}
