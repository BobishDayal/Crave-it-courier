import BottomSheet from "@gorhom/bottom-sheet";
import { useRef, useMemo } from "react";
import { View, Text, Pressable } from "react-native";
import { FontAwesome5, Fontisto } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

import { UseOrderContext } from "../../contexts/OrderContext";

const STATUS_TO_TITLE = {
  READY_FOR_PICKUP: "Accept Order",
  ACCEPTED: "Pick-Up Order",
  PICKED_UP: "Complete Delivery",
};

const BottomSheetDetails = (props) => {
  const { totalKm, totalMinutes, onAccepted } = props;
  const isDriverClose = totalKm <= 1;

  const { order, user, dishes, acceptOrder, completeOrder, pickUpOrder } =
    UseOrderContext();

  const navigation = useNavigation();

  const bottomSheetRef = useRef(null);
  const snapPoints = useMemo(() => ["12%", "95%"], []);

  const onButtonPressed = async () => {
    if (order.status === "READY_FOR_PICKUP") {
      bottomSheetRef.current?.collapse();
      await acceptOrder();
      onAccepted();
    } else if (order.status === "ACCEPTED") {
      bottomSheetRef.current?.collapse();
      await pickUpOrder();
    } else if (order.status === "PICKED_UP") {
      await completeOrder();
      bottomSheetRef.current?.collapse();
      navigation.goBack();
    }
  };

  const isButtonDisabled = () => {
    const { status } = order;

    if (status === "READY_FOR_PICKUP") {
      return false;
    }
    if ((status === "ACCEPTED" || status === "PICKED_UP") && isDriverClose) {
      return false;
    }

    return true;
  };

  return (
    <BottomSheet
      ref={bottomSheetRef}
      snapPoints={snapPoints}
      handleIndicatorStyle={{ backgroundColor: "grey", width: 100 }}
    >
      <View
        style={{
          marginTop: 10,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 20,
        }}
      >
        <Text style={{ fontSize: 25, letterSpacing: 1 }}>
          {totalMinutes.toFixed(0)} min
        </Text>
        <FontAwesome5
          name="shopping-bag"
          size={30}
          color="#3FC060"
          style={{ marginHorizontal: 10 }}
        />
        <Text style={{ fontSize: 25, letterSpacing: 1 }}>
          {totalKm.toFixed(2)} Km
        </Text>
      </View>
      <View style={{ paddingHorizontal: 20 }}>
        <Text style={{ fontSize: 25, letterSpacing: 1, paddingVertical: 20 }}>
          {order.Restaurant.name}
        </Text>
        <View
          style={{
            flexDirection: "row",
            marginBottom: 20,
            alignItems: "center",
          }}
        >
          <Fontisto name="shopping-store" size={22} color="grey" />
          <Text
            style={{
              fontSize: 20,
              color: "grey",
              fontWeight: "500",
              letterSpacing: 0.5,
              marginLeft: 15,
            }}
          >
            {order.Restaurant.address}
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            marginBottom: 20,
            alignItems: "center",
          }}
        >
          <FontAwesome5 name="map-marker-alt" size={30} color="grey" />
          <Text
            style={{
              fontSize: 20,
              color: "grey",
              fontWeight: "500",
              letterSpacing: 0.5,
              marginLeft: 15,
            }}
          >
            {user?.address}
          </Text>
        </View>

        <View
          style={{
            borderTopWidth: 1,
            borderColor: "lightgrey",
            paddingTop: 20,
          }}
        >
          {dishes?.map((dishItem) => (
            <Text
              key={dishItem.id}
              style={{
                fontSize: 18,
                color: "grey",
                fontWeight: "500",
                letterSpacing: 0.5,
                marginBottom: 5,
              }}
            >
              {dishItem.Dish.name} x{dishItem.quantity}
            </Text>
          ))}
        </View>
      </View>
      <Pressable
        style={{
          backgroundColor: isButtonDisabled() ? "grey" : "#3FC060",
          marginTop: "auto",
          marginVertical: 30,
          marginHorizontal: 10,
          borderRadius: 10,
        }}
        onPress={onButtonPressed}
        disabled={isButtonDisabled()}
      >
        <Text
          style={{
            color: "white",
            paddingVertical: 10,
            fontSize: 25,
            fontWeight: "500",
            textAlign: "center",
            letterSpacing: 0.5,
          }}
        >
          {STATUS_TO_TITLE[order.status]}
        </Text>
      </Pressable>
    </BottomSheet>
  );
};

export default BottomSheetDetails;
