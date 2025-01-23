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
            style={styles.backIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handlePress("Home")}>
          <Icon name="home" size={33} color="#0D9276" style={styles.homeIcon} />
        </TouchableOpacity>
      </View>
    
      <Text style={[styles.header, headerStyle]}>{header}</Text>

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
    fontSize: 40,
    color: "#333", 
    marginTop: 50, 
    marginBottom: 30, 
  },
  line: {
    width: "100%", 
    height: 3,
    backgroundColor: "#0D9276",
    marginTop: 10,
  },
  iconContainer: {
    width: "100%", 
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "center", 
    position: "absolute", 
    top: 0, 
    paddingHorizontal: 20, 
  },
  backIcon: {
    marginRight: 10,
  },
  homeIcon: {
    marginLeft: 10,
  },
  
  
});

export default Header;
