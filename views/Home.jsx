import React, { useEffect } from "react";
import {
  View,
  Text,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  Image,
} from "react-native";
import { useUser } from "../contexts/UserContext";
import { Button, IconButton, useTheme } from "react-native-paper";
import * as Clipboard from "expo-clipboard";
import { useCaller } from "../contexts/CallerContext";
import { useWindowDimensions } from "react-native";
import { TabView, SceneMap } from "react-native-tab-view";

const FirstRoute = () => (
  <View style={{ flex: 1, backgroundColor: "#ff4081" }} />
);

const SecondRoute = () => (
  <View style={{ flex: 1, backgroundColor: "#673ab7" }} />
);

const renderScene = SceneMap({
  first: FirstRoute,
  second: SecondRoute,
});

export default function HomeScreen({ navigation }) {
  const layout = useWindowDimensions();

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: "first", title: "First" },
    { key: "second", title: "Second" },
  ]);

  const theme = useTheme();
  const user = useUser();
  const {
    totalcount,
    totalCallCount,
    recalls,
    recallscount,
    complete,
    completed,
    decline,
    declined,
    noanswer,
    noAnswered,
    birthdayCount,
    busy,
    busycount,
    switchoffcount,
    switchoff,
    wrongnumber,
    wrongnocount,
    neralbirthdatecount,
    neralbirthdate,
    kalyanbirthdatecount,
    kayalanbirhdaydocscount,
    khopolibirthdatecountfunc,
    khopolibirthdatecount,
    nmbirthdatecountfunc,
    nmbirthdatecount,
  } = useCaller();

  const [refreshing, setRefreshing] = React.useState(false);
  let todaysdate;
  let date = "2024-08-24";

  function generateDateString() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    todaysdate = `${year}-${month}-${day}`;
    console.log(todaysdate, typeof todaysdate);
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
      recalls(user.current.$id);
      noanswer(user.current.$id);
      decline(user.current.$id);
      complete(user.current.$id);
      busy(user.current.$id);
      wrongnumber(user.current.$id);
      switchoff(user.current.$id);
      neralbirthdate();
      kayalanbirhdaydocscount();
      khopolibirthdatecountfunc();
      nmbirthdatecountfunc();
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

        {/* <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={{ width: layout.width }}
        /> */}

        <Text className="text-xs font-bold px-5 mt-2.5">
          Today's calling count
        </Text>
        <View className=" bg-white border border-slate-200 m-4 rounded-xl flex flex-row items-center justify-around p-3">
          <View>
            <Text
              className="font-semibold text-base p-3 w-11 h-11 text-center text-white rounded-full"
              style={{ backgroundColor: "#6CB4EE" }}
            >
              {completed}
            </Text>
            <Text className="font-semibold py-2">Completed</Text>
          </View>

          <View>
            <Text
              className="font-semibold text-base p-3 w-11 h-11 text-center text-white rounded-full"
              style={{ backgroundColor: "#ED9121" }}
            >
              {noAnswered}
            </Text>
            <Text className="font-semibold py-2">No answer</Text>
          </View>

          <View>
            <Text
              className="font-semibold text-base p-3 w-11 h-11 text-center text-white rounded-full"
              style={{ backgroundColor: "#8DB600" }}
            >
              {recallscount}
            </Text>
            <Text className="font-semibold py-2">Recall</Text>
          </View>

          <View>
            <Text
              className="font-semibold text-base p-3 w-11 h-11 text-center text-white rounded-full"
              style={{ backgroundColor: "#ED2939" }}
            >
              {declined}
            </Text>
            <Text className="font-semibold py-2">Declined</Text>
          </View>
        </View>

        <View className=" bg-white border border-slate-200 m-4 rounded-xl flex flex-row items-center justify-around p-3">
          {/* wrong number */}
          <View>
            <Text
              className="font-semibold text-base p-3 w-11 h-11 text-center text-white rounded-full"
              style={{ backgroundColor: "#AF6E4D" }}
            >
              {wrongnocount}
            </Text>
            <Text className="font-semibold py-2">Wrong No.</Text>
          </View>
          {/* busy */}
          <View>
            <Text
              className="font-semibold text-base p-3 w-11 h-11 text-center text-white rounded-full"
              style={{ backgroundColor: "#FFD700" }}
            >
              {busycount}
            </Text>
            <Text className="font-semibold py-2">Busy</Text>
          </View>
          {/* switch off */}
          <View>
            <Text
              className="font-semibold text-base p-3 w-11 h-11 text-center text-white rounded-full"
              style={{ backgroundColor: "#E5E4E2" }}
            >
              {switchoffcount}
            </Text>
            <Text className="font-semibold py-2">Switch Off</Text>
          </View>
        </View>

        <Text className="text-xs font-bold px-5">Today's birthday count</Text>
        <View className=" bg-white border border-slate-200 m-4 rounded-xl flex flex-row items-center justify-around p-3">
          <View>
            <Text
              className="bg-green-500 text-center rounded-full p-2 font-bold text-2xl text-white"
              style={{ backgroundColor: "#6CB4EE" }}
            >
              {kalyanbirthdatecount}
            </Text>
            <Text className="font-semibold py-2">Kaylan</Text>
          </View>

          <View>
            <Text
              className="font-semibold text-base p-3 w-11 h-11 text-center text-white rounded-full"
              style={{ backgroundColor: "#FF4F00" }}
            >
              {nmbirthdatecount}
            </Text>
            <Text className="font-bold py-2">Airoli</Text>
          </View>

          <View>
            <Text
              className="font-semibold text-base p-3 w-11 h-11 text-center text-white rounded-full"
              style={{ backgroundColor: "#FFBF00" }}
            >
              {khopolibirthdatecount}
            </Text>
            <Text className="font-semibold py-2">Khopoli</Text>
          </View>

          <View>
            <Text
              className="font-semibold text-base p-3 w-11 h-11 text-center text-white rounded-full"
              style={{ backgroundColor: "#ED2939" }}
            >
              {neralbirthdatecount}
            </Text>
            <Text className="font-semibold py-2">Neral</Text>
          </View>
        </View>

        <View className="border border-slate-200 m-4 rounded-xl flex flex-row items-center justify-around ">
          <View>
            <Button
              icon="phone"
              mode="outlined"
              onPress={() => navigation.navigate("Fetch")}
              className="rounded-full my-2"
              uppercase={false}
              style={{
                backgroundColor: theme.colors.background,
              }}
            >
              Verification Calling
            </Button>

            <Button
              icon="cake"
              mode="outlined"
              onPress={() => navigation.navigate("Birthday List")}
              className="rounded-full my-2"
              uppercase={false}
              style={{
                backgroundColor: theme.colors.background,
              }}
            >
              Birthday list
            </Button>
          </View>

          <View className="m-3">
            <Button
              icon="information-outline"
              onPress={() => navigation.navigate("Help")}
              mode="outlined"
              uppercase={false}
              className="rounded-full my-2"
              style={{
                backgroundColor: theme.colors.background,
              }}
            >
              About
            </Button>

            <Button
              icon="logout"
              onPress={() => user.logout()}
              mode="outlined"
              uppercase={false}
              className="rounded-full my-2"
              style={{
                backgroundColor: theme.colors.background,
              }}
            >
              Logout
            </Button>
          </View>
        </View>

        <View className="">
          <Image
            source={require("../assets/dem-logo-new.png")}
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
