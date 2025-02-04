import React, { useEffect, useState } from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import Card from "../components/Card";
import Header from "../components/Header";
import { useNavigation } from "@react-navigation/native";
import { getAccessList, getAccessRequests, hasAccess, hasRequestedAccess } from "../components/BlockchainService"
import {HOMECARE_WORKER_ADDRESS, OTHER_ADDRESS} from '@env';

const Foresporsel = () => {
  const navigation = useNavigation();
  const [requests, setRequests] = useState<any[]>([]);

  useEffect(() => {
    const fetchRequests = async () => {
      const accessRequests = await getAccessRequests();
      const a = await hasRequestedAccess(HOMECARE_WORKER_ADDRESS);
      setRequests(accessRequests)
      
      console.log(accessRequests)
      console.log(a)
    };

    fetchRequests();
  }, [HOMECARE_WORKER_ADDRESS]);

  const handlePress = (screen: string) => {
    navigation.navigate(screen as never);
  };


  return (
    <View style={styles.screen}>
      <Header header="Forespørsler" />

      <Text style={styles.text}>Antall forespørsler: {requests.length}</Text>

      <View style={styles.cardContainer}>
        {requests.map((request, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => handlePress("DetailedForesporsel")}
          >
            <Card
              title={request.navn}
              description={`${request.yrke} - ${request.arbeidsplass}`}
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
