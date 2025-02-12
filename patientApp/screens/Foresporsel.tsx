import React, { useCallback, useEffect, useState } from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import Card from "../components/Card";
import Header from "../components/Header";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import {
  connectWallet,
  getAccessRequests,
} from "../components/BlockchainService";
import { RootStackParamList } from "../types/screens";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import workers from "../assets/homecare_workers.json";

type ForesporselScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "DetailedForesporsel"
>;

const Foresporsel = () => {
  const navigation = useNavigation<ForesporselScreenNavigationProp>();
  const [requests, setRequests] = useState<{
    addresses: string[];
    notes: string[];
  }>({
    addresses: [],
    notes: [],
  });

  const fetchRequests = async () => {
    try {
      await connectWallet();
      const fetchedRequests = await getAccessRequests();
      console.log("Fetched requests:", fetchedRequests);

      setRequests({
        addresses: fetchedRequests.addresses,
        notes: fetchedRequests.notes,
      });
    } catch (error) {
      console.error("Error fetching requests:", error);
    }
  };

  // Fetch data on initial load
  useEffect(() => {
    fetchRequests();
  }, []);

  // Fetch data when the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchRequests();
    }, [])
  );

  // Count unique addresses
  const uniqueAddressCount = new Set(requests.addresses).size;

  const handlePress = (address: string, note: string) => {
    const worker = workers[address] || null;

    navigation.navigate("DetailedForesporsel", { address, note, worker });
  };

  return (
    <View style={styles.screen}>
      <Header header="Forespørsler" />

      <Text style={styles.text}>Antall forespørsler: {uniqueAddressCount}</Text>

      <View style={styles.cardContainer}>
        {requests.addresses.map((address, index) => (
          <TouchableOpacity
            key={index}
            onPress={() =>
              handlePress(address, requests.notes[index] || "Ingen merknad")
            }
          >
            <Card
              title={`Adresse: ${address}`}
              description={`Note: ${requests.notes[index] || "Ingen merknad"}`}
            />
          </TouchableOpacity>
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

  text: {
    fontSize: 20,
    padding: 10,
    textAlign: "left",
    alignSelf: "flex-start",
    marginLeft: 20,
  },

  cardContainer: {
    marginTop: 20,
    width: "90%",
  },
});

export default Foresporsel;
