import React from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import Header from "../components/Header";

const DetailedForesporsel = () => {
  return (
    <View style={styles.screen}>
      <Header header="Forespørsler" />

      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>
          <Text style={styles.label}>Name:</Text> Andrea
        </Text>
        <Text style={styles.infoText}>
          <Text style={styles.label}>Arbeidsplass:</Text> Byåsen hjemmetjeneste
        </Text>
        <Text style={styles.infoText}>
          <Text style={styles.label}>Yrke:</Text> Sykepleier
        </Text>
        <Text style={styles.infoText}>
          <Text style={styles.label}>Notat:</Text> Ønsker tilgang til journal
          fordi jeg er vikar og skal behandle deg neste uke.
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.button, styles.approveButton]}>
          <Text style={styles.buttonText}>Godkjenn</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.denyButton]}>
          <Text style={styles.buttonText}>Ikke godkjenn</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: "center",
  },

  infoContainer: {
    width: "90%",
    marginVertical: 20,
  },

  infoText: {
    fontSize: 18,
    marginBottom: 10,
    color: "#333", 
    padding: 10,

  },

  label: {
    fontStyle: "italic", 
    fontWeight: "bold", 
  },

  buttonContainer: {
    flexDirection: "row", 
    justifyContent: "space-between", 
    width: "90%",
    marginTop: 40,
  },

  button: {
    height: 50,
    flex: 1, 
    marginHorizontal: 5, 
    borderRadius: 10,
    alignItems: "center", 
    justifyContent: "center", 
  },

  approveButton: {
    backgroundColor: "#0D9276", 
  },

  denyButton: {
    backgroundColor: "#FF6347", 
  },

  buttonText: {
    fontSize: 16,
    color: "#FFFFFF", 
  },
});

export default DetailedForesporsel;
