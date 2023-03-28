import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Button,
  Alert,
  Pressable,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Auth, DataStore } from "aws-amplify";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons, FontAwesome5 } from "@expo/vector-icons";

import { Courier, TransportationModes } from "../../models";
import { useAuthContext } from "../../Context/AuthContext";
import { View } from "react-native";

const Profile = () => {
  const { dbCourier, sub, setDbCourier } = useAuthContext();
  const navigation = useNavigation();

  const [transportationMode, setTransportationMode] = useState(
    TransportationModes.DRIVING
  );

  const [name, setName] = useState(dbCourier?.name || "");

  const createCourier = async () => {
    try {
      const courier = await DataStore.save(
        new Courier({
          name,
          sub,
          transporationMode,
        })
      );

      setDbCourier(courier);
    } catch (error) {
      Alert.alert("ERROR", error.message);
    }
  };

  const updateCourier = async () => {
    const courier = await DataStore.save(
      Courier.copyOf(dbCourier, (updated) => {
        updated.name = name;
        updated.transporationMode = transportationMode;
      })
    );
    setDbCourier(courier);
  };

  const onSave = async () => {
    if (dbCourier) {
      await updateCourier();
    } else {
      await createCourier();
    }
    navigation.goBack();
  };

  return (
    <SafeAreaView>
      <Text style={styles.title}>Profile</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="Name"
        style={styles.input}
      />

      <View style={{ flexDirection: "row" }}>
        <Pressable
          onPress={() => setTransportationMode(TransportationModes.BICYCLING)}
          style={{
            flex: 1,
            backgroundColor:
              transportationMode === "BICYCLING" ? "#3FC060" : "white",
            margin: 10,
            padding: 10,
            borderWidth: 1,
            borderRadius: 10,
            borderColor: "grey",
          }}
        >
          <MaterialIcons name="pedal-bike" size={40} color="black" />
        </Pressable>
        <Pressable
          onPress={() => setTransportationMode(TransportationModes.DRIVING)}
          style={{
            flex: 1,
            backgroundColor:
              transportationMode === "DRIVING" ? "#3FC060" : "white",
            margin: 10,
            padding: 10,
            borderWidth: 1,
            borderRadius: 10,
            borderColor: "grey",
          }}
        >
          <FontAwesome5 name="car" size={40} color="black" />
        </Pressable>
      </View>
      <Button onPress={onSave} title="Save" />
      <Text
        onPress={() => Auth.signOut()}
        style={{ textAlign: "center", color: "red", margin: 10 }}
      >
        Sign Out
      </Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    margin: 10,
  },
  input: {
    margin: 10,
    backgroundColor: "white",
    padding: 15,
    borderRadius: 5,
  },
});

export default Profile;
