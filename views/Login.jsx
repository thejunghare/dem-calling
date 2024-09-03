import React, { useState } from "react";
import { View, Text, Image } from "react-native";
import { useUser } from "../contexts/UserContext";
import { Button, TextInput } from 'react-native-paper';

export default function LoginScreen() {
  const [secureText, setSecureText] = useState(true);
  const user = useUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [buttondisable, setButtondisable] = useState(false); // Existing line

  const toggleSecureText = () => {
    setSecureText(!secureText);
  };

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
      <Text className="text-xs font-bold py-2 text-red-500">Login</Text>
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
            icon={secureText ? "eye" : "eye-off"}
            onPress={toggleSecureText}
          />
        }
        className='mb-2'
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={secureText}
        mode="outlined"
      />
      <View>
        <Button
          icon="login"
          mode="outlined"
          onPress={async () => {
            setButtondisable(true); // Show loading indicator

            try {
              await user.login(email, password);
            } catch (error) {
              console.error(error); // Handle the error
            } finally {
              setButtondisable(false); // Hide loading indicator
            }
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
