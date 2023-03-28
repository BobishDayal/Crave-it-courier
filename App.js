import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Amplify } from "aws-amplify";
import { withAuthenticator } from "@aws-amplify/ui-react-native";
import { LogBox } from "react-native";

import Navigation from "./src/navigation";
import awsConfig from "./src/aws-exports";
import AuthContextProvider from "./src/contexts/AuthContext";
import OrderContextProvider from "./src/contexts/OrderContext";

LogBox.ignoreLogs(["Setting a timer"]);

Amplify.configure({ ...awsConfig, Analytics: { disabled: true } });

function App() {
  return (
    <NavigationContainer>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <AuthContextProvider>
          <OrderContextProvider>
            <Navigation />
          </OrderContextProvider>
        </AuthContextProvider>
      </GestureHandlerRootView>

      <StatusBar style="auto" />
    </NavigationContainer>
  );
}

export default withAuthenticator(App);
