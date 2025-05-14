import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";

import Header from "../components/Header";
import fetchIPFSData from "../services/PinataService";
import { getOwnHealthRecordHash } from "../services/BlockchainService";

const NotesPage = () => {
  const [notesData, setNotesData] = useState<string[][]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
      const fetchNotes = async () => {
        try {
          const hash = await getOwnHealthRecordHash();
          const personalData = await fetchIPFSData(hash);
          console.log("hash", hash)
          setNotesData(personalData.notes);
          
        } catch (err) {
          setError("Failed to fetch notes");
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
  
      fetchNotes();
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
            <Text style={styles.headerText}>Arbeider</Text>
          </View>
          <View style={styles.tableCell}>
            <Text style={styles.headerText}>Notat</Text>
          </View>
        </View>

        {notesData.map((note, index) => (
          <View key={index} style={styles.tableRow}>
            <View style={styles.tableCell}>
              <Text style={styles.cellText}>{note[1].split(",")[0]}</Text>
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

export default NotesPage;
