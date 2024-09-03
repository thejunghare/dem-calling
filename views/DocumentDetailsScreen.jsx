import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Linking,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { IconButton, TextInput, Button } from "react-native-paper";
import { Picker } from "@react-native-picker/picker";
import { useCaller } from "../contexts/CallerContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUser } from "../contexts/UserContext";
import * as Clipboard from "expo-clipboard";
import DateTimePicker from '@react-native-community/datetimepicker';
import Toast from 'react-native-toast-message';

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

  // family data
  const [familyheadname, setFamilyheadname] = useState(familyHeadData.familyHeadName);
  const [familyheadphonenumber, setFamilyheadphonenumber] = useState(familyHeadData.familyHeadMobileNumber);
  const [familyheadeducation, setFamilyHeadEducation] = useState(familyHeadData.familyHeadEducation);
  const [caste, setCaste] = useState(familyHeadData.caste);
  const [birthdate, setBirthdate] = useState(familyHeadData.familyHeadBirthdate);
  const [age, setAge] = useState(familyHeadData.familyHeadAge);
  const [familyheadvoterpoll, setFamilyheadvoterpoll] = useState(familyHeadData.voterPoll);
  const [familyheadvoterpollarea, setFamilyheadvoterpollarea] = useState(familyHeadData.voterPollArea);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [updatedDate, setUpdatedate] = useState();

  const handleBirthdateChange = (event, selectedDate) => {
    //const currentDate = selectedDate || new Date();
    setShowDatePicker(false);

    if (selectedDate) {
      const birthdate = selectedDate.toISOString().split('T')[0]; // Format the date as YYYY-MM-DD
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
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
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
    setMembers(prevMembers =>
      prevMembers.map(member =>
        member.memberId === memberId ? { ...member, [field]: value } : member
      )
    );
  }

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
          onChangeText={(text) => handlememberschange(text, item.memberId, 'memberName')}
        />
        <TextInput
          value={item.memberBirthdate}
          style={styles.input}
          mode="outlined"
          label="Birthdate"
          onChangeText={(text) => handlememberschange(text, item.memberId, 'memberBirthdate')}
        />
        <TextInput
          value={item.memberMobileNumber}
          style={styles.input}
          mode="outlined"
          label="Mobile Number"
          onChangeText={(text) => handlememberschange(text, item.memberId, 'memberMobileNumber')}
        />
        <TextInput
          value={item.memberEducation}
          style={styles.input}
          mode="outlined"
          label="Education"
          onChangeText={(text) => handlememberschange(text, item.memberId, 'memberEducation')}
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
          onChangeText={(text) => handlememberschange(text, item.memberId, 'memberAge')}
        />
        <TextInput
          value={item.voterPoll}
          style={styles.input}
          mode="outlined"
          label="Voter Poll"
          onChangeText={(text) => handlememberschange(text, item.memberId, 'voterPoll')}
        />
        <TextInput
          value={item.voterPollArea}
          style={styles.input}
          mode="outlined"
          label="Voter Poll Area"
          onChangeText={(text) => handlememberschange(text, item.memberId, 'voterPollArea')}
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
      voterPoll: familyheadvoterpoll,
      voterPollArea: familyheadvoterpoll
    }
    setVerification(true);
    //console.log(DOCUMENT_ID);
    //console.log(VERFICATIONEMPLOYEEID)

    function currentdate() {
      const date = new Date();
      const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
      return date.toLocaleString('en-US', options);
    }

    const updatedDate = currentdate()
    setUpdatedate(updatedDate)
    console.log(updatedDate);

    const DATA = {
      familyhead: JSON.stringify(updatedfamilydata),
      members: JSON.stringify(members),
      native: nativeplace,
      memberCount: membercount,
      surveyRemark: surveyremark,
      calling_remark: callingRemark,
      calling_status: callingStatus,
      verification: verification,
      verification_employee_id: VERFICATIONEMPLOYEEID,
      verified_at: updatedDate,
    };


    if (!VERFICATIONEMPLOYEEID || !updatedDate || callingRemark == '' || !callingStatus) {
      const showErrorToast = () => {
        Toast.show({
          type: 'error',
          text1: 'Field required',
          text2: 'fields are required unless marked optional!',
          position: 'bottom'
        });
      }
      showErrorToast();
      setButtondisable(false);
    } else {
      if (await update(DOCUMENT_ID, DATA))
        setButtondisable(false);
    }

    setButtondisable(false);
  };

  if (!survey || !survey.familyhead) {
    return (
      <View className='w-screen h-screen  flex items-center justify-center'>
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
          // value={familyHeadData.familyHeadMobileNumber}
          value={familyheadphonenumber}
          onChangeText={(text) => setFamilyheadphonenumber(text)}
          style={styles.input}
          mode="outlined"
        />

        <TextInput
          label="Family Head Birthdate"
          value={birthdate}
          style={styles.input}
          mode="outlined"
          onChangeText={(text) => setBirthdate(text)}
        />


        {/* family head age */}
        <TextInput
          label="Family Head Age"
          value={age}
          style={styles.input}
          mode="outlined"
          onChangeText={(text) => setAge(text)}
        />

        {/* family head education */}
        <TextInput
          label="Family Head Education"
          //value={familyHeadData.familyHeadEducation}
          value={familyheadeducation}
          onChangeText={(text) => setFamilyHeadEducation(text)}
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

        {/* voter poll */}
        <TextInput
          label="Family Head Voter Poll"
          //value={familyHeadData.familyHeadEducation}
          value={familyheadvoterpoll}
          onChangeText={(text) => setFamilyheadvoterpoll(text)}
          style={styles.input}
          mode="outlined"
        />

        {/* voter poll area */}
        <TextInput
          label="Family Head Voter Poll Area"
          //value={familyHeadData.familyHeadEducation}
          value={familyheadvoterpollarea}
          onChangeText={(text) => setFamilyheadvoterpollarea(text)}
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
        <View className="flex flex-row items-center justify-around m-3">
          <Button
            icon="call-made"
            buttonColor="#03C03C"
            mode="contained"
            onPress={() =>
              Linking.openURL(`tel:${familyHeadData.familyHeadMobileNumber}`)
            }
          >
            Call
          </Button>

          <Button
            icon="file-edit-outline"
            buttonColor="#6CB4EE"
            mode="contained"
            onPress={handleVerifyDocument}
            loading={buttondisable}
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
