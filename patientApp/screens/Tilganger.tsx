import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import Card from "../components/Card";
import Header from "../components/Header";
import { useNavigation } from "@react-navigation/native";

const Tilganger = () => {
  const navigation = useNavigation();

  const handlePress = (screen: string) => {
    navigation.navigate(screen as never);
  };
  return (
    <View style={styles.screen}>
      <Header header="Tilganger" />
      <View style={styles.cardContainer}>
      <TouchableOpacity
          onPress={() => handlePress('Innsyn')}
        >
        <Card
          title="Innsyn i journal"
          description="Her ser du hvem som har tilgang til din journal"
        />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handlePress('Foresporsel')}
        >
        <Card
          title="Forespørsler om innsyn"
          description="Her finner du forespørsler om tilgang til din journal"
        />
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

export default Tilganger;
