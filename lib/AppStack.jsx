import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Dashboard from "../screens/Dashboard";

const Stack = createNativeStackNavigator();
const BottomTab = createBottomTabNavigator();

export default AppStack = () => {
  return (
    <BottomTab.Navigator>
      <BottomTab.Screen
        name="Dashboard"
        component={Dashboard}
        options={{
          headerShown: false,
        }}
      />
    </BottomTab.Navigator>
  );
};
