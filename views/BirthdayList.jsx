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
import * as Clipboard from "expo-clipboard";

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

  const copy_birthday_info = async () => {
    const info = `Name: ${familyHeadData.familyHeadName}, Address: ${item.roomNumber}, ${item.building}, ${item.area}, ${item.division}, DOB: ${familyHeadData.familyHeadBirthdate}`;
    await Clipboard.setStringAsync(info);
  };

  const renderItem = useCallback(({ item }) => {
    const familyHeadData = JSON.parse(item.familyhead);
    let memberArray = [];

    const copy_birthday_info = async () => {
      const info = `Name: ${familyHeadData.familyHeadName}, Address: ${item.roomNumber}, ${item.building}, ${item.area}, ${item.division}, DOB: ${familyHeadData.familyHeadBirthdate}, Phone: ${familyHeadData.familyHeadMobileNumber}`;
      await Clipboard.setStringAsync(info);
    };

    // Check if the 'member' field is a string or an array
    if (typeof item.member === "string") {
      try {
        memberArray = JSON.parse(item.member);
      } catch (e) {
        console.error("Error parsing member array:", e);
      }
    } else if (Array.isArray(item.member)) {
      memberArray = item.member;
    }

    return (
      <View className="flex flex-row items-center justify-between my-2.5 w-full">
        <View className="w-4/5 bg-white p-2.5 rounded-md">
          {/* Family Head Information */}
          <Text>Name: {familyHeadData.familyHeadName}</Text>
          <Text>
            Add: {item.roomNumber}, {item.building}, {item.area},{" "}
            {item.division}
          </Text>
          <Text>DOB: {familyHeadData.familyHeadBirthdate}</Text>

          <Text>Phone: {familyHeadData.familyHeadMobileNumber}</Text>

          {/* Render Members */}
          {memberArray.length > 0 &&
            memberArray.map((member, index) => (
              <View key={index} className="mt-2">
                <Text>Member Name: {member.memberName}</Text>
                <Text>Member DOB: {member.memberBirthdate}</Text>
                <Text>Member Mobile: {member.memberMobileNumber}</Text>
              </View>
            ))}
        </View>

        <View className="flex items-center w-1/6">
          {/* Call and WhatsApp for Family Head */}
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

          <IconButton
            icon="content-copy"
            iconColor={"black"}
            size={20}
            onPress={copy_birthday_info}
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
        const showErrorToast = () => {
          Toast.show({
            type: "info",
            text1: "Options not selected!",
            text2: "Try selecting options",
            position: "bottom",
          });
        };
        showErrorToast();
      } else {
        const showfetching = () => {
          Toast.show({
            type: "info",
            text1: "Getthng birthdate...!",
            text2: "This might take some time!",
            position: "bottom",
          });
        };
        showfetching();
        await birhdaylist(division);
      }
    } catch (error) {
      const showfetchingerror = () => {
        Toast.show({
          type: "error",
          text1: "Something went wrong!",
          text2: `Try again later! ${error}`,
          position: "bottom",
        });
      };
      showfetchingerror();
      console.error(error.message);
    } finally {
      const showfetchingsuccess = () => {
        Toast.show({
          type: "success",
          text1: "That's it!",
          text2: `List Updated!`,
          position: "bottom",
        });
      };
      showfetchingsuccess();
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

        <View className="flex flex-row w-full items-center justify-evenly m-2">
          <View style={styles.pickerContainer} className="w-2/5 mb-2">
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
            className="my-2 w-2/5 m-auto rounded-full"
            loading={buttondisable}
            style={{
              backgroundColor: theme.colors.primary,
            }}
          >
            Search
          </Button>
        </View>

        <Text className="text-xs font-bold px-5 py-2 text-red-500">
          Birthdate list: {birthdayCount}
        </Text>
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
    // borderColor: "gray",
    // borderWidth: 1,
    // borderRadius: 99,
    height: 55,
  },
  picker: {
    // height: 32,
    width: 150,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 5,
  },
});

export default BirthdayList;
