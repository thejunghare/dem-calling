import { ID } from "react-native-appwrite";
import { createContext, useContext, useEffect, useState } from "react";
import { account } from "../lib/appwrite";
import { toast } from "../lib/toast";
import Toast from 'react-native-toast-message';

const UserContext = createContext();

export function useUser() {
  return useContext(UserContext);
}

export function UserProvider(props) {
  const [user, setUser] = useState(null);

  async function login(email, password) {
    try {
      const loggedIn = await account.createEmailPasswordSession(email, password);
      setUser(loggedIn);
      Toast.show({
        type: 'success',
        text1: 'Login Success!',
        text2: 'Welcome back',
        position: 'bottom'
      });
    } catch (error) {
      //console.error(error);
      Toast.show({
        type: 'error',
        text1: 'Invalid login details!',
        position: 'bottom'
      });
    }
  }

  async function logout() {
    await account.deleteSession("current");
    setUser(null);
    //toast("Logged out");
    Toast.show({
      type: 'success',
      text1: 'Logged out',
      text2: 'See you soon!',
      position: 'bottom'
    });
  }

  /* async function register(email, password) {
    await account.create(ID.unique(), email, password);
    await login(email, password);
    toast("Account created");
  } */

  async function init() {
    try {
      const loggedIn = await account.get();
      setUser(loggedIn);
      toast("Welcome back. You are logged in");
    } catch (err) {
      setUser(null);
    }
  }

  useEffect(() => {
    init();
  }, []);

  return (
    <UserContext.Provider
      value={{ current: user, login, logout, toast }}
    >
      {props.children}
    </UserContext.Provider>
  );
}
