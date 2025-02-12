import React, { useEffect, useState } from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { getAccessList, revokeAccess } from "../components/BlockchainService";
import Card from "../components/Card";
import Header from "../components/Header";
import { RouteProp, useRoute } from "@react-navigation/native";
import { RootStackParamList } from "../types/screens";
import { Worker } from "../types/Worker";

type DetailedInnsynRouteProp = RouteProp<RootStackParamList, "DetailedInnsyn">;

const DetailedInnsyn = () => {
  const route = useRoute<DetailedInnsynRouteProp>();
  const { address, worker } = route.params as {
    address: string;
    worker: Worker;
  };
  const [isLoading, setIsLoading] = useState(false);
  const [isButtonPressed, setIsButtonPressed] = useState(false);

  const handleRemove = async () => {
    setIsLoading(true);
    try {
      await revokeAccess(address);
      console.log("Success", "Access revoked successfully.");
      console.log("List:", getAccessList());
      setIsButtonPressed(true); 
    } catch (error) {
      console.error("Error revoking access:", error);
      console.log("Error", "Failed to revoke access.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.screen}>
      <Header header={worker.navn} />
      <TouchableOpacity
        style={[
          styles.button,
          (isLoading || isButtonPressed) && styles.disabledButton,
        ]}
        onPress={handleRemove}
      >
        <Text style={styles.buttonText}>Fjern innsynsrettigheter</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: "center",
  },
  cardContainer: {
    marginTop: 20,
    width: "90%",
  },
  button: {
    height: 100,
    width: "90%",
    marginTop: 40,
    backgroundColor: "#0D9276",
    borderRadius: 20,
    alignItems: "center", // Centers text horizontally
    justifyContent: "center", // Centers text vertically
  },
  disabledButton: {
    backgroundColor: "#A9A9A9",
  },
  buttonText: {
    fontFamily: '"Times New Roman", Times, serif',
    fontSize: 30,
  },
});

export default DetailedInnsyn;
