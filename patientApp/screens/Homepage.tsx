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
    flex: 1, // Takes up the full screen
    backgroundColor: "#f0f0f0", // Light background color for better contrast
    alignItems: "center", // Center horizontally
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
    zIndex: 0, // Ensures this circle is on top
    left: "30%", // Adjust position horizontally
    top: 0,
  },
  secondCircle: {
    width: 300,
    height: 300,
    borderRadius: 180,
    backgroundColor: "#BBE2EC",
    zIndex: 1,
    right: "25%", // Adjust position horizontally
    top: -190, // Slightly lower to create the overlap effect
  },
  circleText: {
    position: "absolute", // Positioning the text absolutely within the container
    zIndex: 1, // Ensure the text is above the circles
    fontSize: 24, // Adjust font size
    fontFamily: '"Times New Roman", Times, serif',
    color: "#000", // Black text color
    textAlign: "center",
    top: 50, // Move the text down
    left: 30, // Move the text to the left
  },

  italicText: {
    position: "absolute", // Position absolutely below the first text
    zIndex: 1, // Ensure the text is above the circles
    fontSize: 16, // Slightly smaller font size
    fontStyle: "italic", // Make text italic
    color: "#555", // Darker gray text color
    textAlign: "center",
    top: 80, // Positioned below the first text
    left: 30, // Align with the first text horizontally
    marginTop: 10,
  },
});

export default Homepage;
