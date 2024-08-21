import React from "react";
import { View, Text } from "react-native";
import { useUser } from "../contexts/UserContext";
import { Button, IconButton } from "react-native-paper";

export default function HomeScreen({ navigation }) {
  const user = useUser();

  console.log(user.current);
  return (
    <View className="flex-1 p-3">
      <View className="full flex flex-row items-center justify-between my-3">
        <Text className="font-semibold text-base">
          Welcome, {user.current ? user.current.name : "Please login"}
        </Text>

        <IconButton icon="logout" size={20} onPress={() => user.logout()} />
      </View>

      <View className="my-3 flex items-center justify-evenly h-40">
        <Button
          icon="phone"
          mode="contained"
          onPress={() => navigation.navigate("Fetch")}
        >
          Verification Calling
        </Button>

        <Button icon="cake" mode="contained">
          Birthday message
        </Button>
      </View>
    </View>
  );
}
