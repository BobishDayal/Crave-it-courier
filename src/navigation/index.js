import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ActivityIndicator } from "react-native";

import OrderScreen from "../screen/OrderScreen";
import OrderDelivery from "../screen/OrderDelivery";
import Profile from "../screen/ProfileScreen";
import { useAuthContext } from "../contexts/AuthContext";

const Stack = createNativeStackNavigator();

const Navigation = () => {
  const { dbCourier, loading } = useAuthContext();

  if (loading) {
    return <ActivityIndicator size={"large"} color="gray" />;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {dbCourier ? (
        <>
          <Stack.Screen name="OrderScreen" component={OrderScreen} />
          <Stack.Screen name="OrderDeliveryScreen" component={OrderDelivery} />
        </>
      ) : (
        <Stack.Screen name="Profile" component={Profile} />
      )}
    </Stack.Navigator>
  );
};

export default Navigation;
