import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, ActivityIndicator, ScrollView } from "react-native";
import Header from "../components/Header";
import { getUpdates, connectWallet } from "../components/BlockchainService"; // Ensure this path is correct

const UpdatesLog = () => {
  const [updates, setUpdates] = useState<{
    addresses: string[];
    timestamps: (number | bigint)[];
    descriptions: string[];
  }>({ addresses: [], timestamps: [], descriptions: [] });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUpdates = async () => {
      try {
        await connectWallet();
        const data = await getUpdates();
        setUpdates(data);
      } catch (err) {
        setError("Failed to fetch updates.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUpdates();
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
      <Header header="Endringer" />
      <ScrollView contentContainerStyle={styles.table}>
        <View style={[styles.tableRow, styles.headerRow]}>
          <View style={styles.tableCell}><Text style={styles.headerText}>Timestamp</Text></View>
          <View style={styles.tableCell}><Text style={styles.headerText}>Address (Worker)</Text></View>
          <View style={styles.tableCell}><Text style={styles.headerText}>Description</Text></View>
        </View>

        {updates.timestamps.map((timestamp, index) => (
          <View key={index} style={styles.tableRow}>
            <View style={styles.tableCell}>
              <Text style={styles.cellText}>{
                new Date(Number(timestamp) * 1000).toLocaleString()
              }</Text>
            </View>
            <View style={styles.tableCell}>
              {/* <Text style={styles.cellText}>{updates.addresses[index]}</Text> */}
            </View>
            <View style={styles.tableCell}>
              <Text style={styles.cellText}>{updates.descriptions[index]}</Text>
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
  },
  headerText: {
    fontSize: 14,
    fontWeight: "bold",
  },
});

export default UpdatesLog;
