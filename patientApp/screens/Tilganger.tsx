import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import Card from "../components/Card";
import Header from "../components/Header";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../types/screens";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

type TilgangerScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Tilganger"
>;

const Tilganger = () => {
  const navigation = useNavigation<TilgangerScreenNavigationProp>();

  const handlePress = (screen: keyof RootStackParamList) => {
    navigation.navigate(screen);
  };

  const handleInnsynPress = () => handlePress("Innsyn");
  const handleForesporselPress = () => handlePress("Foresporsel");

  return (
    <View style={styles.screen}>
      <Header header="Tilganger" />
      <View style={styles.cardContainer}>
        <TouchableOpacity onPress={handleInnsynPress}>
          <Card
            title="Innsyn i journal"
            description="Her ser du hvem som har tilgang til din journal"
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleForesporselPress}>
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
