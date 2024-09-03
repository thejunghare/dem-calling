import React, { useEffect } from "react";
import { View, Text, RefreshControl, SafeAreaView, ScrollView, Image } from "react-native";
import { useUser } from "../contexts/UserContext";
import { Button, IconButton, MD3Colors } from "react-native-paper";
import * as Clipboard from "expo-clipboard";
import { useCaller } from "../contexts/CallerContext";

export default function HomeScreen({ navigation }) {
  const user = useUser();
  const { totalcount, totalCallCount, recalls, recallscount, complete, completed, decline, declined, noanswer, noAnswered } = useCaller();

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
      // todayscount(user.current.$id, date);

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

        <Text className="text-xs font-bold px-3 pt-2">Today's count</Text>
        <View className=" bg-white rounded-lg m-3 p-3 full flex flex-row items-start justify-around my-3">
          <Text className="font-bold text-base p-3 w-11 h-11 text-center text-white rounded-full" style={{ backgroundColor: '#6CB4EE' }}>
            {completed}
          </Text>
          <Text className="font-bold text-base p-3 w-11 h-11 text-center text-white rounded-full" style={{ backgroundColor: '#FF4F00' }}>
            {noAnswered}
          </Text>
          <Text className="font-bold text-base p-3 w-11 h-11 text-center text-white rounded-full" style={{ backgroundColor: '#FFBF00' }}>
            {recallscount}
          </Text>
          <Text className="font-bold text-base p-3 w-11 h-11 text-center text-white rounded-full" style={{ backgroundColor: '#ED2939' }}>
            {declined}
          </Text>
        </View>

        <View className="my-3 flex items-center justify-evenly h-60">
          <Button
            icon="phone"
            mode="outlined"
            onPress={() =>
              navigation.navigate("Fetch")
            }
          >
            Verification Calling
          </Button>

          <Button icon="information-outline" onPress={() => navigation.navigate("Help")} mode="outlined">
            About App & Help
          </Button>

          <Button icon="logout" onPress={() => user.logout()} mode="outlined" >
            End Session / Logout
          </Button>
        </View>

        <View className="">
          <Image
            source={require('../assets/dem-logo-new.png')}
            style={{
              width: 200,
              height: 150,
              marginRight: "auto",
              marginLeft: "auto",
            }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
