import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { useRoute } from "@react-navigation/native";
import Header from "../components/Header";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../types/screens";
import {
  denyAccessRequest,
  grantAccess,
} from "../abi/BlockchainService";
import { Worker } from "../types/Worker";

type DetailedForesporselRouteProp = RouteProp<
  RootStackParamList,
  "DetailedForesporsel"
>;

const DetailedForesporsel = () => {
  const route = useRoute<DetailedForesporselRouteProp>();
  const { address, note, worker } = route.params as {
    address: string;
    note: string;
    worker: Worker;
  };

  const [isLoading, setIsLoading] = useState(false);
  const [isButtonPressed, setIsButtonPressed] = useState(false);

  const handleApprove = async () => {
    setIsLoading(true);
    try {
      await grantAccess(address);
      console.log("Success", "Access request approved successfully.");
      setIsButtonPressed(true); // Disable buttons only on success
    } catch (error) {
      console.error("Error approving access request:", error);
      console.log("Error", "Failed to approve access request.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeny = async () => {
    setIsLoading(true);
    try {
      await denyAccessRequest(address);
      console.log("Success", "Access request denied successfully.");
      setIsButtonPressed(true); // Disable buttons only on success
    } catch (error) {
      console.error("Error denying access request:", error);
      console.log("Error", "Failed to deny access request.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.screen}>
      <Header header="Forespørsler" />

      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>
          <Text style={styles.label}>Adresse:</Text> {worker.navn}
        </Text>
        <Text style={styles.infoText}>
          <Text style={styles.label}>Arbeidsplass:</Text> {worker.arbeidsplass}
        </Text>
        <Text style={styles.infoText}>
          <Text style={styles.label}>Yrke:</Text> {worker.yrke}
        </Text>
        <Text style={styles.infoText}>
          <Text style={styles.label}>Notat:</Text> {note}
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.button,
            styles.approveButton,
            (isLoading || isButtonPressed) && styles.disabledButton,
          ]}
          onPress={handleApprove}
          disabled={isLoading || isButtonPressed}
        >
          <Text style={styles.buttonText}>
            {isLoading ? "Processing..." : "Godkjenn"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.button,
            styles.denyButton,
            (isLoading || isButtonPressed) && styles.disabledButton,
          ]}
          onPress={handleDeny}
          disabled={isLoading || isButtonPressed}
        >
          <Text style={styles.buttonText}>
            {isLoading ? "Processing..." : "Ikke godkjenn"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: "center",
  },
  infoContainer: {
    width: "90%",
    marginVertical: 20,
  },
  infoText: {
    fontSize: 18,
    marginBottom: 10,
    color: "#333",
    padding: 10,
  },
  label: {
    fontStyle: "italic",
    fontWeight: "bold",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "90%",
    marginTop: 40,
  },
  button: {
    height: 50,
    flex: 1,
    marginHorizontal: 5,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  approveButton: {
    backgroundColor: "#0D9276",
  },
  denyButton: {
    backgroundColor: "#FF6347",
  },
  disabledButton: {
    backgroundColor: "#A9A9A9",
  },
  buttonText: {
    fontSize: 16,
    color: "#FFFFFF",
  },
});

export default DetailedForesporsel;