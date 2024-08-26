import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Linking,
  FlatList,
} from "react-native";
import { IconButton, TextInput, Button } from "react-native-paper";
import { Picker } from "@react-native-picker/picker";
import { useCaller } from "../contexts/CallerContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUser } from "../contexts/UserContext";
import * as Clipboard from "expo-clipboard";

export default function DocumentDetailScreen({ route, navigation }) {
  const { survey } = route.params;
  const { update } = useCaller();
  const user = useUser();

  const [callingStatus, setCallingStatus] = useState();
  const [callingRemark, setCallingRemark] = useState();
  const [verification, setVerification] = useState(false);

  const familyHeadData = JSON.parse(survey.familyhead);
  //console.log(`Caste: ${familyHeadData.caste}`);
  console.log(`updated : ${survey.$updatedAt}`);
  //console.log(typeof (survey.$updatedAt))

  const [members, setMembers] = useState([]);

  const parseMembers = () => {
    try {
      const parsedMembers = JSON.parse(survey.members);
      setMembers(parsedMembers);
    } catch (error) {
      console.error("Error parsing members:", error);
    }
  };

  // Component to render a single member item
  const renderMemberItem = ({ item }) => {
    return (
      <View
        style={{
          borderBottomWidth: 1,
          borderColor: "red",
          borderTopWidth: 1,
        }}
      >
        <TextInput
          value={item.memberId}
          style={styles.input}
          mode="outlined"
          label="Member ID"
          disabled={true}
        />
        <TextInput
          value={item.memberName}
          style={styles.input}
          mode="outlined"
          label="Full Name"
        />
        <TextInput
          value={item.memberBirthdate}
          style={styles.input}
          mode="outlined"
          label="Birthdate"
        />
        <TextInput
          value={item.memberMobileNumber}
          style={styles.input}
          mode="outlined"
          label="Mobile Number"
        />
        <TextInput
          value={item.memberEducation}
          style={styles.input}
          mode="outlined"
          label="Education"
        />
        <TextInput
          value={item.voter}
          style={styles.input}
          mode="outlined"
          label="Voter"
        />
        <TextInput
          value={item.memberAge}
          style={styles.input}
          mode="outlined"
          label="Age"
        />
        <TextInput
          value={item.voterPoll}
          style={styles.input}
          mode="outlined"
          label="Voter Poll"
        />
        <TextInput
          value={item.voterPollArea}
          style={styles.input}
          mode="outlined"
          label="Voter Poll Area"
        />
        <TextInput
          value={item.newVoterRegistration}
          style={styles.input}
          mode="outlined"
          label="New Registration"
        />
      </View>
    );
  };

  useEffect(() => {
    parseMembers();
  }, [survey.members]);

  // copy survey ID
  const copySurveyIdToClipboard = async () => {
    await Clipboard.setStringAsync(survey.$id);
  };

  // copy employee ID
  const copyEmployeeIdToClipboard = async () => {
    await Clipboard.setStringAsync(survey.employeeId);
  };

  const handleVerifyDocument = async () => {
    const DOCUMENT_ID = survey.$id;
    const VERFICATIONEMPLOYEEID = user.current.$id;
    setVerification(true);
    //console.log(DOCUMENT_ID);
    console.log(VERFICATIONEMPLOYEEID)

    const DATA = {
      calling_remark: callingRemark,
      calling_status: callingStatus,
      verification: verification,
      verification_employee_id: VERFICATIONEMPLOYEEID,
    };

    await update(DOCUMENT_ID, DATA);
  };

  if (!survey || !survey.familyhead) {
    return <Text>Loading...</Text>;
  }

  return (
    <SafeAreaView className="flex-1 px-3">
      <ScrollView>
        <Text className="text-xs font-bold px-3 pb-2">Area Information</Text>
        <View className="p-4 bg-white rounded-lg shadow-md">
          <View className="flex-row mb-2">
            <Text className="text-base font-semibold ">Division:</Text>
            <Text className="text-base ml-2">{survey.division}</Text>
          </View>

          <View className="flex-row mb-2">
            <Text className="text-base font-semibold ">Ward:</Text>
            <Text className="text-base ml-2">{survey.ward}</Text>
          </View>

          <View className="flex-row mb-2">
            <Text className="text-base font-semibold">Area:</Text>
            <Text className="text-base ml-2">{survey.area}</Text>
          </View>

          <View className="flex-row">
            <Text className="text-base font-semibold">Building:</Text>
            <Text className="text-base ml-2">{survey.building}</Text>
          </View>
        </View>

        <Text className="text-xs font-bold px-3 pt-2">Survey Information</Text>
        <View className="p-4 bg-white rounded-lg mt-2">
          <View className="flex-row mb-2 items-center">
            <Text className="text-base font-semibold">Survey ID:</Text>
            <Text className="text-base ml-2"> {survey.$id}</Text>
            <IconButton
              icon="content-copy"
              iconColor={"black"}
              size={20}
              onPress={copySurveyIdToClipboard}
            />
          </View>

          <Text className="text-base ml-2">{survey.$updatedAt}</Text>

          <View className="flex-row items-center">
            <Text className="text-base font-semibold ">Employee ID:</Text>
            <Text className="text-base ml-2">{survey.employeeId}</Text>
            <IconButton
              icon="content-copy"
              iconColor={"black"}
              size={20}
              onPress={copyEmployeeIdToClipboard}
            />
          </View>
        </View>

        <Text className="text-xs font-bold px-3 pt-2">
          Unmutable Information
        </Text>
        <View className="p-4 bg-white rounded-lg mt-2">
          <View className="flex-row">
            <Text className="text-base font-semibold">Room Number:</Text>

            <Text className="text-base ml-2"> {survey.roomNumber}</Text>
          </View>
        </View>

        <Text className="text-xs font-bold px-3 pt-2">
          Collected Information
        </Text>
        {/* native place */}
        <TextInput
          label="Native Place"
          value={survey.native}
          style={styles.input}
          mode="outlined"
        />

        {/* family head name */}
        <TextInput
          label="Family Head Full Name"
          value={familyHeadData.familyHeadName}
          style={styles.input}
          mode="outlined"
        />

        {/* family head phone number */}
        <TextInput
          label="Family Head Phone Number"
          value={familyHeadData.familyHeadMobileNumber}
          style={styles.input}
          mode="outlined"
        />

        {/* family head age */}
        <TextInput
          label="Family Head Age"
          value={familyHeadData.familyHeadAge}
          style={styles.input}
          mode="outlined"
        />

        {/* family head education */}
        <TextInput
          label="Family Head Education"
          value={familyHeadData.familyHeadEducation}
          style={styles.input}
          mode="outlined"
        />

        {/* family head voter */}
        <TextInput
          label="Voter"
          value={familyHeadData.voter}
          style={styles.input}
          mode="outlined"
        />
        <Text className="text-xs font-bold px-3 pt-2">Member Information</Text>
        <FlatList
          data={members}
          renderItem={renderMemberItem}
          keyExtractor={(item) => item.memberId}
        />

        {/* survey remark */}
        <TextInput
          label="Remark"
          value={survey.surveyRemark}
          style={styles.input}
          mode="outlined"
        />

        <Text className="text-xs font-bold px-3 pt-2">For Caller</Text>
        {/* calling status picker */}
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={callingStatus}
            mode="dropdown"
            onValueChange={(itemValue, itemIndex) =>
              setCallingStatus(itemValue)
            }
          >
            <Picker.Item label="Calling Status*" value="" />
            <Picker.Item label="Complete" value="complete" />
            <Picker.Item label="Decline" value="decline" />
            <Picker.Item label="No Answer" value="no_answer" />
            <Picker.Item label="Recall" value="recall" />
          </Picker>
        </View>

        {/* calling remark */}
        <TextInput
          label="Call Remark*"
          value={callingRemark}
          style={styles.input}
          mode="outlined"
          onChangeText={(callingRemark) => setCallingRemark(callingRemark)}
        />

        {/*buttons */}
        <View className="flex flex-row items-center justify-around m-3">
          <Button
            icon="call-made"
            buttonColor="green"
            mode="contained"
            onPress={() =>
              Linking.openURL(`tel:${familyHeadData.familyHeadMobileNumber}`)
            }
          >
            Call
          </Button>

          <Button
            icon="account-plus-outline"
            buttonColor="orange"
            mode="contained"
            onPress={() =>
              Linking.openURL(`tel:${familyHeadData.familyHeadMobileNumber}`)
            }
          >
            Add
          </Button>

          <Button
            icon="file-edit-outline"
            buttonColor="blue"
            mode="contained"
            onPress={handleVerifyDocument}
          >
            Update
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  input: {
    marginVertical: 5,
  },
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
