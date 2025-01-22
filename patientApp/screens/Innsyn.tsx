import React from "react";
import { View, StyleSheet, Text } from "react-native";
import Header from "../components/Header";
import Icon from "react-native-vector-icons/SimpleLineIcons";


const Innsyn = () => {
  const tableData = [
    ["Navn", "Rolle", "Sted"],
    ["Eva Pedersen", "Fastlege", "Moholt Legesenter" ],
    ["Isabelle Olsen", "Sykepleier", "Byåsen hjemmetjeneste"],
  ];

  return (
    <View style={styles.screen}>
      {/* Header */}
      <Header header="Innsyn" />

      {/* Table */}
      <View style={styles.table}>
        {tableData.map((row, rowIndex) => (
          <View
            key={rowIndex}
            style={[
              styles.tableRow,
              rowIndex === 0 && styles.headerRow, // Apply special style for the first row
            ]}
          >
            {row.map((cell, cellIndex) => (
              <View key={cellIndex} style={styles.tableCell}>
                <Text
                  style={[
                    styles.cellText,
                    rowIndex === 0 && styles.headerText, // Optional: Special text style for header
                  ]}
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
    backgroundColor: "#FFFFF",
    alignItems: "center",
  },
  table: {
    marginTop: 20, // Add spacing below the header
    borderWidth: 1,
    borderColor: "#ddd", // Light border color
  },
  tableRow: {
    flexDirection: "row", // Arrange cells horizontally in each row
  },
  headerRow: {
    backgroundColor: "#BBE2EC", // Different background color for the first row
  },
  tableCell: {
    borderWidth: 1,
    borderColor: "#ddd", // Light border color
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    width: 140, // Set cell width
    height: 50, // Set cell height
  },
  cellText: {
    fontSize: 14,
    color: "#333",
  },
  headerText: {
    fontSize: 14,
    fontWeight: "bold", // Bold text for the header
  },
});

export default Innsyn;
