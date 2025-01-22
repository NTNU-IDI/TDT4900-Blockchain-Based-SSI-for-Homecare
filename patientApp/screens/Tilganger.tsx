import React from "react";
import { View, StyleSheet } from "react-native";
import Card from "../components/Card";
import Header from "../components/Header";

const Tilganger = () => {
  return (
    <View style={styles.screen}>
      <Header header="Tilganger" />
      <View style={styles.cardContainer}>
        <Card
          title="Innsyn i journal"
          description="Her ser du hvem som har tilgang til din journal"
        />
        <Card
          title="Forespørsler om innsyn"
          description="Her finner du forespørsler om tilgang til din journal"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#FFFFF",
    alignItems: "center",
    // paddingTop: 40,
  },
  cardContainer: {
    marginTop: 20,
    width: "90%",
  },
});

export default Tilganger;
