import React from "react";
import { View, Text, ScrollView } from "react-native";

export default function DocumentDetailScreen({ route, navigation }) {
  const { survey } = route.params;

  return (
    <ScrollView>
      <View>
        <Text>Employee ID: {survey.division}</Text>
        <Text>Employee ID: {survey.ward}</Text>
        <Text>Employee ID: {survey.area}</Text>
        <Text>Employee ID: {survey.building}</Text>
        <Text>Employee ID: {survey.native}</Text>
      </View>
    </ScrollView>
  );
}
