import { useNavigation } from "@react-navigation/native";
import React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import Header from "../components/Header";


const Innsyn = () => {
  const navigation = useNavigation();

  const handlePress = (screen: string) => {
    navigation.navigate(screen as never);
  };

  const tableData = [
    ["Navn", "Rolle", "Sted"],
    ["Eva Pedersen", "Fastlege", "Moholt Legesenter" ],
    ["Isabelle Olsen", "Sykepleier", "Byåsen hjemmetjeneste"],
  ];

  return (
    <View style={styles.screen}>
      <Header header="Innsyn" />
      <TouchableOpacity
          onPress={() => handlePress('Endringslogg')}
        >
      <View style={styles.table}>
        {tableData.map((row, rowIndex) => (
          <View
            key={rowIndex}
            style={[
              styles.tableRow,
              rowIndex === 0 && styles.headerRow, 
            ]}
          >
            {row.map((cell, cellIndex) => (
              <View key={cellIndex} style={styles.tableCell}>
                <Text
                  style={[
                    styles.cellText,
                    rowIndex === 0 && styles.headerText, 
                  ]}
                >
                  {cell}
                </Text>
              </View>
            ))}
          </View>
        ))}
      </View>
      </TouchableOpacity>
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
