import React, { useEffect } from "react";
import { Button, FlatList, Text, TouchableOpacity, View } from "react-native";
import { useCaller } from "../contexts/CallerContext";

export default function DataFetchingScreen({ navigation }) {
  const { fetch, documents, details } = useCaller();

  useEffect(() => {
    fetch();
  }, []);

  const renderItem = ({ item }) => {
    return (
      <View>
        {item.callingSurveysId.map((survey, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => details(survey.$id, navigation)}
          >
            <Text className="p-3 my-3 bg-white rounded-lg">{survey.$id}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <View className="flex-1 p-3">
      <Button title="See assigned survey" onPress={fetch} />
      <View className="h-15">
        <FlatList
          data={documents}
          keyExtractor={(item) => item.$id}
          renderItem={renderItem}
        />
      </View>
    </View>
  );
}
