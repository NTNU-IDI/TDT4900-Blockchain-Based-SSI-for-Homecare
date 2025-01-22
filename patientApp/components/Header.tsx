import React from "react";
import Icon from "react-native-vector-icons/SimpleLineIcons";
import { View, Text, StyleSheet, ViewStyle, TextStyle } from "react-native";

interface HeaderProps {
  header: string;
  headerStyle?: TextStyle; // Text-specific styling
  iconStyle?: ViewStyle;   // Icon container-specific styling
}

const Header: React.FC<HeaderProps> = ({ header, headerStyle, iconStyle }) => {
  return (
    <View style={styles.container}>
      {/* Icon Container in the Top-Left Corner */}
      <View style={[styles.iconContainer, iconStyle]}>
        {["arrow-left", "home"].map((iconName, index) => (
          <Icon
            key={index}
            name={iconName}
            size={30}
            color="#0D9276"
            style={styles.icon}
          />
        ))}
      </View>

      {/* Header Text */}
      <Text style={[styles.header, headerStyle]}>{header}</Text>

      {/* Green Line */}
      <View style={styles.line} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%", // Ensure the header spans the full width
    marginBottom: 20,
    alignItems: "center", // Center the header text horizontally
  },
  header: {
    fontFamily: '"Times New Roman", Times, serif',
    fontSize: 40,
    color: "#333", // Darker color for better contrast
    marginTop: 50, // Add space below the icons
    marginBottom: 30, // Space between the header text and the line
  },
  line: {
    width: "100%", // Full screen width
    height: 5,
    backgroundColor: "#0D9276",
    marginTop: 10,
  },
  iconContainer: {
    position: "absolute", // Place it relative to the top-left corner
    top: 0, // Distance from the top of the screen
    left: 5, // Distance from the left of the screen
    flexDirection: "row", // Align icons horizontally
    alignItems: "center", // Vertically align icons
    
  },
  icon: {
    margin: 15, // Space between icons
  },
});

export default Header;
