import React from "react";
import { View, StyleSheet, Text } from "react-native";
import Navigation from "../components/Navigation";

const Homepage = () => {
  return (
    <View style={styles.screen}>
      {/* Overlapping Half-Circles */}

      <View style={styles.circleContainer}>
        <View style={[styles.firstCircle]} />
        <View style={[styles.secondCircle]} />
      </View>

      <Text style={styles.circleText}>Velkommen Frida!</Text>
      <Text style={styles.italicText}>Hva kan vi hjelpe deg med?</Text>

      <Navigation />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    alignItems: "center",
  },
  circleContainer: {
    width: "100%",
    height: 250,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },

  firstCircle: {
    width: 290,
    height: 290,
    borderRadius: 180,
    backgroundColor: "#FFF6E9",
    zIndex: 0,
    left: "30%",
    top: 0,
  },
  secondCircle: {
    width: 300,
    height: 300,
    borderRadius: 180,
    backgroundColor: "#BBE2EC",
    zIndex: 1,
    right: "25%",
    top: -190,
  },
  circleText: {
    position: "absolute",
    zIndex: 1,
    fontSize: 24,
    fontFamily: '"Times New Roman", Times, serif',
    color: "#000",
    textAlign: "center",
    top: 50,
    left: 30,
  },

  italicText: {
    position: "absolute",
    zIndex: 1,
    fontSize: 16,
    fontStyle: "italic",
    color: "#555",
    textAlign: "center",
    top: 80,
    left: 30,
    marginTop: 10,
  },
});

export default Homepage;
