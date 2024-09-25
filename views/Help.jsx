import React from "react";
import { View, TouchableOpacity, SafeAreaView } from "react-native";
import { Text, Icon } from "react-native-paper";
import Constants from "expo-constants";
import * as Application from "expo-application";

const Help = () => {
  const app_version = Application.nativeApplicationVersion;
  const app_name = Application.applicationName;
  return (
    <SafeAreaView className="flex-1 p-3">
      <Text className="text-xs font-bold px-5 ">Color scheme:</Text>
      <View className="bg-white border border-slate-200 mx-5 my-2 rounded-xl flex flex-row items-center p-3">
        <View className="flex flex-row items-center justify-between">
          <Text className="text-xs font-bold px-5 py-2">Completed:</Text>
          <Text
            className="text-xs font-bold px-5 py-3 rounded-full"
            style={{ backgroundColor: "#6CB4EE" }}
          ></Text>
        </View>
        <View className="flex flex-row items-center justify-between">
          <Text className="text-xs font-bold px-5 py-2 rounded-full">
            Recall:
          </Text>
          <Text
            className="text-xs font-bold px-5 py-3 rounded-full"
            style={{ backgroundColor: "#8DB600" }}
          ></Text>
        </View>
      </View>

      <View className="bg-white border border-slate-200 mx-5 rounded-xl flex flex-row items-center p-3 my-2">
        <View className="flex flex-row items-center justify-between">
          <Text className="text-xs font-bold px-5 py-2 ">No Answer:</Text>
          <Text
            className="text-xs font-bold px-5 py-3 rounded-full"
            style={{ backgroundColor: "#ED9121" }}
          ></Text>
        </View>
        <View className="flex flex-row items-center justify-between ">
          <Text className="text-xs font-bold px-5 py-2 ">Declined:</Text>
          <Text
            className="text-xs font-bold px-5 py-3 rounded-full"
            style={{ backgroundColor: "#ED2939" }}
          ></Text>
        </View>
      </View>

      <View className="bg-white border border-slate-200 mx-5 rounded-xl flex flex-row items-center p-3 my-2">
        <View className="flex flex-row items-center justify-between">
          <Text className="text-xs font-bold px-5 py-2 ">Switch Off:</Text>
          <Text
            className="text-xs font-bold px-5 py-3 rounded-full"
            style={{ backgroundColor: "#E5E4E2" }}
          ></Text>
        </View>
        <View className="flex flex-row items-center justify-between">
          <Text className="text-xs font-bold px-5 py-2 ">Wrong No:</Text>
          <Text
            className="text-xs font-bold px-5 py-3 rounded-full"
            style={{ backgroundColor: "#AF6E4D" }}
          ></Text>
        </View>
      </View>

      <View className="bg-white border border-slate-200 mx-5 rounded-xl flex flex-row items-center p-3 my-2">
        <View className="flex flex-row items-center justify-between">
          <Text className="text-xs font-bold px-5 py-2 ">Busy:</Text>
          <Text
            className="text-xs font-bold px-5 py-3 rounded-full"
            style={{ backgroundColor: "#FFD700" }}
          ></Text>
        </View>
      </View>

      <Text className="text-xs font-bold px-5 mt-2.5">App version</Text>
      <View className=" bg-white border border-slate-200 m-5 rounded-xl">
        <TouchableOpacity className="border-b border-slate-200 flex flex-row items-center px-3">
          <Icon source="information" size={20} />
          <Text className="p-5 font-semibold text-black">{app_version}</Text>
        </TouchableOpacity>
      </View>

      <Text className="text-xs font-bold px-5 mt-2.5">App name</Text>
      <View className=" bg-white border border-slate-200 m-5 rounded-xl">
        <TouchableOpacity className="border-b border-slate-200 flex flex-row items-center px-3">
          <Icon source="information" size={20} />
          <Text className="p-5 font-semibold text-black">{app_name}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Help;
