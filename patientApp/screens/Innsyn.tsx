import { useNavigation } from "@react-navigation/native";
import React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import Header from "../components/Header";
import Card from "../components/Card";

const Innsyn = () => {
  const navigation = useNavigation();

  const handlePress = (screen: string) => {
    navigation.navigate(screen as never);
  };

  const tableData = [
    ["Navn", "Rolle", "Sted"],
    ["Eva Pedersen", "Fastlege", "Moholt Legesenter"],
    ["Isabelle Olsen", "Sykepleier", "Byåsen hjemmetjeneste"],
  ];

  return (
    <View style={styles.screen}>
      <Header header="Innsyn" />
      <View style={styles.cardContainer}>
        <TouchableOpacity onPress={() => handlePress("Endringslogg")}>
          <Card
            title="Eva Pedersen"
            description="Fastlege"
            workPlace="Moholt legesenter"
          ></Card>
        </TouchableOpacity >
        <TouchableOpacity onPress={() => handlePress("NotatLogg")}>
        <Card
            title="Isabelle Olsen"
            description="Sykepleier"
            workPlace="Byåsen hjemmetjeneste"
          ></Card>
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
  cardContainer: {
    marginTop: 20,
    width: "90%",
  },
});

export default Innsyn;
