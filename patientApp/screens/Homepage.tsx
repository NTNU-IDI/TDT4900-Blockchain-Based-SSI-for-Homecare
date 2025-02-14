import React from "react";
import { View, StyleSheet, Text } from "react-native";
import Navigation from "../components/Navigation";

const Homepage = () => {
  return (
    <View style={styles.screen}>

      <View style={styles.circleContainer}>
        <View style={[styles.firstCircle]} />
        <View style={[styles.secondCircle]} />
      </View>

      <Text style={styles.circleText}>Velkommen Anne!</Text>
      <Text style={styles.italicText}>Hva kan vi hjelpe deg med?</Text>

      <Navigation />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: "center",

  },
  circleContainer: {
    width: "100%",
    height: 250,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    zIndex: 0,
  },

  firstCircle: {
    width: 320,
    height: 320,
    borderRadius: 180,
    backgroundColor: "#FFF6E9",
    zIndex: 0,
    left: "30%",
    top: 60,
  },
  secondCircle: {
    width: 320,
    height: 320,
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
    color: "#000",
    textAlign: "center",
    top: 50,
    left: 30,
    marginTop: 40,
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
    marginTop: 50,
  },
});

export default Homepage;
