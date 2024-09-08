import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  FlatList,
  Linking,
} from "react-native";
import {
  Text,
  ActivityIndicator,
  Button,
  useTheme,
  IconButton,
} from "react-native-paper";
import { Picker } from "@react-native-picker/picker";
import Toast from "react-native-toast-message";
import { useCaller } from "../contexts/CallerContext";

const BirthdayList = () => {
  const theme = useTheme();
  const [division, setDivision] = useState("");
  const [divisions, setDivisions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { birhdaylist, birthdayDocs, birthdayCount } = useCaller();
  const [buttondisable, setButtondisable] = useState(false);

  useEffect(() => {
    birhdaylist(division);
  }, [division]);

  const renderItem = useCallback(({ item }) => {
    const familyHeadData = JSON.parse(item.familyhead);
    return (
      <View className="flex flex-row items-center justify-between  my-2.5 w-full">
        <View className="w-2/3 bg-white p-2.5 rounded-full">
          <Text>{familyHeadData.familyHeadName}</Text>
        </View>
        <View className="flex flex-row">
          <IconButton
            className="rounded-full"
            iconColor="#fff"
            containerColor="#3EB489"
            icon="call-made"
            size={20}
            onPress={() =>
              Linking.openURL(`tel:${familyHeadData.familyHeadMobileNumber}`)
            }
          />
          <IconButton
            className="rounded-full"
            iconColor="#fff"
            containerColor="#03C03C"
            icon="whatsapp"
            size={20}
            onPress={() =>
              Linking.openURL(
                `whatsapp://send?phone=${familyHeadData.familyHeadMobileNumber}`
              )
            }
          />
        </View>
      </View>
    );
  }, []);

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
    try {
      setButtondisable(true);
      if (division === "") {
        showToast();
      } else {
        await birhdaylist(division);
      }
    } catch (error) {
      console.error(error.message);
    } finally {
      setButtondisable(false);
    }
  }

  if (loading) {
    return (
      <View className="w-screen h-screen  flex items-center justify-center">
        <ActivityIndicator size="large" animating={true} color="#0000ff" />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 p-3">
      <ScrollView>
        <Text className="text-xs font-bold px-5 py-2 text-red-500">
          Options:
        </Text>

        <View className="flex items-center justify-evenly m-2">
          <View style={styles.pickerContainer} className="w-full mb-2">
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
            onPress={getlist}
            className="my-2 w-2/4 m-auto rounded-full"
            loading={buttondisable}
            style={{
              backgroundColor: theme.colors.primary,
            }}
          >
            Search
          </Button>
        </View>

        <View style={{ flex: 1, padding: 16 }}>
          {loading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : (
            <FlatList
              data={birthdayDocs}
              keyExtractor={(item) => item.$id}
              renderItem={renderItem}
              initialNumToRender={10}
              maxToRenderPerBatch={5}
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
    borderRadius: 99,
    height: 55,
  },
  picker: {
    // height: 32,
    width: 350,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 5,
  },
});

export default BirthdayList;
