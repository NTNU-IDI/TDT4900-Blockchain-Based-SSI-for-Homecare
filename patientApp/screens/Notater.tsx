import React from "react";
import { View, StyleSheet, Text, ScrollView } from "react-native";
import Header from "../components/Header";
import { RootStackParamList } from "../types/Screens";
import { RouteProp, useRoute } from "@react-navigation/native";

type DetailedForesporselRouteProp = RouteProp<RootStackParamList, "Notater">;

const Notater = () => {
  const route = useRoute<DetailedForesporselRouteProp>();

  const { notes } = route.params as { notes: string[] };

  return (
    <View style={styles.screen}>
      <Header header="Notater" />
      <ScrollView contentContainerStyle={styles.table}>
        <View style={[styles.tableRow, styles.headerRow]}>
          <View style={styles.tableCell}>
            <Text style={styles.headerText}>Dato</Text>
          </View>
          <View style={styles.tableCell}>
            <Text style={styles.headerText}>Arbeider</Text>
          </View>
          <View style={styles.tableCell}>
            <Text style={styles.headerText}>Notat</Text>
          </View>
        </View>

        {notes.map((note, index) => (
          <View key={index} style={styles.tableRow}>
            <View style={styles.tableCell}>
              <Text style={styles.cellText}>{note[1]}</Text>
            </View>
            <View style={styles.tableCell}>
              <Text style={styles.cellText}>{note[2]}</Text>
            </View>
            <View style={styles.tableCell}>
              <Text style={styles.cellText}>{note[0]}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#F5F9FA",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "red",
    fontSize: 16,
  },
  table: {
    marginTop: 20,
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
    borderRadius: 8,
    overflow: "hidden",
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
    minHeight: 50,
  },
  cellText: {
    fontSize: 14,
    color: "#333",
    textAlign: "center",
  },
  headerText: {
    fontSize: 14,
    fontWeight: "bold",
  },
});

export default Notater;
