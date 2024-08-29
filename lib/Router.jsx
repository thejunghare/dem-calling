import { NavigationContainer } from "@react-navigation/native";
import LoginScreen from "../views/Login";
import HomeScreen from "../views/Home";
import DataFetchingScreen from "../views/FetchDataForCalling";
import DocumentDetailScreen from "../views/DocumentDetailsScreen";
import Help from "../views/Help";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useUser } from "../contexts/UserContext";

const Stack = createNativeStackNavigator();

export function Router() {
  const user = useUser();
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {user.current == null ? (
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ title: "Login", headerBackTitleVisible: false }}
          />
        ) : (
          <>
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{ title: "Home" }}
            />
            <Stack.Screen
              name="Fetch"
              component={DataFetchingScreen}
              options={{ title: "Fetch" }}
            />
            <Stack.Screen
              name="DocumentDetail"
              component={DocumentDetailScreen}
              options={{ title: "Details" }}
            />
            <Stack.Screen
              name="Help"
              component={Help}
              options={{ title: "Help" }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
