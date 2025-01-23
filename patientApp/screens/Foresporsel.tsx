import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import Card from "../components/Card";
import Header from "../components/Header";
import { useNavigation } from "@react-navigation/native";

const Foresporsel = () => {
  const navigation = useNavigation();

  const cards = [
    { id: 1, title: "Andrea Markussen", description: "Sykepleier" },
  ];

  const handlePress = (screen: string) => {
    navigation.navigate(screen as never);
  };

  return (
    <View style={styles.screen}>
      <Header header="Forespørsler" />

      <Text style={styles.text}>Antall forespørsler: {cards.length}</Text>

      <View style={styles.cardContainer}>
        {cards.map((card) => (
          <TouchableOpacity
            key={card.id}
            onPress={() => handlePress("DetailedForesporsel")}
          >
            <Card title={card.title} description={card.description} />
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
