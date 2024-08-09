import React from "react";
import { View, Text } from "react-native";
import { useUser } from "../contexts/UserContext";
import { Button } from "react-native-paper";

export default function HomeScreen({ navigation }) {
  const user = useUser();

  console.log(user.current);
  return (
    <View>
      <Text>Welcome, {user.current ? user.current.email : "Please login"}</Text>
      <Button icon="logout" mode="contained" onPress={() => user.logout()}>
        Logout
      </Button>

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
  );
}
