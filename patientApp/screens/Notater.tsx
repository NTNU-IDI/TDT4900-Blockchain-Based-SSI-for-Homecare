import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import Header from "../components/Header";
import fetchIPFSData from "../services/PinataService";
import { IPFS_HASH } from "@env";

const Notater = () => {
  const [notesData, setNotesData] = useState<string[][]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getData = async () => {
      try {
        const data = await fetchIPFSData(IPFS_HASH);
        console.log("Fetched Data:", data);
        setNotesData(data.notes || []);
      } catch (err) {
        setError("Failed to fetch data from IPFS.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <Header header="Notater" />
      <ScrollView contentContainerStyle={styles.table}>
        <View style={[styles.tableRow, styles.headerRow]}>
          <View style={styles.tableCell}>
            <Text style={styles.headerText}>Dato</Text>
          </View>
          <View style={styles.tableCell}>
            <Text style={styles.headerText}>Forfatter</Text>
          </View>
          <View style={styles.tableCell}>
            <Text style={styles.headerText}>Notat</Text>
          </View>
        </View>

        {notesData.map((note, index) => (
          <View key={index} style={styles.tableRow}>
            <View style={styles.tableCell}>
              <Text style={styles.cellText}>{note[1]}</Text> {/* Date */}
            </View>
            <View style={styles.tableCell}>
              <Text style={styles.cellText}>{note[2]}</Text> {/* Note Text */}
            </View>
            <View style={styles.tableCell}>
              <Text style={styles.cellText}>{note[0]}</Text> {/* Author */}
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
