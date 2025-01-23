import React from "react";
import Icon from "react-native-vector-icons/SimpleLineIcons";
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

interface HeaderProps {
  header: string;
  headerStyle?: TextStyle; 
  iconStyle?: ViewStyle; 
}

const Header: React.FC<HeaderProps> = ({ header, headerStyle, iconStyle }) => {
  const navigation = useNavigation();
  const handlePress = (screen: string) => {
    navigation.navigate(screen as never);
  };

  return (
    <View style={styles.container}>
      <View style={[styles.iconContainer, iconStyle]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon
            name="arrow-left"
            size={30}
            color="#0D9276"
            style={styles.icon}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handlePress("Home")}>
          <Icon name="home" size={30} color="#0D9276" style={styles.icon} />
        </TouchableOpacity>
      </View>
      {/* {["arrow-left", "home"].map((iconName, index) => (
          <Icon
            key={index}
            name={iconName}
            size={30}
            color="#0D9276"
            style={styles.icon}
          />
        ))}
      </View> */}

      {/* Header Text */}
      <Text style={[styles.header, headerStyle]}>{header}</Text>

      {/* Green Line */}
      <View style={styles.line} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%", 
    marginBottom: 20,
    alignItems: "center", 
    marginTop: 20,
  },
  header: {
    // fontFamily: '"Times New Roman", Times, serif',
    fontSize: 40,
    color: "#333", 
    marginTop: 50, 
    marginBottom: 30, 
  },
  line: {
    width: "100%", 
    height: 5,
    backgroundColor: "#0D9276",
    marginTop: 10,
  },
  iconContainer: {
    position: "absolute", 
    top: 0, 
    left: 5, 
    flexDirection: "row", 
    alignItems: "center", 
  },
  icon: {
    margin: 15, 
  },
});

export default Header;
