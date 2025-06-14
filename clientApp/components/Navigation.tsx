import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import Icon from "react-native-vector-icons/SimpleLineIcons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Pages } from "../types/screens";
import React from "react";
import { useNavigation } from "@react-navigation/native";

type NavigationScreenNavigationProp = NativeStackNavigationProp<Pages>;

const Navigation = () => {
  const navigation = useNavigation<NavigationScreenNavigationProp>();

  const handlePress = (screen?: keyof Pages) => {
    if (!screen) {
      console.warn("No navigation target for this item.");
      return;
    } else {
      navigation.navigate(screen);
    }
  };

  const icons: {
    name: string;
    label: string;
    screen?: keyof Pages;
  }[] = [
    { name: "calendar", label: "Timeavtaler" },
    { name: "chemistry", label: "Prøvesvar" },
    { name: "note", label: "Endringslogg", screen: "ChangeLogPage" },
    { name: "envelope", label: "Meldinger" },
    { name: "user", label: "Tilganger", screen: "AccessPage" },
    { name: "docs", label: "Notater", screen: "NotesPage" },
  ];

  return (
    <View style={styles.div}>
      <View style={styles.container}>
        {icons.map((icon, index) => (
          <TouchableOpacity
            key={index}
            style={styles.card}
            onPress={() => handlePress(icon.screen)}
          >
            <Icon name={icon.name} size={60} color={"#000"} />
            <Text style={styles.cardText}>{icon.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  div: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: "35%",
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    margin: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  cardText: {
    marginTop: 8,
    fontSize: 14,
    color: "#000",
  },
});

export default Navigation;
