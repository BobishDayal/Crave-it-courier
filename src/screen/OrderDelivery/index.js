import { View, useWindowDimensions, ActivityIndicator } from "react-native";
import { useRef, useEffect, useState } from "react";
import MapView from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import MapViewDirections from "react-native-maps-directions";
import { useNavigation, useRoute } from "@react-navigation/native";
import { DataStore } from "aws-amplify";

import { UseOrderContext } from "../../contexts/OrderContext";
import BottomSheetDetails from "./BottomSheetDetails";
import CustomMarker from "../../components/CustomMarkers";
import { Courier } from "../../models";
import { useAuthContext } from "../../contexts/AuthContext";

const OrderDelivery = () => {
  const { order, user, fetchOrder } = UseOrderContext();
  const { dbCourier } = useAuthContext;

  const [driverLocation, setDriverLocation] = useState(null);
  const [totalMinutes, setTotalMinutes] = useState(0);
  const [totalKm, setTotalKm] = useState(0);
  const mapRef = useRef();

  const { height, width } = useWindowDimensions();

  const navigation = useNavigation();
  const route = useRoute();
  const id = route.params?.id;

  useEffect(() => {
    fetchOrder(id);
  }, [id]);

  useEffect(() => {
    if (!driverLocation) {
      return;
    }

    DataStore.save(
      Courier.copyOf(dbCourier, (updated) => {
        updated.lat = driverLocation.latitude;
        updated.lng = driverLocation.longitude;
      })
    );
  }, [driverLocation]);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (!status === "granted") {
        console.log("nonono");
        return;
      }

      let location = await Location.getCurrentPositionAsync();
      setDriverLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    })();

    const foregroundSubscription = Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        distanceInterval: 500,
      },
      (updatedLocation) => {
        setDriverLocation({
          latitude: updatedLocation.coords.latitude,
          longitude: updatedLocation.coords.longitude,
        });
      }
    );
    return foregroundSubscription;
  }, []);

  if (!driverLocation || !user || !order) {
    return <ActivityIndicator size={"large"} color="gray" />;
  }

  const zoomInOnDriver = () => {
    mapRef.current.animateToRegion({
      latitude: driverLocation.latitude,
      longitude: driverLocation.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    });
  };

  const rsetaurantLocation = {
    latitude: order?.Restaurant?.lat,
    longitude: order?.Restaurant?.lng,
  };
  const deliveryLocation = {
    latitude: user?.lat,
    longitude: user?.lng,
  };

  return (
    <View style={{ backgroundColor: "lightblue", flex: 1 }}>
      <MapView
        ref={mapRef}
        style={{ height, width }}
        showsUserLocation
        followsUserLocation
        initialRegion={{
          latitude: driverLocation.latitude,
          longitude: driverLocation.longitude,
          latitudeDelta: 0.7,
          longitudeDelta: 0.7,
        }}
      >
        <MapViewDirections
          origin={driverLocation}
          destination={
            order.status === "ACCEPTED" ? rsetaurantLocation : deliveryLocation
          }
          strokeWidth={10}
          wayPoints={
            order.status === "READY_FOR_PICKUP" ? [rsetaurantLocation] : []
          }
          strokeColor="#3FC060"
          apikey={"AIzaSyBX-QhanYRGSG2-z4RtyALtY0cuRJAAa4I"}
          onReady={(results) => {
            setTotalMinutes(results.duration);
            setTotalKm(results.distance);
          }}
        />
        <CustomMarker data={order.Restaurant} type="RESTAURANT" />
        <CustomMarker data={user} type="USER" />
      </MapView>
      <BottomSheetDetails
        totalKm={totalKm}
        totalMinutes={totalMinutes}
        onAccepted={zoomInOnDriver}
      />
      {order.status === "READY_FOR_PICKUP" && (
        <Ionicons
          onPress={() => navigation.goBack()}
          name="arrow-back-circle"
          size={45}
          color="black"
          style={{ top: 40, left: 15, position: "absolute" }}
        />
      )}
    </View>
  );
};

export default OrderDelivery;
