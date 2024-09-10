// import * as React from "react";
// import { PaperProvider } from "react-native-paper";
// import RootNavigator from "./src/routes/Router";
// import { AuthProvider } from "./utils/AuthProvider";

// export default function App() {
//   return (
//     <PaperProvider>
//       <AuthProvider>
//         <RootNavigator />
//       </AuthProvider>
//     </PaperProvider>
//   );
// }

import { StyleSheet, Text, View } from "react-native";
import { UserProvider } from "./contexts/UserContext";
import { IdeasProvider } from "./contexts/SurveyContext"; // Add import
import { CallerPrvoider } from "./contexts/CallerContext";
import { Router } from "./lib/Router";
import Toast from "react-native-toast-message";
import { StatusBar } from "expo-status-bar";
import { PaperProvider } from "react-native-paper";

export default function App() {
  return (
    <PaperProvider theme={{ version: 2 }}>
      <UserProvider>
        <IdeasProvider>
          <CallerPrvoider>
            <Router />
            <StatusBar style="auto" />
            <Toast />
          </CallerPrvoider>
        </IdeasProvider>
      </UserProvider>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
