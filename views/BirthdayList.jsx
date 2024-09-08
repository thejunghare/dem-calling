import React, { useState, useEffect } from "react";
import {
  View,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  FlatList,
} from "react-native";
import { Text, ActivityIndicator, Button } from "react-native-paper";
import { Picker } from "@react-native-picker/picker";
import Toast from "react-native-toast-message";
import { useCaller } from "../contexts/CallerContext";

const BirthdayList = () => {
  const [division, setDivision] = useState("");
  const [divisions, setDivisions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { birhdaylist, fetchedDocuments, count } = useCaller();
  const [buttondisable, setButtondisable] = useState(false);

  useEffect(() => {
    birhdaylist(division);
  }, [division]);

  const renderItem = ({ item }) => (
    <View>
      <Text>{item.familyhead.name}</Text>
      <Text>{item.familyhead.familyHeadBirthdate}</Text>
    </View>
  );

  useEffect(() => {
    const getjsondata = async () => {
      setLoading(true);
      const url = "https://thejunghare.github.io/survey-app/src/json/data.json";
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Response status: ${response.status}`);
        }
        const json = await response.json();
        setDivisions(json);
      } catch (error) {
        console.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    getjsondata();
  }, []);

  const handleDivisionChange = (itemValue) => {
    setDivision(itemValue);
    // console.log(`selected division: ${division}`)
  };

  async function getlist() {
    setButtondisable(true);
    await birhdaylist(division);
    setButtondisable(false);
    /*  try {
      if (division === "" || ward === "" || area === "" || building === "") {
        showToast();
      } else {
        await fetchlist(division, ward, area, building);
      }
    } catch (error) {
      console.error(error.message);
    } finally {
      setButtondisable(false);
    } */
  }

  if (loading) {
    return (
      <View className="w-screen h-screen  flex items-center justify-center">
        <ActivityIndicator size="large" animating={true} color="#0000ff" />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 p-3 bg-white">
      <ScrollView>
        <Text className="text-xs font-bold px-5 py-2 text-red-500">
          Options:
        </Text>

        <View className="flex flex-row items-center justify-evenly m-2">
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={division}
              onValueChange={handleDivisionChange}
              style={styles.picker}
              mode="dropdown"
            >
              <Picker.Item label="Division *" value="" />
              {divisions.map((division) => (
                <Picker.Item
                  key={division.id}
                  label={division.name}
                  value={division.name}
                />
              ))}
            </Picker>
          </View>

          <Button
            icon="database-search-outline"
            mode="contained"
            buttonColor="#ED2939"
            onPress={getlist}
            className="my-2 w-2/4 m-auto"
            loading={buttondisable}
          >
            Search
          </Button>
        </View>

        <View style={{ flex: 1, padding: 16 }}>
          {loading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : (
            <FlatList
              data={fetchedDocuments}
              keyExtractor={(item) => item.$id}
              renderItem={renderItem}
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  pickerContainer: {
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
  },
  picker: {
    height: 42,
    width: 170,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 5,
  },
});

export default BirthdayList;
