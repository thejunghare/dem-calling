import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Linking,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { IconButton, TextInput, Button } from "react-native-paper";
import { Picker } from "@react-native-picker/picker";
import { useCaller } from "../contexts/CallerContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUser } from "../contexts/UserContext";
import * as Clipboard from "expo-clipboard";
import DateTimePicker from "@react-native-community/datetimepicker";
import Toast from "react-native-toast-message";
//import { getlist } from "./FetchDataForCalling";

export default function DocumentDetailScreen({ route, navigation }) {
  const { survey } = route.params;
  const { update } = useCaller();
  const user = useUser();

  const familyHeadData = JSON.parse(survey.familyhead);
  // console.info(`family head json: ${familyHeadData}`);
  const [buttondisable, setButtondisable] = useState(false);
  // calling employee verification
  const [callingStatus, setCallingStatus] = useState(survey.calling_status);
  const [callingRemark, setCallingRemark] = useState(survey.calling_remark);
  const [verification, setVerification] = useState(false);

  // indivual data
  const [nativeplace, setNativeplace] = useState(survey.native);
  const [surveyremark, setSurveyremark] = useState(survey.surveyRemark);
  const [membercount, setMembercount] = useState(survey.memberCount);
  const [roomNumber, setRoomNumber] = useState(survey.roomNumber);

  // family data
  const [familyheadname, setFamilyheadname] = useState(
    familyHeadData.familyHeadName
  );
  const [familyheadphonenumber, setFamilyheadphonenumber] = useState(
    familyHeadData.familyHeadMobileNumber
  );
  const [familyheadeducation, setFamilyHeadEducation] = useState(
    familyHeadData.familyHeadEducation
  );
  const [caste, setCaste] = useState(familyHeadData.caste);
  const [birthdate, setBirthdate] = useState(
    familyHeadData.familyHeadBirthdate
  );
  const [age, setAge] = useState(familyHeadData.familyHeadAge);
  const [voter, setVoter] = useState(familyHeadData.voter);
  const [newVoter, setNewVoter] = useState(familyHeadData.newVoterRegistration);
  const [familyheadvoterpoll, setFamilyheadvoterpoll] = useState(
    familyHeadData.voterPoll
  );
  const [familyheadvoterpollarea, setFamilyheadvoterpollarea] = useState(
    familyHeadData.voterPollArea
  );

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showMemberDatePicker, setMemberShowDatePicker] = useState({});
  const [updatedDate, setUpdatedate] = useState();

  // for family head
  const handleBirthdateChange = (event, selectedDate) => {
    setShowDatePicker(false);

    if (selectedDate) {
      const birthdate = selectedDate.toISOString().split("T")[0]; // Format the date as YYYY-MM-DD
      const age = calculateAge(selectedDate); // Calculate the age
      setBirthdate(birthdate);
      setAge(age.toString());
    }
  };

  const calculateAge = (birthdate) => {
    const today = new Date();
    const birthDate = new Date(birthdate);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  const [members, setMembers] = useState([]);

  useEffect(() => {
    parseMembers();
  }, [survey.members]);

  const parseMembers = () => {
    try {
      const parsedMembers = JSON.parse(survey.members);
      setMembers(parsedMembers);
    } catch (error) {
      console.error("Error parsing members:", error);
      // TODO add alert
    }
  };

  const handlememberschange = (value, memberId, field) => {
    setMembers((prevMembers) =>
      prevMembers.map((member) =>
        member.memberId === memberId ? { ...member, [field]: value } : member
      )
    );
  };

  // Component to render a single member item
  const renderMemberItem = ({ item }) => {
    return (
      <View>
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
          onChangeText={(text) =>
            handlememberschange(text, item.memberId, "memberName")
          }
        />

        {/* <TextInput
          value={item.memberBirthdate}
          style={styles.input}
          mode="outlined"
          label="Birthdate"
          onChangeText={(text) => handlememberschange(text, item.memberId, 'memberBirthdate')}
        /> */}

        {/* <TextInput
          value={item.memberAge}
          style={styles.input}
          mode="outlined"
          label="Age"
          onChangeText={(text) => handlememberschange(text, item.memberId, 'memberAge')}
        /> */}

        <TextInput
          value={item.memberMobileNumber}
          style={styles.input}
          mode="outlined"
          label="Mobile Number"
          onChangeText={(text) =>
            handlememberschange(text, item.memberId, "memberMobileNumber")
          }
        />

        <TextInput
          value={item.memberEducation}
          style={styles.input}
          mode="outlined"
          label="Education"
          onChangeText={(text) =>
            handlememberschange(text, item.memberId, "memberEducation")
          }
        />

        <View key={item.memberId} className="">
          <TouchableOpacity
            onPress={() => showMemberDatePickerModal(item.memberId)}
          >
            <TextInput
              value={item.memberBirthdate || ""}
              placeholder="Birthdate"
              label="Birthdate"
              editable={false}
              mode="outlined"
              style={styles.input}
            />
          </TouchableOpacity>
          {showMemberDatePicker[item.memberId] && (
            <DateTimePicker
              value={new Date(item.memberBirthdate || new Date())}
              mode="date"
              display="spinner"
              editable={false}
              onChange={(event, date) =>
                handleMemberDateChange(item.memberId, event, date)
              }
            />
          )}
          <TextInput
            mode="outlined"
            style={styles.input}
            value={item.memberAge || ""}
            label="Age"
            keyboardType="numeric"
            editable={false}
          />
        </View>

        <Text className="text-xs font-bold px-3 my-2">Are You A voter?</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={item.voter}
            onValueChange={(value) =>
              handlememberschange(value, item.memberId, "voter")
            }
          >
            <Picker.Item label="Are You A voter?" value="" />
            <Picker.Item label="Yes" value="yes" />
            <Picker.Item label="No" value="no" />
          </Picker>
        </View>

        {item.voter === "no" ? (
          <View>
            <Text className="text-xs font-bold px-3 my-2">
              Register As New Voter?
            </Text>

            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={item.newVoterRegistration}
                onValueChange={(value) =>
                  handlememberschange(
                    value,
                    item.memberId,
                    "newVoterRegistration"
                  )
                }
              >
                <Picker.Item label="Register As New Voter" value="" />
                <Picker.Item label="Yes" value="yes" />
                <Picker.Item label="No" value="no" />
              </Picker>
            </View>
          </View>
        ) : (
          <>
            <TextInput
              value={item.voterPoll}
              style={styles.input}
              mode="outlined"
              label="Voter Poll"
              onChangeText={(text) =>
                handlememberschange(text, item.memberId, "voterPoll")
              }
            />
            <TextInput
              value={item.voterPollArea}
              style={styles.input}
              mode="outlined"
              label="Voter Poll Area"
              onChangeText={(text) =>
                handlememberschange(text, item.memberId, "voterPollArea")
              }
            />
          </>
        )}

        {item.isNew && (
          <Button
            icon="account-remove-outline"
            buttonColor="#C51E3A"
            mode="contained"
            onPress={() => removeMember(item.memberId)}
            className="w-2/4 m-auto"
          >
            Remove
          </Button>
        )}
      </View>
    );
  };

  const addMember = () => {
    const newMemberId = members.length + 1;
    const newMember = {
      memberId: newMemberId.toString(),
      memberName: "",
      memberBirthdate: "",
      memberMobileNumber: "",
      memberEducation: "",
      voter: "",
      memberAge: "",
      voterPoll: "",
      voterPollArea: "",
      newVoterRegistration: "",
      isNew: true,
    };

    setMembers([...members, newMember]);
  };

  const removeMember = (memberId) => {
    setMembers((prevMembers) =>
      prevMembers.filter((member) => member.memberId !== memberId)
    );
  };

  // for members birthdate
  const showMemberDatePickerModal = (memberId) => {
    setMemberShowDatePicker({
      ...showMemberDatePicker,
      [memberId]: true,
    });
  };

  // for members birthdate
  const handleMemberDateChange = (memberId, event, selectedDate) => {
    if (event.type === "set") {
      const currentDate =
        selectedDate ||
        new Date(
          members.find((member) => member.memberId === memberId)
            .memberBirthdate || new Date()
        );
      const birthdate = new Date(currentDate);

      const newMembers = members.map((member) =>
        member.memberId === memberId
          ? {
              ...member,
              memberBirthdate: birthdate.toISOString().split("T")[0],
              memberAge: (
                new Date().getFullYear() - birthdate.getFullYear()
              ).toString(),
            }
          : member
      );

      setMembers(newMembers);
    }

    setMemberShowDatePicker({
      ...showDatePicker,
      [memberId]: false,
    });
  };

  // copy survey ID
  const copySurveyIdToClipboard = async () => {
    await Clipboard.setStringAsync(survey.$id);
  };

  // copy employee ID
  const copyEmployeeIdToClipboard = async () => {
    await Clipboard.setStringAsync(survey.employeeId);
  };

  const handleVerifyDocument = async () => {
    setButtondisable(true);
    const DOCUMENT_ID = survey.$id;
    const VERFICATIONEMPLOYEEID = user.current.$id;
    console.log(VERFICATIONEMPLOYEEID);

    const updatedfamilydata = {
      ...familyHeadData,
      familyHeadName: familyheadname,
      familyHeadMobileNumber: familyheadphonenumber,
      familyHeadEducation: familyheadeducation,
      familyHeadBirthdate: birthdate,
      familyHeadAge: age,
      caste: caste,
      voter: voter,
      newVoterRegistration: newVoter,
      voterPoll: familyheadvoterpoll,
      voterPollArea: familyheadvoterpoll,
    };
    if (callingStatus == "complete") {
      setVerification(true);
    }
    //console.log(DOCUMENT_ID);
    //console.log(VERFICATIONEMPLOYEEID)

    function currentdate() {
      const date = new Date();
      const options = {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      };
      return date.toLocaleString("en-US", options);
    }

    const updatedDate = currentdate();
    setUpdatedate(updatedDate);
    //console.log(updatedDate);

    const DATA = {
      familyhead: JSON.stringify(updatedfamilydata),
      members: JSON.stringify(members),
      native: nativeplace,
      roomNumber: roomNumber,
      memberCount: membercount,
      surveyRemark: surveyremark,
      calling_remark: callingRemark,
      calling_status: callingStatus,
      verification: verification,
      verification_employee_id: VERFICATIONEMPLOYEEID,
      verified_at: updatedDate,
    };

    if (
      !VERFICATIONEMPLOYEEID ||
      !updatedDate ||
      callingRemark == "" ||
      !callingStatus
    ) {
      const showErrorToast = () => {
        Toast.show({
          type: "error",
          text1: "Field required",
          text2: "fields are required unless marked optional!",
          position: "bottom",
        });
      };
      showErrorToast();
      setButtondisable(false);
    } else {
      if (await update(DOCUMENT_ID, DATA)) setButtondisable(false);
      navigation.goBack();
      // await getlist();
    }

    setButtondisable(false);
  };

  if (!survey || !survey.familyhead) {
    return (
      <View className="w-screen h-screen  flex items-center justify-center">
        <ActivityIndicator size="large" animating={true} color="#0000ff" />
      </View>
    );
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

          {/* <Text className="text-base ml-2">{survey.$updatedAt}</Text> */}

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
          Collected Information
        </Text>
        {/* Room number */}
        <TextInput
          label="Room Number"
          value={roomNumber}
          onChangeText={(text) => setRoomNumber(text)}
          style={styles.input}
          mode="outlined"
        />

        {/* native place */}
        <TextInput
          label="Native Place"
          value={nativeplace}
          onChangeText={(text) => setNativeplace(text)}
          style={styles.input}
          mode="outlined"
        />

        <TextInput
          label="Member count"
          value={membercount}
          onChangeText={(text) => setMembercount(text)}
          style={styles.input}
          mode="outlined"
        />

        {/* caste */}
        <TextInput
          label="Family Caste"
          value={caste}
          onChangeText={(text) => setCaste(text)}
          style={styles.input}
          mode="outlined"
        />

        {/* family head name */}
        <TextInput
          label="Family Head Full Name"
          value={familyheadname}
          onChangeText={(text) => setFamilyheadname(text)}
          style={styles.input}
          mode="outlined"
        />

        {/* family head phone number */}
        <TextInput
          label="Family Head Phone Number"
          value={familyheadphonenumber}
          onChangeText={(text) => setFamilyheadphonenumber(text)}
          style={styles.input}
          mode="outlined"
        />

        <View>
          <TextInput
            label="Family Head Birthdate"
            value={birthdate}
            style={styles.input}
            mode="outlined"
            onFocus={() => setShowDatePicker(true)}
          />
          <TextInput
            label="Family Head Age"
            value={age}
            style={styles.input}
            mode="outlined"
            editable={false}
          />
          {showDatePicker && (
            <DateTimePicker
              value={new Date(birthdate)}
              mode="date"
              display="spinner"
              onChange={handleBirthdateChange}
            />
          )}
        </View>

        {/* family head education */}
        <TextInput
          label="Family Head Education"
          value={familyheadeducation}
          onChangeText={(text) => setFamilyHeadEducation(text)}
          style={styles.input}
          mode="outlined"
        />

        <Text className="text-xs font-bold px-3 my-2">Are You A voter?</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={voter}
            onValueChange={(value) => setVoter(value)}
          >
            <Picker.Item label="Is Voter" value="" />
            <Picker.Item label="Yes" value="yes" />
            <Picker.Item label="No" value="no" />
          </Picker>
        </View>
        {voter === "yes" ? (
          <>
            {/* voter poll */}
            <TextInput
              label="Family Head Voter Poll"
              value={familyheadvoterpoll}
              onChangeText={(text) => setFamilyheadvoterpoll(text)}
              style={styles.input}
              mode="outlined"
            />

            {/* voter register */}
            <TextInput
              label="Family Head Voter Poll Area"
              value={familyheadvoterpollarea}
              onChangeText={(text) => setFamilyheadvoterpollarea(text)}
              style={styles.input}
              mode="outlined"
            />
          </>
        ) : (
          <>
            <Text className="text-xs font-bold px-3 my-2">
              Register As New Voter?
            </Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={newVoter}
                onValueChange={(value) => setNewVoter(value)}
              >
                <Picker.Item label="New Voter Register" value="" />
                <Picker.Item label="Yes" value="yes" />
                <Picker.Item label="No" value="no" />
              </Picker>
            </View>
          </>
        )}

        {/* member */}
        <Text className="text-xs font-bold px-3 pt-2">Member Information</Text>
        <FlatList
          data={members}
          renderItem={renderMemberItem}
          keyExtractor={(item) => item.memberId}
        />

        {/* survey remark */}
        <TextInput
          label="Remark"
          value={surveyremark}
          onChangeText={(text) => setSurveyremark(text)}
          style={styles.input}
          mode="outlined"
        />

        <Text className="text-xs font-bold px-3 pt-2">For Caller</Text>
        {/* calling status picker*/}
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={callingStatus}
            mode="dropdown"
            onValueChange={(itemValue) => setCallingStatus(itemValue)}
          >
            <Picker.Item label="Calling Status*" value="" />
            <Picker.Item label="Complete" value="complete" />
            <Picker.Item label="Decline" value="decline" />
            <Picker.Item label="No Answer" value="no_answer" />
            <Picker.Item label="Recall" value="recall" />
            <Picker.Item label="Switch Off" value="switch_off" />
            <Picker.Item label="Wrong Number" value="wrong_number" />
            <Picker.Item label="Busy" value="busy" />
          </Picker>
        </View>

        {/* calling remark */}
        <TextInput
          label="Call Remark*"
          value={callingRemark}
          style={styles.input}
          mode="outlined"
          onChangeText={(text) => setCallingRemark(text)}
        />

        {/*buttons */}
        <View className="flex flex-row items-center justify-evenly m-3">
          <Button
            icon="call-made"
            buttonColor="#03C03C"
            mode="contained"
            onPress={() =>
              Linking.openURL(`tel:${familyHeadData.familyHeadMobileNumber}`)
            }
          >
            Make Call
          </Button>

          <Button
            icon="plus"
            buttonColor="#C51E3A"
            mode="contained"
            onPress={() => addMember()}
          >
            Add Member
          </Button>
        </View>

        <View className="my-3">
          <Button
            icon="square-edit-outline"
            buttonColor="#6CB4EE"
            mode="contained"
            onPress={handleVerifyDocument}
            loading={buttondisable}
            className="m-auto w-2/4"
          >
            Update Form
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
