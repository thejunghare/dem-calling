import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";

export default function DocumentDetailScreen({ route, navigation }) {
  const { survey } = route.params;

  const familyHeadData = JSON.parse(survey.familyhead);
  console.log(`Caste: ${familyHeadData.caste}`);

  if (!survey || !survey.familyhead) {
    return <Text>Loading...</Text>;
  }

  return (
    <ScrollView className="flex-1 p-3">
      <View>
        <Text className="text-base font-semibold">
          Room Number - {survey.roomNumber}
        </Text>
        <Text className="text-base font-semibold">
          Survey Denied -{String(survey.surveyDenied)}
        </Text>
        <Text className="text-base font-semibold">
          Room Locked - {String(survey.isRoomLocked)}
        </Text>

        <Text className="text-base font-semibold">
          Native Place - {survey.native}
        </Text>

        <Text>Name: {survey.familyhead.familyHeadName}</Text>
      </View>
    </ScrollView>
  );
}
