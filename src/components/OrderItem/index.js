import { Image, Text, View, Pressable } from "react-native";
import { Entypo } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Datastore } from "aws-amplify";

import { User } from "../../models";

const OrderItem = ({ order }) => {
  const [user, setUser] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    Datastore.query(User, order.userID).then(setUser);
  }, []);

  return (
    <Pressable
      style={{
        flexDirection: "row",
        borderColor: "#3FC060",
        borderWidth: 2,
        borderRadius: 10,
        margin: 10,
      }}
      onPress={() =>
        navigation.navigate("OrderDeliveryScreen", { id: order.id })
      }
    >
      <Image
        source={{ uri: order.Restaurant.image }}
        style={{
          width: "25%",
          height: "100%",
          borderBottomLeftRadius: 10,
          borderTopLeftRadius: 12,
        }}
      />
      <View style={{ flex: 1, marginLeft: 10, paddingVertical: 5 }}>
        <Text style={{ fontSize: 18, fontWeight: "500" }}>
          {order.Restaurant.name}
        </Text>
        <Text style={{ color: "grey" }}>{order.Restaurant.address}</Text>
        <Text style={{ marginTop: 10 }}>Delivery Details</Text>

        <Text style={{ color: "grey" }}>{user?.name}</Text>
        <Text style={{ color: "grey" }}>{user?.address}</Text>
      </View>

      <View
        style={{
          padding: 5,
          backgroundColor: "#3FC060",
          borderBottomRightRadius: 10,
          borderTopRightRadius: 10,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Entypo
          name="check"
          size={30}
          color="white"
          style={{ marginLeft: "auto" }}
        />
      </View>
    </Pressable>
  );
};

export default OrderItem;
