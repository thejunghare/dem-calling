import React, { useEffect } from "react";
import { View, Text, RefreshControl, SafeAreaView, ScrollView } from "react-native";
import { useUser } from "../contexts/UserContext";
import { Button, IconButton, MD3Colors } from "react-native-paper";
import * as Clipboard from "expo-clipboard";
import { useCaller } from "../contexts/CallerContext";

export default function HomeScreen({ navigation }) {
  const user = useUser();
  const { totalcount, totalCallCount, todayscount, todaysCallCount, recalls, recallscount, complete, completed, decline, declined, noanswer, noAnswered } = useCaller();

  const [refreshing, setRefreshing] = React.useState(false);
  let todaysdate;
  let date = '2024-08-24'

  function generateDateString() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    todaysdate = `${year}-${month}-${day}`;
    console.log(todaysdate, typeof (todaysdate))
  }

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(user.current.$id);
  };

  useEffect(() => {
    if (refreshing) {
      // based on current date
      todayscount(user.current.$id, date);

      // total count
      totalcount(user.current.$id);
      recalls(user.current.$id)
      noanswer(user.current.$id)
      decline(user.current.$id)
      complete(user.current.$id)
    }
  }, [refreshing, user.current.$id, date]);

  //console.log(user.current);
  return (
    <SafeAreaView className="flex-1">
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
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

        <Text className="text-xs font-bold px-3 pt-2">Total count</Text>
        <View className="bg-white rounded-lg m-3 p-3 full flex items-start justify-center my-3">
          <Text className="font-semibold text-base">
            Completed: {completed}
          </Text>
          <Text className="font-semibold text-base">
            No answer: {noAnswered}
          </Text>
          <Text className="font-semibold text-base">
            Recall: {recallscount}
          </Text>
          <Text className="font-semibold text-base">
            Declined: {declined}
          </Text>
          <Text className="font-semibold text-base">
            Total: {totalCallCount}
          </Text>
        </View>

        <Text className="text-xs font-bold px-3 pt-2">Today's count</Text>
        <View className="bg-white rounded-lg m-3 p-3 full flex items-start justify-center my-3">
          <Text className="font-semibold text-base">
            Completed: {completed}
          </Text>
          <Text className="font-semibold text-base">
            No answer: {noAnswered}
          </Text>
          <Text className="font-semibold text-base">
            Recall: {recallscount}
          </Text>
          <Text className="font-semibold text-base">
            Declined: {declined}
          </Text>
          <Text className="font-semibold text-base">
            Total: {totalCallCount}
          </Text>
        </View>

        <View className="my-3 flex items-center justify-evenly h-40">
          <Button
            icon="phone"
            mode="contained"
            onPress={() =>
              navigation.navigate("Fetch")
            }
          >
            Verification Calling
          </Button>

          <Button icon="cake" mode="contained">
            Birthday message
          </Button>

          <Button icon="logout" onPress={() => user.logout()} mode="contained">
            Logout
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
