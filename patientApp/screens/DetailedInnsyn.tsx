import React from "react";
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';

import Card from "../components/Card";
import Header from "../components/Header";

const DetailedInnsyn = () => {
  return (
    <View style={styles.screen}>
      <Header header="Eva Pedersen" />
      <View style={styles.cardContainer}>
        <Card
          title="Endringslogg"
          description="Her finner du endringer vedrørende har gjort i din journal"
        />
      </View>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Fjern innsynsrettigheter</Text>
        </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#FFFFF",
    alignItems: "center",
  },
  cardContainer: {
    marginTop: 20,
    width: "90%",
  },
  button: {
    height: 100,
    width: '90%',
    marginTop: 40,
    backgroundColor: '#0D9276',
    borderRadius: 20,
    alignItems: "center", // Centers text horizontally
    justifyContent: "center", // Centers text vertically

  },
  buttonText: {
    fontFamily: '"Times New Roman", Times, serif',
    fontSize: 30,

  }
});

export default DetailedInnsyn;
