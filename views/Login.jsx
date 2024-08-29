import React, { useState } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { useUser } from "../contexts/UserContext";
import { Button, TextInput, Icon } from 'react-native-paper';

export default function LoginScreen() {
  const [buttondisable, setButtondisable] = useState(false);
  const [secureText, setSecureText] = useState(true);
  const toggleSecureText = () => {
    setSecureText(!secureText);
  };
  const user = useUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  return (
    <View className='flex-1 p-3'>
      <View className="">
        <Image
          source={require('../assets/dem-logo-new.png')}
          style={{
            width: 200,
            height: 150,
            marginRight: "auto",
            marginLeft: "auto",
          }}
        />
      </View>
      <Text className="text-xs font-bold  py-2 text-red-500">Login</Text>
      <TextInput
        right={<TextInput.Icon icon="account" />}
        className='mb-2'
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        mode="outlined"
      />
      <TextInput
        right={
          <TextInput.Icon
            icon={'eye'}
          />
        }
        className='mb-2'
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        mode="outlined"
      />
      <View >
        <Button
          icon="login"
          mode="outlined"
          onPress={() => {

            user.login(email, password);

          }}
          className="w-2/4 m-auto"
          loading={buttondisable}
        >
          Login
        </Button>

      </View>
    </View>
  );
}


