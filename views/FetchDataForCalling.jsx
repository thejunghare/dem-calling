import React, { useEffect, useState } from "react";
import {
  FlatList,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useCaller } from "../contexts/CallerContext";
import { Button, Checkbox } from "react-native-paper";
import { Picker } from "@react-native-picker/picker";

export default function DataFetchingScreen({ navigation }) {
  const { fetch, documents, details } = useCaller();
  const [division, setDivision] = useState("");
  const [ward, setWard] = useState("");
  const [area, setArea] = useState("");
  const [building, setBuilding] = useState("");
  const [divisions, setDivisions] = useState([]);
  const [wards, setWards] = useState([]);
  const [areas, setAreas] = useState([]);
  const [buildings, setBuildings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checked, setChecked] = React.useState(false);

  const handleDivisionChange = (itemValue) => {
    setDivision(itemValue);
    const selectedDivision = divisions.find((div) => div.name === itemValue);
    if (selectedDivision) {
      setWards(selectedDivision.wards);
    } else {
      setWards([]);
    }
    setWard("");
    setArea("");
    setBuilding("");
  };

  const handleWardChange = (itemValue) => {
    setWard(itemValue);
    const selectedWard = wards.find((ward) => ward.name === itemValue);
    if (selectedWard && selectedWard.areas) {
      setAreas(selectedWard.areas);
    } else {
      setAreas([]);
    }
    setArea("");
    setBuilding("");
  };

  const handleAreaChange = (itemValue) => {
    setArea(itemValue);
    const selectedArea = areas.find((area) => area.name === itemValue);
    if (selectedArea && selectedArea.buildings) {
      setBuildings(selectedArea.buildings);
    } else {
      setBuildings([]);
    }
    setBuilding("");
  };

  const handleBuildingChange = (itemValue) => {
    setBuilding(itemValue);
  };

  const renderItem = ({ item }) => {
    return (
      <View className="m-3">
        {documents && documents.length > 0 ? (
          documents.map((document) => (
            <TouchableOpacity onPress={() => details(document.$id, navigation)}>
              <Text
                className={`font-semibold text-base p-3 my-3 rounded-md ${
                  document.verification === false
                    ? "bg-red-500"
                    : document.verification === true
                      ? "bg-green-500"
                      : "bg-white"
                }`}
                key={document.$id}
              >
                Room No: {document.roomNumber}
              </Text>
            </TouchableOpacity>
          ))
        ) : (
          <Text className="bg-white font-semibold text-base p-3 my-3 rounded">
            No documents found
          </Text>
        )}
      </View>
    );
  };

  useEffect(() => {
    const getData = async () => {
      const url = "https://thejunghare.github.io/survey-app/src/json/data.json";
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Response status: ${response.status}`);
        }

        const json = await response.json();
        //console.log(json);
        setDivisions(json);
      } catch (error) {
        console.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, []);

  useEffect(() => {
    fetch();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View className="flex-1 p-3">
      {/* division picker */}
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

        {/* ward picker */}
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={ward}
            onValueChange={handleWardChange}
            style={styles.picker}
            mode="dropdown"
          >
            <Picker.Item label="Ward *" value="" />
            {wards.map((ward) => (
              <Picker.Item key={ward.id} label={ward.name} value={ward.name} />
            ))}
          </Picker>
        </View>
      </View>

      {/* area picker */}
      <View className="flex flex-row items-center justify-evenly m-2">
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={area}
            onValueChange={handleAreaChange}
            style={styles.picker}
            mode="dropdown"
          >
            <Picker.Item label="Area *" value="" />
            {areas.map((area) => (
              <Picker.Item key={area.id} label={area.name} value={area.name} />
            ))}
          </Picker>
        </View>

        {/* building picker */}
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={building}
            onValueChange={handleBuildingChange}
            style={styles.picker}
          >
            <Picker.Item label="Building *" value="" />
            {buildings.map((building) => (
              <Picker.Item
                key={building.id}
                label={building.name}
                value={building.name}
              />
            ))}
          </Picker>
        </View>
      </View>

      <View className="flex flex-row items-center justify-around">
        <Checkbox.Item label="All" status="checked" />
        <Checkbox.Item label="Completed" status="unchecked" />
        <Checkbox.Item label="Pending" status="unchecked" />
      </View>
      {/* <Button icon="book-search-outline" mode="contained" onPress={fetch}>
        Survey
      </Button> */}

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
