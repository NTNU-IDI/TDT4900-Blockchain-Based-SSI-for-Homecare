import React from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";

import Header from "../components/Header";
import Icon from "react-native-vector-icons/SimpleLineIcons";

const NotatLogg = () => {
  const tableData = [
    ["Dato", "Behandling", "Notater"],
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
      <Header header="Isabelle Pedersen" />
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
    </View>
  );
};
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: "center",
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

export default NotatLogg;
