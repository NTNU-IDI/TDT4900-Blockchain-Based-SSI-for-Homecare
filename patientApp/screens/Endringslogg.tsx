import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { revokeAccess } from '../redux/accessSlice';
import Header from "../components/Header";
import Icon from "react-native-vector-icons/SimpleLineIcons";
import { getAccessList, revokeAccess as blockchainRevoke } from "../components/BlockchainService";
import { OTHER_ADDRESS, OWNER_PRIVATE_KEY } from '@env';

const Endringslogg = () => {
  const dispatch = useDispatch();
  const isAccessRevoked = useSelector((state: RootState) => state.access.isAccessRevoked);

  const handleRemoveAccess = async () => {
    try {
      await blockchainRevoke(OTHER_ADDRESS, OWNER_PRIVATE_KEY);
      dispatch(revokeAccess());  // Update Redux state
    } catch (error) {
      console.error("Error revoking access:", error);
    }
  };

  const tableData = [
    ["Data", "Behandling", "Dokument"],
    ["23/10/19", "Lungemedisinsk", <Icon name={"docs"} size={20} color="#000" />],
    ["23/08/20", "Hjertemedisinsk", <Icon name={"docs"} size={20} color="#000" />],
  ];

  return (
    <View style={styles.screen}>
      <Header header="Eva Pedersen" />
      <View style={styles.table}>
        {tableData.map((row, rowIndex) => (
          <View key={rowIndex} style={[styles.tableRow, rowIndex === 0 && styles.headerRow]}>
            {row.map((cell, cellIndex) => (
              <View key={cellIndex} style={styles.tableCell}>
                <Text style={[styles.cellText, rowIndex === 0 && styles.headerText]}>
                  {cell}
                </Text>
              </View>
            ))}
          </View>
        ))}
      </View>
      <TouchableOpacity
        style={[styles.button, isAccessRevoked && styles.disabledButton]}
        onPress={handleRemoveAccess}
        disabled={isAccessRevoked}
      >
        <Text style={styles.buttonText}>
          {isAccessRevoked ? "Innsynsrettigheter fjernet" : "Fjern innsynsrettigheter"}
        </Text>
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
    alignItems: "center",
    justifyContent: "center",
  },
  disabledButton: {
    backgroundColor: "grey",
  },
  buttonText: {
    fontFamily: '"Times New Roman", Times, serif',
    fontSize: 30,
    color: "#fff",
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
