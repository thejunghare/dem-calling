import React, { useEffect, useState } from "react";
import {
  FlatList,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  Alert
} from "react-native";
import { useCaller } from "../contexts/CallerContext";
// import { useUser } from "../contexts/UserContext";
import { Button, Checkbox, Badge, Chip } from "react-native-paper";
import { Picker } from "@react-native-picker/picker";
import Toast from 'react-native-toast-message';

export default function DataFetchingScreen({ navigation }) {
  // const user = useUser();
  const { fetchlist, fetchedDocuments, details, count } = useCaller();

  const [division, setDivision] = useState("");
  const [ward, setWard] = useState("");
  const [area, setArea] = useState("");
  const [building, setBuilding] = useState("");
  const [divisions, setDivisions] = useState([]);
  const [wards, setWards] = useState([]);
  const [areas, setAreas] = useState([]);
  const [buildings, setBuildings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [buttondisable, setButtondisable] = useState(false);
  //const [filterAll, setFilterAll] = useState(true);
  //const [filterNoAnswer, setFilterNoAnswer] = useState(false);

  const handleDivisionChange = (itemValue) => {
    setDivision(itemValue);
    // console.log(`selected division: ${division}`)

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
    let backgroundColor, color;

    switch (item.calling_status) {
      case 'no_answer':
        backgroundColor = '#FF4F00'; //orange
        color = '#FFFFFF';
        break;
      case 'recall':
        backgroundColor = '#FFBF00'; //yellow
        color = '#000000';
        break;
      case 'complete':
        backgroundColor = '#6CB4EE'; //blue
        color = '#FFFFFF';
        break;
      case 'decline':
        backgroundColor = '#ED2939'; //red
        color = '#FFFFFF';
        break;
      default:
        backgroundColor = '#F4F0EC'; // white smoke
        color = '#000000';
    }

    return (
      <TouchableOpacity
        onPress={() => details(item.$id, navigation)}
      >
        <View className='flex flex-row items-center justify-evenly'>
          <Text
            className={`rounded-lg shadow-md font-medium text-base p-3 m-3 w-3/5`}
            style={{ backgroundColor, color }}
          >
            {item.roomNumber}
          </Text>
          {item.verification ? (
            <Chip icon="information" mode="outlined">Verified</Chip>
          ) : (
            <Chip icon="information" mode="outlined">Pending</Chip>
          )}
        </View>
      </TouchableOpacity>
    );
  };

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

  const showToast = () => {
    Toast.show({
      type: 'info',
      text1: 'Options not selected!',
      position: 'bottom'
    });
  }

  async function getlist() {
    setButtondisable(true);
    try {
      if (division === '' || ward === '' || area === '' || building === '') {
        showToast();
      } else {
        await fetchlist(division, ward, area, building);
      }
    } catch (error) {
      console.error(error.message);
    } finally {
      setButtondisable(false);
    }
  }


  if (loading) {
    return (
      <View className='w-screen h-screen  flex items-center justify-center'>
        <ActivityIndicator size="large" animating={true} color="#0000ff" />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 p-3 bg-white">
      <ScrollView>
        <Text className="text-xs font-bold px-5 py-2 text-red-500">Options:</Text>

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

        <View className="flex flex-row items-center justify-evenly my-5">
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

        {/* <Text className="text-xs font-bold px-5 py-2 text-red-500">Filters:</Text> */}

        {/* <View className="flex flex-row items-center justify-around">
          <Checkbox.Item
            label="All"
            status={filterAll ? 'checked' : 'unchecked'}
            onPress={() => {
              setFilterAll(true);
              fetchlist();
            }}
          />
          <Checkbox.Item label="Completed" status="unchecked" />
          <Checkbox.Item label="Recall" status="unchecked" />
        </View>
        <View className="flex flex-row items-center justify-around">
          <Checkbox.Item label="Decline" status="unchecked" />
          <Checkbox.Item
            label="No answer"
            status={filterNoAnswer ? 'checked' : 'unchecked'}
            onPress={() => {
              setFilterNoAnswer(true);
              fetchlist();
            }}
          />
        </View> */}

        <Button
          icon="database-search-outline"
          mode="contained"
          buttonColor="#ED2939"
          onPress={getlist}
          className='my-2 w-2/4 m-auto'
          loading={buttondisable}
        >
          Search
        </Button>

        {/*  <Text className="text-xs font-bold text-red-500 px-5 pt-2">
          Documents fetched: {count}
        </Text> */}

        <Text className="text-xs font-bold px-5 py-2 text-red-500">Surveys: {count}</Text>

        <View className="h-15">
          <FlatList
            data={fetchedDocuments}
            keyExtractor={(item) => item.$id}
            renderItem={renderItem}
            ListEmptyComponent={
              <Text className="border w-2/4 m-auto font-semibold text-sm p-3 my-3 rounded text-center">
                No documents found
              </Text>
            }
          />
        </View>
      </ScrollView>
    </SafeAreaView>
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
