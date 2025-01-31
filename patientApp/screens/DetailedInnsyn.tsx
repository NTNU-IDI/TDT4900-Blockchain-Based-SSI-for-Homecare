import React, { useEffect, useState } from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { getAccessList, revokeAccess } from "../services/BlockchainService";
import Card from "../components/Card";
import Header from "../components/Header";

const DetailedInnsyn = () => {
  const patientAddress: string = process.env.OWNER_ADDRESS || "";
  const patientPrivateKey: string = process.env.OWNER_PRIVATE_KEY || "";
  const workerPrivateKey: string = process.env.OTHER_PRIVATE_KEY || "";
  const workerAddress: string = process.env.OTHER_ADDRESS || "";
  const [accessList, setAccessList] = useState<string[]>([]);

  useEffect(() => {
    fetchAccessList();
  }, []);

  const fetchAccessList = async () => {
    try {
      const list = await getAccessList();
      setAccessList(list);
      console.log(list);
    } catch (error) {
      console.error("Error fetching access list:", error);
    }
  };

  const handleRemoveAccess = async () => {
    if (!accessList.includes(workerAddress)) {
      console.log("Error", "User does not have access.");
      return;
    }

    try {
      await revokeAccess(workerAddress, patientPrivateKey);
      console.log("Success", "Access revoked successfully.");
      fetchAccessList(); // Refresh access list
    } catch (error) {
      console.error("Error revoking access:", error);
      console.log("Error", "Failed to revoke access.");
    }
  };
  return (
    <View style={styles.screen}>
      <Header header="Eva Pedersen" />
      <View style={styles.cardContainer}>
        <Card
          title="Endringslogg"
          description="Her finner du endringer vedrørende har gjort i din journal"
        />
      </View>
      <TouchableOpacity style={styles.button} onPress={handleRemoveAccess}>
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
  buttonText: {
    fontFamily: '"Times New Roman", Times, serif',
    fontSize: 30,
  },
});

export default DetailedInnsyn;
