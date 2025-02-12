import { useFocusEffect, useNavigation } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import Header from "../components/Header";
import Card from "../components/Card";
import { connect } from "react-redux";
import { connectWallet, getAccessList } from "../components/BlockchainService";
import workers from "../assets/homecare_workers.json";
import { Worker } from "../types/Worker";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/screens";

type InnsynScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "DetailedInnsyn"
>;

const Innsyn = () => {
  const navigation = useNavigation<InnsynScreenNavigationProp>();
  const [accessList, setAccessList] = useState<string[]>([]);
  const [accessDetails, setAccessDetails] = useState<Worker[]>([]);

  // Fetch access list function
  const fetchAccessList = async () => {
    try {
      await connectWallet();
      const list = await getAccessList();
      setAccessList(list);

      // Map the access list to the JSON data
      const details = list.map((address) => {
        const detail = workers[address]; // Access the details directly using the address as a key
        return detail;
      });

      setAccessDetails(details);
    } catch (error) {
      console.error("Error fetching access list", error);
    }
  };

  // Fetch data on initial load
  useEffect(() => {
    fetchAccessList();
  }, []);

  // Fetch data when the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchAccessList();
    }, [])
  );

  const handlePress = (address: string) => {
    const worker = workers[address] || null;

    if (!worker) {
      console.error("Worker not found for address:", address);
      return;
    }

    navigation.navigate("DetailedInnsyn", { address, worker });
  };

  return (
    <View style={styles.screen}>
      <Header header="Innsyn" />
      <View style={styles.cardContainer}>
        {accessDetails.map((worker, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => handlePress(accessList[index])}
          >
            <Card
              title={worker.navn}
              description={`${worker.yrke} - ${worker.arbeidsplass}`}
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
  cardContainer: {
    marginTop: 20,
    width: "90%",
  },
});

export default Innsyn;
