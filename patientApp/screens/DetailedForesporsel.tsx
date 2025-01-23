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

      {/* Buttons Section */}
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
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    paddingTop: 40,
  },

  infoContainer: {
    width: "90%",
    marginVertical: 20,
  },

  infoText: {
    fontSize: 18,
    marginBottom: 10,
    color: "#333", // Dark gray color for readability
  },

  label: {
    fontStyle: "italic", // Italic for the label
    fontWeight: "bold", // Bold to make it stand out
  },

  buttonContainer: {
    flexDirection: "row", // Align buttons in a row
    justifyContent: "space-between", // Space between the buttons
    width: "90%",
    marginTop: 40,
  },

  button: {
    height: 50,
    flex: 1, // Make buttons take equal space
    marginHorizontal: 5, // Add spacing between buttons
    borderRadius: 10,
    alignItems: "center", // Centers text horizontally
    justifyContent: "center", // Centers text vertically
  },

  approveButton: {
    backgroundColor: "#0D9276", // Green for approve
  },

  denyButton: {
    backgroundColor: "#FF6347", // Red for deny
  },

  buttonText: {
    fontSize: 16,
    color: "#FFFFFF", // White text for contrast
  },
});

export default DetailedForesporsel;
