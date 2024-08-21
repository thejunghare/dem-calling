import React from "react";
import { View, Text } from "react-native";
import { useUser } from "../contexts/UserContext";
import { Button, IconButton, MD3Colors } from "react-native-paper";
import * as Clipboard from "expo-clipboard";

export default function HomeScreen({ navigation }) {
  const user = useUser();

  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(user.current.$id);
  };

  //console.log(user.current);
  return (
    <View className="flex-1">
      <View className="p-2 flex flex-row items-center justify-around bg-blue-500">
        <Text className="p-3 text-base font-semibold w-screen text-white">
          Employee ID: {user.current.$id}
        </Text>

        <IconButton
          icon="content-copy"
          iconColor={"white"}
          size={20}
          onPress={copyToClipboard}
        />
      </View>

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
          onPress={() =>
            navigation.navigate("Fetch", { employeeId: user.current.$id })
          }
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
