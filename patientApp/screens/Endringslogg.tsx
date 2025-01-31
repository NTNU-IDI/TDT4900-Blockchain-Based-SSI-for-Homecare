import React, { useEffect, useState } from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";

import Header from "../components/Header";
import Icon from "react-native-vector-icons/SimpleLineIcons";
import { getAccessList, revokeAccess } from "../services/BlockchainService";

import { OTHER_ADDRESS, OTHER_PRIVATE_KEY, OWNER_PRIVATE_KEY } from '@env';


const Endringslogg = () => {
  const [accessList, setAccessList] = useState<string[]>([]);

  // const patientAddress: string = process.env.OWNER_ADDRESS || "";
  // const workerPrivateKey: string = process.env.OTHER_PRIVATE_KEY || "";


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
    if (!accessList.includes(OTHER_ADDRESS)) {
      console.log("Error", "User does not have access.");
      return;
    }

    try {
      await revokeAccess(OTHER_ADDRESS, OWNER_PRIVATE_KEY);
      console.log("Success", "Access revoked successfully.");
      fetchAccessList(); // Refresh access list
    } catch (error) {
      console.error("Error revoking access:", error);
      console.log("Error", "Failed to revoke access.");
    }
  };
  const tableData = [
    ["Data", "Behandling", "Dokument"],
    [
      "23/10/19",
      "Lungemedisinsk",
      <Icon name={"docs"} size={20} color="#000" />,
    ],
    [
      "23/08/20",
      "Hjertemedisinsk",
      <Icon name={"docs"} size={20} color="#000" />,
    ],
  ];
  return (
    <View style={styles.screen}>
      <Header header="Eva Pedersen" />
      <View style={styles.table}>
        {tableData.map((row, rowIndex) => (
          <View
            key={rowIndex}
            style={[styles.tableRow, rowIndex === 0 && styles.headerRow]}
          >
            {row.map((cell, cellIndex) => (
              <View key={cellIndex} style={styles.tableCell}>
                <Text
                  style={[styles.cellText, rowIndex === 0 && styles.headerText]}
                >
                  {cell}
                </Text>
              </View>
            ))}
          </View>
        ))}
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
  table: {
    marginTop: 20,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  tableRow: {
    flexDirection: "row",
  },
  headerRow: {
    backgroundColor: "#BBE2EC",
  },
  tableCell: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    width: 140,
    height: 50,
  },
  cellText: {
    fontSize: 14,
    color: "#333",
  },
  headerText: {
    fontSize: 14,
    fontWeight: "bold",
  },
});

export default Endringslogg;
