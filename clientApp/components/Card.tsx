import React from "react";
import { View, Text, StyleSheet, ViewStyle, TextStyle } from "react-native";

interface CardProps {
  title: string;
  description: string;
  workPlace?: string;
  containerStyle?: ViewStyle;
  titleStyle?: TextStyle;
  descriptionStyle?: TextStyle;
}

const Card: React.FC<CardProps> = ({
  title,
  description,
  workPlace,
  containerStyle,
  titleStyle,
  descriptionStyle,
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={[styles.title, titleStyle]}>{title}</Text>
      <Text style={[styles.description, descriptionStyle]}>{description}</Text>
      <Text style={[styles.description, descriptionStyle]}>{workPlace}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 30,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#D3D3D3",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 40,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  description: {
    fontSize: 18,
    fontStyle: "italic",
    color: "#666",
  },
});

export default Card;
