import { StyleSheet, TouchableOpacity, View } from "react-native";

import Card from "../components/Card";
import Header from "../components/Header";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Pages } from "../types/screens";
import React from "react";
import { useNavigation } from "@react-navigation/native";

type AccessScreenNavigationProp = NativeStackNavigationProp<Pages, "Access">;

const AccessPage = () => {
  const navigation = useNavigation<AccessScreenNavigationProp>();

  const handlePress = (screen: keyof Pages) => {
    navigation.navigate(screen);
  };

  const handleInnsynPress = () => handlePress("Insight");
  const handleForesporselPress = () => handlePress("Request");

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

export default AccessPage;
